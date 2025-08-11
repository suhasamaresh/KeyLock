use axum::{extract::{Path, State}, Json};
use diesel::{prelude::*, sql_types::Date};
use crate::{
    crypto::CryptoService,
    db::{models::*, schema::secrets::dsl::*},
    error::AppError,
};
use base64;
use std::sync::{Arc, Mutex};
use serde_json::json;
use chrono::{Utc, DateTime, TimeZone};
use crate::routes::AppState;

pub async fn get_secret(
    Path(secret_id): Path<String>,
    State(state): State<AppState>,
) -> Result<Json<serde_json::Value>, AppError> {
    use crate::db::schema::secrets::dsl::*;

    let mut conn = state.db.lock().unwrap();
    // Fetch the secret by ID
    let secret_record = secrets
        .filter(id.eq(&secret_id))
        .select(Secret::as_select())
        .first::<Secret>(&mut *conn)
        .map_err(|_| AppError::NotFound)?;

    //Convert NaiveDateTime to DateTime<Utc> for comparision
    let expires_at_utc: DateTime<Utc> = Utc.from_utc_datetime(&secret_record.expires_at);

    // Check for expiry
    if Utc::now() > expires_at_utc {
        // Delete expired
        diesel::delete(secrets.filter(id.eq(&secret_id)))
            .execute(&mut *conn)
            .ok();
        return Err(AppError::NotFound);
    }

    // Check max views
    if secret_record.view_count >= secret_record.max_views {
        // Delete after max views
        diesel::delete(secrets.filter(id.eq(&secret_id)))
            .execute(&mut *conn)
            .ok();
        return Err(AppError::NotFound);
    }

    // Decode bytes to base64 for decryption function
    let ciphertext_b64 = base64::encode(&secret_record.ciphertext);
    let nonce_b64 = base64::encode(&secret_record.nonce);

    // Decrypt
    let decrypted = state
        .crypto
        .decrypt(&ciphertext_b64, &nonce_b64)
        .map_err(|e| AppError::Internal(e))?;

    // Increment view count
    diesel::update(secrets.filter(id.eq(&secret_id)))
        .set(view_count.eq(secret_record.view_count + 1))
        .execute(&mut *conn)
        .map_err(|e| AppError::Internal(e.to_string()))?;

    let remaining = secret_record.max_views - (secret_record.view_count + 1);

    Ok(Json(json!({
        "secret": decrypted,
        "remaining_views": remaining
    })))
}
