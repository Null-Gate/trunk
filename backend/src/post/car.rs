use std::path::Path;

use actix_multipart::form::MultipartForm;
use actix_web::{post, web::Path as WebPath, HttpResponse};
use chrono::{Duration, Utc};
use image::{
    io::Reader,
    ImageFormat::{Jpeg, Png},
};
use jsonwebtoken::{encode, EncodingKey, Header};
use surrealdb::sql::{Id, Thing};
use tokio::fs;

use crate::{
    extra::{check_user, decode_token, verify_password},
    structures::{
        get_cache_dir, CarForm, Claims, DbCarInfo, DbUserInfo, GenString, Resp, Roles, DB,
        JWT_SECRET,
    },
};

#[allow(clippy::future_not_send)]
#[allow(clippy::pedantic)]
#[post("/forms/car/{token}")]
async fn car(MultipartForm(form): MultipartForm<CarForm>, token: WebPath<String>) -> HttpResponse {
    let db = DB.get().await;
    if db.use_ns("ns").use_db("db").await.is_err() {
        return HttpResponse::InternalServerError().json(Resp::new(
            "Sorry We are having some problem when opening our database!",
        ));
    }

    match decode_token(&token) {
        Ok(user_info) => {
            match check_user(&user_info.username, db).await {
                Ok(mut user) => match verify_password(&user_info.password, &user.password) {
                    Ok(_) => {
                        if !((
                            &user.fullname,
                            &user.pik_role,
                            &user.car_posts,
                            &user.own_cars,
                            &user.pkg_posts,
                        ) == (
                            &user_info.fullname,
                            &user_info.pik_role,
                            &user_info.car_posts,
                            &user_info.own_cars,
                            &user_info.pkg_posts,
                        )) {
                            return HttpResponse::NotAcceptable()
                                .json(Resp::new("Some Infos Are Wrong!"));
                        }

                        if form.owner_proof.size > 538_624 {
                            return HttpResponse::PayloadTooLarge()
                                .json(Resp::new("Sorry Max Limit is 526kb!!"));
                        }

                        match Reader::open(form.owner_proof.file.path()) {
                            Ok(r) => match r.with_guessed_format() {
                                Ok(img) => {
                                    if img.format() != Some(Png) && img.format() != Some(Jpeg) {
                                        return HttpResponse::UnsupportedMediaType().json(
                                            Resp::new("Sorry your image format is not supported!"),
                                        );
                                    }
                                }
                                Err(_) => {
                                    return HttpResponse::InternalServerError().json(Resp::new(
                    "Sorry We're having Some Problem while reading your proof picture!",
                ));
                                }
                            },
                            Err(_) => {
                                return HttpResponse::InternalServerError().json(Resp::new(
                "Sorry We're having Some Problem while reading your proof picture!",
            ));
                            }
                        }

                        let dir = format!("{}/user_assets", get_cache_dir().await);

                        if !Path::new(&dir).exists() && fs::create_dir(&dir).await.is_err() {
                            return HttpResponse::InternalServerError().json(Resp::new(
                                "Sorry We're having some problem in saving your proof image!",
                            ));
                        }

                        let pic_path = if let Some(img_name) = form.owner_proof.file_name {
                            let full_img_name =
                                format!("{}-{img_name}", GenString::new().gen_string(10, 30));
                            (format!("{dir}/{full_img_name}"), full_img_name)
                        } else {
                            return HttpResponse::BadRequest().json(Resp::new(
                                "Sorry You have to provide the name of the image!",
                            ));
                        };

                        if form.owner_proof.file.persist(&pic_path.0).is_err() {
                            return HttpResponse::InternalServerError().json(Resp::new(
                                "Sorry We're having some problem in saving your proof image!",
                            ));
                        }

                        let car_info = DbCarInfo {
                            license_num: form.license_num.0,
                            owner_proof: pic_path.1,
                            car_details: form.car_details.0,
                            userinfo: Thing {
                                tb: "user".into(),
                                id: Id::String(user_info.username.clone()),
                            },
                        };

                        let id = Id::rand();

                        match db
                            .create::<Option<DbCarInfo>>(("car", id.clone()))
                            .content(car_info)
                            .await
                        {
                            Ok(Some(_)) => {
                                if !user.pik_role.contains(&Roles::Owner) {
                                    user.pik_role.push(Roles::Owner);
                                }
                                user.own_cars.push(Thing::from(("car", id)));
                                match db.update::<Option<DbUserInfo>>(("user", Id::String(user_info.username.clone()))).content(user).await {
                                        Ok(Some(user)) => {
                                            let exp = usize::try_from((Utc::now() + Duration::days(9_999_999)).timestamp()).unwrap();
                                            let user_info = DbUserInfo {
                                                username: user_info.username,
                                                password: user_info.password,
                                                fullname: user_info.fullname,
                                                pik_role: user.pik_role,
                                                car_posts: user_info.car_posts,
                                                own_cars: user.own_cars,
                                                pkg_posts: user_info.pkg_posts
                                            };
                                            let claims = Claims { user_info, exp };

                                            encode(&Header::default(), &claims, &EncodingKey::from_secret(JWT_SECRET)).map_or_else(|_| {
                                                HttpResponse::InternalServerError().json(Resp::new("Sorry We're Having Some Problem In Creating Your Account!"))
                                            },
                                            |token| HttpResponse::Ok().json(Resp::new(&token)),
                    )
                                        }
                                        _ => {
                                            HttpResponse::InternalServerError().json(Resp::new("Sorry Something Went Wrong While Uploading Car Form!, update"))
                                        }
                                    }
                            }
                            _ => HttpResponse::InternalServerError().json(Resp::new(
                                "Sorry Something Went Wrong While Uploading Car Form!, create",
                            )),
                        }
                    }
                    Err(e) => e,
                },
                Err(e) => e,
            }
        }
        Err(e) => e,
    }
}
