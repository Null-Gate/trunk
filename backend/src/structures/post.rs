use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Post<T> {
    pub ptdate: u64,
    pub r#in: Thing,
    pub out: Thing,
    pub from_where: String,
    pub to_where: String,
    pub date_to_go: String,
    pub cper_weight: u32,
    pub cper_amount: u32,
    pub votes: Option<i64>,
    pub ptype: PType,
    pub data: T,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct PostD<T> {
    pub id: Thing,
    pub ptdate: u64,
    pub r#in: Thing,
    pub out: Thing,
    pub from_where: String,
    pub to_where: String,
    pub date_to_go: String,
    pub cper_amount: u32,
    pub cper_weight: u32,
    pub ptype: PType,
    pub votes: Option<i64>,
    pub data: T,
}
