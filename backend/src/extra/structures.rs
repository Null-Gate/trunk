use std::sync::Arc;

use actix_multipart::form::{tempfile::TempFile, text::Text, MultipartForm};
use argon2::{Config, Variant, Version};
use async_once::AsyncOnce;
use lazy_static::lazy_static;
use rand::rngs::ThreadRng;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use surrealdb::{
    engine::remote::ws::{Client, Ws},
    sql::{Id, Thing},
    Surreal,
};

lazy_static! {
    pub static ref DATA_PATH: String = dotenvy::var("DATA_DIR").unwrap();
    pub static ref SEIF: (String, u16) = (
        dotenvy::var("TRUNK_HOST").unwrap(),
        dotenvy::var("TRUNK_PORT").unwrap().parse().unwrap()
    );
    pub static ref DB: AsyncOnce<Surreal<Client>> =
        AsyncOnce::new(async { Surreal::new::<Ws>("localhost:9070").await.unwrap() });
}

pub static ARGON_CONFIG: Config = {
    Config {
        variant: Variant::Argon2i,
        version: Version::Version13,
        mem_cost: 6000,
        time_cost: 1,
        lanes: 10,
        hash_length: 100,
        ad: &[],
        secret: &[],
    }
};
pub const JWT_SECRET: &[u8] =
    "kshashdfjklasdhfsdhfkasjhfasdhHKHJHKJHSKJHKJSHJKHSJKHJKFHSKJ".as_bytes();

#[derive(Serialize, Deserialize, Clone, Copy, PartialEq, Eq, Debug)]
pub enum Roles {
    Owner,
    Driver,
}

#[derive(Serialize, Deserialize)]
pub struct Claims {
    pub user_info: DbUserInfo,
    pub exp: usize,
}

#[derive(Serialize, Deserialize)]
pub struct Signup {
    pub username: Arc<str>,
    pub fullname: Arc<str>,
    pub password: Arc<str>,
}

#[derive(Serialize, Deserialize, Clone, PartialEq, Eq, Debug)]
pub struct DbUserInfo {
    pub username: Arc<str>,
    pub fullname: Arc<str>,
    pub password: Arc<str>,
    pub pik_role: Vec<Roles>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct DbDriverInfo {
    pub license_num: Arc<str>,
    pub license_pic: Arc<str>,
    pub exp_details: Arc<str>,
    pub userinfo: Thing,
}

#[derive(MultipartForm)]
pub struct DriverForm {
    pub license_num: Text<Arc<str>>,
    #[multipart(limit = "1 MiB")]
    pub license_pic: TempFile,
    pub exp_details: Text<Arc<str>>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct DbCarInfo {
    pub car_id: Id,
    pub license_num: Arc<str>,
    pub owner_proof: Arc<str>,
    pub car_details: Arc<str>,
    pub is_available: bool,
    pub userinfo: Thing,
}

#[derive(MultipartForm)]
pub struct CarForm {
    pub license_num: Text<Arc<str>>,
    #[multipart(limit = "1 MiB")]
    pub owner_proof: TempFile,
    pub car_details: Text<Arc<str>>,
}

#[derive(Serialize, Deserialize)]
pub struct CarPostForm {
    pub car_id: Arc<str>,
    pub driver_id: Arc<str>,
    pub from_where: Arc<str>,
    pub cper_weight: u32,
    pub cper_amount: u32,
    pub to_where: Arc<str>,
    pub date_to_go: Arc<str>,
}

#[derive(MultipartForm)]
pub struct PackageForm {
    pub package_name: Text<Arc<str>>,
    #[multipart(limit = "1 MiB")]
    pub package_pic: TempFile,
    pub pkg_details: Text<Arc<str>>,
    pub cper_weight: Text<u32>,
    pub cper_amount: Text<u32>,
    pub to_where: Text<Arc<str>>,
    pub from_where: Text<Arc<str>>,
    pub date_to_go: Text<Arc<str>>,
}

#[derive(Serialize, Deserialize)]
pub struct NewFeed {
    pub car_posts: Vec<Value>,
    pub packages: Vec<Value>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct DbPackageInfo {
    pub package_name: Arc<str>,
    pub package_pic: Arc<str>,
    pub pkg_details: Arc<str>,
}

#[derive(Serialize, Deserialize)]
pub struct Login {
    pub username: Arc<str>,
    pub password: Arc<str>,
}

#[derive(Serialize, Deserialize, PartialEq, Eq)]
pub enum Event {
    Notification,
    NewFeed,
    Csc,
    Auth
}

#[derive(Serialize, Deserialize)]
pub struct WSReq {
    pub event: Event,
    pub data: Option<String>
}

#[derive(Serialize, Deserialize, PartialEq, Eq, Default, Clone)]
pub enum AccMode {
    #[default]
    Admin,
    User
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

#[derive(Serialize, Deserialize)]
pub struct Resp<'a> {
    pub msg: &'a str,
}

#[derive(Clone)]
pub struct GenString {
    pub rngs: ThreadRng,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Post<T> {
    pub ptdate: u64,
    pub r#in: Thing,
    pub out: Thing,
    pub from_where: Arc<str>,
    pub to_where: Arc<str>,
    pub date_to_go: Arc<str>,
    pub cper_weight: u32,
    pub cper_amount: u32,
    pub votes: i64,
    pub ptype: PType,
    pub data: T,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct PostD<T> {
    pub id: Thing,
    pub ptdate: u64,
    pub r#in: Thing,
    pub out: Thing,
    pub from_where: Arc<str>,
    pub to_where: Arc<str>,
    pub date_to_go: Arc<str>,
    pub cper_amount: u32,
    pub cper_weight: u32,
    pub ptype: PType,
    pub votes: i64,
    pub data: T,
}

#[derive(Serialize, Deserialize)]
pub enum BType {
    Pkg,
    Car
}

#[derive(Serialize, Deserialize)]
pub struct Booking {
    pub car_id: Arc<str>,
    pub pkg_id: Arc<str>,
    pub btype: BType
}
