use std::sync::{atomic::{AtomicBool, Ordering}, Arc};

use serde_json::Value;
use futures_util::StreamExt;
use surrealdb::{engine::local::Db, Notification, Surreal};
use tokio::sync::Mutex;

pub async fn live_chat(state: Arc<AtomicBool>, result: Arc<Mutex<Value>>, db: &Surreal<Db>) {
    db.use_ns("ns").use_db("db").await.unwrap();
    let mut stream = db.select("csc").live().await.unwrap();

    while let Some(res) = stream.next().await {
        let idk: Result<Notification<Value>, surrealdb::Error> = res;
        state.swap(true, Ordering::Relaxed);
        *result.lock().await = idk.unwrap().data;
    }
}
