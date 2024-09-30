use actix_multipart::form::MultipartForm;
use actix_web::{post, web::Path as WebPath, HttpResponse};
use image::{
    ImageFormat::{Jpeg, Png},
    ImageReader as Reader,
};
use surrealdb::RecordId;
use uuid::Uuid;

use crate::{
    extra::functions::{check_user, decode_token, internal_error, save_img, verify_password},
    structures::{
        car::{CarForm, DbCarInfo},
        dbstruct::{PState, PenCar},
        extrastruct::{Resp, DB},
        wsstruct::{NType, Noti},
    },
};

#[allow(clippy::future_not_send)]
#[allow(clippy::pedantic)]
#[post("/forms/car/{token}")]
async fn car(MultipartForm(form): MultipartForm<CarForm>, token: WebPath<String>) -> HttpResponse {
    let db = DB.get().await;
    if let Err(e) = db.use_ns("ns").use_db("db").await {
        return internal_error(e);
    }

    match decode_token(&token) {
        Ok(user_info) => match check_user(&user_info.username).await {
            Ok(user) => match verify_password(&user_info.password, &user.password) {
                Ok(_) => {
                    match Reader::open(form.owner_proof.file.path()) {
                        Ok(r) => match r.with_guessed_format() {
                            Ok(img) => {
                                if img.format() != Some(Png) && img.format() != Some(Jpeg) {
                                    return HttpResponse::UnsupportedMediaType().json(Resp::new(
                                        "Sorry your image format is not supported!",
                                    ));
                                }
                            }
                            Err(e) => {
                                return internal_error(e);
                            }
                        },
                        Err(e) => {
                            return internal_error(e);
                        }
                    }

                    let pic_url = match save_img(form.owner_proof).await {
                        Ok(url) => url,
                        Err(e) => {
                            return e;
                        }
                    };

                    let id = Uuid::new_v4().simple();

                    let car_info = DbCarInfo {
                        license_num: form.license_num.0,
                        car_id: id.to_string(),
                        owner_proof: pic_url,
                        car_details: form.car_details.0,
                        is_available: false,
                        userinfo: RecordId::from_table_key("tb_user", &user_info.username),
                    };

                    let pcont = PenCar {
                        pstat: PState::Pending,
                        data: car_info,
                    };

                    let nt = Noti {
                        data: pcont.clone(),
                        ntyp: NType::OwnCarForm,
                    };

                    db.create::<Option<PenCar>>(RecordId::from_table_key(
                        "tb_pend_car",
                        id.to_string(),
                    ))
                    .content(pcont)
                    .await
                    .unwrap()
                    .unwrap();
                    db.create::<Option<Noti<PenCar>>>(RecordId::from_table_key(
                        user_info.username,
                        Uuid::new_v4().simple().to_string(),
                    ))
                    .content(nt)
                    .await
                    .unwrap()
                    .unwrap();
                    HttpResponse::Ok().await.unwrap()

                    /*match db
                        .create::<Option<DbCarInfo>>(("car", id.clone()))
                        .content(car_info)
                        .await
                    {
                        Ok(Some(_)) => {
                            if !user.pik_role.contains(&Roles::Owner) {
                                user.pik_role.push(Roles::Owner);
                            }
                            let rel = OwnTB {
                                r#in: Thing {
                                    tb: "user".into(),
                                    id: Id::String(user_info.username.to_string()),
                                },
                                out: Thing {
                                    tb: "car".into(),
                                    id: id.clone(),
                                },
                            };
                            db.create::<Option<OwnTB>>(("own", id.clone()))
                                .content(rel)
                                .await
                                .unwrap()
                                .unwrap();
                            match db
                                .update::<Option<DbUserInfo>>((
                                    "user",
                                    Id::String(user_info.username.to_string()),
                                ))
                                .content(user)
                                .await
                            {
                                Ok(Some(user)) => {
                                    let exp = usize::try_from(
                                        (Utc::now() + TimeDelta::try_days(9_999_999).unwrap())
                                            .timestamp(),
                                    )
                                    .unwrap();
                                    let user_info = DbUserInfo {
                                        username: user_info.username,
                                        password: user_info.password,
                                        fullname: user_info.fullname,
                                        pik_role: user.pik_role,
                                    };
                                    let claims = Claims { user_info, exp };

                                    encode(
                                        &Header::default(),
                                        &claims,
                                        &EncodingKey::from_secret(JWT_SECRET),
                                    )
                                    .map_or_else(internal_error, |token| {
                                        HttpResponse::Ok().json(Resp::new(&token))
                                    })
                                }
                                Ok(None) => internal_error("None User Error"),
                                Err(e) => internal_error(e),
                            }
                        }
                        Ok(None) => internal_error("None Car Error"),
                        Err(e) => internal_error(e),
                    }*/
                }
                Err(e) => e,
            },
            Err(e) => e,
        },
        Err(e) => e,
    }
}
