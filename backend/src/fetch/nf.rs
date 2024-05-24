use serde_json::Value;
use tokio_tungstenite::tungstenite::Result;

use crate::{
    extra::wserror,
    structures::{DbCarPost, NewFeed, PostD, DB},
};

pub async fn fetch_newfeed() -> Result<NewFeed, tokio_tungstenite::tungstenite::Error> {
    let db = DB.get().await;
    if let Err(e) = db.use_ns("ns").use_db("db").await {
        return Err(wserror(e));
    }

    let car_postsql = "SELECT * FROM car_post ORDER BY RAND() LIMIT 50;";
    let packagesql = "SELECT * FROM package ORDER BY RAND() LIMIT 50;";

    let mut ret = db.query(car_postsql).query(packagesql).await.unwrap();
    let db_car_posts = ret.take::<Vec<PostD<DbCarPost>>>(0).unwrap();
    let db_packages = ret.take::<Vec<PostD<Value>>>(1).unwrap();
    let mut car_posts = vec![];
    let packages = db_packages.into_iter().map(|x| x.to_resp()).collect::<Vec<Value>>();

    for i in db_car_posts {
        car_posts.push(i.to_resp().await);
    }

    Ok(NewFeed {
        car_posts,
        packages,
    })
}
