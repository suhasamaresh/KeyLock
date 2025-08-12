#!/bin/bash
set -e

echo "Checking for backend/.env..."
if [ ! -f "backend/.env" ]; then
  echo "Missing backend/.env file."
  echo "Please create backend/.env with your DATABASE_URL before running this setup."
  echo "Example:"
  echo "DATABASE_URL=sqlite:/app/data/secrets.db"
  exit 1
fi

export $(grep -v '^#' backend/.env | xargs)

echo "Installing Rust dependencies..."
cd backend
cargo fetch

echo "Installing frontend dependencies..."
cd ../frontend
npm install

echo "Setting up SQLite database..."
cd ../backend
if ! [ -f "./data/secrets.db" ]; then
  mkdir -p data
  touch data/secrets.db
  diesel setup
  diesel migration run
fi

echo "Setup complete!"
echo "Now run: scripts/dev.sh to start the app"
