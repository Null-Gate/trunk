use std::sync::{
    atomic::{AtomicBool, Ordering},
    Arc,
};

use futures_util::StreamExt;
use surrealdb::{engine::local::Db, Notification, Surreal};
use tokio::sync::Mutex;

use crate::extra::structures::{BookTB, Noti};

pub async fn booknoti(
    db: &Surreal<Db>,
    username: Arc<str>,
    state: Arc<AtomicBool>,
    result: Arc<Mutex<Option<Noti<BookTB>>>>,
) {
    let mut stream = db.select(username.to_string()).live().await.unwrap();
    while let Some(res) = stream.next().await {
        let idk: Notification<Noti<BookTB>> = res.unwrap();
        state.swap(true, Ordering::Relaxed);
        *result.lock().await = Some(idk.data);
    }
}
