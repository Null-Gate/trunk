use std::fmt::Display;

use async_once::AsyncOnce;
use lazy_static::lazy_static;
use serde::{Deserialize, Serialize};
use surrealdb::{
    opt::auth::Root,
    engine::remote::ws::{Client, Ws}, RecordId, Surreal
};
use tracing::error;

pub type Dbt = Client;

lazy_static! {
    pub static ref DB: AsyncOnce<Surreal<Dbt>> =
        AsyncOnce::new(async {
            let db = Surreal::new::<Ws>("127.0.0.1:6677").await.unwrap();
            db.signin(Root {
                username: "root",
                password: "root"
            }).await.unwrap();
            db
        });
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct DbCarInfo {
    pub car_id: String,
    pub license_num: String,
    pub owner_proof: String,
    pub car_details: String,
    pub is_available: bool,
    pub userinfo: RecordId,
}

#[derive(Serialize, Deserialize, PartialEq, Eq)]
pub enum Event {
    Notification,
    NewFeed,
    Csc,
    Auth,
    CarFormNoti,
    DregFormNoti,
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
    pub id: RecordId,
    pub msg: (AccMode, String),
}

#[derive(Serialize, Deserialize, Clone, Copy, PartialEq, Eq, Debug)]
pub enum PState {
    Accept,
    Deny,
    Pending,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum NType {
    Booking,
    Bac,
    Bdn,
    AvaCar,
    OwnCarForm,
    CarFormApt,
    CarFormDny,
    DriverRegForm,
    DriverRegApt,
    DriverRegDny,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct PenDReg {
    pub pstat: PState,
    pub data: DbDriverInfo,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct DbDriverInfo {
    pub license_num: String,
    pub license_pic: String,
    pub exp_details: String,
    pub userinfo: RecordId,
}

#[derive(Serialize, Deserialize, Clone, Copy, PartialEq, Eq, Debug)]
pub enum Roles {
    Owner,
    Driver,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct OwnTB {
    pub r#in: RecordId,
    pub out: RecordId,
}

#[derive(Serialize, Deserialize, Clone, PartialEq, Eq, Debug, Default)]
pub struct DbUserInfo {
    pub username: String,
    pub fullname: String,
    pub password: String,
    pub pik_role: Vec<Roles>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Noti<T> {
    pub data: T,
    pub ntyp: NType,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct PenCar {
    pub pstat: PState,
    pub data: DbCarInfo,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct PenCarD {
    pub id: RecordId,
    pub pstat: PState,
    pub data: DbCarInfo,
}

impl Default for Msg {
    fn default() -> Self {
        Self {
            id: RecordId::from_table_key(
                "tb_user",
                "test"
                
            ),
            msg: (AccMode::default(), "".into()),
        }
    }
}

pub fn wserror<T: Display>(e: T) -> tokio_tungstenite::tungstenite::Error {
    error!("Error: {}", e);
    tokio_tungstenite::tungstenite::Error::AttackAttempt
}
