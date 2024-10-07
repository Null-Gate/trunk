use actix_web::{put, web::Path, HttpResponse};
use surrealdb::RecordId;

use crate::structures::{NType, Noti, PState, PenCarD, DB};

#[put("/deny/carf/{id}")]
pub async fn dny_cf(path: Path<String>) -> HttpResponse {
    let db = DB.get().await;
    let id = path.into_inner();

    if let Some(mut dbi) = db
        .delete::<Option<PenCarD>>(RecordId::from_table_key("tb_pend_car", &id))
        .await
        .unwrap()
    {
        dbi.pstat = PState::Deny;

        let nt = Noti {
            notimsg: String::from("Your car registration from has been denied by admin!!"),
            data: dbi.clone(),
            ntyp: NType::CarFormDny,
        };

        db.update::<Option<Noti<PenCarD>>>(RecordId::from_table_key(dbi.data.userinfo.key().to_string(), &id))
            .content(nt)
            .await
            .unwrap()
            .unwrap();
        HttpResponse::Ok().await.unwrap()
    } else {
        HttpResponse::InternalServerError().await.unwrap()
    }
}
