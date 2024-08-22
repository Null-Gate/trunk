use crate::{
    extra::functions::internal_error,
    structures::{extrastruct::DB, post::PostD},
};
use actix_web::{get, HttpResponse};
use serde_json::Value;

#[get("/package")]
async fn fetch_package() -> HttpResponse {
    let db = DB.get().await;

    if let Err(e) = db.use_ns("ns").use_db("db").await {
        return internal_error(e);
    }

    let query = "SELECT * FROM tb_post WHERE (ptype = 'Pkg') ORDER BY RAND() LIMIT 30;";

    (db.query(query).await).map_or_else(internal_error, |mut resp| {
        resp.take::<Vec<PostD<Value>>>(0)
            .map_or_else(internal_error, |driver| {
                HttpResponse::Ok().json(
                    driver
                        .into_iter()
                        .map(|mut x| x.to_resp())
                        .collect::<Vec<Value>>(),
                )
            })
    })
}
