use actix_web::{get, web::Path, HttpResponse};
use argon2::verify_encoded;
use jsonwebtoken::{decode, encode, Algorithm, DecodingKey, EncodingKey, Header, Validation};
use surrealdb::{engine::local::Db, sql::Id, Surreal};

use crate::structures::{Claims, DbUserInfo, Resp, JWT_SECRET};

pub fn decode_token(token: &str) -> Result<DbUserInfo, HttpResponse> {
    match decode::<Claims>(
        token,
        &DecodingKey::from_secret(JWT_SECRET),
        &Validation::new(Algorithm::HS256),
    ) {
        Ok(token_info) => Ok(token_info.claims.user_info),
        Err(_) => Err(HttpResponse::InternalServerError().json(Resp::new("Sorry Wrong Token!"))),
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
        Err(_) => Err(HttpResponse::InternalServerError().json(Resp::new(
            "Sorry Something Went Wrong While Checking Your Account!",
        ))),
    }
}

pub async fn check_user(username: &str, db: &Surreal<Db>) -> Result<DbUserInfo, HttpResponse> {
    match db
        .select::<Option<DbUserInfo>>(("user", Id::from(username)))
        .await
    {
        Ok(Some(user)) => Ok(user),
        Ok(None) => Err(HttpResponse::NotFound().json(Resp::new("Sorry User Not Found!"))),
        Err(_) => Err(HttpResponse::InternalServerError().json(Resp::new(
            "Sorry Something Went Wrong While Checking Your Account!",
        ))),
    }
}

pub fn encode_token(claims: &Claims) -> Result<String, HttpResponse> {
    encode(
        &Header::default(),
        claims,
        &EncodingKey::from_secret(JWT_SECRET),
    )
    .map_or_else(
        |_| {
            Err(HttpResponse::InternalServerError().json(Resp::new(
                "Sorry Something Went Wrong While Creating Token!",
            )))
        },
        Ok,
    )
}

#[get("/test_token/{token}")]
pub async fn test_token(token: Path<String>) -> HttpResponse {
    decode_token(token.as_str()).map_or_else(|e| e, |v| HttpResponse::Ok().json(v))
}
