use actix_web::{get, HttpResponse};

use crate::structures::{DbCarPost, NewFeed, Resp, DB};

#[get("/nf")]
pub async fn get_nf() -> HttpResponse {
    let db = DB.get().await;
    if db.use_ns("ns").use_db("db").await.is_err() {
        return HttpResponse::InternalServerError().json(Resp::new(
            "Sorry We are having some problem when opening our database!",
        ));
    }

    let car_postsql = "SELECT * FROM car_post ORDER BY RAND() LIMIT 50;";
    let packagesql = "SELECT * FROM package ORDER BY RAND() LIMIT 50;";

    let mut ret = db.query(car_postsql).query(packagesql).await.unwrap();
    let db_car_posts = ret.take::<Vec<DbCarPost>>(0).unwrap();
    println!("{db_car_posts:?}");
    let mut car_posts = vec![];

    for x in db_car_posts {
        car_posts.push(x.to_resp().await.unwrap());
    }
    println!("{car_posts:?}");

    let nf = NewFeed {
        car_posts,
        packages: ret.take(1).unwrap(),
    };

    HttpResponse::Ok().json(nf)
}
