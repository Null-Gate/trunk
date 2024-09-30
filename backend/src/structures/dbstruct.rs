use serde::{Deserialize, Serialize};
use surrealdb::RecordId;

use super::{
    car::{CargoD, DbCarInfo},
    post::PostD,
};

#[derive(Serialize, Deserialize, Clone, Copy, PartialEq, Eq, Debug)]
pub enum Roles {
    Owner,
    Driver,
}

#[derive(Serialize, Deserialize, Clone, Copy, PartialEq, Eq, Debug)]
pub enum PState {
    Accept,
    Deny,
    Pending,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct PenCar {
    pub pstat: PState,
    pub data: DbCarInfo,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct PenDReg {
    pub pstat: PState,
    pub data: DbDriverInfo,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct DbDriverInfo {
    pub license_num: String,
    pub license_pic: String,
    pub exp_details: String,
    pub userinfo: RecordId,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct PenCarD {
    pub id: RecordId,
    pub pstat: PState,
    pub data: DbCarInfo,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct DbPackageInfo {
    pub package_name: String,
    pub package_pic: String,
    pub pkg_details: String,
}

#[derive(Serialize, Deserialize, Clone, PartialEq, Eq, Debug, Default)]
pub struct DbUserInfo {
    pub username: String,
    pub fullname: String,
    pub password: String,
    pub pik_role: Vec<Roles>,
}

#[derive(Serialize, Deserialize)]
pub struct PkgPsts {
    pub owner: RecordId,
    pub pkg_data: PostD<DbPackageInfo>,
    pub bcargo: CargoD,
}

#[derive(Serialize, Deserialize)]
pub struct CargoS {
    pub dcargo: Vec<CargoD>,
    pub ocargo: Vec<CargoD>,
    pub pcargo: Vec<CargoD>,
}
