use serde_json::Value;
use surrealdb::{engine::local::Db, Surreal};

use crate::extra::structures::Noti;

pub async fn notinit(username: &str, db: &Surreal<Db>) -> Vec<Noti<Value>> {
    db.select::<Vec<Noti<Value>>>("adsa").await.unwrap()
}
