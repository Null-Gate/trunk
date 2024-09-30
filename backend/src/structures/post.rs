use serde::{Deserialize, Serialize};
use surrealdb::RecordId;

use super::wsstruct::SLoc;

#[derive(Serialize, Deserialize, PartialEq, Eq, Debug, Clone)]
pub enum PType {
    Car,
    Pkg,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Post<T> {
    pub ptdate: u64,
    pub r#in: RecordId,
    pub out: RecordId,
    pub from_where: SLoc,
    pub to_where: SLoc,
    pub date_to_go: String,
    pub cper_weight: u32,
    pub cper_amount: u32,
    pub votes: Option<i64>,
    pub ptype: PType,
    pub data: T,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct PostD<T> {
    pub id: RecordId,
    pub ptdate: u64,
    pub r#in: RecordId,
    pub out: RecordId,
    pub from_where: SLoc,
    pub to_where: SLoc,
    pub date_to_go: String,
    pub cper_amount: u32,
    pub cper_weight: u32,
    pub ptype: PType,
    pub votes: Option<i64>,
    pub data: T,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct OwnTB {
    pub r#in: RecordId,
    pub out: RecordId,
}
