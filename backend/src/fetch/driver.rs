use actix_web::{get, HttpResponse};
use serde_json::Value;

use crate::{
    extra::internal_error,
    structures::{DbDriverInfo, DbtoResp, DB},
};

#[get("/driver")]
async fn fetch_driver() -> HttpResponse {
    let db = DB.get().await;
    if let Err(e) = db.use_ns("ns").use_db("db").await {
        return internal_error(e);
    }

    let query = "SELECT * FROM driver ORDER BY RAND() LIMIT 30;";

    (db.query(query).await).map_or_else(internal_error, |mut resp| {
        resp.take::<Vec<DbDriverInfo>>(0)
            .map_or_else(internal_error, |driver| {
                HttpResponse::Ok().json(
                    driver
                        .iter()
                        .map(DbDriverInfo::to_resp)
                        .collect::<Vec<Value>>(),
                )
            })
    })
}
