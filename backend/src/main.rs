use std::io::Result;
use actix_web::{HttpServer, App};
use auth::signup::signup;

mod structures;
mod gen_salt;
mod auth;

#[actix_web::main]
async fn main() -> Result<()> {
    HttpServer::new(|| App::new().service(signup)).bind(("127.0.0.1", 8090))?.run().await
}
