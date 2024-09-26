#!/bin/bash

# Navigate to frontend directory and build
cd ./frontend
npm install
npm run build

# Move to backend and remove old dist folder contents
cd ../backend
rm -rf ./dist/*

# Copy the new build to dist folder
cp -r ../frontend/build/* ./dist/

# Install backend dependencies and build backend if necessary
npm install
