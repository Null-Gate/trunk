use serde::{Deserialize, Serialize};
use serde_json::Value;
use surrealdb::sql::Thing;

use super::post::PostD;

#[derive(Serialize, Deserialize, PartialEq, Eq)]
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

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct BookTB {
    pub r#in: Thing,
    pub in_info: Value,
    pub out: Thing,
    pub out_info: Value,
    pub utn: Thing,
    pub utr: Thing,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct BookStat {
    pub bstat: BStat,
    pub bdata: BookTB,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct GBookTB<L, V> {
    pub r#in: Thing,
    pub in_info: PostD<L>,
    pub out: Thing,
    pub out_info: PostD<V>,
    pub utn: Thing,
    pub utr: Thing,
}
