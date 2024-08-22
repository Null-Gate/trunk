use actix_web::{
    post,
    web::{Json, Path},
    HttpResponse,
};
use surrealdb::sql::{Id, Thing};

use crate::{
    extra::functions::{ct_user, internal_error},
    structures::{
        bookstruct::{BType, BookTB, Booking},
        car::DbCarInfo,
        dbstruct::DbPackageInfo,
        extrastruct::DB,
        post::PostD,
        wsstruct::{NType, Noti},
    },
};

#[allow(clippy::future_not_send)]
#[post("/book/{token}")]
pub async fn book(token: Path<String>, info: Json<Booking>) -> HttpResponse {
    let db = DB.get().await;
    if let Err(e) = db.use_ns("ns").use_db("db").await {
        return internal_error(e);
    }

    match ct_user(&token).await {
        Ok((_, _)) => {
            let db_car_info: PostD<DbCarInfo> = db
                .select::<Option<PostD<DbCarInfo>>>((
                    "tb_car_post",
                    Id::String(info.carp_id.to_string()),
                ))
                .await
                .unwrap()
                .unwrap();
            let db_pkg_info: PostD<DbPackageInfo> = db
                .select::<Option<PostD<DbPackageInfo>>>((
                    "tb_post",
                    Id::String(info.pkgp_id.to_string()),
                ))
                .await
                .unwrap()
                .unwrap();
            let ntdata = if info.btype == BType::Pkg {
                BookTB {
                    r#in: Thing {
                        id: Id::String(info.carp_id.to_string()),
                        tb: "tb_car_post".into(),
                    },
                    in_info: serde_json::to_value(&db_car_info).unwrap(),
                    out: Thing {
                        id: Id::String(info.pkgp_id.to_string()),
                        tb: "tb_post".into(),
                    },
                    out_info: serde_json::to_value(&db_pkg_info).unwrap(),
                    btype: BType::Pkg,
                    utn: db_pkg_info.r#in,
                    utr: db_car_info.r#in,
                }
            } else {
                BookTB {
                    r#in: Thing {
                        id: Id::String(info.pkgp_id.to_string()),
                        tb: "tb_post".into(),
                    },
                    in_info: serde_json::to_value(&db_pkg_info).unwrap(),
                    out: Thing {
                        id: Id::String(info.carp_id.to_string()),
                        tb: "tb_car_post".into(),
                    },
                    out_info: serde_json::to_value(&db_car_info).unwrap(),
                    btype: BType::Car,
                    utn: db_car_info.r#in,
                    utr: db_pkg_info.r#in,
                }
            };

            let content = Noti {
                data: ntdata,
                ntyp: NType::Booking,
            };

            match db
                .create::<Option<Noti<BookTB>>>((format!("tb_{}", content.data.utn.id), Id::rand()))
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
