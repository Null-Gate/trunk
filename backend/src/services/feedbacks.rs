use actix_web::{post, HttpResponse};

use crate::{extra::functions::internal_error, extra::structures::DB};

#[post("/feedbacks/{token}")]
async fn feedbacks() -> HttpResponse {
    let db = DB.get().await;
    if let Err(e) = db.use_ns("ns").use_db("db").await {
        return internal_error(e);
    }

    todo!()
}
