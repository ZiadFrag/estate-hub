# Installation script for database connection setup (Windows PowerShell)

Write-Host "🚀 Installing database dependencies..." -ForegroundColor Cyan

# Install axios for React project
Write-Host "📦 Installing axios for React..." -ForegroundColor Yellow
npm install axios

# Navigate to api folder and install backend dependencies
Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
Push-Location api
npm install
Pop-Location

Write-Host "✅ Installation complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Update .env.local with your database credentials"
Write-Host "2. Update api/.env with your database credentials"
Write-Host "3. Run backend: cd api && npm run dev"
Write-Host "4. Run frontend: npm run dev (in another terminal)"
Write-Host ""
Write-Host "📖 See DATABASE_SETUP.md for detailed configuration instructions"
