use std::sync::Arc;

use surrealdb::{engine::remote::ws::Client, Surreal};

pub async fn acbooknoti(db: &Surreal<Client>, username: Arc<str>) {
    let stream = db.select(("user", ))
}
