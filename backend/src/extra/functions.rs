use std::{fmt::Display, path::Path as FPath, sync::Arc};

use actix_multipart::form::tempfile::TempFile;
use actix_web::{get, web::Path, HttpResponse};
use argon2::verify_encoded;
use jsonwebtoken::{decode, encode, Algorithm, DecodingKey, EncodingKey, Header, Validation};
use surrealdb::{engine::remote::ws::Client, sql::Id, Surreal};
use tokio::fs;
use tracing::error;

use crate::extra::structures::{get_cache_dir, Claims, DbUserInfo, GenString, Resp, JWT_SECRET};

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

pub async fn check_user(
    username: Arc<str>,
    db: &Surreal<Client>,
) -> Result<DbUserInfo, HttpResponse> {
    match db
        .select::<Option<DbUserInfo>>(("user", Id::from(username.to_string())))
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
            format!("http://54.169.162.141:80/pics{img_dir}"),
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

#[get("/bruh")]
pub async fn test_token() -> HttpResponse {
    HttpResponse::Ok().await.unwrap()
    //decode_token(token.as_str()).map_or_else(|e| e, |v| HttpResponse::Ok().json(v))
}
