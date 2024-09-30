use std::collections::BTreeMap;

use actix_web::{
    post,
    web::{Json, Path},
    HttpResponse,
};
use chrono::{TimeDelta, Utc};
use surrealdb::RecordId;
use uuid::Uuid;

use crate::{
    extra::functions::{check_user, decode_token, encode_token, internal_error, verify_password},
    structures::{
        auth::Claims,
        car::{AcData, CarPostForm, Cargo, CargoD, DbCarInfo, PaSta},
        dbstruct::{DbUserInfo, Roles},
        extrastruct::{Resp, DB},
        post::{OwnTB, PostD},
        wsstruct::{NType, Noti, SLoc},
    },
};

#[allow(clippy::too_many_lines)]
#[allow(clippy::future_not_send)]
#[post("/post/car/{token}")]
async fn post_car(token: Path<String>, post: Json<CarPostForm>) -> HttpResponse {
    let db = DB.get().await;
    if let Err(e) = db.use_ns("ns").use_db("db").await {
        return internal_error(e);
    }
    match decode_token(&token) {
        Ok(user_info) => match check_user(&user_info.username).await {
            Ok(user) => match verify_password(&user_info.password, &user.password) {
                Ok(()) => {
                    match db
                        .select::<Option<OwnTB>>(RecordId::from_table_key("tb_own", &post.car_id))
                        .await
                    {
                        Ok(Some(_)) => {
                            if !user.pik_role.contains(&Roles::Owner) {
                                return HttpResponse::NotAcceptable().json("The Infos Are Wrong!");
                            }
                        }
                        Ok(None) => return HttpResponse::NotFound().json("Sorry Car Not Found!!"),
                        Err(e) => return internal_error(e),
                    }

                    let idk: DbUserInfo = db
                        .select::<Option<DbUserInfo>>(RecordId::from_table_key(
                            "tb_user",
                            &post.driver_id,
                        ))
                        .await
                        .unwrap()
                        .unwrap();
                    let cidk: Option<CargoD> = db
                        .select::<Option<CargoD>>(RecordId::from_table_key(
                            "tb_cargo",
                            &post.car_id,
                        ))
                        .await
                        .unwrap();
                    let didk: Option<CargoD> = db
                        .select::<Option<CargoD>>(RecordId::from_table_key(
                            "tb_dond",
                            &post.driver_id,
                        ))
                        .await
                        .unwrap();

                    if !idk.pik_role.contains(&Roles::Driver) || cidk.is_some() || didk.is_some() {
                        return HttpResponse::NotAcceptable()
                            .json("The Driver is not a driver or the car/driver is on_going");
                    }

                    let cargo_data = Cargo {
                        driver: RecordId::from_table_key("tb_user", &post.driver_id),
                        owner: RecordId::from_table_key("tb_user", &user_info.username),
                        car: RecordId::from_table_key("tb_car".to_string(), &post.car_id),
                        pdata: post.to_db_post(&user_info.username).await.unwrap(),
                        casta: PaSta::Pend,
                        stloc: post.from_where.clone(),
                        fnloc: post.to_where.clone(),
                        ctloc: SLoc::default(),
                        tlocs: BTreeMap::new(),
                    };
                    db.create::<Option<PostD<DbCarInfo>>>(RecordId::from_table_key(
                        "tb_car_post",
                        &post.car_id,
                    ))
                    .content(post.to_db_post(&user_info.username).await.unwrap())
                    .await
                    .unwrap()
                    .unwrap();
                    let ont = Noti {
                        data: cargo_data.clone(),
                        ntyp: NType::AvaCar,
                    };
                    let dnt = Noti {
                        data: cargo_data.clone(),
                        ntyp: NType::CDriver,
                    };
                    db.create::<Option<Cargo>>(RecordId::from_table_key("tb_cargo", &post.car_id))
                        .content(cargo_data)
                        .await
                        .unwrap()
                        .unwrap();
                    db.create::<Option<Noti<Cargo>>>(RecordId::from_table_key(
                        &user_info.username,
                        Uuid::new_v4().as_simple().to_string(),
                    ))
                    .content(ont)
                    .await
                    .unwrap()
                    .unwrap();
                    db.create::<Option<Noti<Cargo>>>((
                        &post.driver_id,
                        Uuid::new_v4().simple().to_string(),
                    ))
                    .content(dnt)
                    .await
                    .unwrap()
                    .unwrap();
                    let acdata = AcData {
                        driver: RecordId::from_table_key("tb_user", &post.driver_id),
                        owner: RecordId::from_table_key("tb_user", &user_info.username),
                        cargo: RecordId::from_table_key("tb_cargo", &post.car_id),
                    };
                    db.create::<Option<AcData>>(RecordId::from_table_key(&post.car_id, "cargo"))
                        .content(acdata)
                        .await
                        .unwrap()
                        .unwrap();
                    let user_info = DbUserInfo {
                        username: user_info.username,
                        password: user_info.password,
                        fullname: user_info.fullname,
                        pik_role: user.pik_role,
                    };
                    let exp = usize::try_from(
                        (Utc::now() + TimeDelta::try_days(9_999_999).unwrap()).timestamp(),
                    )
                    .unwrap();
                    let claims = Claims { user_info, exp };

                    encode_token(&claims)
                        .map_or_else(|e| e, |token| HttpResponse::Ok().json(Resp::new(&token)))
                }
                Err(e) => e,
            },
            Err(e) => e,
        },
        Err(e) => e,
    }
}
