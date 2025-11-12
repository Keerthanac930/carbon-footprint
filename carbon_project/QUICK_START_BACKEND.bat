@echo off
chcp 65001 >nul 2>&1
title Carbon Footprint Backend Server
color 0A

echo.
echo ============================================================
echo    CARBON FOOTPRINT - BACKEND SERVER
echo ============================================================
echo.

cd /d "%~dp0carbon_project\backend"

echo [1/3] Checking Python...
python --version
if errorlevel 1 (
    echo ERROR: Python not found!
    pause
    exit /b 1
)
echo.

echo [2/3] Checking dependencies...
python -c "import uvicorn, fastapi" 2>nul
if errorlevel 1 (
    echo WARNING: Some dependencies may be missing
    echo Run: pip install -r requirements.txt
    echo.
)
echo.

echo [3/3] Starting server...
echo.
echo ============================================================
echo    SERVER STARTING ON PORT 8000
echo ============================================================
echo.
echo Access URLs:
echo    API:      http://localhost:8000
echo    Docs:     http://localhost:8000/docs
echo    Ping:     http://localhost:8000/ping
echo    Login:    http://localhost:8000/auth/login
echo.
echo ============================================================
echo    Press CTRL+C to stop the server
echo ============================================================
echo.

python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

echo.
echo.
echo ============================================================
echo    SERVER STOPPED
echo ============================================================
pause

