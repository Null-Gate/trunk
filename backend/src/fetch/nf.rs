use serde_json::Value;
use tokio_tungstenite::tungstenite::Result;

use crate::extra::{
    functions::wserror,
    structures::{PostD, DB},
};

pub async fn fetch_newfeed() -> Result<Vec<Value>, tokio_tungstenite::tungstenite::Error> {
    let db = DB.get().await;
    if let Err(e) = db.use_ns("ns").use_db("db").await {
        return Err(wserror(e));
    }

    let pql = "SELECT * FROM post ORDER BY RAND() LIMIT 50;";

    let mut ret = db.query(pql).await.unwrap();
    let new_feed = ret.take::<Vec<PostD<Value>>>(0).unwrap();

    Ok(new_feed.into_iter().map(|x| x.to_resp()).collect())
}
