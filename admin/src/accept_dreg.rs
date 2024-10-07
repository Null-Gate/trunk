use actix_web::{put, web::Path, HttpResponse};
use surrealdb::{RecordId, Uuid};

use crate::structures::{NType, Noti, DB};

#[put("/accept/dreg/{id}")]
async fn apt_dreg(path: Path<String>) -> HttpResponse {
    let db = DB.get().await;
    db.use_ns("ns").use_db("db").await.unwrap();

    let sql = r#"
    BEGIN TRANSACTION;

    DELETE type::thing($tbthing);

    UPDATE type::thing($dthing) SET pik_role += 'Driver';

    CREATE type::thing($uthing) SET notimsg = $notimsg, data = $data, ntyp = $ntyp;

    COMMIT TRANSACTION;
    "#;

    db.query(sql)
        .bind((
            "tbthing",
            RecordId::from_table_key(
                "tb_pend_driver",
                path.to_string(),
        )))
        .bind((
            "dthing",
            RecordId::from_table_key(
                "tb_user",
                path.to_string(),
        )))
        .bind((
            "uthing",
            RecordId::from_table_key(
                path.into_inner(),
                Uuid::new_v4().simple().to_string()
        )))
        .bind(
            Noti {
                notimsg: String::from("The Driver Registration Has Been Approved!"),
                data: "The Driver Registration Has Been Approved!",
                ntyp: NType::DriverRegApt,
            }
        )
        .await
        .unwrap();

    HttpResponse::Ok().await.unwrap()
}
