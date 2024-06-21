use actix_web::{post, web::Path, HttpResponse};
use surrealdb::sql::Id;

use crate::extra::{
    functions::{ct_user, internal_error},
    structures::{BStat, BookStat, BookTB, NType, Noti, DB},
};

#[allow(clippy::future_not_send)]
#[post("/book/deny/{id}/{token}")]
async fn dnbooking(parts: Path<(String, String)>) -> HttpResponse {
    let parts = parts.into_inner();
    let db = DB.get().await;
    if let Err(e) = db.use_ns("ns").use_db("db").await {
        return internal_error(e);
    }

    match ct_user(&parts.1, db).await {
        Ok((_, cuser)) => {
            match db
                .select::<Option<Noti<BookTB>>>((
                    cuser.username.to_string(),
                    Id::String(parts.0.clone()),
                ))
                .await
            {
                Ok(Some(_)) => {
                    match db
                        .delete::<Option<Noti<BookTB>>>((
                            cuser.username.to_string(),
                            Id::String(parts.0),
                        ))
                        .await
                    {
                        Ok(Some(smt)) => {
                            let stat = BookStat {
                                bstat: BStat::Deny,
                                bdata: smt.clone().data,
                            };
                            let nt = Noti {
                                ntyp: NType::Bdn,
                                data: stat,
                            };
                            db.create::<Option<Noti<BookStat>>>((
                                smt.data.utr.id.to_raw(),
                                Id::rand(),
                            ))
                            .content(nt)
                            .await
                            .unwrap()
                            .unwrap();
                            HttpResponse::Ok().await.unwrap()
                        }
                        Ok(None) => HttpResponse::NotFound().await.unwrap(),
                        Err(e) => internal_error(e),
                    }
                }
                Ok(None) => HttpResponse::NotFound().await.unwrap(),
                Err(e) => internal_error(e),
            }
        }
        Err(e) => e,
    }
}
