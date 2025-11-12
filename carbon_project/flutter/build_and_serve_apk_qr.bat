@echo off
echo ========================================
echo Building APK and Generating QR Code
echo ========================================
echo.

cd /d "%~dp0"

echo [Step 1/4] Building APK (this may take 5-10 minutes)...
echo Please wait...
echo.

flutter build apk --release

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Build failed!
    pause
    exit /b 1
)

echo.
echo [Step 2/4] APK built successfully!
echo.

echo [Step 3/4] Starting QR code generator and server...
echo.

cd /d "%~dp0\.."

python generate_qr_code.py

if %errorlevel% neq 0 (
    echo.
    echo WARNING: QR code generation failed, but continuing with server...
    echo You can still access the download via browser.
    echo.
)

echo.
echo [Step 4/4] Starting download server...
echo.
echo ========================================
echo Server starting...
echo ========================================
echo.
echo Instructions:
echo 1. A QR code image has been generated (apk_download_qr.png)
echo 2. Open the QR code image on your computer
echo 3. Scan it with your phone's camera
echo 4. Download and install the APK
echo.
echo The server will start in a new window.
echo Press Ctrl+C to stop the server when done.
echo.
echo ========================================
echo.

start "APK Download Server" cmd /k "python serve_apk.py"

timeout /t 3 /nobreak >nul

echo.
echo ✅ Server started! Check the new window for the download URL.
echo.
echo 💡 Tip: The QR code image is in the carbon_project folder.
echo.

pause

