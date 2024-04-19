use actix_web::{get, web::Path, HttpResponse};
use surrealdb::sql::Id;

use crate::{
    extra::internal_error,
    structures::{DbCarInfo, DbtoResp, DB},
};

#[get("/car/{id}")]
pub async fn fetch_car(id: Path<String>) -> HttpResponse {
    let db = DB.get().await;
    if let Err(e) = db.use_ns("ns").use_db("db").await {
        return internal_error(e);
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
