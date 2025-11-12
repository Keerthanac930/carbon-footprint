@echo off
echo ========================================
echo Quick USB Installation
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] Checking device connection...
flutter devices
echo.

echo [2/3] Building and installing app...
echo This will take a few minutes on first build...
echo.

flutter run -d 10BD960RCE0003P --debug

echo.
echo ========================================
echo Installation complete!
echo ========================================
pause

