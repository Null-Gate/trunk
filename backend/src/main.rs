use actix_cors::Cors;
use actix_files as afs;
use actix_multipart::form::tempfile::TempFileConfig;
use actix_web::{App, HttpServer};
use auth::{delete::delete, login::login, signup::signup};
use extra::test_token;
use fetch::scope::fetch;
use post::{ava_car::post_car, car::car, driver::driver, package::package};
use std::{io::Result, path::Path};
use structures::get_cache_dir;
use tokio::fs;

mod auth;
mod extra;
mod fetch;
mod gen_salt;
mod post;
mod structures;

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
    .bind(("127.0.0.1", 8090))?
    .run()
    .await
}
