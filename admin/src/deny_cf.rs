use actix_web::{put, web::Path, HttpResponse};
use surrealdb::sql::Id;

use crate::structures::{NType, Noti, PState, PenCarD, DB};

#[put("/deny/carf/{id}")]
pub async fn dny_cf(path: Path<String>) -> HttpResponse {
    let db = DB.get().await;
    let id = path.into_inner();

    if let Some(mut dbi) = db
        .delete::<Option<PenCarD>>(("tb_pend_car", Id::String(id.clone())))
        .await
        .unwrap()
    {
        dbi.pstat = PState::Deny;

        let nt = Noti {
            data: dbi.clone(),
            ntyp: NType::CarFormApt,
        };

        db.update::<Option<Noti<PenCarD>>>((dbi.data.userinfo.id.to_raw(), Id::String(id)))
            .content(nt)
            .await
            .unwrap()
            .unwrap();
        HttpResponse::Ok().await.unwrap()
    } else {
        HttpResponse::InternalServerError().await.unwrap()
    }
}
