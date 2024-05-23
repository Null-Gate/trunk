use tokio_tungstenite::tungstenite::Result;

use crate::{
    extra::wserror,
    structures::{DbCarPost, NewFeed, Post, DB},
};

pub async fn fetch_newfeed() -> Result<NewFeed, tokio_tungstenite::tungstenite::Error> {
    let db = DB.get().await;
    if let Err(e) = db.use_ns("ns").use_db("db").await {
        return Err(wserror(e));
    }

    let car_postsql = "SELECT * FROM car_post ORDER BY RAND() LIMIT 50;";
    let packagesql = "SELECT * FROM package ORDER BY RAND() LIMIT 50;";

    let mut ret = db.query(car_postsql).query(packagesql).await.unwrap();
    let car_posts = ret.take::<Vec<Post<DbCarPost>>>(0).unwrap();

    Ok(NewFeed {
        car_posts,
        packages: ret.take(1).unwrap(),
    })
}
