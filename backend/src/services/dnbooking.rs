use actix_web::{post, web::Path, HttpResponse};
use surrealdb::{opt::PatchOp, RecordId};
use uuid::Uuid;

use crate::{
    extra::functions::{ct_user, internal_error},
    structures::{
        bookstruct::{BStat, BType, BookStat, BookTB}, dbstruct::DbPackageInfo, extrastruct::DB, wsstruct::{NType, Noti}
    },
};

#[allow(clippy::future_not_send)]
#[post("/book/deny/{id}/{token}")]
pub async fn dnbooking(parts: Path<(String, String)>) -> HttpResponse {
    let parts = parts.into_inner();
    let db = DB.get().await;
    if let Err(e) = db.use_ns("ns").use_db("db").await {
        return internal_error(e);
    }

    match ct_user(&parts.1).await {
        Ok((_, cuser)) => {
            match db
                .select::<Option<Noti<BookTB>>>(RecordId::from_table_key(&cuser.username, &parts.0))
                .await
            {
                Ok(Some(_)) => {
                    match db
                        .delete::<Option<Noti<BookTB>>>(RecordId::from_table_key(
                            &cuser.username,
                            &parts.0,
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
                            db.create::<Option<Noti<BookStat>>>(RecordId::from_table_key(
                                smt.data.utr.key().to_string(),
                                Uuid::new_v4().simple().to_string(),
                            ))
                            .content(nt)
                            .await
                            .unwrap()
                            .unwrap();
                            if smt.data.btype == BType::Car {
                                db.update::<Option<DbPackageInfo>>(RecordId::from_table_key("tb_post", smt.data.r#in.key().to_string())).patch(PatchOp::replace("/ava", true)).await.unwrap().unwrap();
                            }
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
