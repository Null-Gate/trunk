use actix_web::{get, web::Path, HttpResponse};
use rayon::iter::{IntoParallelRefIterator, ParallelIterator};
use surrealdb::sql::{Id, Thing};

use crate::{
    extra::functions::{ct_user, internal_error},
    structures::{
        car::CargoD,
        dbstruct::{CargoS, PkgPsts, Roles},
        extrastruct::DB,
    },
};

#[allow(clippy::similar_names)]
#[allow(clippy::future_not_send)]
#[get("/get/cargos/{token}")]
pub async fn get_cargos(token: Path<String>) -> HttpResponse {
    let db = DB.get().await;
    if let Err(e) = db.use_ns("ns").use_db("db").await {
        return internal_error(e);
    }

    let (_, duser) = ct_user(token.as_str()).await.unwrap();
    let uql = "SELECT * FROM tb_bkpkg WHERE owner == type::thing($uthing);";
    let oql = if duser.pik_role.contains(&Roles::Owner) {
        Some("SELECT * FROM tb_cargo WHERE owner == type::thing($othing);")
    } else {
        None
    };
    let dql = if duser.pik_role.contains(&Roles::Driver) {
        Some("SELECT * FROM tb_cargo WHERE driver == type::thing($dthing);")
    } else {
        None
    };

    let urs = db.query(uql).bind((
        "uthing",
        Thing {
            id: Id::String(duser.username.clone()),
            tb: "tb_user".to_string(),
        },
    ));

    let ors = if let Some(oql) = oql {
        Some(db.query(oql).bind((
            "othing",
            Thing {
                id: Id::String(duser.username.clone()),
                tb: "tb_user".to_string(),
            },
        )))
    } else {
        None
    };

    let drs = if let Some(dql) = dql {
        Some(db.query(dql).bind((
            "dthing",
            Thing {
                id: Id::String(duser.username),
                tb: "tb_user".to_string(),
            },
        )))
    } else {
        None
    };

    let urd: Vec<PkgPsts> = urs.await.unwrap().take(0).unwrap();
    let prd: Vec<CargoD> = urd.par_iter().map(|v| v.bcargo.clone()).collect();

    let ord: Vec<CargoD> = if let Some(ors) = ors {
        ors.await.unwrap().take(0).unwrap()
    } else {
        vec![]
    };

    let drd: Vec<CargoD> = if let Some(drs) = drs {
        drs.await.unwrap().take(0).unwrap()
    } else {
        vec![]
    };

    let cargos = CargoS {
        ocargo: ord,
        dcargo: drd,
        pcargo: prd,
    };

    HttpResponse::Ok().json(cargos)
}
