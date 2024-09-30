use actix_web::{get, web::Path, HttpResponse};
use serde_json::Value;
use surrealdb::RecordId;
use uuid::Uuid;

use crate::{
    extra::functions::{check_user, decode_token, internal_error, verify_password},
    structures::{
        extrastruct::DB,
        post::{Post, PostD},
        votestruct::{VRelate, Vote, VoteTB},
    },
};

#[allow(clippy::pedantic)]
#[allow(clippy::future_not_send)]
#[get("/vote/{v_type}/{p_id}/{token}")]
pub async fn up_vote(paths: Path<(String, String, String)>) -> HttpResponse {
    let db = DB.get().await;
    if let Err(e) = db.use_ns("ns").use_db("db").await {
        return internal_error(e);
    }

    match decode_token(&paths.2) {
        Ok(user_info) => match check_user(&user_info.username).await {
            Ok(user) => match verify_password(&user_info.password, &user.password) {
                Ok(()) => {
                    let cuery = "SELECT * FROM tb_vote WHERE (in = type::thing($uthing) AND out = type::thing($pthing));";
                    let iuery = "SELECT * FROM type::thing($pthing);";
                    let mut idk = db
                        .query(cuery)
                        .query(iuery)
                        .bind((
                            "uthing",
                            RecordId::from_table_key("tb_user", &user_info.username),
                        ))
                        .bind(("pthing", RecordId::from_table_key("tb_post", &paths.1)))
                        .await
                        .unwrap();

                    let sel: Option<VRelate> = idk.take(0).unwrap();
                    let iid: Option<PostD<Value>> = idk.take(1).unwrap();

                    if let (Some(mut voted), Some(mut post)) = (sel, iid.clone()) {
                        if voted.vote == Vote::Up {
                            post.votes = Some(post.votes.unwrap_or(0) - 1);

                            if &paths.0 == "up" {
                                if let Err(e) = db.delete::<Option<VRelate>>(voted.id).await {
                                    return internal_error(e);
                                }
                            } else if &paths.0 == "down" {
                                post.votes = Some(post.votes.unwrap_or(0) - 1);
                                voted.vote = Vote::Down;
                                if let Err(e) = db
                                    .update::<Option<VRelate>>(voted.id.clone())
                                    .content(voted)
                                    .await
                                {
                                    return internal_error(e);
                                }
                            }

                            match db
                                .update::<Option<Post<Value>>>(RecordId::from_table_key(
                                    "tb_post", &paths.1,
                                ))
                                .content(post)
                                .await
                            {
                                Ok(Some(mut i)) => return HttpResponse::Ok().json(i.to_resp()),
                                Ok(None) => return internal_error("none update vote post error!"),
                                Err(e) => return internal_error(e),
                            };
                        } else if voted.vote == Vote::Down {
                            post.votes = Some(post.votes.unwrap_or(0) + 1);

                            if &paths.0 == "up" {
                                voted.vote = Vote::Up;
                                post.votes = Some(post.votes.unwrap_or(0) + 1);
                                if let Err(e) = db
                                    .update::<Option<VRelate>>(voted.id.clone())
                                    .content(voted)
                                    .await
                                {
                                    return internal_error(e);
                                }
                            } else if &paths.0 == "down" {
                                if let Err(e) = db.delete::<Option<VRelate>>(voted.id).await {
                                    return internal_error(e);
                                }
                            }

                            match db
                                .update::<Option<Post<Value>>>(RecordId::from_table_key(
                                    "tb_post", &paths.1,
                                ))
                                .content(post)
                                .await
                            {
                                Ok(Some(mut i)) => return HttpResponse::Ok().json(i.to_resp()),
                                Ok(None) => return internal_error("none update vote post error!"),
                                Err(e) => return internal_error(e),
                            };
                        }
                    };

                    let vote = if &paths.0 == "up" {
                        Vote::Up
                    } else if &paths.0 == "down" {
                        Vote::Down
                    } else {
                        return HttpResponse::BadRequest().await.unwrap();
                    };

                    let tdata = VoteTB {
                        r#in: RecordId::from_table_key("tb_user", &user_info.username),
                        out: RecordId::from_table_key("tb_post", &paths.1),
                        vote,
                    };

                    let cel = match db
                        .create::<Option<VRelate>>(RecordId::from_table_key(
                            "tb_vote",
                            Uuid::new_v4().simple().to_string(),
                        ))
                        .content(tdata)
                        .await
                    {
                        Ok(cel) => cel,
                        Err(e) => return internal_error(e),
                    };

                    if let (Some(_), Some(mut post)) = (cel, iid) {
                        if &paths.0 == "up" {
                            post.votes = Some(post.votes.unwrap_or(0) + 1);
                        } else if &paths.0 == "down" {
                            post.votes = Some(post.votes.unwrap_or(0) - 1);
                        } else {
                            return HttpResponse::BadRequest().await.unwrap();
                        }

                        match db
                            .update::<Option<Post<Value>>>(RecordId::from_table_key(
                                "tb_post", &paths.1,
                            ))
                            .content(post)
                            .await
                        {
                            Ok(Some(mut i)) => return HttpResponse::Ok().json(i.to_resp()),
                            Ok(None) => return internal_error("None Update Vote Post Error!"),
                            Err(e) => return internal_error(e),
                        };
                    }
                    HttpResponse::ServiceUnavailable().await.unwrap()
                }
                Err(e) => e,
            },
            Err(e) => e,
        },
        Err(e) => e,
    }
}
