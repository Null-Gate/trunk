use actix_web::{post, web::{Json, Path}, HttpResponse};

use crate::extra::{functions::{ct_user, internal_error}, structures::{Booking, DB}};

#[allow(clippy::future_not_send)]
#[post("/book/{token}")]
async fn book(token: Path<String>, info: Json<Booking>) -> HttpResponse {
    let db = DB.get().await;
    if let Err(e) = db.use_ns("ns").use_db("db").await {
        return internal_error(e);
    }

    match ct_user(&token, db).await {
        Ok((user_info, user)) => todo!(),
        Err(e) => e
    }
}
