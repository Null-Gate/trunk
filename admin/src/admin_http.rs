use actix_web::{App, HttpServer};

pub async fn http_server() -> std::io::Result<()> {
    HttpServer::new(move || App::new()).bind(("127.0.0.1", 9690))?.run().await
}
