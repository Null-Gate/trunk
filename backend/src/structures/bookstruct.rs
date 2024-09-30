use serde::{Deserialize, Serialize};
use serde_json::Value;
use surrealdb::RecordId;

use super::post::PostD;

#[derive(Serialize, Deserialize, PartialEq, Eq, Clone, Debug)]
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

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum BStat {
    Accept,
    Deny,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct BookTB {
    pub r#in: RecordId,
    pub in_info: Value,
    pub out: RecordId,
    pub out_info: Value,
    pub btype: BType,
    pub utn: RecordId,
    pub utr: RecordId,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct BookStat {
    pub bstat: BStat,
    pub bdata: BookTB,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct GBookTB<L, V> {
    pub r#in: RecordId,
    pub in_info: PostD<L>,
    pub out: RecordId,
    pub out_info: PostD<V>,
    pub utn: RecordId,
    pub utr: RecordId,
}
