use super::{driver::fetch_driver, package::fetch_package};
use actix_web::Scope;

pub fn fetch() -> Scope {
    Scope::new("/fetch")
        .service(fetch_driver)
        .service(fetch_package)
}
