use std::sync::{Arc, Mutex};
use diesel::SqliteConnection;
use crate::crypto::CryptoService;

#[derive(Clone)]
pub struct AppState {
    pub crypto: CryptoService,
    pub db: Arc<Mutex<SqliteConnection>>,
}

pub mod share;
pub mod retrieve;
