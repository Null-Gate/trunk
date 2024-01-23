use std::path::Path;

use async_once::AsyncOnce;
use directories::BaseDirs;
use lazy_static::lazy_static;
use rand::{rngs::ThreadRng, distributions::{DistString, Distribution}, Rng};
use serde::{Deserialize, Serialize};
use surrealdb::{Surreal, engine::local::{File, Db}};
use tokio::fs;

lazy_static! {
    pub static ref DB: AsyncOnce<Surreal<Db>> = AsyncOnce::new(async {
        Surreal::new::<File>(format!("{}/db.db", get_cache_dir().await))
            .await
            .unwrap()
    });
}

#[derive(Serialize, Deserialize, Clone, Copy)]
pub enum Roles {
    Driver,
    User,
}

#[derive(Serialize, Deserialize)]
pub struct Claims {
    pub username: String,
    pub password: String,
    pub exp: usize
}

#[derive(Serialize, Deserialize)]
pub struct Signup {
    pub username: String,
    pub fullname: String,
    pub password: String,
}

#[derive(Serialize, Deserialize)]
pub struct DbUserInfo{
    pub username: String,
    pub fullname: String,
    pub password: String,
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
    pub fn new(msg: &'a str) -> Self {
        Resp { msg }
    }
}

#[derive(Serialize, Deserialize)]
pub struct UserInfo {
    pub username: String,
    pub fullname: String,
    pub password: String,
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
            &mut self.rngs.to_owned(),
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
        fs::create_dir(&dir).await.unwrap()
    }
    dir
}
