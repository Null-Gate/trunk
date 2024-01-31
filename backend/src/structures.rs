use std::path::Path;

use actix_multipart::form::{tempfile::TempFile, text::Text, MultipartForm};
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
use surrealdb::{
    engine::local::{Db, File}, sql::Thing, Surreal
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
    pub up_posts: Vec<Thing>
}

#[derive(Serialize, Deserialize)]
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

#[derive(MultipartForm)]
pub struct PackageForm {
    pub package_name: Text<String>,
    pub package_pic: TempFile,
    pub pkg_details: Text<String>,
    pub location_to_send: Text<String>,
    pub location_of_package_rn: Text<String>,
    pub expect_date_of_delivery: Text<String>
}

#[derive(Serialize, Deserialize)]
pub struct DbPackageInfo {
    pub package_name: String,
    pub package_pic: String,
    pub pkg_details: String,
    pub location_to_send: String,
    pub location_of_package_rn: String,
    pub expect_date_of_delivery: String,
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
