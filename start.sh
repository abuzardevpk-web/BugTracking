#!/bin/bash
set -e
cd "$(dirname "$0")"

echo "Starting BugTracker (Backend + Frontend)..."
echo ""
echo "Backend:  http://localhost:8080"
echo "Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both."
echo ""

if [ ! -d "node_modules" ]; then
  echo "Installing root dependencies..."
  npm install
fi

if [ ! -d "bugtracker-frontend/node_modules" ]; then
  echo "Installing frontend dependencies..."
  (cd bugtracker-frontend && npm install)
fi

npm run start
