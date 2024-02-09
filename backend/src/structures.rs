use std::path::Path;

use actix_multipart::form::{tempfile::TempFile, text::Text, MultipartForm};
use actix_web::HttpResponse;
use argon2::{Config, Variant, Version};
use async_once::AsyncOnce;
use directories::BaseDirs;
use lazy_static::lazy_static;
use rand::{
    distributions::{DistString, Distribution},
    rngs::ThreadRng,
    Rng,
};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use surrealdb::{
    engine::local::{Db, File}, sql::{Id, Thing}, Surreal
};
use tokio::fs;

lazy_static! {
    pub static ref DB: AsyncOnce<Surreal<Db>> = AsyncOnce::new(async {
        Surreal::new::<File>(format!("{}/db.db", get_cache_dir().await))
            .await
            .unwrap()
    });
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

#[derive(Serialize, Deserialize, Clone, Copy, PartialEq, Eq)]
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

#[derive(Serialize, Deserialize)]
pub struct DbUserInfo {
    pub username: String,
    pub fullname: String,
    pub password: String,
    pub pik_role: Vec<Roles>,
    pub own_cars: Vec<Thing>,
    pub pkg_posts: Vec<Thing>,
    pub car_posts: Vec<Thing> 
}

#[derive(Serialize, Deserialize, Debug)]
pub struct DbDriverInfo {
    pub license_num: String,
    pub license_pic: String,
    pub exp_details: String,
    pub userinfo: Thing
}

#[derive(MultipartForm)]
pub struct DriverForm {
    pub license_num: Text<String>,
    pub license_pic: TempFile,
    pub exp_details: Text<String>,
}

#[derive(Serialize, Deserialize)]
pub struct DbCarInfo {
    pub license_num: String,
    pub owner_proof: String,
    pub car_details: String,
    pub userinfo: Thing
}

#[derive(MultipartForm)]
pub struct CarForm {
    pub license_num: Text<String>,
    pub owner_proof: TempFile,
    pub car_details: Text<String>,
}

#[derive(Serialize, Deserialize)]
pub struct DbCarPost {
    pub userinfo: Thing,
    pub car_info: Thing,
    pub from_where: String,
    pub to_where: String,
    pub date_to_go: String
}

#[derive(Serialize, Deserialize)]
pub struct CarPostForm {
    pub car_id: String,
    pub from_where: String,
    pub to_where: String,
    pub date_to_go: String
}

impl CarPostForm {
    pub fn to_db_post(&self, userinfo: &str) -> DbCarPost {
        DbCarPost { userinfo: Thing::from(("user", Id::String(userinfo.into()))), car_info: Thing::from(("user", Id::String(self.car_id.to_string()))), to_where: self.to_where.to_string(), from_where: self.from_where.to_string(), date_to_go: self.date_to_go.to_string() }
    }
}

#[derive(MultipartForm)]
pub struct PackageForm {
    pub package_name: Text<String>,
    pub package_pic: TempFile,
    pub pkg_details: Text<String>,
    pub to_where: Text<String>,
    pub from_where: Text<String>,
    pub exp_date_to_send: Text<String>
}

#[derive(Serialize, Deserialize)]
pub struct DbPackageInfo {
    pub package_name: String,
    pub package_pic: String,
    pub pkg_details: String,
    pub to_where: String,
    pub from_where: String,
    pub exp_date_to_send: String,
    pub userinfo: Thing
}

#[derive(Serialize, Deserialize)]
pub struct Login {
    pub username: String,
    pub password: String,
}

#[derive(Serialize, Deserialize)]
pub struct Resp<'a> {
    msg: &'a str,
}

impl<'a> Resp<'a> {
    pub const fn new(msg: &'a str) -> Self {
        Resp { msg }
    }
}

#[derive(Clone)]
pub struct GenString {
    rngs: ThreadRng,
}

impl GenString {
    pub fn new() -> Self {
        Self {
            rngs: rand::thread_rng(),
        }
    }

    pub fn gen_string(&mut self, min: usize, max: usize) -> String {
        self.sample_string(
            &mut self.rngs.clone(),
            self.to_owned().rngs.gen_range(min..max),
        )
    }
}

impl DistString for GenString {
    fn append_string<R: Rng + ?Sized>(&self, rng: &mut R, string: &mut String, len: usize) {
        unsafe {
            let v = string.as_mut_vec();
            v.extend(self.sample_iter(rng).take(len));
        }
    }
}

pub async fn get_cache_dir() -> String {
    let dir = format!(
        "{}/Trunk",
        BaseDirs::new().unwrap().cache_dir().to_string_lossy()
    );
    if !Path::new(&dir).exists() {
        fs::create_dir(&dir).await.unwrap();
    }
    dir
}

pub trait DbtoResp {
    fn to_resp(&self) -> Value;
    fn to_hresp(&self) -> HttpResponse {
        HttpResponse::Ok().json(self.to_resp())
    }
}

impl DbtoResp for DbDriverInfo {
    fn to_resp(&self) -> Value {
        json! ({
            "username": self.userinfo.id,
            "license_num": self.license_num,
            "license_pic": format!("http://localhost:8090/pics/{}", self.license_pic),
            "exp_details": self.exp_details
        })
    }
}

impl DbtoResp for DbCarInfo {
    fn to_resp(&self) -> Value {
        json!({
            "username": self.userinfo.id,
            "license_num": self.license_num,
            "owner_proof": format!("http://localhost:8090/pics/{}", self.owner_proof),
            "car_details": self.car_details,
        })
    }
}

impl DbtoResp for DbPackageInfo {
    fn to_resp(&self) -> Value {
        json!({
            "username": self.userinfo.id,
            "package_name": self.package_name,
            "package_pic": format!("http://localhost:8090/pics/{}", self.package_pic),
            "pkg_details": self.pkg_details,
            "to_where": self.to_where,
            "from_where": self.from_where,
            "exp_date_to_send": self.exp_date_to_send,
        })
    }
}

impl DbtoResp for DbCarPost {
    fn to_resp(&self) -> Value {
        json!({
            "username": self.userinfo.id,
            "car_info": self.car_info.id,
            "from_where": self.from_where,
            "to_where": self.to_where,
            "date_to_go": self.date_to_go
        })
    }
}
