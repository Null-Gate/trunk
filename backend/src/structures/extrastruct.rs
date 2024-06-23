use actix_multipart::form::{tempfile::TempFile, text::Text, MultipartForm};
use argon2::{Config, Variant, Version};
use async_once::AsyncOnce;
use lazy_static::lazy_static;
use rand::rngs::ThreadRng;
use serde::{Deserialize, Serialize};
use surrealdb::{
    engine::local::{Db, Mem},
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

#[derive(Serialize, Deserialize, PartialEq, Eq, Default, Clone)]
pub enum AccMode {
    #[default]
    Admin,
    User,
}

#[derive(Serialize, Deserialize)]
pub struct Resp<'a> {
    pub msg: &'a str,
}

#[derive(Clone)]
pub struct GenString {
    pub rngs: ThreadRng,
}
