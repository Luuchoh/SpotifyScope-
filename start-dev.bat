@echo off
echo Starting SpotifyScope Development Environment...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Start Redis (assuming it's installed and in PATH)
echo Starting Redis server...
start "Redis Server" redis-server

REM Wait a moment for Redis to start
timeout /t 3 /nobreak >nul

REM Start Backend
echo Starting Backend server...
start "SpotifyScope Backend" cmd /k "cd back && npm run dev"

REM Wait a moment for backend to start
timeout /t 5 /nobreak >nul

REM Start Frontend
echo Starting Frontend application...
start "SpotifyScope Frontend" cmd /k "cd front && npm start"

echo.
echo ========================================
echo SpotifyScope Development Environment Started!
echo ========================================
echo.
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
echo.
echo Press any key to close this window...
pause >nul
