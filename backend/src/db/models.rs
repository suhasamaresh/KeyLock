use diesel::prelude::*;
use serde::{Serialize, Deserialize};
use chrono::{DateTime, Utc};
use chrono::NaiveDateTime;

#[derive(Queryable, Selectable, Serialize, Deserialize)]
#[diesel(table_name = crate::db::schema::secrets)]
pub struct Secret {
    pub id: String, 
    pub ciphertext: Vec<u8>,
    pub nonce: Vec<u8>,
    pub expires_at: NaiveDateTime,
    pub max_views: i32,
    pub view_count: i32,
    pub created_at: NaiveDateTime,
}

#[derive(Insertable)]
#[diesel(table_name = crate::db::schema::secrets)]
pub struct NewSecret {
    pub id:String,
    pub ciphertext: Vec<u8>,
    pub nonce: Vec<u8>,
    pub expires_at: NaiveDateTime,
    pub max_views: i32,
}

#[derive(Deserialize)]
pub struct ShareRequest {
    pub secret: String,
    pub expire_minutes: Option<i32>,
    pub max_views: Option<i32>,
}