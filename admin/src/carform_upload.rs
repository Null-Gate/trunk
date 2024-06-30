use std::sync::{
    atomic::{AtomicBool, Ordering},
    Arc,
};

use futures_util::StreamExt;
use surrealdb::{engine::local::Db, Notification, Surreal};
use tokio::sync::Mutex;

use crate::structures::DbCarInfo;

pub async fn carform_noti(
    db: &Surreal<Db>,
    state: Arc<AtomicBool>,
    result: Arc<Mutex<Option<DbCarInfo>>>,
) {
    let mut stream = db.select("pend_car").live().await.unwrap();
    while let Some(res) = stream.next().await {
        let idk: Notification<DbCarInfo> = res.unwrap();
        state.swap(true, Ordering::Relaxed);
        *result.lock().await = Some(idk.data);
    }
}
