use std::sync::{
    atomic::{AtomicBool, Ordering},
    Arc,
};

use futures_util::StreamExt;
use surrealdb::{Notification, Surreal};
use tokio::sync::Mutex;

use crate::structures::{Dbt, PState, PenCarD};

pub async fn carform_noti(
    db: &Surreal<Dbt>,
    state: Arc<AtomicBool>,
    result: Arc<Mutex<Option<PenCarD>>>,
) {
    let mut stream = db.select("pend_car").live().await.unwrap();
    while let Some(res) = stream.next().await {
        let idk: Notification<PenCarD> = res.unwrap();
        if idk.data.pstat != PState::Pending {
            continue;
        }
        state.swap(true, Ordering::Relaxed);
        *result.lock().await = Some(idk.data);
    }
}
