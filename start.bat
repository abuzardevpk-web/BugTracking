@echo off
title BugTracker
echo Starting BugTracker (Backend + Frontend)...
echo.
echo Backend:  http://localhost:8080
echo Frontend: http://localhost:5173
echo.
echo Press Ctrl+C to stop both.
echo.

cd /d "%~dp0"

REM Check if node exists (for concurrently)
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    if not exist "node_modules" (
        echo Installing root dependencies...
        call npm install
    )
    if not exist "bugtracker-frontend\node_modules" (
        echo Installing frontend dependencies...
        cd bugtracker-frontend
        call npm install
        cd ..
    )
    call npm run start
) else (
    echo [ERROR] Node.js not found. Please install Node.js to use the unified startup.
    echo You can also start manually:
    echo   1. Backend:  mvn spring-boot:run
    echo   2. Frontend: cd bugtracker-frontend ^&^& npm run dev
    pause
    exit /b 1
)
