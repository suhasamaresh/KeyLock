use axum::{routing::{get,post}, Router};
use tower_http::cors::CorsLayer;
use axum::http::Method;

mod routes;
mod db;
mod crypto;
mod config;
mod error;
mod utils;


use crate::routes::{share::share_secret, retrieve::get_secret};
use crate::crypto::CryptoService;
use crate::config::establish_connection;
use crate::routes::AppState;
use std::{sync::{Arc, Mutex}, time::Duration};
use tokio_cron_scheduler::{JobScheduler, Job};
use crate::db::cleanup::cleanup_expired_records;
use tokio::time::sleep;

#[tokio::main]
async fn main() {
    let sched = JobScheduler::new().await.unwrap();

    let mut db_conn = None;
    for attempt in 1..=10 {
        println!("Attempting to connect to the database (attempt {}/10)...", attempt);
        db_conn = Some(establish_connection());
        if db_conn.is_some() {
            break;
        }
        sleep(Duration::from_secs(3)).await;
    }
    
    let db_conn = Arc::new(Mutex::new(db_conn.expect("Failed to establish database connection after 10 attempts")));
    let db_pool = db_conn.clone();

    let state = AppState {
        crypto: CryptoService::new(),
        db: db_conn,
    };

    let cors = CorsLayer::new()
        .allow_origin(tower_http::cors::Any)
        .allow_methods([Method::GET, Method::POST])
        .allow_headers(vec![axum::http::header::CONTENT_TYPE, axum::http::header::ACCEPT]);

    let app = Router::new()
        .route("/api/share", post(share_secret))
        .route("/api/secret/{id}", get(get_secret))
        .with_state(state)
        .layer(cors);

    
    sched.add(
        Job::new_async("0 0 0 * * 0", {
            let db_pool = db_pool.clone();
            move |_uuid, _| {
                let db_pool = db_pool.clone();
                Box::pin(async move{
                    println!("Hi deleting expired records");
                    cleanup_expired_records(db_pool).await;
                })
            }
        }).unwrap()
    ).await.unwrap();

    let listener = tokio::net::TcpListener::bind("127.0.0.1:3001").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}