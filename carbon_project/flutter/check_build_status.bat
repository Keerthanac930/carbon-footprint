@echo off
echo ========================================
echo Build Status Checker
echo ========================================
echo.

cd /d "%~dp0"

echo Checking for built APK files...
echo.

if exist "build\app\outputs\flutter-apk\app-debug.apk" (
    echo [OK] Debug APK found!
    dir "build\app\outputs\flutter-apk\app-debug.apk"
    echo.
    echo To install, run:
    echo   flutter install -d 10BD960RCE0003P
    echo.
) else (
    echo [WAITING] Debug APK not found yet...
    echo Build is still in progress...
    echo.
)

if exist "build\app\outputs\flutter-apk\app-release.apk" (
    echo [OK] Release APK found!
    dir "build\app\outputs\flutter-apk\app-release.apk"
    echo.
) else (
    echo [WAITING] Release APK not found yet...
    echo.
)

echo Checking device connection...
flutter devices
echo.

echo ========================================
echo Tips:
echo - First build takes 10-15 minutes
echo - Keep your phone connected
echo - Don't close the build window
echo - Watch for errors in the terminal
echo ========================================
echo.

pause

