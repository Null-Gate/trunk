use std::collections::BTreeMap;

use actix_multipart::form::{tempfile::TempFile, text::Text, MultipartForm};
use serde::{Deserialize, Serialize};
use surrealdb::sql::{Id, Thing};

use super::{post::Post, wsstruct::SLoc};

#[derive(Serialize, Deserialize, Debug, Clone)]
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
    pub from_where: SLoc,
    pub to_where: SLoc,
    pub cper_weight: u32,
    pub cper_amount: u32,
    pub date_to_go: String,
}

#[derive(Serialize, Deserialize, Clone)]
pub enum PaSta {
    Pend,
    OnGo,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct Cargo {
    pub driver: Thing,
    pub owner: Thing,
    pub car: Thing,
    pub pdata: Post<DbCarInfo>,
    pub casta: PaSta,
    pub stloc: SLoc,
    pub fnloc: SLoc,
    pub ctloc: SLoc,
    pub tlocs: BTreeMap<i64, SLoc>,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct CargoD {
    pub id: Thing,
    pub driver: Thing,
    pub owner: Thing,
    pub car: Thing,
    pub pdata: Post<DbCarInfo>,
    pub casta: PaSta,
    pub stloc: SLoc,
    pub fnloc: SLoc,
    pub ctloc: SLoc,
    pub tlocs: BTreeMap<i64, SLoc>,
}

#[derive(Serialize, Deserialize)]
pub struct AcData {
    pub driver: Thing,
    pub owner: Thing,
    pub cargo: Thing,
}
