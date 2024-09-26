#!/bin/bash

# Navigate to frontend directory and install dependencies
cd frontend
npm install

# Build frontend
npm run build

# Navigate to backend directory
cd ../backend

# Clean old dist folder
rm -rf ./dist/*

# Copy new build files to dist folder
cp -r ../frontend/build/* ./dist/

# Install backend dependencies
npm install
