use std::sync::{
    atomic::{AtomicBool, Ordering},
    Arc,
};

use futures_util::StreamExt;
use serde_json::Value;
use surrealdb::{Notification, Surreal};
use tokio::sync::Mutex;

use crate::structures::{extrastruct::Dbt, wsstruct::NotiD};

pub async fn get_all_noti(
    db: &Surreal<Dbt>,
    username: String,
    state: Arc<AtomicBool>,
    result: Arc<Mutex<Option<NotiD<Value>>>>,
) {
    let mut stream = db.select(username).live().await.unwrap();
    while let Some(res) = stream.next().await {
        let idk: Notification<NotiD<Value>> = res.unwrap();
        state.swap(true, Ordering::Relaxed);
        *result.lock().await = Some(idk.data);
    }
}
