use diesel::pg::PgConnection;
use diesel::prelude::*;
use diesel::r2d2::{self, ConnectionManager, Pool, PoolError, PooledConnection};
use dotenvy::dotenv;
use std::env;

pub type DbPool = Pool<ConnectionManager<PgConnection>>;
pub type DbConnection = PooledConnection<ConnectionManager<PgConnection>>;

pub fn establish_connection_pool() -> Result<DbPool, PoolError> {
    dotenv().ok();
    
    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set in .env");

    let manager = ConnectionManager::<PgConnection>::new(database_url);
    
    Pool::builder()
        .max_size(10)
        .min_idle(Some(2))
        .test_on_check_out(true)
        .build(manager)
}

// Keep the old function for backward compatibility if needed
/* 
pub fn establish_connection() -> Result<PgConnection, Box<dyn std::error::Error>> {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL")
        .map_err(|_| "DATABASE_URL must be set in .env")?;

    PgConnection::establish(&database_url)
        .map_err(|e| Box::new(e) as Box<dyn std::error::Error>)
}*/