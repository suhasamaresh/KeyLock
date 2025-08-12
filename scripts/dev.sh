#!/bin/bash
set -e

echo "Starting keylock backend"
cd backend
cargo run & BACKEND_PID = $!

echo "Starting keylock frontend"
cd frontend
npm run dev & FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID" EXIT

wait