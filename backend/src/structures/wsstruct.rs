use serde::{Deserialize, Serialize};
use serde_json::Value;
use surrealdb::sql::Thing;

#[derive(Serialize, Deserialize)]
pub struct NewFeed {
    pub car_posts: Vec<Value>,
    pub packages: Vec<Value>,
}

#[derive(Serialize, Deserialize, PartialEq, Eq)]
pub enum Event {
    Notification,
    InitNotifications,
    NewFeed,
    Csc,
    Auth,
}

#[derive(Serialize, Deserialize)]
pub struct WSReq {
    pub event: Event,
    pub data: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct WSResp<T> {
    pub event: Event,
    pub data: T,
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq)]
pub enum NType {
    Booking,
    Bac,
    Bdn,
    AvaCar,
    OwnCarForm,
    CarFormApt,
    CDriver,
    CDriverApt,
    CDriverDny,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Noti<T> {
    pub data: T,
    pub ntyp: NType,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct NotiD<T> {
    pub id: Thing,
    pub data: T,
    pub ntyp: NType,
}
