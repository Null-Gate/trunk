use actix_web::{
    post,
    web::{Json, Path},
    HttpResponse,
};
use surrealdb::sql::{Id, Thing};

use crate::extra::{
    functions::{ct_user, internal_error},
    structures::{BType, Booking, OwnTB, DB},
};

#[allow(clippy::future_not_send)]
#[post("/book/{token}")]
async fn book(token: Path<String>, info: Json<Booking>) -> HttpResponse {
    let db = DB.get().await;
    if let Err(e) = db.use_ns("ns").use_db("db").await {
        return internal_error(e);
    }

    match ct_user(&token, db).await {
        Ok((_, _)) => {
            let (content, id) = if info.btype == BType::Pkg {
                (
                    OwnTB {
                        r#in: Thing {
                            id: Id::String(info.carp_id.to_string()),
                            tb: "post".into(),
                        },
                        out: Thing {
                            id: Id::String(info.pkgp_id.to_string()),
                            tb: "post".into(),
                        },
                    },
                    info.carp_id.clone(),
                )
            } else {
                (
                    OwnTB {
                        r#in: Thing {
                            id: Id::String(info.pkgp_id.to_string()),
                            tb: "post".into(),
                        },
                        out: Thing {
                            id: Id::String(info.carp_id.to_string()),
                            tb: "post".into(),
                        },
                    },
                    info.pkgp_id.clone(),
                )
            };
            match db
                .create::<Option<OwnTB>>(("book", Id::String(id.to_string())))
                .content(content)
                .await
            {
                Ok(Some(_)) => HttpResponse::Ok().await.unwrap(),
                Ok(None) => internal_error("Something is wrong in booking!!"),
                Err(e) => internal_error(e),
            }
        }
        Err(e) => e,
    }
}
