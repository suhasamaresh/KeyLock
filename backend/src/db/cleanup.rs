use chrono::Utc;
use diesel::prelude::*;
use crate::db::schema::secrets::dsl::*;
use std::sync::{Arc, Mutex};

pub async fn cleanup_expired_records(db_pool: Arc<Mutex<SqliteConnection>>) {
    let db = db_pool.clone();
    tokio::task::spawn_blocking(move || {
        let now = Utc::now().naive_utc();
        let mut conn = db.lock().unwrap();

        match diesel::delete(secrets.filter(expires_at.lt(now))).execute(&mut *conn) {
            Ok(count) => {
                println!("Deleted {} expired records", count);
            }
            Err(e) => {
                eprintln!("Error deleting expired records: {}", e);
            }
        }
    }).await.ok();
}