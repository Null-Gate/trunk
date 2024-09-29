use actix_web::{post, web::Json, HttpResponse};
use chrono::{TimeDelta, Utc};
use jsonwebtoken::{encode, EncodingKey, Header};
use serde_json::json;
use surrealdb::RecordId;

use crate::{
    extra::functions::internal_error,
    structures::{
        auth::{Claims, Login},
        dbstruct::DbUserInfo,
        extrastruct::{Resp, DB, JWT_SECRET},
    },
};

#[post("/login")]
pub async fn login(info: Json<Login>) -> HttpResponse {
    let db = DB.get().await;
    if let Err(e) = db.use_ns("ns").use_db("db").await {
        return internal_error(e);
    }

    let sql = r#"
        BEGIN TRANSACTION;

        let $ut = type::thing($uthing);
        let $select = SELECT * FROM type::thing($uthing);

        IF $select == [] {
            RETURN NONE;
        }

        IF !crypto::argon2::compare($select.password, $password) {
            THROW "Password Not Match";
        } ELSE {
            RETURN $select;
        };

        COMMIT TRANSACTION;
    "#;

    let mut resul = db.query(sql)
        .bind((
            "uthing",
            RecordId::from_table_key("tb_user", &info.username)
        ))
        .bind(info.0.clone()).await.unwrap();

    let exp = usize::try_from(
        (Utc::now() + TimeDelta::try_days(9_999_999).unwrap()).timestamp(),
    ).unwrap();

    let tres: Option<Result<DbUserInfo, String>> = resul.take(0).unwrap();

    if tres.is_none() {
        return HttpResponse::NotFound().json(Resp::new("Sorry User Not Found!!"));
    }

    if let Some(Ok(user_info)) = tres {
        let mut token_userinfo = DbUserInfo {
            username: user_info.username,
            fullname: user_info.fullname,
            password: info.password.clone(),
            pik_role: user_info.pik_role,
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
            return HttpResponse::Ok().json(value);
        });
    };
    HttpResponse::NotAcceptable().json(Resp::new("Sorry Wrong Password!!"))
}
