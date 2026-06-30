#!/bin/bash
set -e

echo "Building React Frontend..."
cd frontend
npm install
npm run build
cd ..

echo "Setting up Public Directory for Vercel..."
rm -rf public
mkdir -p public/crm

echo "Copying CRM Frontend to /crm..."
cp -R crm-frontend/* public/crm/

echo "Copying React Website to root..."
cp -R frontend/build/* public/

echo "Build complete! Output is in 'public' directory."
