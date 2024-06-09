use std::sync::{atomic::{AtomicBool, Ordering}, Arc};

use futures_util::StreamExt;
use surrealdb::{engine::remote::ws::Client, sql::Id, Notification, Surreal};
use tokio::sync::Mutex;

use crate::extra::structures::BookTB;

pub async fn acbooknoti(db: &Surreal<Client>, username: Arc<str>, state: Arc<AtomicBool>, result: Arc<Mutex<BookTB>>) {
    let mut stream = db.select("book").live().await.unwrap();
    while let Some(res) = stream.next().await {
        let idk: Notification<BookTB> = res.unwrap();
        if idk.data.utn.id != Id::String(username.to_string()) {
            continue;
        }
        state.swap(true, Ordering::Relaxed);
        *result.lock().await = idk.data;
    }
}
