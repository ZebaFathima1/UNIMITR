#!/usr/bin/env pwsh
<#
    UniMitr Deployment Script
    Builds React and deploys with Django
    Run from root directory: .\deploy.ps1
#>

Write-Host "🚀 UniMitr Deployment Script Starting..." -ForegroundColor Green
Write-Host ""

# Colors
$successColor = "Green"
$errorColor = "Red"
$infoColor = "Cyan"

# Step 1: Clean previous build
Write-Host "Step 1: Cleaning previous builds..." -ForegroundColor $infoColor
if (Test-Path "build") {
    Remove-Item -Path "build" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "✓ Cleaned build/ folder" -ForegroundColor $successColor
}

# Step 2: Install dependencies
Write-Host "`nStep 2: Installing frontend dependencies..." -ForegroundColor $infoColor
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ npm install failed" -ForegroundColor $errorColor
    exit 1
}
Write-Host "✓ Dependencies installed" -ForegroundColor $successColor

# Step 3: Build React
Write-Host "`nStep 3: Building React frontend..." -ForegroundColor $infoColor
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ npm run build failed" -ForegroundColor $errorColor
    exit 1
}
Write-Host "✓ React build completed" -ForegroundColor $successColor

# Step 4: Copy build to Django
Write-Host "`nStep 4: Copying React build to Django..." -ForegroundColor $infoColor
if (-not (Test-Path "backend/staticfiles_build/frontend")) {
    New-Item -ItemType Directory -Path "backend/staticfiles_build/frontend" -Force | Out-Null
}

# Clean old build first
Remove-Item -Path "backend/staticfiles_build/frontend/*" -Recurse -Force -ErrorAction SilentlyContinue

# Copy new build
Copy-Item -Path "build/*" -Destination "backend/staticfiles_build/frontend" -Recurse -Force
Write-Host "✓ React build copied to Django" -ForegroundColor $successColor

# Step 5: Run collectstatic (optional)
Write-Host "`nStep 5: Collecting Django static files..." -ForegroundColor $infoColor
$backendPath = "backend"
Push-Location $backendPath
python manage.py collectstatic --noinput
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠ Warning: collectstatic encountered issues" -ForegroundColor "Yellow"
}
Pop-Location
Write-Host "✓ Static files collected" -ForegroundColor $successColor

# Step 6: Summary
Write-Host "`n" -ForegroundColor $successColor
Write-Host "═════════════════════════════════════════" -ForegroundColor $successColor
Write-Host "✓ DEPLOYMENT COMPLETE!" -ForegroundColor $successColor
Write-Host "═════════════════════════════════════════" -ForegroundColor $successColor
Write-Host ""
Write-Host "Frontend location: backend/staticfiles_build/frontend/" -ForegroundColor $infoColor
Write-Host "Build type: Production" -ForegroundColor $infoColor
Write-Host ""
Write-Host "Next steps:" -ForegroundColor $infoColor
Write-Host "1. Start Django server:" -ForegroundColor $infoColor
Write-Host "   cd backend" -ForegroundColor "Yellow"
Write-Host "   python manage.py runserver 0.0.0.0:8000" -ForegroundColor "Yellow"
Write-Host ""
Write-Host "2. Open browser:" -ForegroundColor $infoColor
Write-Host "   http://localhost:8000" -ForegroundColor "Yellow"
Write-Host ""
Write-Host "3. Access admin:" -ForegroundColor $infoColor
Write-Host "   http://localhost:8000/admin/" -ForegroundColor "Yellow"
Write-Host ""
Write-Host "═════════════════════════════════════════" -ForegroundColor $successColor
