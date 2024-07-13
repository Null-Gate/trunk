use actix_web::{put, web::Path, HttpResponse};
use surrealdb::sql::Id;

use crate::structures::{DbCarInfo, NType, Noti, PState, PenCar, DB};

#[put("/deny/carf/{id}")]
pub async fn dny_cf(path: Path<String>) -> HttpResponse {
    let db = DB.get().await;
    let id = path.into_inner();

    if let Some(dbi) = db
        .delete::<Option<DbCarInfo>>(("pend_car", Id::String(id.clone())))
        .await
        .unwrap()
    {
        let pcont = PenCar {
            pstat: PState::Deny,
            data: dbi.clone(),
        };

        let nt = Noti {
            data: pcont,
            ntyp: NType::CarFormApt,
        };

        db.update::<Option<Noti<PenCar>>>((dbi.userinfo.id.to_raw(), Id::String(id)))
            .content(nt)
            .await
            .unwrap()
            .unwrap();
        HttpResponse::Ok().await.unwrap()
    } else {
        HttpResponse::InternalServerError().await.unwrap()
    }
}
