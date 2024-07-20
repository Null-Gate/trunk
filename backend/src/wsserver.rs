use std::{
    net::SocketAddr,
    sync::{
        atomic::{AtomicBool, Ordering},
        Arc,
    },
    time::Duration,
};

use argon2::verify_encoded;
use futures_util::{SinkExt, StreamExt};
use jsonwebtoken::{decode, Algorithm, DecodingKey, Validation};
use serde_json::Value;
use surrealdb::{
    sql::{Id, Thing},
    Surreal,
};
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
    extra::functions::{check_user, decode_token, verify_password, wserror},
    fetch::{nf::fetch_newfeed, noti::live_select},
    services::{ganoti::get_all_noti, notinit::notinit},
    structures::{
        auth::Claims,
        bookstruct::BookTB,
        dbstruct::DbUserInfo,
        extrastruct::{AccMode, Dbt, DB, JWT_SECRET},
        wsstruct::{Event, Noti, NotiD, WSReq, WSResp},
    },
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

#[allow(clippy::too_many_lines)]
pub async fn handle_connection(peer: SocketAddr, stream: TcpStream) -> Result<()> {
    let mut idk = None;
    let callback = |req: &Request, resp: Response| {
        println!("req Path: {}", req.uri().path());
        idk = Some(req.uri().to_string());

        Ok(resp)
    };
    match accept_hdr_async(stream, callback).await {
        Ok(ws_stream) => {
            let db_user_info = Arc::new(Mutex::new(DbUserInfo::default()));
            let authed = Arc::new(AtomicBool::new(false));
            let db = DB.get().await;
            if let Err(e) = db.use_ns("ns").use_db("db").await {
                return Err(wserror(e));
            }
            if let Some(paths) = idk {
                let parts = paths.split('/').collect::<Vec<&str>>();
                let tuserinfo = decode::<Claims>(
                    parts[1],
                    &DecodingKey::from_secret(JWT_SECRET),
                    &Validation::new(Algorithm::HS256),
                )
                .unwrap();
                let cuserinfo: DbUserInfo = db
                    .select::<Option<DbUserInfo>>((
                        "user",
                        Id::String(tuserinfo.claims.user_info.username.to_string()),
                    ))
                    .await
                    .unwrap()
                    .unwrap();
                if verify_encoded(
                    &cuserinfo.password,
                    tuserinfo.claims.user_info.password.as_bytes(),
                )
                .unwrap()
                {
                    *db_user_info.lock().await = tuserinfo.claims.user_info;
                    authed.swap(true, Ordering::Relaxed);
                } else {
                    return Err(wserror("bruh"));
                }
            }
            println!("NWS Conn: {peer:?}");
            let (mut ws_sender, mut ws_receiver) = ws_stream.split();
            let query_state = Arc::new(AtomicBool::new(false));
            let query_result = Arc::new(Mutex::new(DbUserInfo::default()));
            let acbook_state = Arc::new(AtomicBool::new(false));
            let acbook_result: Arc<Mutex<Option<Noti<BookTB>>>> = Arc::new(Mutex::new(None));
            let anstate = Arc::new(AtomicBool::new(false));
            let anresult: Arc<Mutex<Option<NotiD<Value>>>> = Arc::new(Mutex::new(None));
            let mut dur = tokio::time::interval(Duration::from_millis(10));
            tokio::spawn(live_select(query_state.clone(), query_result.clone()));
            tokio::spawn(get_all_noti(
                db,
                db_user_info.lock().await.username.clone(),
                anstate.clone(),
                anresult.clone(),
            ));
            /*tokio::spawn(booknoti(
                db,
                db_user_info.lock().await.username.clone(),
                acbook_state.clone(),
                acbook_result.clone(),
            ));

            if db_user_info.lock().await.pik_role.contains(&Roles::Driver) {
                tokio::spawn(gnotifd(
                    db,
                    db_user_info.lock().await.username.clone(),
                    cdriver_state.clone(),
                    cdriver_result.clone(),
                ));
            }*/

            let notinit_msg = notinit(&db_user_info.lock().await.username, db).await;
            let nt = WSResp {
                event: Event::InitNotifications,
                data: notinit_msg,
            };

            ws_sender
                .send(Message::Text(serde_json::to_string_pretty(&nt).unwrap()))
                .await
                .unwrap();

            loop {
                tokio::select! {
                         msg = ws_receiver.next() => {
                            if let Some(msg) = msg {
                                    let msg = msg?;
                                    match cond_check(msg, db_user_info.clone(), db, authed.clone()).await {
                                        Ok(remsg) => {ws_sender.send(remsg).await.unwrap();},
                                        Err(()) => break Ok(())
                                    }
                            }
                         }
                         _ = dur.tick() => {
                             if anstate.swap(false, Ordering::Relaxed) {
                                 let nt = WSResp{
                                     event: Event::Notification,
                                     data: anresult.lock().await.clone()
                                 };
                                 ws_sender.send(Message::text(serde_json::to_string_pretty(&nt).unwrap())).await.unwrap();
                             }
                             if acbook_state.swap(false, Ordering::Relaxed) {
                                 let nt = WSResp {
                                     event: Event::Notification,
                                     data: acbook_result.lock().await.clone().unwrap()
                                 };
                                 ws_sender.send(Message::text(serde_json::to_string_pretty(&nt).unwrap())).await.unwrap();
                             }
                         }
                }
            }
        }
        Err(_) => Err(wserror("not implemented wserror!")),
    }
}

pub async fn cond_check(
    msg: Message,
    db_user_info: Arc<Mutex<DbUserInfo>>,
    db: &Surreal<Dbt>,
    authed: Arc<AtomicBool>,
) -> Result<Message, ()> {
    if msg.is_text() || msg.is_binary() {
        let text = serde_json::from_str::<WSReq>(msg.to_text().unwrap()).unwrap();
        if text.event == Event::Auth {
            let user_info = decode_token(&text.data.clone().unwrap()).unwrap();

            *db_user_info.lock().await = check_user(user_info.username.clone()).await.unwrap();
            verify_password(&user_info.password, &(db_user_info.lock().await).password).unwrap();
            authed.swap(true, Ordering::Relaxed);
        }

        if !authed.load(Ordering::Relaxed) {
            return Ok(Message::Close(Some(CloseFrame {
                code: CloseCode::Policy,
                reason: "Sorry You're Not Authed!!".into(),
            })));
        }

        if text.event == Event::NewFeed {
            let nf = WSResp {
                event: Event::NewFeed,
                data: fetch_newfeed().await.unwrap(),
            };
            return Ok(Message::text(serde_json::to_string_pretty(&nf).unwrap()));
        } else if text.event == Event::Csc {
            if let Some(msg) = text.data {
                let query = "UPDATE type::thing($cscthing) SET msg += type::string($msg)";
                db.query(query)
                    .bind((
                        "cscthing",
                        Thing {
                            tb: "csc".into(),
                            id: Id::String((db_user_info.lock().await).username.to_string()),
                        },
                    ))
                    .bind(("msg", (AccMode::User, msg)))
                    .await
                    .unwrap();
            }
        }
    } else if msg.is_close() {
        return Err(());
    }
    Err(())
}
