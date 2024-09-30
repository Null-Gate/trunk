use std::{
    net::SocketAddr,
    sync::{
        atomic::{AtomicBool, Ordering},
        Arc,
    },
    time::Duration,
};

use argon2::verify_encoded;
use chrono::Utc;
use futures_util::{SinkExt, StreamExt};
use jsonwebtoken::{decode, Algorithm, DecodingKey, Validation};
use serde_json::Value;
use surrealdb::{Notification, RecordId, Surreal};
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
    extra::functions::wserror,
    fetch::nf::fetch_newfeed,
    services::{ganoti::get_all_noti, notinit::notinit},
    structures::{
        auth::Claims,
        car::Cargo,
        dbstruct::DbUserInfo,
        extrastruct::{Dbt, DB, JWT_SECRET},
        wsstruct::{Event, NotiD, SLoc, WSReq, WSResp, Wst},
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
            let (mut ws_sender, mut ws_receiver) = ws_stream.split();
            let db_user_info = Arc::new(Mutex::new(DbUserInfo::default()));
            let authed = Arc::new(AtomicBool::new(false));
            let mut wst = Wst::Noti;
            let mut cargod = String::new();
            let db = DB.get().await;
            if let Err(e) = db.use_ns("ns").use_db("db").await {
                return Err(wserror(e));
            }
            check_ws(
                idk,
                &mut wst,
                &mut cargod,
                db,
                db_user_info.clone(),
                authed.clone(),
            )
            .await?;

            println!("NWS Conn: {peer:?}");
            let anstate = Arc::new(AtomicBool::new(false));
            let anresult: Arc<Mutex<Option<NotiD<Value>>>> = Arc::new(Mutex::new(None));
            let ctstate = Arc::new(AtomicBool::new(false));
            let ctresult: Arc<Mutex<SLoc>> = Arc::new(Mutex::new(SLoc::default()));
            let mut dur = tokio::time::interval(Duration::from_millis(10));
            let mut ldur = tokio::time::interval(Duration::from_millis(500));
            tokio::spawn(get_all_noti(
                db,
                db_user_info.lock().await.username.clone(),
                anstate.clone(),
                anresult.clone(),
            ));

            let notinit_msg = notinit(&db_user_info.lock().await.username, db).await;
            let nt = WSResp {
                event: Event::InitNotifications,
                data: notinit_msg,
            };

            ws_sender
                .send(Message::Text(serde_json::to_string_pretty(&nt).unwrap()))
                .await
                .unwrap();

            if wst == Wst::LocS {
                loop {
                    tokio::select! {
                        msg = ws_receiver.next() => {
                            if let Some(msg) = msg {
                                let msg = msg?;
                                if msg.is_text() || msg.is_binary() {
                                    if !authed.load(Ordering::Relaxed) {
                                        ws_sender.send(Message::Close(Some(CloseFrame {
                                            code: CloseCode::Policy,
                                            reason: "Sorry You're Not Authed!!".into(),
                                        }))).await.unwrap();
                                    }

                                    let ctloc: SLoc = serde_json::from_str(msg.to_text().unwrap()).unwrap();
                                    let mut cargodt: Cargo = db.select::<Option<Cargo>>(RecordId::from_table_key("tb_cargo", &cargod)).await.unwrap().unwrap();
                                    if cargodt.driver.key().to_string() != db_user_info.lock().await.username {
                                        ws_sender.send(Message::Close(Some(CloseFrame {
                                            code: CloseCode::Policy,
                                            reason: "Sorry You Are Not A Driver Of This Car".into(),
                                        }))).await.unwrap();
                                    }
                                    cargodt.tlocs.insert(Utc::now().timestamp(), ctloc.clone());
                                    cargodt.ctloc = ctloc;
                                    db.update::<Option<Cargo>>(RecordId::from_table_key("tb_cargo", &cargod)).content(cargodt).await.unwrap().unwrap();
                                }
                            }
                        }
                    }
                }
            } else if wst == Wst::LocG {
                tokio::spawn(get_loc(
                    db,
                    cargod.clone(),
                    ctresult.clone(),
                    ctstate.clone(),
                ));
                loop {
                    tokio::select! {
                        _ = ldur.tick() => {
                            if ctstate.swap(false, Ordering::Relaxed) {
                                ws_sender.send(Message::Text(serde_json::to_string_pretty(&*(ctresult.lock().await)).unwrap())).await.unwrap();
                            }
                        }
                    }
                }
            }

            loop {
                tokio::select! {
                         msg = ws_receiver.next() => {
                            if let Some(msg) = msg {
                                    let msg = msg?;
                                    match cond_check(msg, authed.clone()).await {
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
                         }
                }
            }
        }
        Err(_) => Err(wserror("not implemented wserror!")),
    }
}

pub async fn cond_check(msg: Message, authed: Arc<AtomicBool>) -> Result<Message, ()> {
    if msg.is_text() || msg.is_binary() {
        let text = serde_json::from_str::<WSReq>(msg.to_text().unwrap()).unwrap();

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
        } else if msg.is_close() {
            return Err(());
        }
    }
    Err(())
}

async fn check_ws(
    idk: Option<String>,
    wst: &mut Wst,
    cargod: &mut String,
    db: &Surreal<Dbt>,
    db_user_info: Arc<Mutex<DbUserInfo>>,
    authed: Arc<AtomicBool>,
) -> std::result::Result<(), Error> {
    if let Some(paths) = idk {
        let parts = paths.split('/').collect::<Vec<&str>>();
        if parts[1] == "noti" {
            *wst = Wst::Noti;
        } else if parts[1] == "get_loc" {
            *cargod = parts[2].to_string();
            *wst = Wst::LocG;
        } else if parts[1] == "send_loc" {
            *cargod = parts[2].to_string();
            *wst = Wst::LocS;
        } else {
            return Err(wserror("Fuckkkk NO Ws Option"));
        }
        let tuserinfo = decode::<Claims>(
            parts[3],
            &DecodingKey::from_secret(JWT_SECRET),
            &Validation::new(Algorithm::HS256),
        )
        .unwrap();
        let cuserinfo: DbUserInfo = db
            .select::<Option<DbUserInfo>>(RecordId::from_table_key(
                "tb_user",
                &tuserinfo.claims.user_info.username,
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
    Ok(())
}

async fn get_loc(
    db: &Surreal<Dbt>,
    cargod: String,
    ctlot: Arc<Mutex<SLoc>>,
    ctstat: Arc<AtomicBool>,
) {
    let mut stream = db
        .select(RecordId::from_table_key("tb_cargo", &cargod))
        .live()
        .await
        .unwrap();

    while let Some(result) = stream.next().await {
        let result: Notification<Cargo> = result.unwrap();
        *ctlot.lock().await = result.data.ctloc;
        ctstat.swap(true, Ordering::Relaxed);
    }
}

/*if text.event == Event::Auth {
    let user_info = decode_token(&text.data.clone().unwrap()).unwrap();

    *db_user_info.lock().await = check_user(user_info.username.clone()).await.unwrap();
    verify_password(&user_info.password, &(db_user_info.lock().await).password).unwrap();
    authed.swap(true, Ordering::Relaxed);
}*/

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
