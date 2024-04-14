use actix_web::{get, HttpResponse};

use crate::structures::{DbCarPost, Resp, DB};

#[get("/ava_cars")]
async fn fetch_ava_cars() -> HttpResponse {
    let db = DB.get().await;
    if db.use_ns("ns").use_db("db").await.is_err() {
        return HttpResponse::InternalServerError().json(Resp::new(
            "Sorry We are having some problem when opening our database While Fetching AvA Cars.",
        ));
    }

    let query = "SELECT * FROM car_post ORDER BY RAND() LIMIT 30;";

    let mut resp = db.query(query).await.unwrap();

    let driver = resp.take::<Vec<DbCarPost>>(0).unwrap();
    let mut svec = vec![];

    for x in driver {
        svec.push(x.to_resp().await.unwrap());
    }
    HttpResponse::Ok().json(svec)
}
