#![allow(clippy::module_name_repetitions)]

use actix_cors::Cors;
use actix_files as afs;
use actix_multipart::form::tempfile::TempFileConfig;
use actix_web::{App, HttpServer};
use auth::{delete::delete, login::login, signup::signup};
use extra::functions::test_token;
use fetch::scope::fetch;
use post::{ava_car::post_car, car::car, driver::driver, package::package};
use services::acbooking::acbooking;
use services::booking::book;
use services::voting::up_vote;
use std::path::Path;
use std::{fs::File, io::BufReader};
use structures::extrastruct::DATA_PATH;
use tokio::fs;
use tracing::Level;

mod auth;
mod extra;
mod fetch;
mod post;
mod services;
mod structures;
mod wsserver;

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

    rustls::crypto::aws_lc_rs::default_provider()
        .install_default()
        .unwrap();
    let mut certs_file = BufReader::new(File::open(dotenvy::var("CERT_FILE").unwrap()).unwrap());
    let mut key_file = BufReader::new(File::open(dotenvy::var("KEY_FILE").unwrap()).unwrap());

    let tls_certs = rustls_pemfile::certs(&mut certs_file)
        .collect::<Result<Vec<_>, _>>()
        .unwrap();
    let tls_key = rustls_pemfile::pkcs8_private_keys(&mut key_file)
        .next()
        .unwrap()
        .unwrap();

    // set up TLS config options
    let tls_config = rustls::ServerConfig::builder()
        .with_no_client_auth()
        .with_single_cert(tls_certs, rustls::pki_types::PrivateKeyDer::Pkcs8(tls_key))
        .unwrap();

    let dir = format!("{}/user_assets", DATA_PATH.as_str());
    if !Path::new(&dir).exists() {
        fs::create_dir_all(&dir).await.unwrap();
    }

    tokio::spawn(wsserver::wserver());
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
            .service(up_vote)
            .service(book)
            .service(acbooking)
            .wrap(cors)
    })
    .bind_rustls_0_23(
        (
            dotenvy::var("TRUNK_HOST").unwrap(),
            dotenvy::var("TRUNK_PORT").unwrap().parse().unwrap(),
        ),
        tls_config,
    )?
    .run()
    .await;
    Ok(())
}
