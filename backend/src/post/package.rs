use actix_multipart::form::MultipartForm;
use actix_web::{post, web::Path as WebPath, HttpResponse};
use argon2::verify_encoded;
use chrono::{TimeDelta, Utc};
use image::{
    ImageReader as Reader,
    ImageFormat::{Jpeg, Png},
};
use jsonwebtoken::{decode, encode, Algorithm, DecodingKey, EncodingKey, Header, Validation};
use surrealdb::sql::{Id, Thing};

use crate::{
    extra::functions::{internal_error, save_img},
    structures::{
        auth::Claims,
        dbstruct::{DbPackageInfo, DbUserInfo},
        extrastruct::{Resp, DB, JWT_SECRET},
        package::PackageForm,
        post::{PType, Post, PostD},
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
                .select::<Option<DbUserInfo>>(("tb_user", Id::String(user_info.username.to_string())))
                .await
            {
                Ok(Some(user)) => {
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

                            let pic_url = match save_img(form.package_pic).await {
                                Ok(url) => url,
                                Err(e) => {
                                    return e;
                                }
                            };

                            let package_info = DbPackageInfo {
                                package_name: form.package_name.0,
                                package_pic: pic_url,
                                pkg_details: form.pkg_details.0,
                            };

                            let id = Id::rand();

                            let post_car_ava = Post {
                                r#in: Thing {
                                    tb: "tb_user".into(),
                                    id: Id::String(user_info.username.to_string()),
                                },
                                out: Thing {
                                    tb: "tb_package".into(),
                                    id: id.clone(),
                                },
                                ptdate: 0,
                                from_where: form.from_where.into_inner(),
                                to_where: form.to_where.into_inner(),
                                cper_weight: form.cper_weight.into_inner(),
                                cper_amount: form.cper_amount.into_inner(),
                                ptype: PType::Pkg,
                                votes: Some(0),
                                data: package_info.clone(),
                                date_to_go: form.date_to_go.into_inner(),
                            };

                            match db
                                .create::<Option<DbPackageInfo>>(("tb_package", id.clone()))
                                .content(package_info)
                                .await
                            {
                                Ok(Some(_)) => {
                                    db.create::<Option<PostD<DbPackageInfo>>>(("tb_post", id.clone()))
                                        .content(post_car_ava)
                                        .await
                                        .unwrap()
                                        .unwrap();
                                    let exp = usize::try_from(
                                        (Utc::now() + TimeDelta::try_days(9_999_999).unwrap())
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
