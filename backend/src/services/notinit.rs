use serde_json::Value;
use surrealdb::Surreal;

use crate::structures::{extrastruct::Dbt, wsstruct::NotiD};

pub async fn notinit(username: &str, db: &Surreal<Dbt>) -> Vec<NotiD<Value>> {
    db.select::<Vec<NotiD<Value>>>(username).await.unwrap()
}
