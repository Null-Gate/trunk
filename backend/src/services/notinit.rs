use serde_json::Value;
use surrealdb::Surreal;

use crate::structures::{extrastruct::Dbt, wsstruct::Noti};

pub async fn notinit(username: &str, db: &Surreal<Dbt>) -> Vec<Noti<Value>> {
    db.select::<Vec<Noti<Value>>>(username).await.unwrap()
}
