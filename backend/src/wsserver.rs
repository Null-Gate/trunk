use std::{net::SocketAddr, sync::Arc, time::Duration};

use futures_util::{SinkExt, StreamExt};
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

use crate::{
    extra::wserror,
    fetch::{nf::fetch_newfeed, noti::live_select},
    structures::{DbUserInfo, Event, WSResp},
};

pub async fn wserver() {
    let server = TcpListener::bind(dotenvy::var("WSADDR").unwrap())
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
            println!("NWS Conn: {peer:?}");
            let (mut ws_sender, mut ws_receiver) = ws_stream.split();
            let query_state = Arc::new(Mutex::new(false));
            let query_result = Arc::new(Mutex::new(DbUserInfo::default()));
            let mut dur = tokio::time::interval(Duration::from_millis(10));
            tokio::spawn(live_select(query_state.clone(), query_result.clone()));

            loop {
                tokio::select! {
                         msg = ws_receiver.next() => {
                            if let Some(msg) = msg {
                                    let msg = msg?;
                                    if (msg.is_text() || msg.is_binary()) && msg.to_text().unwrap() == "start" {
                                        let nf = WSResp{
                                            event: Event::NewFeed,
                                            data: fetch_newfeed().await.unwrap()
                                        };
                                        ws_sender.send(Message::text(serde_json::to_string_pretty(&nf).unwrap())).await.unwrap();
                                    } else if msg.is_close() {
                                        break Ok(());
                                    }
                            }
                         }
                         _ = dur.tick() => {
                             if *query_state.lock().await {
                                 let nt = WSResp{
                                     event: Event::Notification,
                                     data: query_result.lock().await.clone()
                                 };
                                 ws_sender.send(Message::text(serde_json::to_string_pretty(&nt).unwrap())).await.unwrap();
                                 *query_state.lock().await = false;
                             }
                         }
                }
            }
        }
        Err(_) => Err(wserror("not implemented wserror!")),
    }
}
