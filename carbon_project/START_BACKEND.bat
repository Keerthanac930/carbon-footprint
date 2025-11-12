@echo off
echo ============================================================
echo    Starting Carbon Footprint Backend Server
echo ============================================================
echo.

cd /d "%~dp0carbon_project\backend"

echo Checking Python installation...
python --version
echo.

echo Starting backend server on port 8000...
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

pause

