@echo off
REM Test runner with coverage report for Windows
echo ========================================
echo Running Tests with Coverage Report
echo ========================================
echo.

REM Check if pytest is installed
python -m pytest --version >nul 2>&1
if errorlevel 1 (
    echo Installing pytest and dependencies...
    pip install pytest pytest-cov pytest-asyncio
)

echo.
echo Running tests with coverage...
python -m pytest tests/ -v --cov=app --cov-report=html --cov-report=term --tb=short

echo.
echo Coverage report generated in htmlcov/index.html
echo.
echo ========================================
echo Test run complete!
echo ========================================
pause

