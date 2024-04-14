use actix_web::{get, web::Path, HttpResponse};
use surrealdb::sql::Id;

use crate::structures::{DbCarInfo, DbtoResp, Resp, DB};

#[get("/car/{id}")]
pub async fn fetch_car(id: Path<String>) -> HttpResponse {
    let db = DB.get().await;
    if db.use_ns("ns").use_db("db").await.is_err() {
        return HttpResponse::InternalServerError().json(Resp::new(
            "Sorry We are having some problem when opening our database!",
        ));
    }

    match db
        .select::<Option<DbCarInfo>>(("car", Id::from(id.as_str())))
        .await
    {
        Ok(Some(car)) => car.to_hresp(),
        Ok(None) => HttpResponse::NotFound().json("Car Not Found"),
        Err(_) => HttpResponse::InternalServerError().json("Sorry Went Wrong While Searching Car!"),
    }
}
