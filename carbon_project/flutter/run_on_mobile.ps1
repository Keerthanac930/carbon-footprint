# Script to run Flutter app on connected Android device
Write-Host "=== Running Flutter App on Mobile ===" -ForegroundColor Cyan
Write-Host ""

# Set Android SDK path
$env:ANDROID_HOME = $env:LOCALAPPDATA + "\Android\Sdk"
$env:PATH += ";$env:ANDROID_HOME\platform-tools"

# Restart ADB
Write-Host "Checking for connected device..." -ForegroundColor Yellow
adb kill-server
Start-Sleep -Seconds 2
adb start-server
Start-Sleep -Seconds 2

# Check for devices
$devices = adb devices | Select-String -Pattern "device$"

if ($devices) {
    Write-Host "✅ Device detected!" -ForegroundColor Green
    $deviceId = ($devices -split "\s+")[0]
    Write-Host "Device ID: $deviceId" -ForegroundColor Cyan
    Write-Host "`nStarting Flutter app on your phone..." -ForegroundColor Yellow
    Write-Host "Make sure backend is running on: http://192.168.31.4:8000" -ForegroundColor Yellow
    Write-Host ""
    flutter run
} else {
    Write-Host "❌ No Android device detected!" -ForegroundColor Red
    Write-Host "`nPlease follow these steps:" -ForegroundColor Yellow
    Write-Host "1. Enable Developer Options:" -ForegroundColor White
    Write-Host "   - Go to Settings > About Phone" -ForegroundColor Gray
    Write-Host "   - Tap 'Build Number' 7 times" -ForegroundColor Gray
    Write-Host "2. Enable USB Debugging:" -ForegroundColor White
    Write-Host "   - Go to Settings > System > Developer Options" -ForegroundColor Gray
    Write-Host "   - Enable 'USB Debugging'" -ForegroundColor Gray
    Write-Host "3. Connect Phone:" -ForegroundColor White
    Write-Host "   - Connect via USB cable" -ForegroundColor Gray
    Write-Host "   - Select 'File Transfer' or 'PTP' mode" -ForegroundColor Gray
    Write-Host "   - When prompted, tap 'Allow USB Debugging'" -ForegroundColor Gray
    Write-Host "   - Check 'Always allow from this computer'" -ForegroundColor Gray
    Write-Host "`nWaiting for device... (Press Ctrl+C to cancel)" -ForegroundColor Cyan
    
    # Wait for device
    $maxAttempts = 30
    $attempt = 0
    while ($attempt -lt $maxAttempts) {
        Start-Sleep -Seconds 2
        $devices = adb devices | Select-String -Pattern "device$"
        if ($devices) {
            Write-Host "`n✅ Device detected! Starting app..." -ForegroundColor Green
            $deviceId = ($devices -split "\s+")[0]
            Write-Host "Make sure backend is running on: http://192.168.31.4:8000" -ForegroundColor Yellow
            flutter run
            break
        }
        $attempt++
        Write-Host "." -NoNewline -ForegroundColor Gray
    }
    
    if ($attempt -eq $maxAttempts) {
        Write-Host "`n❌ Timeout: Device not detected after 60 seconds" -ForegroundColor Red
        Write-Host "Please check your USB connection and USB debugging settings" -ForegroundColor Yellow
    }
}










