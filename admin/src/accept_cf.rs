use actix_web::{put, web::Path, HttpResponse};
use surrealdb::{
    opt::PatchOp,
    sql::{Id, Thing},
};

use crate::structures::{DbCarInfo, DbUserInfo, NType, Noti, OwnTB, PState, PenCar, Roles, DB};

#[put("/accept/carf/{id}")]
pub async fn apt_cf(path: Path<String>) -> HttpResponse {
    let db = DB.get().await;
    let id = path.into_inner();

    if let Some(dbi) = db
        .delete::<Option<DbCarInfo>>(("pend_car", Id::String(id.clone())))
        .await
        .unwrap()
    {
        let pcont = PenCar {
            pstat: PState::Accept,
            data: dbi.clone(),
        };

        let nt = Noti {
            data: pcont,
            ntyp: NType::CarFormApt,
        };

        let rel = OwnTB {
            r#in: dbi.userinfo.clone(),
            out: Thing {
                tb: "car".into(),
                id: Id::String(id.clone()),
            },
        };

        db.create::<Option<DbCarInfo>>(("car", Id::String(id.clone())))
            .content(dbi.clone())
            .await
            .unwrap()
            .unwrap();

        db.create::<Option<OwnTB>>(("own", Id::String(id.clone())))
            .content(rel)
            .await
            .unwrap()
            .unwrap();
        db.update::<Option<DbUserInfo>>(dbi.userinfo.clone())
            .patch(PatchOp::replace("/pik_role", Roles::Owner))
            .await
            .unwrap()
            .unwrap();
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
