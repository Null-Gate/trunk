use actix_web::{delete, web::Path, HttpResponse};
use argon2::verify_encoded;
use jsonwebtoken::{decode, Algorithm, DecodingKey, Validation};
use surrealdb::sql::Id;

use crate::{
    extra::internal_error,
    structures::{Claims, DbUserInfo, Resp, DB, JWT_SECRET},
};

#[delete("/delete/{jwt}")]
pub async fn delete(jwt: Path<String>) -> HttpResponse {
    let db = DB.get().await;
    if let Err(e) = db.use_ns("ns").use_db("db").await {
        return internal_error(e);
    }

    match decode::<Claims>(
        &jwt,
        &DecodingKey::from_secret(JWT_SECRET),
        &Validation::new(Algorithm::HS256),
    ) {
        Ok(token_info) => {
            let user_info = token_info.claims.user_info;
            match db
                .select::<Option<DbUserInfo>>(("user", Id::String(user_info.username.to_string())))
                .await
            {
                Ok(Some(user)) => {
                    match verify_encoded(&user.password, user_info.password.as_bytes()) {
                        Ok(stat) => {
                            if !stat {
                                return HttpResponse::NotAcceptable()
                                    .json(Resp::new("Sorry Wrong password!"));
                            }

                            match db
                                .delete::<Option<DbUserInfo>>((
                                    "user",
                                    Id::String(user_info.username.to_string()),
                                ))
                                .await
                            {
                                Ok(Some(_)) => HttpResponse::Ok()
                                    .json(Resp::new("Successfully Deleted The Account!")),
                                Ok(None) => HttpResponse::NoContent()
                                    .json(Resp::new("No Userfound Not Deleted!")),
                                Err(e) => internal_error(e),
                            }
                        }
                        Err(_) => HttpResponse::InternalServerError().json(Resp::new(
                            "Something Went Wrong While Verifying Your Password!",
                        )),
                    }
                }
                Ok(None) => HttpResponse::NoContent().json(Resp::new("No Userfound Not Deleted!")),
                Err(e) => internal_error(e),
            }
        }
        Err(_) => HttpResponse::NotAcceptable().json(Resp::new("Sorry Wrong Token!")),
    }
}
