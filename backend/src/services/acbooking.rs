use actix_web::{post, web::Path, HttpResponse};
use surrealdb::{RecordId, Uuid};

use crate::{
    extra::functions::{ct_user, internal_error},
    structures::{
        bookstruct::{BStat, BType, BookStat, BookTB},
        car::CargoD,
        dbstruct::{DbPackageInfo, PkgPsts},
        extrastruct::DB,
        wsstruct::{NType, Noti},
    },
};

#[allow(clippy::future_not_send)]
#[post("/book/accept/{id}/{token}")]
async fn acbooking(parts: Path<(String, String)>) -> HttpResponse {
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
                                bstat: BStat::Accept,
                                bdata: smt.clone().data,
                            };
                            let nt = Noti {
                                ntyp: NType::Bac,
                                data: stat,
                            };
                            db.create::<Option<Noti<BookStat>>>(RecordId::from_table_key(
                                smt.data.utr.key().to_string(),
                                Uuid::new_v4().as_simple().to_string(),
                            ))
                            .content(nt)
                            .await
                            .unwrap()
                            .unwrap();
                            let (pid, uid, cdt, pdt) = if smt.data.btype == BType::Pkg {
                                (
                                    smt.data.out.key().to_string(),
                                    smt.data.utn,
                                    smt.data.r#in,
                                    smt.data.out_info,
                                )
                            } else {
                                (
                                    smt.data.r#in.key().to_string(),
                                    smt.data.utr,
                                    smt.data.out,
                                    smt.data.in_info,
                                )
                            };
                            let bcargo: CargoD = db
                                .select::<Option<CargoD>>(RecordId::from_table_key(
                                    "tb_cargo",
                                    cdt.key().to_string(),
                                ))
                                .await
                                .unwrap()
                                .unwrap();
                            let pkgpsts = PkgPsts {
                                owner: uid,
                                pkg_data: serde_json::from_value(pdt).unwrap(),
                                bcargo,
                            };
                            db.create::<Option<PkgPsts>>(RecordId::from_table_key("tb_bkpkg", &pid))
                                .content(pkgpsts)
                                .await
                                .unwrap()
                                .unwrap();
                            db.delete::<Option<DbPackageInfo>>(RecordId::from_table_key("tb_post", &pid)).await.unwrap().unwrap();
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
