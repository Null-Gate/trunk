use serde::{Serialize, Deserialize};
use surrealdb::sql::Thing;

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
    pub vote: Vote,
}
