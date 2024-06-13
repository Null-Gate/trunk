use actix_web::{post, web::Path, HttpResponse};
use surrealdb::sql::Id;

use crate::extra::{functions::{ct_user, internal_error}, structures::{BookTB, DB}};

#[allow(clippy::future_not_send)]
#[post("/book/accept/{id}/{token}")]
async fn acbooking(parts: Path<(String, String)>) -> HttpResponse {
    let parts = parts.into_inner();
    let db = DB.get().await;
    if let Err(e) = db.use_ns("ns").use_db("db").await {
        return internal_error(e);
    }

    match ct_user(&parts.1, db).await {
        Ok((_, cuser)) => {
            match db.select::<Option<BookTB>>((cuser.username.to_string(), Id::String(parts.0.clone()))).await {
                Ok(Some(_)) => {
                    match db.delete::<Option<BookTB>>((cuser.username.to_string(), Id::String(parts.0))).await {
                        Ok(Some(_)) => HttpResponse::Ok().await.unwrap(),
                        Ok(None) => HttpResponse::NotFound().await.unwrap(),
                        Err(e) => internal_error(e)
                    }
                },
                Ok(None) => HttpResponse::NotFound().await.unwrap(),
                Err(e) => internal_error(e),
            }
        },
        Err(e) => e
    }
}
