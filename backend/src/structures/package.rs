use actix_multipart::form::{json::Json, tempfile::TempFile, text::Text, MultipartForm};

use super::wsstruct::SLoc;

#[derive(MultipartForm)]
pub struct PackageForm {
    pub package_name: Text<String>,
    #[multipart(limit = "1 MiB")]
    pub package_pic: TempFile,
    pub pkg_details: Text<String>,
    pub cper_weight: Text<u32>,
    pub cper_amount: Text<u32>,
    pub to_where: Json<SLoc>,
    pub from_where: Json<SLoc>,
    pub date_to_go: Text<String>,
}
