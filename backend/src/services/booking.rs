use actix_web::{
    post,
    web::{Json, Path},
    HttpResponse,
};
use surrealdb::sql::{Id, Thing};

use crate::extra::{
    functions::{ct_user, internal_error},
    structures::{BType, BookTB, Booking, DbCarInfo, DbPackageInfo, PostD, DB},
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
            let db_car_info: PostD<DbCarInfo> = db
                .select::<Option<PostD<DbCarInfo>>>(("post", Id::String(info.carp_id.to_string())))
                .await
                .unwrap()
                .unwrap();
            let db_pkg_info: PostD<DbPackageInfo> = db
                .select::<Option<PostD<DbPackageInfo>>>((
                    "post",
                    Id::String(info.pkgp_id.to_string()),
                ))
                .await
                .unwrap()
                .unwrap();
            let content = if info.btype == BType::Pkg {
                BookTB {
                    r#in: Thing {
                        id: Id::String(info.carp_id.to_string()),
                        tb: "post".into(),
                    },
                    out: Thing {
                        id: Id::String(info.pkgp_id.to_string()),
                        tb: "post".into(),
                    },
                    utn: db_pkg_info.r#in,
                }
            } else {
                BookTB {
                    r#in: Thing {
                        id: Id::String(info.pkgp_id.to_string()),
                        tb: "post".into(),
                    },
                    out: Thing {
                        id: Id::String(info.carp_id.to_string()),
                        tb: "post".into(),
                    },
                    utn: db_car_info.r#in,
                }
            };
            match db
                .create::<Option<BookTB>>((content.utn.id.to_raw(), Id::rand()))
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
