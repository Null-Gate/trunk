use actix_web::{get, HttpResponse};

use crate::{
    extra::internal_error,
    structures::{DbCarPost, PostD, DB},
};

#[get("/ava_cars")]
async fn fetch_ava_cars() -> HttpResponse {
    let db = DB.get().await;
    if let Err(e) = db.use_ns("ns").use_db("db").await {
        return internal_error(e);
    }

    let query = "SELECT * FROM car_post ORDER BY RAND() LIMIT 30;";

    let mut resp = db.query(query).await.unwrap();

    let svec = resp.take::<Vec<PostD<DbCarPost>>>(0).unwrap();
    let mut rvec = vec![];

    for i in svec {
        rvec.push(i.to_resp().await);
    }

    HttpResponse::Ok().json(rvec)
}
