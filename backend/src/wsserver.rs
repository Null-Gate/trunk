use std::{net::SocketAddr, sync::Arc, time::Duration};

use futures_util::{SinkExt, StreamExt};
use surrealdb::sql::{Id, Thing};
use tokio::{
    net::{TcpListener, TcpStream},
    sync::Mutex,
};
use tokio_tungstenite::{
    accept_hdr_async,
    tungstenite::{
        handshake::server::{Request, Response},
        protocol::{frame::coding::CloseCode, CloseFrame},
        Error, Message, Result,
    },
};

use crate::{
    extra::{check_user, decode_token, verify_password, wserror},
    fetch::{nf::fetch_newfeed, noti::live_select},
    structures::{AccMode, DbUserInfo, Event, WSReq, WSResp, DB},
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
            let db = DB.get().await;
            if let Err(e) = db.use_ns("ns").use_db("db").await {
                return Err(wserror(e));
            }
            println!("NWS Conn: {peer:?}");
            let (mut ws_sender, mut ws_receiver) = ws_stream.split();
            let query_state = Arc::new(Mutex::new(false));
            let query_result = Arc::new(Mutex::new(DbUserInfo::default()));
            let mut dur = tokio::time::interval(Duration::from_millis(10));
            let mut db_user_info = DbUserInfo::default();
            let mut authed = false;
            tokio::spawn(live_select(query_state.clone(), query_result.clone()));

            loop {
                tokio::select! {
                         msg = ws_receiver.next() => {
                            if let Some(msg) = msg {
                                    let msg = msg?;
                                    if msg.is_text() || msg.is_binary() {
                                        let text = serde_json::from_str::<WSReq>(msg.to_text().unwrap()).unwrap();
                                        if text.event == Event::Auth {
                                            let user_info = decode_token(&text.data.clone().unwrap()).unwrap();

                                            db_user_info = check_user(user_info.username.clone(), db).await.unwrap();
                                            verify_password(&user_info.password, &db_user_info.password).unwrap();
                                            authed = true;
                                        }

                                        if !authed {
                                            ws_sender.send(Message::Close(Some(CloseFrame { code: CloseCode::Policy, reason: "Sorry You're Not Authed!!".into() }))).await.unwrap();
                                        }

                                        if text.event == Event::NewFeed {
                                            let nf = WSResp{
                                                event: Event::NewFeed,
                                                data: fetch_newfeed().await.unwrap()
                                            };
                                            ws_sender.send(Message::text(serde_json::to_string_pretty(&nf).unwrap())).await.unwrap();
                                        } else if text.event == Event::Csc {
                                            if let Some(msg) = text.data {
                                                let query = "UPDATE type::thing($cscthing) SET msg += type::string($msg)";
                                                db.query(query).bind(
                                                    ("cscthing", Thing {
                                                    tb: "csc".into(),
                                                    id: Id::String(db_user_info.username.to_string())
                                                })).bind(("msg", (AccMode::User, msg))).await.unwrap();
                                            }
                                        }
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
