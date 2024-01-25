use actix_web::{delete, web::Path, HttpResponse};
use argon2::verify_encoded;
use jsonwebtoken::{decode, Algorithm, DecodingKey, Validation};
use surrealdb::sql::Id;

use crate::structures::{Claims, DbUserInfo, Resp, DB, JWT_SECRET};

#[delete("/delete/{jwt}")]
pub async fn delete(jwt: Path<String>) -> HttpResponse {
    let db = DB.get().await;
    if db.use_ns("ns").use_db("db").await.is_err() {
        return HttpResponse::InternalServerError().json(Resp::new(
            "Sorry We are having some problem when opening our database!",
        ));
    }
    
    let user_info = decode::<Claims>(&jwt, &DecodingKey::from_secret(JWT_SECRET), &Validation::new(Algorithm::HS256)).unwrap();

    match db.select::<Option<DbUserInfo>>(("user", Id::String(user_info.claims.username.clone()))).await {
        Ok(Some(user)) => {
            match verify_encoded(&user.password, user_info.claims.password.clone().as_bytes()) {
                Ok(stat) => {
                    if !stat {
                        return HttpResponse::NotAcceptable().json(Resp::new("Sorry Wrong password!"));
                    }

                    match db.delete::<Option<DbUserInfo>>(("user", Id::String(user_info.claims.username))).await {
                        Ok(Some(_)) => {
                            HttpResponse::Ok().json(Resp::new("Successfully Deleted The Account!"))
                        }
                        Ok(None) => {
                            HttpResponse::NoContent().json(Resp::new("No Userfound Not Deleted!"))
                        }
                        _ => {
                            HttpResponse::InternalServerError().json(Resp::new("Something Went Wrong While Deleting The Account!"))
                        }
                    }
                },
                Err(_) => {
                    HttpResponse::InternalServerError().json(Resp::new("Something Went Wrong While Verifying Your Password!"))
                },
            }
        },
        Ok(None) => {
            HttpResponse::NoContent().json(Resp::new("No Userfound Not Deleted!"))
        }
        Err(_) => {
            HttpResponse::InternalServerError().json(Resp::new("Something Went Wrong While Checking Your Account Info!"))
        }
    }
}
