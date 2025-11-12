@echo off
REM Test runner script for Windows
echo ========================================
echo Running Carbon Footprint Test Suite
echo ========================================
echo.

REM Check if pytest is installed
python -m pytest --version >nul 2>&1
if errorlevel 1 (
    echo Installing pytest and dependencies...
    pip install pytest pytest-cov pytest-asyncio
)

echo.
echo Running all tests...
python -m pytest tests/ -v --tb=short

echo.
echo ========================================
echo Test run complete!
echo ========================================
pause

