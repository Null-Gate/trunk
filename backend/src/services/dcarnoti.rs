use std::sync::{
    atomic::{AtomicBool, Ordering},
    Arc,
};

use futures_util::StreamExt;
use serde_json::Value;
use surrealdb::{Notification, Surreal};
use tokio::sync::Mutex;

use crate::structures::{
    car::CargoD, extrastruct::Dbt, wsstruct::{NType, Noti}
};

pub async fn gnotifd(
    db: &Surreal<Dbt>,
    username: String,
    noti_status: Arc<AtomicBool>,
    noti_result: Arc<Mutex<Option<Noti<CargoD>>>>,
) {
    let mut gntf = db.select(username).live().await.unwrap();

    while let Some(smt) = gntf.next().await {
        match smt {
            Ok(smt) => {
                let smtt = smti(smt);
                match smtt {
                    Ok(kk) => {
                        if kk.ntyp != NType::CDriver {
                            continue;
                        }
                        noti_status.swap(true, Ordering::Relaxed);
                        *noti_result.lock().await = Some(kk);
                    }
                    Err(()) => continue,
                }
            }
            Err(_) => continue,
        };
    }
}

fn smti(smt: Notification<Value>) -> Result<Noti<CargoD>, ()> {
    serde_json::from_value::<Noti<CargoD>>(smt.data).map_or(Err(()), Ok)
}
