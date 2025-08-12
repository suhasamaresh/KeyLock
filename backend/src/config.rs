use diesel::sqlite::SqliteConnection;
use diesel::prelude::*;
use dotenvy::dotenv;
use std::env;

pub fn establish_connection() -> Result<SqliteConnection, Box<dyn std::error::Error>> {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL")
        .map_err(|_| "DATABASE_URL must be set in .env")?;
    
    SqliteConnection::establish(&database_url)
        .map_err(|e| Box::new(e) as Box<dyn std::error::Error>)
}
