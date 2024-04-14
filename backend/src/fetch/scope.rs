use super::{
    ava_cars::fetch_ava_cars, car::fetch_car, driver::fetch_driver, nf::get_nf,
    package::fetch_package, user::fetch_user,
};
use actix_web::Scope;

pub fn fetch() -> Scope {
    Scope::new("/fetch")
        .service(fetch_driver)
        .service(fetch_package)
        .service(fetch_user)
        .service(fetch_car)
        .service(fetch_ava_cars)
        .service(get_nf)
}
