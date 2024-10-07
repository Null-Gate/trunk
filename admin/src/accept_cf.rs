use actix_web::{put, web::Path, HttpResponse};
use surrealdb::{RecordId, Uuid};

use crate::structures::{
    DbCarInfo, DbUserInfo, NType, Noti, OwnTB, PState, PenCar, PenCarD, Roles, DB,
};

#[put("/accept/carf/{id}")]
pub async fn apt_cf(path: Path<String>) -> HttpResponse {
    let db = DB.get().await;
    db.use_ns("ns").use_db("db").await.unwrap();
    let id = path.into_inner();

    if let Some(mut dbi) = db
        .delete::<Option<PenCarD>>(RecordId::from_table_key("tb_pend_car", &id))
        .await
        .unwrap()
    {
        dbi.pstat = PState::Accept;

        let nt = Noti {
            notimsg: String::from("Your car registration from has been verified by admin!!"),
            data: dbi.clone(),
            ntyp: NType::CarFormApt,
        };

        let rel = OwnTB {
            r#in: dbi.data.userinfo.clone(),
            out: RecordId::from_table_key(
                "tb_car",
                &id,
            )
        };

        let mut userinfo: DbUserInfo = db
            .select::<Option<DbUserInfo>>(dbi.data.userinfo.clone())
            .await
            .unwrap()
            .unwrap();

        db.create::<Option<DbCarInfo>>(RecordId::from_table_key("tb_car", &id))
            .content(dbi.data.clone())
            .await
            .unwrap()
            .unwrap();

        db.create::<Option<OwnTB>>(RecordId::from_table_key("tb_own", &id))
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
        db.create::<Option<Noti<PenCar>>>(RecordId::from_table_key(dbi.data.userinfo.key().to_string(), Uuid::new_v4().simple().to_string()))
            .content(nt)
            .await
            .unwrap()
            .unwrap();
        HttpResponse::Ok().await.unwrap()
    } else {
        HttpResponse::InternalServerError().await.unwrap()
    }
}
