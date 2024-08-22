use actix_web::{put, web::Path, HttpResponse};
use surrealdb::{opt::PatchOp, sql::Id};

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
                .select::<Option<Noti<Cargo>>>((&format!("tb_{}", duser.username), Id::String(id.clone())))
                .await
                .unwrap()
            {
                Some(mut ntcargo) => {
                    ntcargo.ntyp = NType::CDriverApt;
                    let nt = db
                        .update::<Option<Noti<Cargo>>>((
                            &format!("tb_{}", ntcargo.data.owner.id),
                            Id::String(id.clone()),
                        ))
                        .content(ntcargo)
                        .await
                        .unwrap()
                        .unwrap();
                    db.create::<Option<PostD<DbCarInfo>>>(("tb_post", Id::String(id.clone())))
                        .content(&nt.data.pdata)
                        .await
                        .unwrap()
                        .unwrap();
                    db.update::<Option<DbCarInfo>>(("tb_car", id.clone()))
                        .patch(PatchOp::replace("is_available", true))
                        .await
                        .unwrap()
                        .unwrap();
                    db.create::<Option<Cargo>>(("tb_dond", Id::String(duser.username)))
                        .content(nt)
                        .await
                        .unwrap()
                        .unwrap();
                    db.update::<Option<Cargo>>(("tb_cargo", id.clone()))
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
