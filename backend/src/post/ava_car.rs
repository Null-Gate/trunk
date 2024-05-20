use actix_web::{
    post,
    web::{Json, Path},
    HttpResponse,
};
use chrono::{TimeDelta, Utc};
use surrealdb::sql::{Id, Thing};

use crate::{
    extra::{check_user, decode_token, encode_token, internal_error, verify_password},
    structures::{CarPostForm, Claims, DbCarPost, DbUserInfo, Post, Resp, Roles, DB},
};

#[allow(clippy::future_not_send)]
#[post("/post/car/{token}")]
async fn post_car(token: Path<String>, post: Json<CarPostForm>) -> HttpResponse {
    let db = DB.get().await;
    if let Err(e) = db.use_ns("ns").use_db("db").await {
        return internal_error(e);
    }
    match decode_token(&token) {
        Ok(user_info) => match check_user(user_info.username.clone(), db).await {
            Ok(mut user) => match verify_password(&user_info.password, &user.password) {
                Ok(()) => {
                    if !(user.pik_role.contains(&Roles::Owner)
                        && user
                            .own_cars
                            .contains(&Thing::from(("car", Id::String(post.car_id.to_string())))))
                    {
                        return HttpResponse::NotAcceptable().json("The Infos Are Wrong!");
                    }

                    match db
                        .create::<Option<Post<DbCarPost>>>(("car_post", post.car_id.to_string()))
                        .content(post.to_db_post().to_post(&user.username))
                        .await
                    {
                        Ok(Some(_)) => {
                            user.car_posts.push(Thing::from((
                                "car_post",
                                Id::String(post.car_id.to_string()),
                            )));
                            let sql = "UPDATE type::thing($thing) SET is_available = true;";
                            db.query(sql)
                                .bind((
                                    "thing",
                                    Thing {
                                        id: Id::String(post.car_id.to_string()),
                                        tb: "car".into(),
                                    },
                                ))
                                .await
                                .unwrap();
                            
                            match db
                                .update::<Option<DbUserInfo>>((
                                    "user",
                                    Id::String(user.username.to_string()),
                                ))
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
                                Ok(None) => internal_error("None User Error"),
                                Err(e) => internal_error(e),
                            }
                        }
                        Ok(None) => internal_error("None Ava Car Error"),
                        Err(e) => internal_error(e),
                    }
                }
                Err(e) => e,
            },
            Err(e) => e,
        },
        Err(e) => e,
    }
}
