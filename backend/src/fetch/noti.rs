use std::sync::{
    atomic::{AtomicBool, Ordering},
    Arc,
};

use crate::extra::structures::{DbUserInfo, DB};
use futures_util::StreamExt;
use surrealdb::Notification;
use tokio::sync::Mutex;

pub async fn live_select(state: Arc<AtomicBool>, result: Arc<Mutex<DbUserInfo>>) {
    let db = DB.get().await;
    db.use_ns("ns").use_db("db").await.unwrap();
    let mut stream = db.select("user").live().await.unwrap();

    while let Some(res) = stream.next().await {
        let idk: Result<Notification<DbUserInfo>, surrealdb::Error> = res;
        state.swap(true, Ordering::Relaxed);
        *result.lock().await = idk.unwrap().data;
    }
}
