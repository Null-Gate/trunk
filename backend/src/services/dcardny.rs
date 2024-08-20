use actix_web::{put, web::Path, HttpResponse};
use surrealdb::sql::Id;

use crate::{
    extra::functions::{ct_user, internal_error},
    structures::{
        car::{AcData, Cargo},
        extrastruct::DB,
        wsstruct::{NType, Noti},
    },
};

#[allow(clippy::future_not_send)]
#[put("/deny/cdriver/{id}/{token}")]
pub async fn driver_dny_car(pdata: Path<(String, String)>) -> HttpResponse {
    let id = pdata.0.clone();
    let token = &pdata.1;

    let db = DB.get().await;
    if let Err(e) = db.use_ns("ns").use_db("db").await {
        return internal_error(e);
    }

    match ct_user(token).await {
        Ok((_, duser)) => {
            match db
                .delete::<Option<Noti<Cargo>>>((&duser.username, Id::String(id.clone())))
                .await
                .unwrap()
            {
                Some(mut ntcargo) => {
                    ntcargo.ntyp = NType::CDriverDny;
                    db.update::<Option<Noti<Cargo>>>((
                        &ntcargo.data.owner.id.to_raw(),
                        Id::String(id.clone()),
                    ))
                    .content(ntcargo)
                    .await
                    .unwrap()
                    .unwrap();
                    db.delete::<Option<Cargo>>(("cargo", Id::from(&id)))
                        .await
                        .unwrap()
                        .unwrap();
                    db.delete::<Option<AcData>>((&id, Id::from("cargo")))
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
