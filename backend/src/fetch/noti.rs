use crate::{extra::wserror, structures::{DbUserInfo, DB}};
use futures_util::StreamExt;
use surrealdb::Notification;
use tokio_tungstenite::tungstenite::Error;

pub async fn live_select() -> Result<DbUserInfo, Error> {
    let db = DB.get().await;
    if let Err(e) = db.use_ns("ns").use_db("db").await {
        return Err(wserror(e));
    }
    let mut stream = db.select("person").live().await.unwrap();

    while let Some(res) = stream.next().await {
        let idk: Result<Notification<DbUserInfo>, surrealdb::Error> = res;
        println!("{:?}", idk.unwrap());
    }

    todo!()
}
