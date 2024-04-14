use actix_web::{
    post,
    web::{Json, Path},
    HttpResponse,
};
use chrono::{TimeDelta, Utc};
use surrealdb::sql::{Id, Thing};

use crate::{
    extra::{check_user, decode_token, encode_token, verify_password},
    structures::{CarPostForm, Claims, DbCarPost, DbUserInfo, Resp, Roles, DB},
};

#[allow(clippy::future_not_send)]
#[post("/post/car/{token}")]
async fn post_car(token: Path<String>, post: Json<CarPostForm>) -> HttpResponse {
    let db = DB.get().await;
    if db.use_ns("ns").use_db("db").await.is_err() {
        return HttpResponse::InternalServerError().json(Resp::new(
            "Sorry We are having some problem when opening our database!",
        ));
    }
    match decode_token(&token) {
        Ok(user_info) => match check_user(&user_info.username, db).await {
            Ok(mut user) => match verify_password(&user_info.password, &user.password) {
                Ok(()) => {
                    if (
                        &user.fullname,
                        &user.pik_role,
                        &user.car_posts,
                        &user.pkg_posts,
                        &user.own_cars,
                    ) != (
                        &user_info.fullname,
                        &user_info.pik_role,
                        &user_info.car_posts,
                        &user_info.pkg_posts,
                        &user_info.own_cars,
                    ) {
                        return HttpResponse::NotAcceptable()
                            .json(Resp::new("Some Infos Are Wrong!"));
                    }

                    if !(user.pik_role.contains(&Roles::Owner)
                        && user
                            .own_cars
                            .contains(&Thing::from(("car", Id::from(&post.car_id)))))
                    {
                        return HttpResponse::NotAcceptable().json("The Infos Are Wrong!");
                    }

                    let id = Id::rand();

                    match db
                        .create::<Option<DbCarPost>>(("car_post", id.clone()))
                        .content(post.to_db_post(&user.username))
                        .await
                    {
                        Ok(Some(_)) => {
                            user.car_posts.push(Thing::from(("car_post", id)));
                            let sql = "UPDATE type::thing($thing) SET is_available = true;";
                            db.query(sql)
                                .bind((
                                    "thing",
                                    Thing {
                                        id: Id::from(&post.car_id),
                                        tb: "car".into(),
                                    },
                                ))
                                .await
                                .unwrap();
                            match db
                                .update::<Option<DbUserInfo>>(("user", Id::from(&user.username)))
                                .content(user)
                                .await
                            {
                                Ok(Some(user)) => {
                                    let user_info = DbUserInfo {
                                        username: user_info.username,
                                        password: user_info.password,
                                        fullname: user_info.fullname,
                                        pik_role: user.pik_role,
                                        car_posts: user.car_posts,
                                        own_cars: user.own_cars,
                                        pkg_posts: user.pkg_posts,
                                    };
                                    let exp = usize::try_from(
                                        (Utc::now() + TimeDelta::try_days(9_999_999).unwrap())
                                            .timestamp(),
                                    )
                                    .unwrap();
                                    let claims = Claims { user_info, exp };

                                    encode_token(&claims).map_or_else(
                                        |e| e,
                                        |token| HttpResponse::Ok().json(Resp::new(&token)),
                                    )
                                }
                                _ => HttpResponse::InternalServerError().json(Resp::new(
                                    "Sorry Something Went Wrong While Updating Infos!",
                                )),
                            }
                        }
                        _ => HttpResponse::InternalServerError().json(Resp::new(
                            "Sorry Something Went Wrong While Uploading Your Car Post!",
                        )),
                    }
                }
                Err(e) => e,
            },
            Err(e) => e,
        },
        Err(e) => e,
    }
}
