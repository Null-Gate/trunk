use actix_web::{put, web::Path, HttpResponse};
use surrealdb::sql::{Id, Thing};

use crate::structures::{DbCarInfo, DbUserInfo, NType, Noti, OwnTB, PState, PenCar, PenCarD, Roles, DB};

#[put("/accept/carf/{id}")]
pub async fn apt_cf(path: Path<String>) -> HttpResponse {
    let db = DB.get().await;
    let id = path.into_inner();

    if let Some(mut dbi) = db
        .delete::<Option<PenCarD>>(("pend_car", Id::String(id.clone())))
        .await
        .unwrap()
    {
        dbi.pstat = PState::Accept;

        let nt = Noti {
            data: dbi.clone(),
            ntyp: NType::CarFormApt,
        };

        let rel = OwnTB {
            r#in: dbi.data.userinfo.clone(),
            out: Thing {
                tb: "car".into(),
                id: Id::String(id.clone()),
            },
        };

        let mut userinfo: DbUserInfo = db.select::<Option<DbUserInfo>>(dbi.data.userinfo.clone()).await.unwrap().unwrap();

        db.create::<Option<DbCarInfo>>(("car", Id::String(id.clone())))
            .content(dbi.data.clone())
            .await
            .unwrap()
            .unwrap();

        db.create::<Option<OwnTB>>(("own", Id::String(id.clone())))
            .content(rel)
            .await
            .unwrap()
            .unwrap();
        if !userinfo.pik_role.contains(&Roles::Owner) {
            userinfo.pik_role.push(Roles::Owner);
        db.update::<Option<DbUserInfo>>(dbi.data.userinfo.clone())
            .content(userinfo)
            .await
            .unwrap()
            .unwrap();
        }
        db.update::<Option<Noti<PenCar>>>((dbi.data.userinfo.id.to_raw(), Id::String(id)))
            .content(nt)
            .await
            .unwrap()
            .unwrap();
        HttpResponse::Ok().await.unwrap()
    } else {
        HttpResponse::InternalServerError().await.unwrap()
    }
}
