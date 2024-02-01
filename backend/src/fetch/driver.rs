use actix_web::{get, HttpResponse};
use serde_json::Value;

use crate::structures::{DbDriverInfo, DbtoResp, Resp, DB};

#[get("/driver")]
async fn fetch_driver() -> HttpResponse {
    let db = DB.get().await;
    if db.use_ns("ns").use_db("db").await.is_err() {
        return HttpResponse::InternalServerError().json(Resp::new(
            "Sorry We are having some problem when opening our database!",
        ));
    }

    let query = "SELECT * FROM driver ORDER BY RAND() LIMIT 30;";

    (db.query(query).await).map_or_else(
        |_| {
            HttpResponse::InternalServerError()
                .json("Sorry Something Went Wrong Getting the drivers!")
        },
        |mut resp| {
            resp.take::<Vec<DbDriverInfo>>(0).map_or_else(
                |_| {
                    HttpResponse::InternalServerError()
                        .json("Sorry Something Went Wrong Getting the drivers!")
                },
                |driver| {
                    HttpResponse::Ok().json(
                        driver
                            .iter()
                            .map(DbDriverInfo::to_resp)
                            .collect::<Vec<Value>>(),
                    )
                },
            )
        },
    )
}
