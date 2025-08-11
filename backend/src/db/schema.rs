// @generated automatically by Diesel CLI.

diesel::table! {
    secrets (id) {
        id -> Text,
        ciphertext -> Binary,
        nonce -> Binary,
        expires_at -> Timestamp,
        max_views -> Integer,
        view_count -> Integer,
        created_at -> Timestamp,
    }
}
