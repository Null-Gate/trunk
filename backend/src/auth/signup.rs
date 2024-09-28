#![allow(unused_imports)]

use actix_web::{
    post,
    web::{Data, Json},
    HttpResponse,
};
use argon2::hash_encoded;
use surrealdb::{sql::Id, RecordId, Surreal};

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
    let db = DB.get().await;
    db.use_ns("ns").use_db("db").await.unwrap();
    let sql = r"
        LET $ut = type::thing($uthing);
        LET $select = SELECT * FROM $ut;
        IF $ut.id != [] {
            RETURN NONE;
        } ELSE {
            RETURN CREATE $ut SET username = $username, password = $password, fullname = $fullname, pik_role = $pik_role;
        };
    ";
    
    if contains_special_chars(&info.username) {
        return HttpResponse::NotAcceptable().json(Resp::new(
            "Sorry Only lowercase eng latters and number are allow for username.",
        ));
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
            let mut resul = db.query(sql).bind((
                "uthing",
                RecordId::from_table_key("tb_user", &info.username)
            )).bind(user_info).await.unwrap();

            let qres: Option<DbUserInfo> = resul.take(0).unwrap();
            if qres.is_none() {
                HttpResponse::NotAcceptable().json(Resp::new("Sorry User Already Exits!"))
            } else {
                HttpResponse::Ok().json(Resp::new("All Good Acc Is Created!!"))
            }
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
