@echo off
echo ========================================
echo Rebuilding Mobile App and Restarting Server
echo ========================================
echo.

cd /d "%~dp0"

echo [Step 1/4] Cleaning Flutter build...
cd flutter
flutter clean
if %errorlevel% neq 0 (
    echo ERROR: Flutter clean failed!
    pause
    exit /b 1
)

echo.
echo [Step 2/4] Getting Flutter dependencies...
flutter pub get
if %errorlevel% neq 0 (
    echo ERROR: Flutter pub get failed!
    pause
    exit /b 1
)

echo.
echo [Step 3/4] Building APK (this may take 5-10 minutes)...
echo Please wait...
flutter build apk --release
if %errorlevel% neq 0 (
    echo ERROR: APK build failed!
    pause
    exit /b 1
)

echo.
echo [Step 4/4] APK built successfully!
echo.

cd /d "%~dp0"

echo Checking and updating QR code...
python check_and_regenerate_qr.py

echo.
echo ========================================
echo ✅ Mobile app rebuilt successfully!
echo ========================================
echo.
echo Next steps:
echo 1. The APK server should already be running
echo 2. If not, run: python serve_apk.py
echo 3. Scan the QR code: apk_download_qr.png
echo 4. Reinstall the app on your phone
echo.
echo ========================================
pause

