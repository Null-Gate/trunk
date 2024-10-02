use actix_web::{
    post,
    web::{Json, Path},
    HttpResponse,
};
use surrealdb::{opt::PatchOp, RecordId};
use uuid::Uuid;

use crate::{
    extra::functions::{ct_user, internal_error},
    structures::{
        bookstruct::{BType, BookTB, Booking},
        car::DbCarInfo,
        dbstruct::DbPackageInfo,
        extrastruct::DB,
        post::{Post, PostD},
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
                .select::<Option<PostD<DbCarInfo>>>(RecordId::from_table_key(
                    "tb_car_post",
                    &info.carp_id,
                ))
                .await
                .unwrap()
                .unwrap();
            let db_pkg_info: PostD<DbPackageInfo> = db
                .select::<Option<PostD<DbPackageInfo>>>(RecordId::from_table_key(
                    "tb_post",
                    &info.pkgp_id,
                ))
                .await
                .unwrap()
                .unwrap();
            let (ntdata, trb) = if info.btype == BType::Pkg {
                (BookTB {
                    r#in: RecordId::from_table_key("tb_car_post", &info.carp_id),
                    in_info: serde_json::to_value(&db_car_info).unwrap(),
                    out: RecordId::from_table_key("tb_post", &info.pkgp_id),
                    out_info: serde_json::to_value(&db_pkg_info).unwrap(),
                    btype: BType::Pkg,
                    utn: db_pkg_info.r#in,
                    utr: db_car_info.r#in,
                }, false)
            } else {
                (BookTB {
                    r#in: RecordId::from_table_key("tb_post", &info.pkgp_id),
                    in_info: serde_json::to_value(&db_pkg_info).unwrap(),
                    out: RecordId::from_table_key("tb_car_post", &info.carp_id),
                    out_info: serde_json::to_value(&db_car_info).unwrap(),
                    btype: BType::Car,
                    utn: db_car_info.r#in,
                    utr: db_pkg_info.r#in,
                }, true)
            };

            let content = Noti {
                data: ntdata,
                ntyp: NType::Booking,
            };

            match db
                .create::<Option<Noti<BookTB>>>(RecordId::from_table_key(
                    content.data.utn.key().to_string(),
                    Uuid::new_v4().as_simple().to_string(),
                ))
                .content(content)
                .await
            {
                Ok(Some(_)) => {
                    if trb {
                        db.update::<Option<Post<DbPackageInfo>>>(RecordId::from_table_key("tb_post", &info.pkgp_id)).patch(PatchOp::replace("/ava", false)).await.unwrap().unwrap();
                    }
                    HttpResponse::Ok().await.unwrap()
                },
                Ok(None) => internal_error("Something is wrong in booking!!"),
                Err(e) => internal_error(e),
            }
        }
        Err(e) => e,
    }
}
