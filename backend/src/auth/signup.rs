#![allow(unused_imports)]

use actix_web::{
    post,
    web::{Data, Json},
    HttpResponse,
};
use argon2::hash_encoded;
use surrealdb::{sql::Id, Surreal};

use crate::{
    extra::functions::internal_error,
    structures::{
        auth::Signup,
        dbstruct::DbUserInfo,
        extrastruct::{Dbt, GenString, Resp, ARGON_CONFIG, DB},
    },
};

#[post("/sign_up")]
pub async fn signup(info: Json<Signup>) -> HttpResponse {
    let rand_salt = GenString::new().gen_string(20, 100);
    let idk = info.username.clone();
    let db = DB.get().await;
    db.use_ns("ns").use_db("db").await.unwrap();
    let d = tokio::spawn(async {
        let db = DB.get().await;
        db.use_ns("ns").use_db("db").await.unwrap();
        db.select::<Option<DbUserInfo>>(("tb_user", Id::String(idk)))
            .await
    });
    /*.await
    {
        Ok(Some(_)) => {
            return HttpResponse::NotAcceptable().json(Resp::new("User Already exits!"));
        }
        Err(e) => {
            return internal_error(e);
        }
        Ok(None) => {}
    }*/

    if contains_special_chars(&info.username) {
        return HttpResponse::NotAcceptable().json(Resp::new("Sorry Only lowercase eng latters and number are allow for username."));
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
            };

            let i: Option<DbUserInfo> = d.await.unwrap().unwrap();
            if i.is_none() {
                match db
                    .create::<Option<DbUserInfo>>(("tb_user", Id::String(info.username.to_string())))
                    .content(user_info)
                    .await
                {
                    Ok(Some(_)) => {
                        return HttpResponse::Ok().json(Resp::new("All Good Account Is Created!"))
                    }
                    Ok(None) => return internal_error("None User Error"),
                    Err(e) => return internal_error(e),
                }
            };
            HttpResponse::NotAcceptable().json(Resp::new("User Already exits!"))
        }
        Err(e) => internal_error(e),
    }
}

fn contains_special_chars(input: &str) -> bool {
    if !input.is_ascii() {
        return true;
    }

    if input.chars().any(char::is_whitespace) {
        return true;
    }

    let special_chars = "!@#$%^&*()_+-=~`{}[]|:;'<>,.?/ \\";
    if input.chars().any(|c| special_chars.contains(c)) {
        return true;
    }

    false
}
