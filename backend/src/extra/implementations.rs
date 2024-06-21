#![allow(clippy::wrong_self_convention)]
use actix_web::HttpResponse;
use rand::{
    distributions::{DistString, Distribution},
    Rng,
};
use serde_json::Value;
use surrealdb::sql::{Id, Thing};

use crate::{
    extra::functions::internal_error,
    extra::structures::{
        CarPostForm, DbCarInfo, GenString, PType, Post, PostD, Resp, DB,
    },
};

impl Post<Value> {
    pub fn to_resp(&mut self) -> Value {
        if let None | Some(0) = self.votes {
            self.votes = None;
        }
        serde_json::to_value(self).unwrap()
    }
}

impl PostD<Value> {
    pub fn to_resp(&mut self) -> Value {
        if let None | Some(0) = self.votes {
            self.votes = None;
        }
        serde_json::to_value(self).unwrap()
    }
}

impl PostD<DbCarInfo> {
    pub fn to_resp(&mut self) -> Value {
        if let None | Some(0) = self.votes {
            self.votes = None;
        }
        serde_json::to_value(self).unwrap()
    }
}

impl GenString {
    pub fn new() -> Self {
        Self {
            rngs: rand::thread_rng(),
        }
    }

    pub fn gen_string(&self, min: usize, max: usize) -> String {
        self.sample_string(
            &mut self.rngs.clone(),
            self.to_owned().rngs.gen_range(min..max),
        )
    }
}

impl DistString for GenString {
    fn append_string<R: Rng + ?Sized>(&self, rng: &mut R, string: &mut String, len: usize) {
        unsafe {
            let v = string.as_mut_vec();
            v.extend(self.sample_iter(rng).take(len));
        }
    }
}

impl<'a> Resp<'a> {
    pub const fn new(msg: &'a str) -> Self {
        Resp { msg }
    }
}

impl CarPostForm {
    pub async fn to_db_post(&self, username: &str) -> Result<Post<DbCarInfo>, HttpResponse> {
        let db = DB.get().await;
        if let Err(e) = db.use_ns("ns").use_db("db").await {
            return Err(internal_error(e));
        };

        match db
            .select::<Option<DbCarInfo>>(("car", Id::String(self.car_id.to_string())))
            .await
        {
            Ok(Some(data)) => Ok(Post {
                r#in: Thing {
                    tb: "user".into(),
                    id: Id::from(username),
                },
                out: Thing::from(("car", Id::String(self.car_id.to_string()))),
                ptdate: 0,
                votes: Some(0),
                data,
                ptype: PType::Car,
                to_where: self.to_where.clone(),
                from_where: self.from_where.clone(),
                date_to_go: self.date_to_go.clone(),
                cper_weight: self.cper_weight,
                cper_amount: self.cper_amount,
            }),
            Ok(None) => Err(internal_error("structure 139 None DbCarIndo Error!")),
            Err(e) => Err(internal_error(e)),
        }
    }
}
