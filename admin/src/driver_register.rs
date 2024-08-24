use std::sync::{
    atomic::{AtomicBool, Ordering},
    Arc,
};

use futures_util::StreamExt;
use surrealdb::{Action, Notification, Surreal};
use tokio::sync::Mutex;

use crate::structures::{Dbt, PState, PenDReg};

pub async fn drivereg_noti(
    db: &Surreal<Dbt>,
    state: Arc<AtomicBool>,
    result: Arc<Mutex<Option<PenDReg>>>,
) {
    let mut stream = db.select("tb_pend_driver").live().await.unwrap();
    while let Some(res) = stream.next().await {
        let idk: Notification<PenDReg> = res.unwrap();
        if idk.data.pstat == PState::Pending && idk.action != Action::Delete {
            state.swap(true, Ordering::Relaxed);
            *result.lock().await = Some(idk.data);
        }
    }
}
