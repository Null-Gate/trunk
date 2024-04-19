use actix_cors::Cors;
use actix_files as afs;
use actix_multipart::form::tempfile::TempFileConfig;
use actix_web::{App, HttpServer};
use auth::{delete::delete, login::login, signup::signup};
use extra::test_token;
use fetch::scope::fetch;
use post::{ava_car::post_car, car::car, driver::driver, package::package};
use std::path::Path;
use structures::{DATA_PATH, SEIF};
use tokio::fs;
use tracing::Level;

mod auth;
mod extra;
mod fetch;
mod gen_salt;
mod post;
mod structures;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    color_eyre::install().unwrap();
    tracing_subscriber::fmt()
        .with_max_level(Level::ERROR)
        .pretty()
        .with_ansi(true)
        .with_file(true)
        .with_line_number(true)
        .init();
    let dir = format!("{}/user_assets", DATA_PATH.as_str());
    if !Path::new(&dir).exists() {
        fs::create_dir_all(&dir).await.unwrap();
    }
    let _ = HttpServer::new(move || {
        let cors = Cors::permissive();
        App::new()
            .app_data(TempFileConfig::default().directory(&dir))
            .service(afs::Files::new("/pics", &dir))
            .service(signup)
            .service(login)
            .service(delete)
            .service(driver)
            .service(car)
            .service(post_car)
            .service(package)
            .service(fetch())
            .service(test_token)
            .wrap(cors)
    })
    .bind((SEIF.0.as_str(), SEIF.1))?
    .run()
    .await;
    Ok(())
}
