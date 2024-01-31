use actix_web::{get, HttpResponse};

use crate::structures::{Resp, DB};

#[get("/fetch/{which}")]
async fn fetch() -> HttpResponse {
    let db = DB.get().await;
    if db.use_ns("ns").use_db("db").await.is_err() {
        return HttpResponse::InternalServerError().json(Resp::new(
            "Sorry We are having some problem when opening our database!",
        ));
    }

    
/*    let query = {
        match which.to_lowercase().as_str() {
            "drivers" => "SELECT * FROM user WHERE pik_role='Driver' LIMIT 30 ORDER BY RAND();",
            "cars" =>   "SELECT * FROM post WHERE type='car' AND available=true LIMIT 30 ORDER BY RAND();",
            "packages" =>   "SELECT * FROM post WHERE type='package' AND available=true LIMIT 30 ORDER BY RAND();",
            _ => {return HttpResponse::NotFound().json(Resp::new("Sorry Url Not Found!"));}
        }
    };
*/
    todo!()
}
