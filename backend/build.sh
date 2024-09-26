#!/bin/bash

# Navigate to frontend directory and build
cd ../frontend
npm install
npm run build

# Move to backend directory
cd ../backend

# Clean old dist folder
rm -rf ./dist/*

# Copy new build files to dist folder
cp -r ../frontend/build/* ./dist/

# Install backend dependencies
npm install
