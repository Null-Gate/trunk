use std::path::Path;

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
use tokio::fs;

use crate::{
    extra::internal_error,
    structures::{
        get_cache_dir, Claims, DbPackageInfo, DbUserInfo, GenString, PackageForm, Resp, DB,
        JWT_SECRET,
    },
};

#[allow(clippy::pedantic)]
#[post("/forms/package/{token}")]
async fn package(
    MultipartForm(form): MultipartForm<PackageForm>,
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
                    match verify_encoded(&user.password, user_info.password.as_bytes()) {
                        Ok(stat) => {
                            if !stat {
                                return HttpResponse::NotAcceptable()
                                    .json(Resp::new("Sorry Wrong password!"));
                            }

                            match Reader::open(form.package_pic.file.path()) {
                                Ok(r) => match r.with_guessed_format() {
                                    Ok(img) => {
                                        if img.format() != Some(Png) && img.format() != Some(Jpeg) {
                                            return HttpResponse::UnsupportedMediaType().json(
                                                Resp::new(
                                                    "Sorry your image format is not supported!",
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

                            let dir = format!("{}/user_assets", get_cache_dir().await);

                            if !Path::new(&dir).exists() {
                                if let Err(e) = fs::create_dir(&dir).await {
                                    return internal_error(e);
                                }
                            }

                            let pic_path = if let Some(img_name) = form.package_pic.file_name {
                                let full_img_name =
                                    format!("{}-{img_name}", GenString::new().gen_string(10, 30));
                                (format!("{dir}/{full_img_name}"), full_img_name)
                            } else {
                                return HttpResponse::BadRequest().json(Resp::new(
                                    "Sorry You have to provide the name of the image!",
                                ));
                            };

                            if let Err(e) = form.package_pic.file.persist(&pic_path.0) {
                                return internal_error(e);
                            }

                            let package_info = DbPackageInfo {
                                package_name: form.package_name.0,
                                package_pic: pic_path.1.into(),
                                pkg_details: form.pkg_details.0,
                                exp_date_to_send: form.exp_date_to_send.0,
                                to_where: form.to_where.0,
                                from_where: form.from_where.0,
                                userinfo: Thing {
                                    tb: "user".into(),
                                    id: Id::String(user_info.username.to_string()),
                                },
                            };

                            let id = Id::rand();

                            match db
                                .create::<Option<DbPackageInfo>>(("package", id.clone()))
                                .content(package_info)
                                .await
                            {
                                Ok(Some(_)) => {
                                    user.pkg_posts.push(Thing::from(("package", id)));
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
                                                car_posts: user.car_posts,
                                                pkg_posts: user.pkg_posts,
                                                own_cars: user.own_cars,
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
                                Ok(None) => internal_error("None Car Error"),
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
