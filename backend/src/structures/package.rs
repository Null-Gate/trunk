use actix_multipart::form::{text::Text, MultipartForm};

#[derive(MultipartForm)]
pub struct PackageForm {
    pub package_name: Text<String>,
    #[multipart(limit = "1 MiB")]
    pub package_pic: TempFile,
    pub pkg_details: Text<String>,
    pub cper_weight: Text<u32>,
    pub cper_amount: Text<u32>,
    pub to_where: Text<String>,
    pub from_where: Text<String>,
    pub date_to_go: Text<String>,
}
