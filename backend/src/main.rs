use actix_cors::Cors;
use actix_multipart::form::tempfile::TempFileConfig;
use actix_web::{App, HttpServer};
use auth::{delete::delete, login::login, signup::signup};
use fetch::scope::fetch;
use post::{driver::driver, car::car, package::package};
use structures::get_cache_dir;
use tokio::fs;
use std::{io::Result, path::Path};

mod auth;
mod gen_salt;
mod structures;
mod fetch;
mod post;

#[actix_web::main]
async fn main() -> Result<()> {
    let dir = format!("{}/user_assets", get_cache_dir().await);
    if !Path::new(&dir).exists() {
        fs::create_dir(&dir).await.unwrap();
    }
    HttpServer::new(move || {
        let cors = Cors::permissive();
        App::new()
            .app_data(TempFileConfig::default().directory(&dir))
            .service(signup)
            .service(login)
            .service(delete)
            .service(driver)
            .service(car)
            .service(package)
            .service(fetch())
            .wrap(cors)
    })
    .bind(("127.0.0.1", 8090))?
    .run()
    .await
}
