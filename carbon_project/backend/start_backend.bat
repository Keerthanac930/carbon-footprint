@echo off
cd /d "%~dp0"
echo ========================================
echo   Carbon Footprint Backend Server
echo ========================================
echo.
echo Current directory: %CD%
echo Starting backend server on port 8000...
echo.

python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

if errorlevel 1 (
    echo.
    echo ERROR: Failed to start backend server
    echo Please ensure you are in the backend directory
    pause
)

