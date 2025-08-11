use uuid::Uuid;
use chrono::{DateTime, Duration, Utc};

//Generate a new secret id
pub fn generate_id() -> String {
    Uuid::new_v4().to_string()
}

//Calculate expiry from optional minutes param
pub fn calculate_expiry(minutes: Option<i32>) -> DateTime<Utc> {
    Utc::now() + Duration::minutes(minutes.unwrap_or(60) as i64)
}