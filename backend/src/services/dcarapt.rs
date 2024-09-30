use actix_web::{put, web::Path, HttpResponse};
use surrealdb::{opt::PatchOp, RecordId};

use crate::{
    extra::functions::{ct_user, internal_error},
    structures::{
        car::{Cargo, DbCarInfo, PaSta},
        extrastruct::DB,
        post::PostD,
        wsstruct::{NType, Noti},
    },
};

#[allow(clippy::future_not_send)]
#[put("/accept/cdriver/{id}/{token}")]
pub async fn driver_acpt_car(pdata: Path<(String, String)>) -> HttpResponse {
    let id = pdata.0.clone();
    let token = &pdata.1;

    let db = DB.get().await;
    if let Err(e) = db.use_ns("ns").use_db("db").await {
        return internal_error(e);
    }

    match ct_user(token).await {
        Ok((_, duser)) => {
            match db
                .select::<Option<Noti<Cargo>>>(RecordId::from_table_key(&duser.username, &id))
                .await
                .unwrap()
            {
                Some(mut ntcargo) => {
                    ntcargo.ntyp = NType::CDriverApt;
                    let nt = db
                        .update::<Option<Noti<Cargo>>>(RecordId::from_table_key(
                            ntcargo.data.owner.key().to_string(),
                            &id,
                        ))
                        .content(ntcargo.clone())
                        .await
                        .unwrap()
                        .unwrap();
                    db.create::<Option<PostD<DbCarInfo>>>(RecordId::from_table_key("tb_post", &id))
                        .content(nt.data.pdata.clone())
                        .await
                        .unwrap()
                        .unwrap();
                    db.update::<Option<DbCarInfo>>(&ntcargo.data.car)
                        .patch(PatchOp::replace("is_available", true))
                        .await
                        .unwrap()
                        .unwrap();
                    db.create::<Option<Cargo>>(RecordId::from_table_key(
                        "tb_dond",
                        &duser.username,
                    ))
                    .content(nt.data)
                    .await
                    .unwrap()
                    .unwrap();
                    db.update::<Option<Cargo>>(RecordId::from_table_key(
                        "tb_cargo",
                        ntcargo.data.car.key().to_string(),
                    ))
                    .patch(PatchOp::add("casta", PaSta::OnGo))
                    .await
                    .unwrap()
                    .unwrap();
                    HttpResponse::Ok().await.unwrap()
                }
                None => HttpResponse::NoContent().await.unwrap(),
            }
        }
        Err(idk) => idk,
    }
}
