#!/bin/bash
echo "Installing Trillavision T.V. dependencies..."
npm install
echo ""
echo "Creating .env file from template..."
cp .env.example .env
echo ""
echo "Installation complete!"
echo "To start the development server, run: npm run dev"