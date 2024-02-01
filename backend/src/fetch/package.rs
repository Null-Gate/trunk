use actix_web::{get, HttpResponse};
use serde_json::Value;

use crate::structures::{DbPackageInfo, DbtoResp, Resp, DB};

#[get("/package")]
async fn fetch_package() -> HttpResponse {
    let db = DB.get().await;
    if db.use_ns("ns").use_db("db").await.is_err() {
        return HttpResponse::InternalServerError().json(Resp::new(
            "Sorry We are having some problem when opening our database!",
        ));
    }

    let query = "SELECT * FROM package ORDER BY RAND() LIMIT 30;";

    (db.query(query).await).map_or_else(
        |_| {
            HttpResponse::InternalServerError()
                .json("Sorry Something Went Wrong Getting the packages!")
        },
        |mut resp| {
            resp.take::<Vec<DbPackageInfo>>(0).map_or_else(
                |_| {
                    HttpResponse::InternalServerError()
                        .json("Sorry Something Went Wrong Getting the packages!")
                },
                |package| {
                    HttpResponse::Ok().json(
                        package
                            .iter()
                            .map(DbPackageInfo::to_resp)
                            .collect::<Vec<Value>>(),
                    )
                },
            )
        },
    )
}
