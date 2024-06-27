use std::fmt::Display;

use async_once::AsyncOnce;
use lazy_static::lazy_static;
use serde::{Deserialize, Serialize};
use surrealdb::{
    engine::local::{Db, Mem},
    sql::{Id, Thing},
    Surreal,
};
use tracing::error;

lazy_static! {
    pub static ref DB: AsyncOnce<Surreal<Db>> =
        AsyncOnce::new(async { Surreal::new::<Mem>(()).await.unwrap() });
}

#[derive(Serialize, Deserialize, PartialEq, Eq)]
pub enum Event {
    Notification,
    NewFeed,
    Csc,
    Auth,
}

#[derive(Serialize, Deserialize, PartialEq, Eq, Default, Clone)]
pub enum AccMode {
    #[default]
    Admin,
    User,
}

#[derive(Serialize, Deserialize)]
pub struct WSReq {
    pub event: Event,
    pub username: Option<String>,
    pub data: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct WSResp<T> {
    pub event: Event,
    pub data: T,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct Msg {
    pub id: Thing,
    pub msg: (AccMode, String),
}

impl Default for Msg {
    fn default() -> Self {
        Self {
            id: Thing {
                tb: "user".into(),
                id: Id::from("test"),
            },
            msg: (AccMode::default(), "".into()),
        }
    }
}

pub fn wserror<T: Display>(e: T) -> tokio_tungstenite::tungstenite::Error {
    error!("Error: {}", e);
    tokio_tungstenite::tungstenite::Error::AttackAttempt
}
