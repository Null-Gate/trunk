use actix_web::{post, web::Path, HttpResponse};
use surrealdb::sql::{Id, Thing};

use crate::{extra::{check_user, decode_token, internal_error, verify_password}, structures::{VRelate, Vote, DB}};

#[allow(clippy::future_not_send)]
#[post("/up/{p_id}/{token}")]
pub async fn up_vote(paths: Path<(String, String)>) -> HttpResponse {
    let db = DB.get().await;
    if let Err(e) = db.use_ns("ns").use_db("db").await {
        return internal_error(e);
    }

    match decode_token(&paths.0) {
        Ok(user_info) => {
            match check_user(user_info.username.clone(), db).await {
                Ok(user) => {
                    match verify_password(&user_info.password, &user.password) {
                        Ok(()) => {
                            let cuery = "SELECT * FROM vote WHERE (in = type::thing($uthing) AND out = type::thing($pthing));";
                            let mut idk = db.query(cuery).bind(("uthing", Thing{
                                tb: "user".into(),
                                id: Id::from(user_info.username.to_string())
                            })).await.unwrap();
                            
                            let sel: Option<VRelate> = idk.take(0).unwrap();

                            if let Some(voted) = sel {
                                if voted.vote == Vote::Up {}
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
