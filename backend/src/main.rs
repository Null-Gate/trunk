use std::io::Result;
use actix_cors::Cors;
use actix_web::{HttpServer, App};
use auth::{delete::delete, login::login, signup::signup};

mod structures;
mod gen_salt;
mod auth;

#[actix_web::main]
async fn main() -> Result<()> {
    HttpServer::new(||{
        let cors = Cors::permissive();
        App::new().service(signup).service(login).service(delete).wrap(cors)
    }).bind(("127.0.0.1", 8090))?.run().await
}
