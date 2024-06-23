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
    pub username: String,
    pub fullname: String,
    pub password: String,
}

#[derive(Serialize, Deserialize, Clone, PartialEq, Eq, Debug)]
pub struct SDbUserInfo {
    pub username: String,
    pub fullname: String,
    pub password: String,
    pub pik_role: Vec<Roles>,
}

#[derive(Serialize, Deserialize, Clone, PartialEq, Eq, Debug, Default)]
pub struct DbUserInfo {
    pub username: String,
    pub fullname: String,
    pub password: String,
    pub pik_role: Vec<Roles>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct DbDriverInfo {
    pub license_num: String,
    pub license_pic: String,
    pub exp_details: String,
    pub userinfo: Thing,
}

#[derive(MultipartForm)]
pub struct DriverForm {
    pub license_num: Text<String>,
    #[multipart(limit = "1 MiB")]
    pub license_pic: TempFile,
    pub exp_details: Text<String>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct DbCarInfo {
    pub car_id: Id,
    pub license_num: String,
    pub owner_proof: String,
    pub car_details: String,
    pub is_available: bool,
    pub userinfo: Thing,
}

#[derive(MultipartForm)]
pub struct CarForm {
    pub license_num: Text<String>,
    #[multipart(limit = "1 MiB")]
    pub owner_proof: TempFile,
    pub car_details: Text<String>,
}

#[derive(Serialize, Deserialize)]
pub struct CarPostForm {
    pub car_id: String,
    pub driver_id: String,
    pub from_where: String,
    pub cper_weight: u32,
    pub cper_amount: u32,
    pub to_where: String,
    pub date_to_go: String,
}

#[derive(MultipartForm)]
pub struct PackageForm {
    pub package_name: Text<String>,
    #[multipart(limit = "1 MiB")]
    pub package_pic: TempFile,
    pub pkg_details: Text<String>,
    pub cper_weight: Text<u32>,
    pub cper_amount: Text<u32>,
    pub to_where: Text<String>,
    pub from_where: Text<String>,
    pub date_to_go: Text<String>,
}

#[derive(Serialize, Deserialize)]
pub struct NewFeed {
    pub car_posts: Vec<Value>,
    pub packages: Vec<Value>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct DbPackageInfo {
    pub package_name: String,
    pub package_pic: String,
    pub pkg_details: String,
}

#[derive(Serialize, Deserialize)]
pub struct Login {
    pub username: String,
    pub password: String,
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

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Post<T> {
    pub ptdate: u64,
    pub r#in: Thing,
    pub out: Thing,
    pub from_where: String,
    pub to_where: String,
    pub date_to_go: String,
    pub cper_weight: u32,
    pub cper_amount: u32,
    pub votes: Option<i64>,
    pub ptype: PType,
    pub data: T,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct PostD<T> {
    pub id: Thing,
    pub ptdate: u64,
    pub r#in: Thing,
    pub out: Thing,
    pub from_where: String,
    pub to_where: String,
    pub date_to_go: String,
    pub cper_amount: u32,
    pub cper_weight: u32,
    pub ptype: PType,
    pub votes: Option<i64>,
    pub data: T,
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
