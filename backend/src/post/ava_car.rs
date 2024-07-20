use actix_web::{
    post,
    web::{Json, Path},
    HttpResponse,
};
use chrono::{TimeDelta, Utc};
use surrealdb::sql::{Id, Thing};

use crate::{
    extra::functions::{check_user, decode_token, encode_token, internal_error, verify_password},
    structures::{
        auth::Claims,
        car::{AcData, CarPostForm, Cargo, CargoD, DbCarInfo, PaSta},
        dbstruct::{DbUserInfo, Roles},
        extrastruct::{Resp, DB},
        post::{OwnTB, PostD},
        wsstruct::{NType, Noti},
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
        Ok(user_info) => match check_user(user_info.username.clone()).await {
            Ok(user) => match verify_password(&user_info.password, &user.password) {
                Ok(()) => {
                    match db
                        .select::<Option<OwnTB>>(("own", Id::String(post.car_id.clone())))
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
                        .select::<Option<DbUserInfo>>(("user", Id::String(post.driver_id.clone())))
                        .await
                        .unwrap()
                        .unwrap();
                    let cidk: Option<CargoD> = db
                        .select::<Option<CargoD>>(("cargo", Id::String(post.car_id.clone())))
                        .await
                        .unwrap();
                    let didk: Option<CargoD> = db
                        .select::<Option<CargoD>>(("dond", Id::String(post.driver_id.clone())))
                        .await
                        .unwrap();

                    if !idk.pik_role.contains(&Roles::Driver) || cidk.is_some() || didk.is_some() {
                        return HttpResponse::NotAcceptable()
                            .json("The Driver is not a driver or the car/driver is on_going");
                    }

                    let cargo_data = Cargo {
                        driver: Thing {
                            tb: "user".to_string(),
                            id: Id::String(post.driver_id.clone()),
                        },
                        owner: Thing {
                            tb: "user".to_string(),
                            id: Id::String(user_info.username.clone()),
                        },
                        car: Thing {
                            tb: "car".to_string(),
                            id: Id::String(post.car_id.clone()),
                        },
                        pdata: post.to_db_post(&user_info.username).await.unwrap(),
                        casta: PaSta::Pend,
                        stloc: post.from_where.clone(),
                        fnloc: post.to_where.clone(),
                        ctloc: None,
                    };
                    db.create::<Option<PostD<DbCarInfo>>>((
                        "car_post",
                        Id::String(post.car_id.clone()),
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
                    db.create::<Option<Cargo>>(("cargo", Id::String(post.car_id.clone())))
                        .content(cargo_data)
                        .await
                        .unwrap()
                        .unwrap();
                    db.create::<Option<Noti<Cargo>>>((user_info.username.clone(), Id::rand()))
                        .content(ont)
                        .await
                        .unwrap()
                        .unwrap();
                    db.create::<Option<Noti<Cargo>>>((post.driver_id.clone(), Id::rand()))
                        .content(dnt)
                        .await
                        .unwrap()
                        .unwrap();
                    let acdata = AcData {
                        driver: Thing {
                            tb: "user".to_string(),
                            id: Id::String(post.driver_id.clone()),
                        },
                        owner: Thing {
                            tb: "user".to_string(),
                            id: Id::String(user_info.username.clone()),
                        },
                        cargo: Thing {
                            tb: "cargo".to_string(),
                            id: Id::String(post.car_id.clone()),
                        },
                    };
                    db.create::<Option<AcData>>((&post.car_id, Id::from("cargo")))
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
