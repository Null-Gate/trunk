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

    match decode::<Claims>(
        &jwt,
        &DecodingKey::from_secret(JWT_SECRET),
        &Validation::new(Algorithm::HS256),
    ) {
        Ok(token_info) => {
            let user_info = token_info.claims.user_info;
            match db
                .select::<Option<DbUserInfo>>(("user", Id::String(user_info.username.clone())))
                .await
            {
                Ok(Some(user)) => {
                    match verify_encoded(&user.password, user_info.password.as_bytes()) {
                        Ok(stat) => {
                            if !stat {
                                return HttpResponse::NotAcceptable()
                                    .json(Resp::new("Sorry Wrong password!"));
                            }

                            if (
                                user.fullname,
                                user.pik_role,
                                user.car_posts,
                                user.pkg_posts,
                                user.own_cars,
                            ) != (
                                user_info.fullname,
                                user_info.pik_role,
                                user_info.car_posts,
                                user_info.pkg_posts,
                                user_info.own_cars,
                            ) {
                                return HttpResponse::NotAcceptable()
                                    .json(Resp::new("Some Infos Are Wrong!"));
                            }

                            match db
                                .delete::<Option<DbUserInfo>>((
                                    "user",
                                    Id::String(user_info.username),
                                ))
                                .await
                            {
                                Ok(Some(_)) => HttpResponse::Ok()
                                    .json(Resp::new("Successfully Deleted The Account!")),
                                Ok(None) => HttpResponse::NoContent()
                                    .json(Resp::new("No Userfound Not Deleted!")),
                                _ => HttpResponse::InternalServerError().json(Resp::new(
                                    "Something Went Wrong While Deleting The Account!",
                                )),
                            }
                        }
                        Err(_) => HttpResponse::InternalServerError().json(Resp::new(
                            "Something Went Wrong While Verifying Your Password!",
                        )),
                    }
                }
                Ok(None) => HttpResponse::NoContent().json(Resp::new("No Userfound Not Deleted!")),
                Err(_) => HttpResponse::InternalServerError().json(Resp::new(
                    "Something Went Wrong While Checking Your Account Info!",
                )),
            }
        }
        Err(_) => HttpResponse::NotAcceptable().json(Resp::new("Sorry Wrong Token!")),
    }
}
