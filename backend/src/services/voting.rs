use actix_web::{post, web::Path, HttpResponse};
use serde_json::Value;
use surrealdb::sql::{Id, Thing};

use crate::{extra::{check_user, decode_token, internal_error, verify_password}, structures::{Post, VRelate, Vote, DB}};

#[allow(clippy::future_not_send)]
#[post("/up/{p_id}/{token}")]
pub async fn up_vote(paths: Path<(String, String)>) -> HttpResponse {
    let db = DB.get().await;
    if let Err(e) = db.use_ns("ns").use_db("db").await {
        return internal_error(e);
    }

    match decode_token(&paths.1) {
        Ok(user_info) => {
            match check_user(user_info.username.clone(), db).await {
                Ok(user) => {
                    match verify_password(&user_info.password, &user.password) {
                        Ok(()) => {
                            let cuery = "SELECT * FROM vote WHERE (in = type::thing($uthing) AND out = type::thing($pthing));";
                            let iuery = "SELECT * FROM type::thing($pthing);";
                            let mut idk = db.query(cuery).query(iuery).bind(("uthing", Thing{
                                tb: "user".into(),
                                id: Id::from(user_info.username.to_string())
                            })).bind(("pthing", Thing {
                                tb: "user".into(),
                                id: Id::from(&paths.0)
                            })).await.unwrap();
                            
                            let sel: Option<VRelate> = idk.take(0).unwrap();
                            let iid: Option<Post<Value>> = idk.take(1).unwrap();

                            if let (Some(voted), Some(mut post)) = (sel, iid) {
                                if voted.vote == Vote::Up {
                                    post.votes -= 1;
                                    let duery = "DELETE type::thing($uthing)->vote WHERE out = type::thing($pthing);";
                                    db.query(duery).bind(("uthing", Thing{
                                        tb: "user".into(),
                                        id: Id::from(user_info.username.to_string())
                                    })).bind(("pthing", Thing {
                                        tb: "user".into(),
                                        id: Id::from(&paths.0)
                                    })).await.unwrap();

                                     match db.update::<Option<Value>>(("post", Id::from(&paths.0))).await {
                                         Ok(Some(_)) => todo!(),
                                         Ok(None) => internal_error("None Update Vote Post Error!"),
                                         Err(e) => internal_error(e)
                                     };
                                     todo!()
                                }
                                todo!()
                            };

                            //let _query = "RELATE type::thing($uthing)->vote->type::thing($pthing) SET vote = 'up';";
                            todo!()
                        },
                        Err(e) => e
                    }
                },
                Err(e) => e
            }
        },
        Err(e) => e
    }
}
