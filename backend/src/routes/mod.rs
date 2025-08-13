use crate::crypto::CryptoService;
use crate::config::DbPool;

#[derive(Clone)]
pub struct AppState {
    pub crypto: CryptoService,
    pub db: DbPool,
}

pub mod share;
pub mod retrieve;
