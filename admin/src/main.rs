use std::{fs::File, io::BufReader};

use accept_cf::apt_cf;
use admin_ws::wsserver;
use deny_cf::dny_cf;
use tracing::Level;

use actix_web::{App, HttpServer};

mod accept_cf;
mod admin_ws;
mod carform_upload;
mod deny_cf;
mod live_chat;
mod structures;

#[tokio::main]
pub async fn main() -> std::io::Result<()> {
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

    tokio::spawn(wsserver());

    HttpServer::new(move || App::new().service(apt_cf).service(dny_cf))
        .bind_rustls_0_23(
            (
                dotenvy::var("ADMIN_HOST").unwrap(),
                dotenvy::var("ADMIN_PORT").unwrap().parse().unwrap(),
            ),
            tls_config,
        )?
        .run()
        .await
}
