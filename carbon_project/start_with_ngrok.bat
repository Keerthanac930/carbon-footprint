@echo off
echo ========================================
echo Starting Backend with Ngrok Tunnel
echo ========================================
echo.

REM Check if ngrok is installed
where ngrok >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Ngrok is not installed!
    echo.
    echo Please install ngrok:
    echo 1. Download from: https://ngrok.com/download
    echo 2. Extract ngrok.exe to a folder in your PATH
    echo    OR extract to this directory: %~dp0
    echo 3. Run this script again
    echo.
    pause
    exit /b 1
)

echo [1/2] Starting backend server...
start "Backend Server" cmd /k "cd /d %~dp0backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

REM Wait a bit for backend to start
timeout /t 3 /nobreak >nul

echo [2/2] Starting ngrok tunnel...
echo.
echo ========================================
echo IMPORTANT: Copy the Forwarding URL below
echo Example: https://abc123.ngrok.io
echo ========================================
echo.
echo Update your Flutter app config:
echo carbon_project\flutter\assets\config\server_config.json
echo.
echo Change apiBaseUrl to the ngrok URL above
echo.
echo ========================================
echo.

ngrok http 8000

pause

