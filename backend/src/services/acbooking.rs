use actix_web::{post, web::Path, HttpResponse};

#[post("/book/accept/{id}/{token}")]
async fn acbooking(parts: Path<(String, String)>) -> HttpResponse {
    todo!()
}
