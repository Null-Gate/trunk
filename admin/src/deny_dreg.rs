use actix_web::{put, web::Path, HttpResponse};
use surrealdb::{RecordId, Uuid};

use crate::structures::{NType, Noti, DB};

#[put("/deny/dreg/{id}")]
async fn dny_dreg(path: Path<String>) -> HttpResponse {
    let db = DB.get().await;
    db.use_ns("ns").use_db("db").await.unwrap();

    let sql = r#"
    BEGIN TRANSACTION;

    DELETE type::thing($tbthing);

    CREATE type::thing($uthing) SET data = $data, ntyp = $ntyp;

    COMMIT TRANSACTION;
    "#;

    db.query(sql)
        .bind((
            "tbthing",
            RecordId::from_table_key(
                "tb_pend_driver",
                path.as_str()
        )))
        .bind((
            "uthing",
            RecordId::from_table_key(
                path.as_str(),
                Uuid::new_v4().simple().to_string()
        )))
        .bind(
            Noti {
                notimsg: String::from("The Driver Registration Has Been Denied!"),
                data: "The Driver Registration Has Been Denied!",
                ntyp: NType::DriverRegDny,
            }
        )
        .await
        .unwrap();


    HttpResponse::Ok().await.unwrap()
}
