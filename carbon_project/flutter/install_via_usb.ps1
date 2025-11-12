# USB Installation Script for Carbon Footprint App
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "USB Installation - Carbon Footprint App" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$apkPath = "build\app\outputs\flutter-apk\app-release.apk"

# Step 1: Check for connected devices
Write-Host "[1/3] Checking for connected devices..." -ForegroundColor Yellow
Write-Host ""
$devicesOutput = flutter devices 2>&1
Write-Host $devicesOutput
Write-Host ""

# Step 2: Check if APK exists
Write-Host "[2/3] Checking if APK exists..." -ForegroundColor Yellow
if (-not (Test-Path $apkPath)) {
    Write-Host "APK not found. Building APK first..." -ForegroundColor Yellow
    Write-Host "This will take a few minutes..." -ForegroundColor Yellow
    Write-Host ""
    flutter build apk --release
    Write-Host ""
}

if (-not (Test-Path $apkPath)) {
    Write-Host "ERROR: APK still not found. Build may have failed." -ForegroundColor Red
    Write-Host "APK path: $apkPath" -ForegroundColor Red
    pause
    exit 1
}

Write-Host "APK found: $apkPath" -ForegroundColor Green
Write-Host ""

# Step 3: Install using Flutter
Write-Host "[3/3] Installing to connected device..." -ForegroundColor Yellow
Write-Host ""
flutter install

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Installation successful!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "The app is now installed on your phone." -ForegroundColor Green
    Write-Host "You can open it from your app drawer." -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "Installation failed!" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Troubleshooting:" -ForegroundColor Yellow
    Write-Host "1. Make sure your phone is connected via USB" -ForegroundColor Yellow
    Write-Host "2. Enable USB debugging on your phone" -ForegroundColor Yellow
    Write-Host "3. Allow USB debugging when prompted on phone" -ForegroundColor Yellow
    Write-Host "4. Check connection: flutter devices" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host ""
pause

