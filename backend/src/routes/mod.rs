use std::sync::{Arc, Mutex};
use diesel::pg::PgConnection;
use crate::crypto::CryptoService;

#[derive(Clone)]
pub struct AppState {
    pub crypto: CryptoService,
    pub db: Arc<Mutex<PgConnection>>,
}

pub mod share;
pub mod retrieve;
