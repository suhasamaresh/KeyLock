CREATE TABLE secrets (
    id TEXT PRIMARY KEY NOT NULL,
    ciphertext BYTEA NOT NULL,
    nonce BYTEA NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    max_views INTEGER NOT NULL DEFAULT 1,
    view_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_secrets_expires_at ON secrets(expires_at);
