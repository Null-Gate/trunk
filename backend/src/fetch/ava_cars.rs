use actix_web::{get, HttpResponse};
use serde_json::Value;

use crate::extra::{
    functions::internal_error,
    structures::{DbCarInfo, PostD, DB},
};

#[get("/ava_cars")]
async fn fetch_ava_cars() -> HttpResponse {
    let db = DB.get().await;
    if let Err(e) = db.use_ns("ns").use_db("db").await {
        return internal_error(e);
    }

    let query = "SELECT * FROM car_post ORDER BY RAND() LIMIT 30;";

    let mut resp = db.query(query).await.unwrap();

    let svec = resp.take::<Vec<PostD<DbCarInfo>>>(0).unwrap();
    let rvec = svec
        .into_iter()
        .map(|x| x.to_resp())
        .collect::<Vec<Value>>();

    HttpResponse::Ok().json(rvec)
}
