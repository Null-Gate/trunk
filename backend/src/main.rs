use std::io::Result;

use actix_web::{HttpServer, App};

#[actix_web::main]
async fn main() -> Result<()> {
    HttpServer::new(|| App::new()).bind(("127.0.0.1", 8090))?.run().await
}
