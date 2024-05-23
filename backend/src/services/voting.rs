use actix_web::{get, web::Path, HttpResponse};
use serde_json::Value;
use surrealdb::sql::{Id, Thing};

use crate::{
    extra::{check_user, decode_token, internal_error, verify_password},
    structures::{Post, VRelate, Vote, VoteTB, DB},
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
        Ok(user_info) => {
            match check_user(user_info.username.clone(), db).await {
                Ok(user) => {
                    match verify_password(&user_info.password, &user.password) {
                        Ok(()) => {
                            let cuery = "SELECT * FROM vote WHERE (in = type::thing($uthing) AND out = type::thing($pthing));";
                            let iuery = "SELECT * FROM type::thing($pthing);";
                            let mut idk = db
                                .query(cuery)
                                .query(iuery)
                                .bind((
                                    "uthing",
                                    Thing {
                                        tb: "user".into(),
                                        id: Id::from(user_info.username.to_string()),
                                    },
                                ))
                                .bind((
                                    "pthing",
                                    Thing {
                                        tb: "package".into(),
                                        id: Id::from(&paths.1),
                                    },
                                ))
                                .await
                                .unwrap();

                            let sel: Option<VRelate> = idk.take(0).unwrap();
                            let iid: Option<Post<Value>> = idk.take(1).unwrap();

                            if let (Some(mut voted), Some(mut post)) = (sel, iid.clone()) {
                                if voted.vote == Vote::Up {
                                    post.votes -= 1;

                                    if &paths.0 == "up" {
                                        if let Err(e) = db.delete::<Option<VRelate>>(voted.id).await {
                                            return internal_error(e);
                                        }
                                    } else if &paths.0 == "down" {
                                        post.votes -= 1;
                                        voted.vote = Vote::Down;
                                        if let Err(e) = db.update::<Option<VRelate>>(voted.id.clone()).content(voted).await {
                                            return internal_error(e);
                                        }
                                    }

                                    match db
                                        .update::<Option<Post<Value>>>(("package", Id::from(&paths.1))).content(post)
                                        .await
                                    {
                                        Ok(Some(i)) => return HttpResponse::Ok().json(i.to_resp()),
                                        Ok(None) => return internal_error("none update vote post error!"),
                                        Err(e) => return internal_error(e),
                                    };
                                } else if voted.vote == Vote::Down {
                                    post.votes += 1;

                                    if &paths.0 == "up" {
                                        voted.vote = Vote::Up;
                                        post.votes += 1;
                                        if let Err(e) = db.update::<Option<VRelate>>(voted.id.clone()).content(voted).await {
                                            return internal_error(e);
                                        } 
                                    } else if &paths.0 == "down" {
                                        if let Err(e) = db.delete::<Option<VRelate>>(voted.id).await {
                                            return internal_error(e);
                                        }
                                    }
                                    
                                    match db
                                        .update::<Option<Post<Value>>>(("package", Id::from(&paths.1))).content(post)
                                        .await
                                    {
                                        Ok(Some(i)) => return HttpResponse::Ok().json(i.to_resp()),
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
                                r#in: Thing { tb: "user".into(), id: Id::String(user_info.username.to_string()) },
                                out: Thing { tb: "package".into(), id: Id::String(paths.1.to_string()) },
                                vote
                            };

                            let cel = match db.create::<Option<VRelate>>(("vote", Id::rand())).content(tdata).await {
                                Ok(cel) => cel,
                                Err(e) => return internal_error(e)
                            };

                            if let (Some(_), Some(mut post)) = (cel, iid) {
                                if &paths.0 == "up" {
                                    println!("{}", post.votes);
                                    post.votes += 1;
                                    println!("{}", post.votes);
                                } else if &paths.0 == "down" {
                                    println!("{}", post.votes);
                                    post.votes -= 1;
                                    println!("{}", post.votes);
                                } else {
                                    return HttpResponse::BadRequest().await.unwrap();
                                }

                                match db
                                    .update::<Option<Post<Value>>>(("package", Id::from(&paths.1))).content(post).await
                                    {
                                        Ok(Some(i)) => return HttpResponse::Ok().json(i.to_resp()),
                                        Ok(None) => return internal_error("None Update Vote Post Error!"),
                                        Err(e) => return internal_error(e),
                                    };
                            }
                            HttpResponse::ServiceUnavailable().await.unwrap()
                        }
                        Err(e) => e,
                    }
                }
                Err(e) => e,
            }
        }
        Err(e) => e,
    }
}
