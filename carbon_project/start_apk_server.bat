@echo off
echo ========================================
echo Starting APK Download Server (Wi-Fi)
echo ========================================
echo.

cd /d "%~dp0"

REM Check if APK exists
if not exist "flutter\build\app\outputs\flutter-apk\app-release.apk" (
    echo APK not found. Building APK first...
    echo.
    cd flutter
    flutter build apk --release
    cd ..
    echo.
)

REM Check if APK exists now
if not exist "flutter\build\app\outputs\flutter-apk\app-release.apk" (
    echo ERROR: APK still not found. Build may have failed.
    pause
    exit /b 1
)

echo Starting server...
echo.
python serve_apk.py

pause

