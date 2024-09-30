use serde::{Deserialize, Serialize};
use surrealdb::RecordId;

#[derive(Serialize, Deserialize, PartialEq, Eq, Debug)]
pub enum Vote {
    Up,
    Down,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct VRelate {
    pub id: RecordId,
    pub r#in: RecordId,
    pub out: RecordId,
    pub vote: Vote,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct VoteTB {
    pub r#in: RecordId,
    pub out: RecordId,
    pub vote: Vote,
}
