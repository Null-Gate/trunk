use actix_web::{get, HttpResponse};
use serde_json::Value;

use crate::structures::{DbCarPost, DbtoResp, Resp, DB};

#[get("/ava_cars")]
async fn fetch_ava_cars() -> HttpResponse {
    let db = DB.get().await;
    if db.use_ns("ns").use_db("db").await.is_err() {
        return HttpResponse::InternalServerError().json(Resp::new(
            "Sorry We are having some problem when opening our database!",
        ));
    }

    let query = "SELECT * FROM car_post ORDER BY RAND() LIMIT 30;";

    (db.query(query).await).map_or_else(
        |_| {
            HttpResponse::InternalServerError()
                .json("Sorry Something Went Wrong Getting the cars!")
        },
        |mut resp| {
            resp.take::<Vec<DbCarPost>>(0).map_or_else(
                |_| {
                    HttpResponse::InternalServerError()
                        .json("Sorry Something Went Wrong Getting the cars!")
                },
                |driver| {
                    HttpResponse::Ok().json(
                        driver
                            .iter()
                            .map(DbCarPost::to_resp)
                            .collect::<Vec<Value>>(),
                    )
                },
            )
        },
    )
}
