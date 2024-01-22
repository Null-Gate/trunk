use actix_web::{post, HttpResponse, web::Json};
use argon2::{Config, Variant, Version, hash_encoded};
use chrono::{Utc, Duration};
use jsonwebtoken::{encode, Header, EncodingKey};
use surrealdb::sql::Id;

use crate::structures::{Signup, DB, Resp, GenString, Claims};

#[post("/sign_up")]
pub async fn signup(info: Json<Signup>) -> HttpResponse {
    let db = DB.get().await;
    if db.use_ns("ns").use_db("db").await.is_err() {
        return HttpResponse::InternalServerError().json(Resp::new(
            "Sorry We are having some problem when opening our database!",
        ));
    }

    let rand_salt = GenString::new().gen_string(20, 150);
    let arg_cfg = Config {
        variant: Variant::Argon2i,
        version: Version::Version13,
        mem_cost: 655360,
        time_cost: 2,
        lanes: 50,
        hash_length: 256,
        ..Default::default()
    };

    match db.select::<Option<Signup>>(("user", Id::String(info.username.to_string()))).await {
        Ok(Some(_)) => {
            return HttpResponse::NotAcceptable().json(Resp::new("User Already exits!"));
        },
        Err(_) => {
            return HttpResponse::InternalServerError().json(Resp::new("Sorry We're Having Some Problem In Creating Your Account!"));
        }
        Ok(None) => {
        }
    }

    match hash_encoded(info.password.as_bytes(), rand_salt.as_bytes(), &arg_cfg) {
        Ok(hash) => {
            let user_info = Signup {
                username: info.username.clone(),
                fullname: info.fullname.clone(),
                password: hash,
                pik_role: info.pik_role,
            };
            match db.create::<Option<Signup>>(("user", Id::String(info.username.to_string()))).content(user_info).await {
                Ok(Some(user)) => {
                    let exp = (Utc::now()+Duration::days(i64::MAX)).timestamp() as usize;
                    let claims = Claims {
                        username: user.username,
                        password: user.password,
                        exp
                    };
                    match encode(&Header::default(), &claims, &EncodingKey::from_secret("kshashdfjklasdhfsdhfkasjhfasdhHKHJHKJHSKJHKJSHJKHSJKHJKFHSKJ".as_bytes())) {
                        Ok(token) => HttpResponse::Ok().json(Resp::new(&token)),
                        Err(_) =>   HttpResponse::InternalServerError().json(Resp::new("Sorry We're Having Some Problem In Creating Your Account!"))

                    }
                }
                _ => HttpResponse::InternalServerError().json(Resp::new("Sorry We're Having Some Problem In Creating Your Account!"))
            }
        },
        Err(_) => {
            HttpResponse::InternalServerError().json(Resp::new("Sorry We're Having Some Problem In Creating Your Account!"))
        }
    }

}
