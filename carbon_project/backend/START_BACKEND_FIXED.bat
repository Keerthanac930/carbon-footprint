@echo off
chcp 65001 >nul
echo ============================================================
echo    Starting Carbon Footprint Backend Server
echo ============================================================
echo.

cd /d "%~dp0"

echo Checking if port 8000 is available...
netstat -ano | findstr :8000 >nul
if %errorlevel% equ 0 (
    echo WARNING: Port 8000 is already in use!
    echo.
    echo Please close the existing process or use a different port.
    echo.
    echo To find what's using port 8000, run:
    echo   netstat -ano ^| findstr :8000
    echo.
    pause
    exit /b 1
)

echo Port 8000 is available.
echo.

echo Starting backend server...
echo.
echo The server will be accessible at:
echo    - API: http://localhost:8000
echo    - Docs: http://localhost:8000/docs
echo    - Ping: http://localhost:8000/ping
echo.
echo Press CTRL+C to stop the server
echo ============================================================
echo.

python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

if errorlevel 1 (
    echo.
    echo ============================================================
    echo ERROR: Failed to start server
    echo ============================================================
    echo.
    echo Common issues:
    echo 1. Python dependencies not installed
    echo    Run: pip install -r requirements.txt
    echo.
    echo 2. Database connection failed
    echo    Check MySQL is running and database settings are correct
    echo.
    echo 3. Port 8000 already in use
    echo    Close the process using port 8000 or change the port
    echo.
    pause
)

