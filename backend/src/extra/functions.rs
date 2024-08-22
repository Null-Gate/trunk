use std::{fmt::Display, path::Path as FPath};

use actix_multipart::form::tempfile::TempFile;
use actix_web::{get, web::Path, HttpResponse};
use argon2::verify_encoded;
use jsonwebtoken::{decode, encode, Algorithm, DecodingKey, EncodingKey, Header, Validation};
use surrealdb::sql::Id;
use tokio::fs;
use tracing::error;

use crate::structures::{
    auth::Claims,
    dbstruct::DbUserInfo,
    extrastruct::{GenString, Resp, DATA_PATH, DB, JWT_SECRET},
};

pub fn decode_token(token: &str) -> Result<DbUserInfo, HttpResponse> {
    match decode::<Claims>(
        token,
        &DecodingKey::from_secret(JWT_SECRET),
        &Validation::new(Algorithm::HS256),
    ) {
        Ok(token_info) => Ok(token_info.claims.user_info),
        Err(e) => Err(internal_error(e)),
    }
}

pub fn verify_password(password: &str, hash: &str) -> Result<(), HttpResponse> {
    match verify_encoded(hash, password.as_bytes()) {
        Ok(stat) => {
            if !stat {
                return Err(HttpResponse::NotAcceptable().json(Resp::new("Sorry Wrong password!")));
            }
            Ok(())
        }
        Err(e) => Err(internal_error(e)),
    }
}

pub async fn check_user(username: String) -> Result<DbUserInfo, HttpResponse> {
    let db = DB.get().await;
    if let Err(e) = db.use_ns("ns").use_db("db").await {
        return Err(internal_error(e));
    }
    match db
        .select::<Option<DbUserInfo>>(("tb_user", Id::from(username)))
        .await
    {
        Ok(Some(user)) => Ok(user),
        Ok(None) => Err(HttpResponse::NotFound().json(Resp::new("Sorry User Not Found!"))),
        Err(e) => Err(internal_error(e)),
    }
}

pub fn encode_token(claims: &Claims) -> Result<String, HttpResponse> {
    encode(
        &Header::default(),
        claims,
        &EncodingKey::from_secret(JWT_SECRET),
    )
    .map_or_else(|e| Err(internal_error(e)), Ok)
}

pub fn internal_error<T: Display>(e: T) -> HttpResponse {
    error!("Error: {}", e);
    HttpResponse::InternalServerError().json(Resp::new("Sorry Something Went Wrong!"))
}
pub async fn save_img(img: TempFile) -> Result<String, HttpResponse> {
    let dir = format!("{}/user_assets", get_cache_dir().await);

    if !FPath::new(&dir).exists() {
        if let Err(e) = fs::create_dir(&dir).await {
            return Err(internal_error(e));
        }
    }

    let pic_path = if let Some(img_name) = img.file_name {
        let img_dir = format!("{dir}/{}-{img_name}", GenString::new().gen_string(10, 30));
        (
            img_dir.clone(),
            format!("https://kargate.site/pics{img_dir}"),
        )
    } else {
        return Err(HttpResponse::BadRequest().json(Resp::new(
            "Sorry You have to provide the name of the image!",
        )));
    };

    if let Err(e) = img.file.persist(&pic_path.0) {
        return Err(internal_error(e));
    }

    Ok(pic_path.1)
}

pub fn wserror<T: Display>(e: T) -> tokio_tungstenite::tungstenite::Error {
    error!("Error: {}", e);
    tokio_tungstenite::tungstenite::Error::AttackAttempt
}

pub async fn get_cache_dir() -> String {
    if !FPath::new(DATA_PATH.as_str()).exists() {
        fs::create_dir(DATA_PATH.as_str()).await.unwrap();
    }
    DATA_PATH.to_string()
}

#[allow(clippy::future_not_send)]
pub async fn ct_user(token: &str) -> Result<(DbUserInfo, DbUserInfo), HttpResponse> {
    match decode_token(token) {
        Ok(tuser_info) => match check_user(tuser_info.username.clone()).await {
            Ok(cuser_info) => match verify_password(&tuser_info.password, &cuser_info.password) {
                Ok(()) => Ok((tuser_info, cuser_info)),
                Err(e) => Err(e),
            },
            Err(e) => Err(e),
        },
        Err(e) => Err(e),
    }
}

#[allow(clippy::future_not_send)]
#[get("/bruh/{smt}")]
pub async fn test_token(path: Path<String>) -> HttpResponse {
    println!("{path}");
    HttpResponse::Ok().await.unwrap()
}
