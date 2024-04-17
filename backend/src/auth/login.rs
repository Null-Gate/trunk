use actix_web::{post, web::Json, HttpResponse};
use argon2::verify_encoded;
use chrono::{TimeDelta, Utc};
use jsonwebtoken::{encode, EncodingKey, Header};
use serde_json::json;
use surrealdb::sql::Id;

use crate::{
    extra::internal_error,
    structures::{Claims, DbUserInfo, Login, Resp, DB, JWT_SECRET},
};

#[post("/login")]
pub async fn login(info: Json<Login>) -> HttpResponse {
    let db = DB.get().await;
    if let Err(e) = db.use_ns("ns").use_db("db").await {
        return internal_error(e);
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
                        username: user_info.username,
                        fullname: user_info.fullname,
                        password: info.password.clone(),
                        pik_role: user_info.pik_role,
                        car_posts: user_info.car_posts,
                        pkg_posts: user_info.pkg_posts,
                        own_cars: user_info.own_cars,
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
                    .map_or_else(internal_error, |token| {
                        token_userinfo.password = user_info.password;
                        let value = json! ({
                            "user_details": token_userinfo,
                            "token": token,
                        });
                        HttpResponse::Ok().json(value)
                    })
                }
                Err(e) => internal_error(e),
            }
        }
        Ok(None) => HttpResponse::Unauthorized().json(Resp::new("User Not Found!")),
        Err(e) => internal_error(e),
    }
}
