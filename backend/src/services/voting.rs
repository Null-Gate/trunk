use actix_web::{post, web::Path, HttpResponse};

use crate::{extra::{decode_token, internal_error}, structures::DB};

#[post("/up/{p_id}/{token}")]
pub async fn up_vote(paths: Path<(String, String)>) -> HttpResponse {
    let db = DB.get().await;
    if let Err(e) = db.use_ns("ns").use_db("db").await {
        return internal_error(e);
    }

    match decode_token(&paths.0) {
        Ok(user_info) => {
            todo!()
        },
        Err(e) => e
    }
}
