use serde_json::Value;
use surrealdb::{engine::local::Db, Surreal};

use crate::structures::wsstruct::Noti;

pub async fn notinit(username: &str, db: &Surreal<Db>) -> Vec<Noti<Value>> {
    db.select::<Vec<Noti<Value>>>(username).await.unwrap()
}
