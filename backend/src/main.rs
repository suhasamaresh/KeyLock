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
use std::sync::{Arc, Mutex};

#[tokio::main]
async fn main() {
    let db_conn = establish_connection();
    let db_conn = Arc::new(Mutex::new(db_conn));

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

    let listener = tokio::net::TcpListener::bind("127.0.0.1:3001").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}