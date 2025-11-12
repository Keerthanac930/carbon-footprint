@echo off
cls
echo ========================================
echo INSTALLING APP ON YOUR PHONE
echo ========================================
echo.
echo Make sure:
echo 1. Phone is connected via USB
echo 2. USB debugging is enabled
echo 3. You allowed USB debugging on your phone
echo.
echo This will take 10-15 minutes on first build...
echo Please wait and DON'T close this window!
echo.
echo ========================================
echo.

cd /d "%~dp0"

echo Checking device...
flutter devices
echo.

echo Starting build and installation...
echo You will see progress below...
echo.
echo ========================================
echo.

flutter run -d 10BD960RCE0003P

echo.
echo ========================================
echo.
pause

