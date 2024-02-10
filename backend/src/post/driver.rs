use std::path::Path;

use actix_multipart::form::MultipartForm;
use actix_web::{post, web::Path as WebPath, HttpResponse};
use argon2::verify_encoded;
use chrono::{Duration, Utc};
use image::{
    io::Reader,
    ImageFormat::{Jpeg, Png},
};
use jsonwebtoken::{decode, encode, Algorithm, DecodingKey, EncodingKey, Header, Validation};
use surrealdb::sql::{Id, Thing};
use tokio::fs;

use crate::structures::{
    get_cache_dir, Claims, DbDriverInfo, DbUserInfo, DriverForm, GenString, Resp, Roles, DB,
    JWT_SECRET,
};

#[allow(clippy::pedantic)]
#[post("/forms/driver/{token}")]
async fn driver(
    MultipartForm(form): MultipartForm<DriverForm>,
    token: WebPath<String>,
) -> HttpResponse {
    let db = DB.get().await;
    if db.use_ns("ns").use_db("db").await.is_err() {
        return HttpResponse::InternalServerError().json(Resp::new(
            "Sorry We are having some problem when opening our database!",
        ));
    }

    match decode::<Claims>(
        &token,
        &DecodingKey::from_secret(JWT_SECRET),
        &Validation::new(Algorithm::HS256),
    ) {
        Ok(token_info) => {
            let user_info = token_info.claims.user_info;
            match db
                .select::<Option<DbUserInfo>>(("user", Id::String(user_info.username.clone())))
                .await
            {
                Ok(Some(mut user)) => {
                    if user.pik_role.contains(&Roles::Driver) {
                        return HttpResponse::AlreadyReported()
                            .json(Resp::new("Sorry User has been already uploaded as driver!"));
                    }
                    match verify_encoded(&user.password, user_info.password.as_bytes()) {
                        Ok(stat) => {
                            if !stat {
                                return HttpResponse::NotAcceptable()
                                    .json(Resp::new("Sorry Wrong password!"));
                            }

                            if !((
                                &user.fullname,
                                &user.pik_role,
                                &user.car_posts,
                                &user.pkg_posts,
                                &user.own_cars,
                            ) == (
                                &user_info.fullname,
                                &user_info.pik_role,
                                &user_info.car_posts,
                                &user_info.pkg_posts,
                                &user_info.own_cars,
                            )) {
                                return HttpResponse::NotAcceptable()
                                    .json(Resp::new("Some Infos Are Wrong!"));
                            }

                            if form.license_pic.size > 538_624 {
                                return HttpResponse::PayloadTooLarge()
                                    .json(Resp::new("Sorry Max Limit is 526kb!!"));
                            }

                            match Reader::open(form.license_pic.file.path()) {
                                Ok(r) => match r.with_guessed_format() {
                                    Ok(img) => {
                                        if img.format() != Some(Png) && img.format() != Some(Jpeg) {
                                            return HttpResponse::UnsupportedMediaType().json(
                                                Resp::new(
                                                    "Sorry your image format is not  supported!",
                                                ),
                                            );
                                        }
                                    }
                                    Err(_) => {
                                        return HttpResponse::InternalServerError().json(Resp::new(
                    "Sorry We're having Some Problem while reading your pofile picture!",
                ));
                                    }
                                },
                                Err(_) => {
                                    return HttpResponse::InternalServerError().json(Resp::new(
                "Sorry We're having Some Problem while reading your pofile picture!",
            ));
                                }
                            }

                            let dir = format!("{}/user_assets", get_cache_dir().await);

                            if !Path::new(&dir).exists() && fs::create_dir(&dir).await.is_err() {
                                return HttpResponse::InternalServerError().json(Resp::new(
                                    "Sorry We're having some problem in saving your profile image!",
                                ));
                            }

                            let pic_path = if let Some(img_name) = form.license_pic.file_name {
                                let full_img_name =
                                    format!("{}-{img_name}", GenString::new().gen_string(10, 30));
                                (format!("{dir}/{full_img_name}"), full_img_name)
                            } else {
                                return HttpResponse::BadRequest().json(Resp::new(
                                    "Sorry You have to provide the name of the image!",
                                ));
                            };

                            if form.license_pic.file.persist(&pic_path.0).is_err() {
                                return HttpResponse::InternalServerError().json(Resp::new(
                                    "Sorry We're having some problem in saving your profile image!",
                                ));
                            }

                            let driver_info = DbDriverInfo {
                                license_num: form.license_num.0,
                                license_pic: pic_path.1,
                                exp_details: form.exp_details.0,
                                userinfo: Thing {
                                    tb: "user".into(),
                                    id: Id::String(user_info.username.clone()),
                                },
                            };

                            match db
                                .create::<Option<DbDriverInfo>>((
                                    "driver",
                                    Id::String(user_info.username.clone()),
                                ))
                                .content(driver_info)
                                .await
                            {
                                Ok(Some(_)) => {
                                    user.pik_role.push(Roles::Driver);
                                    match db.update::<Option<DbUserInfo>>(("user", Id::String(user_info.username.clone()))).content(user).await {
                                        Ok(Some(user)) => {
                                            let exp = usize::try_from((Utc::now() + Duration::days(9_999_999)).timestamp()).unwrap();
                                            let user_info = DbUserInfo {
                                                username: user_info.username,
                                                password: user_info.password,
                                                fullname: user_info.fullname,
                                                pik_role: user.pik_role,
                                                car_posts: user.car_posts,
                                                pkg_posts: user.pkg_posts,
                                                own_cars: user.own_cars
                                            };
                                            let claims = Claims { user_info, exp };

                                            encode(&Header::default(), &claims, &EncodingKey::from_secret(JWT_SECRET)).map_or_else(|_| {
                                                HttpResponse::InternalServerError().json(Resp::new("Sorry We're Having Some Problem In Creating Your Account!"))
                                            },
                                            |token| HttpResponse::Ok().json(Resp::new(&token)),
                    )
                                        }
                                        _ => {
                                            HttpResponse::InternalServerError().json(Resp::new("Sorry Something Went Wrong While Uploading Driver Form!"))
                                        }
                                    }
                                }
                                _ => HttpResponse::InternalServerError().json(Resp::new(
                                    "Sorry Something Went Wrong While Uploading Driver Form!",
                                )),
                            }
                        }
                        Err(_) => HttpResponse::InternalServerError().json(Resp::new(
                            "Sorry Something Went Wrong While Checking Your Password!",
                        )),
                    }
                }
                Ok(None) => HttpResponse::NotFound().json(Resp::new("User Not Found!")),
                Err(_) => HttpResponse::InternalServerError().json(Resp::new(
                    "Sorry Something Went Wrong While Checking Your Account!",
                )),
            }
        }
        Err(_) => HttpResponse::InternalServerError().json(Resp::new("Sorry Wrong Token!")),
    }
}