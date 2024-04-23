use actix_web::{post, web::Json, HttpResponse};
use argon2::hash_encoded;
use surrealdb::sql::Id;

use crate::{
    extra::internal_error,
    structures::{DbUserInfo, GenString, Resp, Signup, ARGON_CONFIG, DB},
};

#[post("/sign_up")]
pub async fn signup(info: Json<Signup>) -> HttpResponse {
    let db = DB.get().await;
    if let Err(e) = db.use_ns("ns").use_db("db").await {
        return internal_error(e);
    }

    let rand_salt = GenString::new().gen_string(20, 100);

    match db
        .select::<Option<DbUserInfo>>(("user", Id::String(info.username.to_string())))
        .await
    {
        Ok(Some(_)) => {
            return HttpResponse::NotAcceptable().json(Resp::new("User Already exits!"));
        }
        Err(e) => {
            return internal_error(e);
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
                password: hash.into(),
                pik_role: vec![],
                car_posts: vec![],
                pkg_posts: vec![],
                own_cars: vec![],
            };

            match db
                .create::<Option<DbUserInfo>>(("user", Id::String(info.username.to_string())))
                .content(user_info)
                .await
            {
                Ok(Some(_)) => HttpResponse::Ok().json(Resp::new("All Good Account Is Created!")),
                Ok(None) => internal_error("None User Error"),
                Err(e) => internal_error(e),
            }
        }
        Err(e) => internal_error(e),
    }
}
