#!/bin/bash
# Installation script for database connection setup

echo "🚀 Installing database dependencies..."

# Install axios for React project
echo "📦 Installing axios for React..."
npm install axios

# Navigate to api folder and install backend dependencies
cd api
echo "📦 Installing backend dependencies..."
npm install

cd ..

echo "✅ Installation complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your database credentials"
echo "2. Update api/.env with your database credentials"
echo "3. Run backend: cd api && npm run dev"
echo "4. Run frontend: npm run dev (in another terminal)"
echo ""
echo "📖 See DATABASE_SETUP.md for detailed configuration instructions"
