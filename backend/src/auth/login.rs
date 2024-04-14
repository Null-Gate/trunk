use actix_web::{post, web::Json, HttpResponse};
use argon2::verify_encoded;
use chrono::{TimeDelta, Utc};
use jsonwebtoken::{encode, EncodingKey, Header};
use serde_json::json;
use surrealdb::sql::Id;

use crate::structures::{Claims, DbUserInfo, Login, Resp, DB, JWT_SECRET};

#[post("/login")]
pub async fn login(info: Json<Login>) -> HttpResponse {
    let db = DB.get().await;
    if db.use_ns("ns").use_db("db").await.is_err() {
        return HttpResponse::InternalServerError().json(Resp::new(
            "Sorry We are having some problem when opening our database!",
        ));
    }

    match db
        .select::<Option<DbUserInfo>>(("user", Id::String(info.username.to_string())))
        .await
    {
        Ok(Some(user_info)) => {
            match verify_encoded(&user_info.password, info.password.as_bytes()) {
                Ok(stat) => {
                    if !stat {
                        return HttpResponse::NotAcceptable()
                            .json(Resp::new("Sorry Wrong Password!"));
                    }

                    let exp = usize::try_from(
                        (Utc::now() + TimeDelta::try_days(9_999_999).unwrap()).timestamp(),
                    )
                    .unwrap();
                    let mut token_userinfo = DbUserInfo {
                        username: user_info.username.clone(),
                        fullname: user_info.fullname.clone(),
                        password: info.password.clone(),
                        pik_role: user_info.pik_role.clone(),
                        car_posts: user_info.car_posts.clone(),
                        pkg_posts: user_info.pkg_posts.clone(),
                        own_cars: user_info.own_cars.clone(),
                    };

                    let claims = Claims {
                        user_info: token_userinfo.clone(),
                        exp,
                    };
                    encode(
                        &Header::default(),
                        &claims,
                        &EncodingKey::from_secret(JWT_SECRET),
                    )
                    .map_or_else(
                        |_| {
                            HttpResponse::InternalServerError().json(Resp::new(
                                "Sorry We're Having Some Problem In Creating Your Account!",
                            ))
                        },
                        |token| {
                            token_userinfo.password = user_info.password;
                            let value = json! ({
                                "user_details": token_userinfo,
                                "token": token,
                            });
                            HttpResponse::Ok().json(value)
                        },
                    )
                }
                Err(_) => HttpResponse::InternalServerError().json(Resp::new(
                    "Sorry Something Went Wrong While Checking Your Password!",
                )),
            }
        }
        Ok(None) => HttpResponse::Unauthorized().json(Resp::new("User Not Found!")),
        Err(_) => HttpResponse::InternalServerError().json(Resp::new(
            "Sorry We're Having Some Problem in Searching Your Account!",
        )),
    }
}
