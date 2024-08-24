use actix_web::{put, web::Path, HttpResponse};
use surrealdb::sql::{Id, Thing};

use crate::structures::{NType, Noti, DB};

#[put("/deny/dreg/{id}")]
async fn dny_dreg(path: Path<String>) -> HttpResponse {
    let db = DB.get().await;
    db.use_ns("ns").use_db("db").await.unwrap();

    let sql = r#"
    BEGIN TRANSACTION;

    DELETE type::thing($tbthing);

    CREATE type::thing($uthing) CONTENT type::object($othing);

    COMMIT TRANSACTION;
    "#;

    db.query(sql)
        .bind((
            "tbthing",
            Thing {
                tb: "tb_pend_driver".to_string(),
                id: Id::String(path.to_string()),
            },
        ))
        .bind((
            "uthing",
            Thing {
                tb: path.to_string(),
                id: Id::rand(),
            },
        ))
        .bind((
            "othing",
            Noti {
                data: "The Driver Registration Has Been Denied!",
                ntyp: NType::DriverRegDny,
            },
        ))
        .await
        .unwrap();

    HttpResponse::Ok().await.unwrap()
}
