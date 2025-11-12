@echo off
echo ========================================
echo USB Installation - Carbon Footprint App
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] Checking for connected devices...
echo.
flutter devices
echo.

echo [2/3] Checking if APK exists...
if not exist "build\app\outputs\flutter-apk\app-release.apk" (
    echo APK not found. Building APK first...
    echo This will take a few minutes...
    echo.
    flutter build apk --release
    echo.
)

if not exist "build\app\outputs\flutter-apk\app-release.apk" (
    echo ERROR: APK still not found. Build may have failed.
    pause
    exit /b 1
)

echo APK found!
echo.

echo [3/3] Installing to connected device...
echo.
flutter install
echo.

if %ERRORLEVEL% EQU 0 (
    echo ========================================
    echo Installation successful!
    echo ========================================
    echo.
    echo The app is now installed on your phone.
    echo You can open it from your app drawer.
    echo.
) else (
    echo ========================================
    echo Installation failed!
    echo ========================================
    echo.
    echo Troubleshooting:
    echo 1. Make sure your phone is connected via USB
    echo 2. Enable USB debugging on your phone
    echo 3. Allow USB debugging when prompted on phone
    echo 4. Check connection: flutter devices
    echo.
)

pause

