use actix_web::{get, web::Path, HttpResponse};
use surrealdb::sql::Id;

use crate::structures::{DbUserInfo, Resp, DB};

#[get("/user/{id}")]
async fn fetch_user(id: Path<String>) -> HttpResponse {
    let db = DB.get().await;
    if db.use_ns("ns").use_db("db").await.is_err() {
        return HttpResponse::InternalServerError().json(Resp::new(
            "Sorry We are having some problem when opening our database!",
        ));
    }

    match db.select::<Option<DbUserInfo>>(("user", Id::from(id.as_str()))).await {
        Ok(Some(user)) => {
            HttpResponse::Ok().json(user)
        },
        Ok(None) => {
            HttpResponse::NotFound().json("User Not Found!")
        },
        Err(_) => {
            HttpResponse::InternalServerError().json("Sorry Something Went Wrong While Searching User!")
        }
    }
}
