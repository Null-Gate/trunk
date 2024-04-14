use actix_web::{get, web::Path, HttpResponse};
use serde_json::{json, Value};
use surrealdb::sql::{Id, Thing};

use crate::structures::{DbCarInfo, DbCarPost, DbPackageInfo, DbUserInfo, DbtoResp, Resp, DB};

#[get("/user/{id}")]
async fn fetch_user(id: Path<String>) -> HttpResponse {
    let db = DB.get().await;
    if db.use_ns("ns").use_db("db").await.is_err() {
        return HttpResponse::InternalServerError().json(Resp::new(
            "Sorry We are having some problem when opening our database!",
        ));
    }

    match db
        .select::<Option<DbUserInfo>>(("user", Id::from(id.as_str())))
        .await
    {
        Ok(Some(user)) => {
            let own_carsql = "SELECT * FROM car WHERE userinfo=type::thing($thing);";
            let pkg_postsql = "SELECT * FROM package WHERE userinfo=type::thing($thing);";
            let car_postsql = "SELECT * FROM car_post WHERE userinfo=type::thing($thing);";
            let mut idk = db
                .query(own_carsql)
                .query(pkg_postsql)
                .query(car_postsql)
                .bind((
                    "thing",
                    Thing {
                        id: Id::from(id.as_str()),
                        tb: "user".into(),
                    },
                ))
                .await
                .unwrap();
            let owncar: Vec<DbCarInfo> = idk.take(0).unwrap();
            let pkgpost: Vec<DbPackageInfo> = idk.take(1).unwrap();
            let carpost: Vec<DbCarPost> = idk.take(2).unwrap();

            let owncars = owncar
                .iter()
                .map(DbCarInfo::to_resp)
                .collect::<Vec<Value>>();
            let packages = pkgpost
                .iter()
                .map(DbPackageInfo::to_resp)
                .collect::<Vec<Value>>();
            let mut resp_car_post = vec![];

            for x in &carpost {
                resp_car_post.push(x.to_resp().await.unwrap());
            }

            let ret_user = json!({
                "username": user.username,
                "fullname": user.fullname,
                "pik_role": user.pik_role,
                "own_cars": owncars,
                "packages": packages,
                "car_post": resp_car_post
            });
            HttpResponse::Ok().json(ret_user)
        }
        Ok(None) => HttpResponse::NotFound().json("User Not Found!"),
        Err(_) => HttpResponse::InternalServerError()
            .json("Sorry Something Went Wrong While Searching User!"),
    }
}
