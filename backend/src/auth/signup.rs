use actix_web::{post, web::Json, HttpResponse};
use argon2::hash_encoded;
use surrealdb::sql::Id;

use crate::structures::{DbUserInfo, GenString, Resp, Signup, ARGON_CONFIG, DB};

#[post("/sign_up")]
pub async fn signup(info: Json<Signup>) -> HttpResponse {
    let db = DB.get().await;
    if db.use_ns("ns").use_db("db").await.is_err() {
        return HttpResponse::InternalServerError().json(Resp::new(
            "Sorry We are having some problem when opening our database!",
        ));
    }

    let rand_salt = GenString::new().gen_string(20, 100);

    match db
        .select::<Option<DbUserInfo>>(("user", Id::String(info.username.to_string())))
        .await
    {
        Ok(Some(_)) => {
            return HttpResponse::NotAcceptable().json(Resp::new("User Already exits!"));
        }
        Err(_) => {
            return HttpResponse::InternalServerError().json(Resp::new(
                "Sorry We're Having Some Problem In Creating Your Account!",
            ));
        }
        Ok(None) => {}
    }

    match hash_encoded(
        info.password.as_bytes(),
        rand_salt.as_bytes(),
        &ARGON_CONFIG,
    ) {
        Ok(hash) => {
            let user_info = DbUserInfo {
                username: info.username.clone(),
                fullname: info.fullname.clone(),
                password: hash,
                pik_role: vec![],
                up_posts: vec![],
            };

            match db
                .create::<Option<DbUserInfo>>(("user", Id::String(info.username.to_string())))
                .content(user_info)
                .await
            {
                Ok(Some(_)) => HttpResponse::Ok().json(Resp::new("All Good Account Is Created!")),
                _ => HttpResponse::InternalServerError().json(Resp::new(
                    "Sorry We're Having Some Problem In Creating Your Account!",
                )),
            }
        }
        Err(_) => HttpResponse::InternalServerError().json(Resp::new(
            "Sorry We're Having Some Problem In Creating Your Account!",
        )),
    }
}
