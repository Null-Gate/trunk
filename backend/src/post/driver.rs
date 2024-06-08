use actix_multipart::form::MultipartForm;
use actix_web::{post, web::Path as WebPath, HttpResponse};
use argon2::verify_encoded;
use chrono::{TimeDelta, Utc};
use image::{
    io::Reader,
    ImageFormat::{Jpeg, Png},
};
use jsonwebtoken::{decode, encode, Algorithm, DecodingKey, EncodingKey, Header, Validation};
use surrealdb::sql::{Id, Thing};

use crate::extra::{
    functions::{internal_error, save_img},
    structures::{Claims, DbDriverInfo, DbUserInfo, DriverForm, Resp, Roles, DB, JWT_SECRET},
};

#[allow(clippy::pedantic)]
#[post("/forms/driver/{token}")]
async fn driver(
    MultipartForm(form): MultipartForm<DriverForm>,
    token: WebPath<String>,
) -> HttpResponse {
    let db = DB.get().await;
    if let Err(e) = db.use_ns("ns").use_db("db").await {
        return internal_error(e);
    }

    match decode::<Claims>(
        &token,
        &DecodingKey::from_secret(JWT_SECRET),
        &Validation::new(Algorithm::HS256),
    ) {
        Ok(token_info) => {
            let user_info = token_info.claims.user_info;
            match db
                .select::<Option<DbUserInfo>>(("user", Id::String(user_info.username.to_string())))
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
                                    Err(e) => {
                                        return internal_error(e);
                                    }
                                },
                                Err(e) => {
                                    return internal_error(e);
                                }
                            }

                            let pic_url = match save_img(form.license_pic).await {
                                Ok(url) => url,
                                Err(e) => {
                                    return e;
                                }
                            };

                            let driver_info = DbDriverInfo {
                                license_num: form.license_num.into_inner(),
                                license_pic: pic_url.into(),
                                exp_details: form.exp_details.0,
                                userinfo: Thing {
                                    tb: "user".into(),
                                    id: Id::String(user_info.username.to_string()),
                                },
                            };

                            match db
                                .create::<Option<DbDriverInfo>>((
                                    "driver",
                                    Id::String(user_info.username.to_string()),
                                ))
                                .content(driver_info)
                                .await
                            {
                                Ok(Some(_)) => {
                                    user.pik_role.push(Roles::Driver);
                                    match db
                                        .update::<Option<DbUserInfo>>((
                                            "user",
                                            Id::String(user_info.username.to_string()),
                                        ))
                                        .content(user)
                                        .await
                                    {
                                        Ok(Some(user)) => {
                                            let exp = usize::try_from(
                                                (Utc::now()
                                                    + TimeDelta::try_days(9_999_999).unwrap())
                                                .timestamp(),
                                            )
                                            .unwrap();
                                            let user_info = DbUserInfo {
                                                username: user_info.username,
                                                password: user_info.password,
                                                fullname: user_info.fullname,
                                                pik_role: user.pik_role,
                                            };
                                            let claims = Claims { user_info, exp };

                                            encode(
                                                &Header::default(),
                                                &claims,
                                                &EncodingKey::from_secret(JWT_SECRET),
                                            )
                                            .map_or_else(internal_error, |token| {
                                                HttpResponse::Ok().json(Resp::new(&token))
                                            })
                                        }
                                        Ok(None) => internal_error("None User Error"),
                                        Err(e) => internal_error(e),
                                    }
                                }
                                Ok(None) => internal_error("None Driver Error"),
                                Err(e) => internal_error(e),
                            }
                        }
                        Err(e) => internal_error(e),
                    }
                }
                Ok(None) => HttpResponse::NotFound().json(Resp::new("User Not Found!")),
                Err(e) => internal_error(e),
            }
        }
        Err(e) => internal_error(e),
    }
}
