use axum::http::Method;
use axum::{
    routing::{get, post},
    Router,
};
use tower_http::cors::CorsLayer;

mod config;
mod crypto;
mod db;
mod error;
mod routes;
mod utils;

use crate::config::establish_connection;
use crate::crypto::CryptoService;
use crate::db::cleanup::cleanup_expired_records;
use crate::routes::AppState;
use crate::routes::{retrieve::get_secret, share::share_secret};
use std::sync::{Arc, Mutex};
use tokio_cron_scheduler::{Job, JobScheduler};

#[tokio::main]
async fn main() {
    let sched = JobScheduler::new().await.unwrap();

    let db_conn = establish_connection().unwrap();
    let db_conn = Arc::new(Mutex::new(db_conn));
    let db_pool = db_conn.clone();

    let state = AppState {
        crypto: CryptoService::new(),
        db: db_conn,
    };

    let cors = CorsLayer::new()
        .allow_origin(tower_http::cors::Any)
        .allow_methods([Method::GET, Method::POST])
        .allow_headers(vec![
            axum::http::header::CONTENT_TYPE,
            axum::http::header::ACCEPT,
        ]);

    let app = Router::new()
        .route("/api/share", post(share_secret))
        .route("/api/secret/{id}", get(get_secret))
        .with_state(state)
        .layer(cors);

    sched
        .add(
            Job::new_async("0 0 0 * * 0", {
                let db_pool = db_pool.clone();
                move |_uuid, _| {
                    let db_pool = db_pool.clone();
                    Box::pin(async move {
                        println!("Hi deleting expired records");
                        cleanup_expired_records(db_pool).await;
                    })
                }
            })
            .unwrap(),
        )
        .await
        .unwrap();

    let port = std::env::var("PORT")
        .unwrap_or_else(|_| "10000".to_string())
        .parse::<u16>()
        .expect("PORT must be a valid number");

    let address = format!("0.0.0.0:{}", port);
    let listener = tokio::net::TcpListener::bind(&address).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
