use accept_cf::apt_cf;
use admin_ws::wsserver;
use tracing::Level;

use actix_web::{App, HttpServer};

mod carform_upload;
mod live_chat;
mod structures;
mod admin_ws;
mod accept_cf;

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
    tokio::spawn(wsserver());
    
    HttpServer::new(move || App::new().service(apt_cf)).bind(("127.0.0.1", 9690))?.run().await
}

