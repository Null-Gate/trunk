use std::fmt::Debug;

use actix_multipart::form::{tempfile::TempFile, text::Text, MultipartForm};
use argon2::{Config, Variant, Version};
use async_once::AsyncOnce;
use lazy_static::lazy_static;
use rand::rngs::ThreadRng;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use surrealdb::{
    engine::local::{Db, Mem},
    sql::{Id, Thing},
    Surreal,
};

lazy_static! {
    pub static ref DATA_PATH: String = dotenvy::var("DATA_DIR").unwrap();
    pub static ref SEIF: (String, u16) = (
        dotenvy::var("TRUNK_HOST").unwrap(),
        dotenvy::var("TRUNK_PORT").unwrap().parse().unwrap()
    );
    pub static ref DB: AsyncOnce<Surreal<Db>> =
        AsyncOnce::new(async { Surreal::new::<Mem>(()).await.unwrap() });
}

pub static ARGON_CONFIG: Config = {
    Config {
        variant: Variant::Argon2i,
        version: Version::Version13,
        mem_cost: 10000,
        time_cost: 5,
        lanes: 100,
        hash_length: 100,
        ad: &[],
        secret: &[],
    }
};
pub const JWT_SECRET: &[u8] =
    "kshashdfjklasdhfsdhfkasjhfasdhHKHJHKJHSKJHKJSHJKHSJKHJKFHSKJ".as_bytes();


#[derive(MultipartForm)]
pub struct DriverForm {
    pub license_num: Text<String>,
    #[multipart(limit = "1 MiB")]
    pub license_pic: TempFile,
    pub exp_details: Text<String>,
}

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

#[derive(Serialize, Deserialize, PartialEq, Eq, Default, Clone)]
pub enum AccMode {
    #[default]
    Admin,
    User,
}

#[derive(Serialize, Deserialize)]
pub struct WSResp<T> {
    pub event: Event,
    pub data: T,
}

#[derive(Serialize, Deserialize, PartialEq, Eq, Debug)]
pub enum Vote {
    Up,
    Down,
}

#[derive(Serialize, Deserialize, PartialEq, Eq, Debug, Clone)]
pub enum PType {
    Car,
    Pkg,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct VRelate {
    pub id: Thing,
    pub r#in: Thing,
    pub out: Thing,
    pub vote: Vote,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct VoteTB {
    pub r#in: Thing,
    pub out: Thing,
    pub vote: Vote,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct OwnTB {
    pub r#in: Thing,
    pub out: Thing,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum BStat {
    Accept,
    Deny,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct BookTB {
    pub r#in: Thing,
    pub in_info: Value,
    pub out: Thing,
    pub out_info: Value,
    pub utn: Thing,
    pub utr: Thing,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct BookStat {
    pub bstat: BStat,
    pub bdata: BookTB,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct GBookTB<L, V> {
    pub r#in: Thing,
    pub in_info: PostD<L>,
    pub out: Thing,
    pub out_info: PostD<V>,
    pub utn: Thing,
    pub utr: Thing,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum NType {
    Booking,
    Bac,
    Bdn,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Noti<T> {
    pub data: T,
    pub ntyp: NType,
}

#[derive(Serialize, Deserialize)]
pub struct Resp<'a> {
    pub msg: &'a str,
}

#[derive(Clone)]
pub struct GenString {
    pub rngs: ThreadRng,
}

#[derive(Serialize, Deserialize, PartialEq, Eq)]
pub enum BType {
    Pkg,
    Car,
}

#[derive(Serialize, Deserialize)]
pub struct Booking {
    pub carp_id: String,
    pub pkgp_id: String,
    pub btype: BType,
}
