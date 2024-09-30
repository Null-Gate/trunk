use actix_web::{get, web::Path, HttpResponse};
use serde_json::{json, Value};
use surrealdb::RecordId;

use crate::{
    extra::functions::internal_error,
    structures::{car::DbCarInfo, dbstruct::DbUserInfo, extrastruct::DB, post::PostD},
};

#[get("/user/{id}")]
async fn fetch_user(id: Path<String>) -> HttpResponse {
    let db = DB.get().await;
    if let Err(e) = db.use_ns("ns").use_db("db").await {
        return internal_error(e);
    }

    match db
        .select::<Option<DbUserInfo>>(RecordId::from_table_key("tb_user", id.as_str()))
        .await
    {
        Ok(Some(user)) => {
            let own_carsql = "SELECT * FROM tb_car WHERE userinfo=type::thing($thing);";
            let postsql = "SELECT * FROM tb_post WHERE in=type::thing($thing);";
            let mut idk = db
                .query(own_carsql)
                .query(postsql)
                .bind((
                    "thing",
                    RecordId::from_table_key("tb_user", id.into_inner()),
                ))
                .await
                .unwrap();
            let owncar: Vec<DbCarInfo> = idk.take(0).unwrap();
            let db_posts: Vec<PostD<Value>> = idk.take(1).unwrap();
            let posts = db_posts
                .into_iter()
                .map(|mut x| x.to_resp())
                .collect::<Vec<Value>>();

            let ret_user = json!({
                "username": user.username,
                "fullname": user.fullname,
                "pik_role": user.pik_role,
                "own_cars": owncar,
                "posts": posts,
            });
            HttpResponse::Ok().json(ret_user)
        }
        Ok(None) => HttpResponse::NotFound().json("User Not Found!"),
        Err(e) => internal_error(e),
    }
}
