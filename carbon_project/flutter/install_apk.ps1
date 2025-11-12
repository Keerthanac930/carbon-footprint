# Install APK directly to connected Android device
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Installing Carbon Footprint App" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$apkPath = "build\app\outputs\flutter-apk\app-release.apk"

# Check if APK exists
if (-not (Test-Path $apkPath)) {
    Write-Host "APK not found. Building APK first..." -ForegroundColor Yellow
    Write-Host ""
    flutter build apk
    Write-Host ""
}

# Check if APK exists now
if (-not (Test-Path $apkPath)) {
    Write-Host "ERROR: APK still not found. Build may have failed." -ForegroundColor Red
    Write-Host "APK path: $apkPath" -ForegroundColor Red
    pause
    exit 1
}

Write-Host "APK found: $apkPath" -ForegroundColor Green
Write-Host ""

# Check if device is connected
Write-Host "Checking for connected devices..." -ForegroundColor Cyan
$devices = adb devices
Write-Host $devices
Write-Host ""

# Install APK
Write-Host "Installing APK to device..." -ForegroundColor Cyan
adb install -r $apkPath

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "App installed successfully!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "You can now open the app on your phone." -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "Installation failed!" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Try:" -ForegroundColor Yellow
    Write-Host "1. Make sure USB debugging is enabled" -ForegroundColor Yellow
    Write-Host "2. Check if device is connected: adb devices" -ForegroundColor Yellow
    Write-Host "3. Try uninstalling the app first: adb uninstall com.example.carbon_footprint_flutter" -ForegroundColor Yellow
}

Write-Host ""
pause

