use surrealdb::sql::Thing;
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Clone, Copy, PartialEq, Eq, Debug)]
pub enum Roles {
    Owner,
    Driver,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct DbPackageInfo {
    pub package_name: String,
    pub package_pic: String,
    pub pkg_details: String,
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
