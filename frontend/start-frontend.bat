@echo off
echo Starting Carbon Footprint Frontend...
echo.
echo Make sure you have:
echo 1. Node.js installed
echo 2. Backend API running on http://localhost:9005
echo.
echo Installing dependencies...
call npm install
echo.
echo Starting development server...
call npm start
