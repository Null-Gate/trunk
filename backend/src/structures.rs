use std::{path::Path, sync::Arc};

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
    engine::remote::ws::{Client, Ws},
    sql::{Id, Thing},
    Surreal,
};
use tokio::fs;

use crate::extra::internal_error;

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
    pub own_cars: Vec<Thing>,
    pub pkg_posts: Vec<Thing>,
    pub car_posts: Vec<Thing>,
}

impl Default for DbUserInfo {
    fn default() -> Self {
        Self {
            username: "".into(),
            fullname: "".into(),
            password: "".into(),
            pik_role: vec![],
            own_cars: vec![],
            car_posts: vec![],
            pkg_posts: vec![],
        }
    }
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

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct DbCarPost {
    pub car_info: Thing,
    pub from_where: Arc<str>,
    pub to_where: Arc<str>,
    pub date_to_go: Arc<str>,
}

#[derive(Serialize, Deserialize)]
pub struct CarPostForm {
    pub car_id: Arc<str>,
    pub from_where: Arc<str>,
    pub to_where: Arc<str>,
    pub date_to_go: Arc<str>,
}

impl CarPostForm {
    pub fn to_db_post(&self) -> DbCarPost {
        DbCarPost {
            car_info: Thing::from(("car", Id::String(self.car_id.to_string()))),
            to_where: self.to_where.clone(),
            from_where: self.from_where.clone(),
            date_to_go: self.date_to_go.clone(),
        }
    }
}

#[derive(MultipartForm)]
pub struct PackageForm {
    pub package_name: Text<Arc<str>>,
    #[multipart(limit = "1 MiB")]
    pub package_pic: TempFile,
    pub pkg_details: Text<Arc<str>>,
    pub to_where: Text<Arc<str>>,
    pub from_where: Text<Arc<str>>,
    pub exp_date_to_send: Text<Arc<str>>,
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
    pub to_where: Arc<str>,
    pub from_where: Arc<str>,
    pub exp_date_to_send: Arc<str>,
}

#[derive(Serialize, Deserialize)]
pub struct Login {
    pub username: Arc<str>,
    pub password: Arc<str>,
}

#[derive(Serialize, Deserialize)]
pub enum Event {
    Notification,
    NewFeed,
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
    pub vote: Vote
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

    pub fn gen_string(&self, min: usize, max: usize) -> String {
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

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Post<T> {
    pub ptdate: u64,
    pub data: T,
    pub votes: i64,
    pub userinfo: Thing,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct PostD<T> {
    pub id: Thing,
    pub ptdate: u64,
    pub data: T,
    pub votes: i64,
    pub userinfo: Thing,
}

/*impl Post<DbCarPost> {
    pub fn to_resp(&self) -> Value {
        json! ({
            "userinfo": self.userinfo.clone(),
            "ptdate": self.ptdate,
            "data": self.data.clone(),
            "votes": self.votes.to_string(),
        })
    }
}

impl Post<DbPackageInfo> {
    pub fn to_resp(&self) -> Value {
        json! ({
            "userinfo": self.userinfo.clone(),
            "ptdate": self.ptdate,
            "data": self.data.clone(),
            "votes": self.votes.to_string(),
        })
    }
}*/

impl Post<Value> {
    pub fn to_resp(&self) -> Value {
        json! ({
            "userinfo": self.userinfo.clone(),
            "ptdate": self.ptdate,
            "data": self.data.clone(),
            "votes": self.votes.to_string(),
        })
    }
}

impl PostD<Value> {
    pub fn to_resp(&self) -> Value {
        json! ({
            "id": self.id,
            "userinfo": self.userinfo.clone(),
            "ptdate": self.ptdate,
            "data": self.data.clone(),
            "votes": self.votes.to_string(),
        })
    }
}

impl PostD<DbCarPost> {
    pub async fn to_resp(&self) -> Value {
        json! ({
            "id": self.id,
            "userinfo": self.userinfo.clone(),
            "ptdate": self.ptdate,
            "data": self.data.to_resp().await.unwrap(),
            "votes": self.votes.to_string(),
        })
    }
}

impl DbPackageInfo {
    pub fn to_post(&self, username: &str) -> Post<Self> {
        Post {
            userinfo: Thing {
                tb: "user".into(),
                id: Id::from(username),
            },
            ptdate: 0,
            data: self.clone(),
            votes: 0,
        }
    }
}

impl DbCarPost {
    pub fn to_post(&self, username: &str) -> Post<Self> {
        Post {
            userinfo: Thing {
                tb: "user".into(),
                id: Id::from(username),
            },
            ptdate: 0,
            data: self.clone(),
            votes: 0,
        }
    }
    pub async fn to_resp(&self) -> Result<Value, HttpResponse> {
        let db = DB.get().await;
        if let Err(e) = db.use_ns("ns").use_db("db").await {
            return Err(internal_error(e));
        }

        let query = "SELECT * FROM type::thing($thing);";

        let mut fetch_car_info = db
            .query(query)
            .bind(("thing", &self.car_info))
            .await
            .unwrap();

        let car_info = fetch_car_info.take::<Option<DbCarInfo>>(0).unwrap();

        Ok(json!({
            "car_info": car_info.unwrap(),
            "from_where": self.from_where,
            "to_where": self.to_where,
            "date_to_go": self.date_to_go
        }))
    }
}
