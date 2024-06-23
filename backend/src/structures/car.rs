use serde::{Serialize, Deserialize};
use actix_multipart::form::{tempfile::TempFile, text::Text, MultipartForm};
use surrealdb::sql::{Id, Thing};

#[derive(Serialize, Deserialize, Debug)]
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
    pub from_where: String,
    pub cper_weight: u32,
    pub cper_amount: u32,
    pub to_where: String,
    pub date_to_go: String,
}
