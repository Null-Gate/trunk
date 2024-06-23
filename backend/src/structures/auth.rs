use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
pub struct Login {
    pub username: String,
    pub password: String,
}

#[derive(Serialize, Deserialize)]
pub struct Signup {
    pub username: String,
    pub fullname: String,
    pub password: String,
}

#[derive(Serialize, Deserialize)]
pub struct Claims {
    pub user_info: DbUserInfo,
    pub exp: usize,
}
