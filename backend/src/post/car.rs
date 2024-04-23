use std::path::Path;

use actix_multipart::form::MultipartForm;
use actix_web::{post, web::Path as WebPath, HttpResponse};
use chrono::{TimeDelta, Utc};
use image::{
    io::Reader,
    ImageFormat::{Jpeg, Png},
};
use jsonwebtoken::{encode, EncodingKey, Header};
use surrealdb::sql::{Id, Thing};
use tokio::fs;

use crate::{
    extra::{check_user, decode_token, internal_error, verify_password},
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
    if let Err(e) = db.use_ns("ns").use_db("db").await {
        return internal_error(e);
    }

    match decode_token(&token) {
        Ok(user_info) => match check_user(&user_info.username, db).await {
            Ok(mut user) => match verify_password(&user_info.password, &user.password) {
                Ok(_) => {
                    match Reader::open(form.owner_proof.file.path()) {
                        Ok(r) => match r.with_guessed_format() {
                            Ok(img) => {
                                if img.format() != Some(Png) && img.format() != Some(Jpeg) {
                                    return HttpResponse::UnsupportedMediaType().json(Resp::new(
                                        "Sorry your image format is not supported!",
                                    ));
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

                    let pic_path = if let Some(img_name) = form.owner_proof.file_name {
                        let full_img_name =
                            format!("{}-{img_name}", GenString::new().gen_string(10, 30));
                        (format!("{dir}/{full_img_name}"), full_img_name)
                    } else {
                        return HttpResponse::BadRequest().json(Resp::new(
                            "Sorry You have to provide the name of the image!",
                        ));
                    };

                    if let Err(e) = form.owner_proof.file.persist(&pic_path.0) {
                        return internal_error(e);
                    }

                    let id = Id::rand();

                    let car_info = DbCarInfo {
                        license_num: form.license_num.0,
                        car_id: id.clone(),
                        owner_proof: pic_path.1.into(),
                        car_details: form.car_details.0,
                        is_available: false,
                        userinfo: Thing {
                            tb: "user".into(),
                            id: Id::String(user_info.username.to_string()),
                        },
                    };

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
                                        (Utc::now() + TimeDelta::try_days(9_999_999).unwrap())
                                            .timestamp(),
                                    )
                                    .unwrap();
                                    let user_info = DbUserInfo {
                                        username: user_info.username,
                                        password: user_info.password,
                                        fullname: user_info.fullname,
                                        pik_role: user.pik_role,
                                        car_posts: user.car_posts,
                                        own_cars: user.own_cars,
                                        pkg_posts: user.pkg_posts,
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
                Err(e) => e,
            },
            Err(e) => e,
        },
        Err(e) => e,
    }
}
