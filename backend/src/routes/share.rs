use axum::{extract::State, Json};
use crate::{
    db::{models::*, schema::secrets::dsl::*},
    error::AppError,
    utils::{generate_id, calculate_expiry},
};
use diesel::prelude::*;
use serde_json::json;
use crate::routes::AppState;

pub async fn share_secret(State(state): State<AppState>, Json(payload): Json<ShareRequest>) -> Result<Json<serde_json::Value>, AppError> {
    let generated_id = generate_id();
    let exp_at = calculate_expiry(payload.expire_minutes);

    let (ciphertext_b64, nonce_b64) = state
        .crypto
        .encrypt(&payload.secret)
        .map_err(|e| AppError::Internal(e))?;

    let ct_bytes = base64::decode(ciphertext_b64).map_err(|e| AppError::Internal(e.to_string()))?;
    let nonce_bytes = base64::decode(nonce_b64).map_err(|e| AppError::Internal(e.to_string()))?;

    let new_secret = NewSecret {
        id:  generated_id.clone().to_string(),
        ciphertext: ct_bytes,
        nonce: nonce_bytes,
        expires_at: exp_at.naive_utc(), 
        max_views: payload.max_views.unwrap_or(1),
    };

    let mut conn = state.db.lock().unwrap();

    diesel::insert_into(secrets)
        .values(new_secret)
        .execute(&mut *conn)
        .map_err(|e| AppError::Internal(e.to_string()))?;

    Ok(Json(json!({
        "id":  generated_id,
        "url": format!("http://localhost:3000/secret/{}",  generated_id),
        "expires_at": exp_at,
        "max_views": payload.max_views.unwrap_or(1)
    })))
}