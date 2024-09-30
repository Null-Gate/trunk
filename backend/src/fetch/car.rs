use actix_web::{get, web::Path, HttpResponse};
use surrealdb::RecordId;

use crate::{
    extra::functions::internal_error,
    structures::{car::DbCarInfo, extrastruct::DB},
};

#[get("/car/{id}")]
pub async fn fetch_car(id: Path<String>) -> HttpResponse {
    let db = DB.get().await;
    if let Err(e) = db.use_ns("ns").use_db("db").await {
        return internal_error(e);
    }

    match db
        .select::<Option<DbCarInfo>>(RecordId::from_table_key("tb_car", id.into_inner()))
        .await
    {
        Ok(Some(car)) => HttpResponse::Ok().json(car),
        Ok(None) => HttpResponse::NotFound().json("Car Not Found"),
        Err(_) => HttpResponse::InternalServerError().json("Sorry Went Wrong While Searching Car!"),
    }
}
