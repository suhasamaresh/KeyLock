use axum::{extract::{Path, State}, Json};
use diesel::{prelude::*};
use crate::{
    db::{models::*},
    error::AppError,
};
use base64;
use serde_json::json;
use chrono::{Utc, DateTime, TimeZone};
use crate::routes::AppState;

pub async fn get_secret(
    Path(secret_id): Path<String>,
    State(state): State<AppState>,
) -> Result<Json<serde_json::Value>, AppError> {
    use crate::db::schema::secrets::dsl::*;

    let mut conn = state.db.lock().map_err(|_| AppError::Internal("Failed to lock database".into()))?;

    let _ = diesel::sql_query("DEALLOCATE ALL").execute(&mut *conn);
    
    let secret_record = secrets
        .filter(id.eq(&secret_id))
        .select(Secret::as_select())
        .first::<Secret>(&mut *conn)
        .map_err(|e| {
            println!("Database query error: {:?}", e);
            match e {
                diesel::result::Error::NotFound => {
                    println!(" Secret not found in database for ID: {}", secret_id);
                    AppError::NotFound
                }
                _ => {
                    println!(" Database error: {}", e);
                    AppError::Internal(format!("Database error: {}", e))
                }
            }
        })?;

    
    let expires_at_utc: DateTime<Utc> = Utc.from_utc_datetime(&secret_record.expires_at);

    
    if Utc::now() > expires_at_utc {
       
        diesel::delete(secrets.filter(id.eq(&secret_id)))
            .execute(&mut *conn)
            .ok();
        return Err(AppError::NotFound);
    }

    
    if secret_record.view_count >= secret_record.max_views {
       
        diesel::delete(secrets.filter(id.eq(&secret_id)))
            .execute(&mut *conn)
            .ok();
        return Err(AppError::NotFound);
    }

    
    let ciphertext_b64 = base64::encode(&secret_record.ciphertext);
    let nonce_b64 = base64::encode(&secret_record.nonce);

    
    let decrypted = state
        .crypto
        .decrypt(&ciphertext_b64, &nonce_b64)
        .map_err(|e| AppError::Internal(e))?;

    
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
