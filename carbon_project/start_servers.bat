@echo off
echo ============================================================
echo    🚀 Carbon Footprint Application - Starting Servers
echo ============================================================
echo.

REM Kill any existing processes on ports 8000 and 3000
echo 🔄 Checking for existing processes...
netstat -ano | findstr :8000 >nul
if %errorlevel% equ 0 (
    echo ⚠️  Port 8000 is in use. Please close the existing backend server.
)

echo.
echo 📦 Starting Backend Server (Port 8000)...
start "Carbon Footprint - Backend Server" cmd /k "cd /d "%~dp0backend" && echo Starting from: %CD% && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

echo ⏳ Waiting 5 seconds for backend to start...
timeout /t 5 /nobreak >nul

echo.
echo 🌐 Starting Frontend Server (Port 3000)...
start "Carbon Footprint - Frontend Server" cmd /k "cd /d "%~dp0frontend" && echo Starting from: %CD% && npm start"

echo.
echo ============================================================
echo ✅ Both servers are starting!
echo ============================================================
echo.
echo 📋 Access URLs:
echo    Frontend:     http://localhost:3000
echo    Backend API:  http://localhost:8000
echo    API Docs:     http://localhost:8000/docs
echo    Ping Test:    http://localhost:8000/ping
echo.
echo 💡 Tips:
echo    - Wait for both servers to fully start (30-60 seconds)
echo    - Check the separate command windows for status
echo    - Press CTRL+C in each window to stop the servers
echo.
echo ============================================================
pause
