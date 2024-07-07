use actix_web::{get, web::Path, HttpResponse};

use crate::{extra::functions::{ct_user, internal_error}, structures::extrastruct::DB};

#[allow(clippy::future_not_send)]
#[get("/get/cargos/{token}")]
pub async fn get_cargos(token: Path<String>) -> HttpResponse {
    let db = DB.get().await;
    if let Err(e) = db.use_ns("ns").use_db("db").await {
        return internal_error(e);
    }

    let (tuser, duser) = ct_user(token.as_str()).await.unwrap();
    todo!()
}
