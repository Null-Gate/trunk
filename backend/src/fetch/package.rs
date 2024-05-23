use crate::{
    extra::internal_error,
    structures::{DbPackageInfo, Post, DB},
};
use actix_web::{get, HttpResponse};

#[get("/package")]
async fn fetch_package() -> HttpResponse {
    let db = DB.get().await;

    if let Err(e) = db.use_ns("ns").use_db("db").await {
        return internal_error(e);
    }

    let query = "SELECT * FROM package ORDER BY RAND() LIMIT 30;";

    (db.query(query).await).map_or_else(internal_error, |mut resp| {
        resp.take::<Vec<Post<DbPackageInfo>>>(0)
            .map_or_else(internal_error, |driver| {
                HttpResponse::Ok().json(driver)
            })
    })
}
