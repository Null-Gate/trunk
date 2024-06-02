use std::{net::SocketAddr, sync::Arc, time::Duration};

use futures_util::{SinkExt, StreamExt};
use serde_json::Value;
use structures::wserror;
use surrealdb::{sql::{Id, Thing}, Notification};
use tokio::{
    net::{TcpListener, TcpStream},
    sync::Mutex,
};
use tokio_tungstenite::{
    accept_hdr_async,
    tungstenite::{
        handshake::server::{Request, Response},
        Error, Message, Result,
    },
};
use tracing::Level;

use crate::structures::{AccMode, Event, WSReq, WSResp, DB};

mod structures;

#[tokio::main]
pub async fn main() {
    color_eyre::install().unwrap();
    tracing_subscriber::fmt()
        .with_max_level(Level::ERROR)
        .pretty()
        .with_ansi(true)
        .with_file(true)
        .with_line_number(true)
        .init();
    let server = TcpListener::bind("localhost:9090")
        .await
        .unwrap();
    while let Ok((stream, _)) = server.accept().await {
        tokio::spawn(accept_conn(stream));
    }
}

pub async fn accept_conn(stream: TcpStream) {
    let peer = stream.peer_addr().unwrap();
    println!("peered: {peer}");
    if let Err(e) = handle_connection(peer, stream).await {
        match e {
            Error::ConnectionClosed | Error::Protocol(_) | Error::Utf8 => (),
            _ => println!("Something Wrong"),
        }
    }
}

pub async fn handle_connection(peer: SocketAddr, stream: TcpStream) -> Result<()> {
    let callback = |req: &Request, resp: Response| {
        println!("req Path: {}", req.uri().path());
        Ok(resp)
    };
    match accept_hdr_async(stream, callback).await {
        Ok(ws_stream) => {
            let db = DB.get().await;
            db.use_ns("ns").use_db("db").await.unwrap();
            println!("NWS Conn: {peer:?}");
            let (mut ws_sender, mut ws_receiver) = ws_stream.split();
            let mut dur = tokio::time::interval(Duration::from_millis(10));
            let query_state = Arc::new(Mutex::new(false));
            let query_result = Arc::new(Mutex::new(Value::default()));

            tokio::spawn(live_chat(query_state.clone(), query_result.clone()));

            loop {
                tokio::select! {
                         msg = ws_receiver.next() => {
                            if let Some(msg) = msg {
                                    let msg = msg?;
                                    if msg.is_text() || msg.is_binary() {
                                        let text = serde_json::from_str::<WSReq>(msg.to_text().unwrap()).unwrap();

                                        if text.event == Event::Csc {
                                            if let Some(msg) = text.data {
                                                let query = "UPDATE type::thing($cscthing) SET msg += type::string($msg)";
                                                db.query(query).bind(
                                                    ("cscthing", Thing {
                                                    tb: "csc".into(),
                                                    id: Id::String(text.username.unwrap())
                                                })).bind(("msg", (AccMode::Admin, msg))).await.unwrap();
                                            }
                                        }
                                    } else if msg.is_close() {
                                        break Ok(());
                                    }
                            }
                         }
                         _ = dur.tick() => {
                             if *query_state.lock().await {
                    let resp = WSResp {
                        event: Event::Csc,
                        data: query_result.lock().await.clone()
                    };
                    ws_sender.send(Message::text(serde_json::to_string_pretty(&resp).unwrap())).await.unwrap();
                    println!("yoooo");
                    *query_state.lock().await = false;
                }

                         }
                }

           }
        }
        Err(_) => Err(wserror("not implemented wserror!")),
    }
}

async fn live_chat(state: Arc<Mutex<bool>>, result: Arc<Mutex<Value>>) {
    let db = DB.get().await;
    db.use_ns("ns").use_db("db").await.unwrap();
    let mut stream = db.select("csc").live().await.unwrap();

    while let Some(res) = stream.next().await {
        let idk: Result<Notification<Value>, surrealdb::Error> = res;
        *state.lock().await = true;
        *result.lock().await = idk.unwrap().data;
    }
}
