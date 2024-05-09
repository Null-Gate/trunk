use std::net::SocketAddr;

use futures_util::{SinkExt, StreamExt};
use tokio::net::{TcpListener, TcpStream};
use tokio_tungstenite::{
    accept_hdr_async,
    tungstenite::{
        handshake::server::{Request, Response},
        Error, Message, Result,
    },
};

use crate::{
    extra::wserror,
    structures::{DbCarPost, NewFeed, DB},
};

pub async fn wserver() {
    println!("here!!");
    let server = TcpListener::bind("127.0.0.1:9080").await.unwrap();
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
        if req.uri().path() == "/nf" {
            return Ok(resp);
        }
        todo!()
    };
    let ws_stream = accept_hdr_async(stream, callback).await.unwrap();
    println!("NWS Conn: {peer:?}");
    let (mut ws_sender, mut ws_receiver) = ws_stream.split();

    loop {
        tokio::select! {
                 msg = ws_receiver.next() => {
                    if let Some(msg) = msg {
                            let msg = msg?;
                            if (msg.is_text() || msg.is_binary()) && msg.to_text().unwrap() == "start" {
                                let nf = fnf().await.unwrap();
                                ws_sender.send(Message::text(serde_json::to_string_pretty(&nf).unwrap())).await.unwrap();
                            } else if msg.is_close() {
                                break Ok(());
                            }
                    }
                }
             }
    }
}



pub async fn fnf() -> Result<NewFeed, tokio_tungstenite::tungstenite::Error> {
    let db = DB.get().await;
    if let Err(e) = db.use_ns("ns").use_db("db").await {
        return Err(wserror(e));
    }

    let car_postsql = "SELECT * FROM car_post ORDER BY RAND() LIMIT 50;";
    let packagesql = "SELECT * FROM package ORDER BY RAND() LIMIT 50;";

    let mut ret = db.query(car_postsql).query(packagesql).await.unwrap();
    let db_car_posts = ret.take::<Vec<DbCarPost>>(0).unwrap();
    println!("{db_car_posts:?}");
    let mut car_posts = vec![];

    for x in db_car_posts {
        car_posts.push(x.to_resp().await.unwrap());
    }
    println!("{car_posts:?}");

    Ok(NewFeed {
        car_posts,
        packages: ret.take(1).unwrap(),
    })
}
