# Quick Start Script for Yackson's World

Write-Host "🚀 Setting up Yackson's World..." -ForegroundColor Cyan

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "📝 Creating .env file from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✅ .env file created. Please review and update if needed." -ForegroundColor Green
} else {
    Write-Host "✅ .env file already exists." -ForegroundColor Green
}

# Check if SSL certificates exist
if (-not (Test-Path "ssl/fullchain.pem") -or -not (Test-Path "ssl/privkey.pem")) {
    Write-Host "" 
    Write-Host "⚠️  SSL certificates not found!" -ForegroundColor Yellow
    Write-Host "Would you like to generate self-signed certificates for development? (Y/N)" -ForegroundColor Yellow
    $response = Read-Host
    
    if ($response -eq "Y" -or $response -eq "y") {
        Write-Host "🔐 Generating self-signed SSL certificates..." -ForegroundColor Cyan
        
        # Create ssl directory if it doesn't exist
        if (-not (Test-Path "ssl")) {
            New-Item -ItemType Directory -Path "ssl" | Out-Null
        }
        
        # Generate self-signed certificate using OpenSSL
        $opensslCmd = "openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ssl/privkey.pem -out ssl/fullchain.pem -subj '/CN=localhost'"
        
        try {
            Invoke-Expression $opensslCmd
            Write-Host "✅ Self-signed certificates generated!" -ForegroundColor Green
        } catch {
            Write-Host "❌ Failed to generate certificates. Please install OpenSSL or generate them manually." -ForegroundColor Red
            Write-Host "See ssl/README.md for instructions." -ForegroundColor Yellow
        }
    } else {
        Write-Host "⚠️  Please add your SSL certificates to the ssl/ directory before starting." -ForegroundColor Yellow
        Write-Host "See ssl/README.md for instructions." -ForegroundColor Yellow
    }
} else {
    Write-Host "✅ SSL certificates found." -ForegroundColor Green
}

Write-Host ""
Write-Host "📦 Building and starting Docker containers..." -ForegroundColor Cyan
Write-Host "This may take a few minutes on first run..." -ForegroundColor Yellow

# Build and start containers
docker-compose up -d --build

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Yackson's World is running!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Access your application at:" -ForegroundColor Cyan
    Write-Host "   - HTTP:  http://localhost" -ForegroundColor White
    Write-Host "   - HTTPS: https://localhost" -ForegroundColor White
    Write-Host ""
    Write-Host "🔧 API endpoints:" -ForegroundColor Cyan
    Write-Host "   - Backend API: http://localhost/api/" -ForegroundColor White
    Write-Host ""
    Write-Host "📊 View logs:" -ForegroundColor Cyan
    Write-Host "   docker-compose logs -f" -ForegroundColor White
    Write-Host ""
    Write-Host "🛑 Stop the application:" -ForegroundColor Cyan
    Write-Host "   docker-compose down" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "❌ Failed to start Docker containers." -ForegroundColor Red
    Write-Host "Check the error messages above for details." -ForegroundColor Yellow
}
