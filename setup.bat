@echo off
echo ========================================
echo SpotifyScope Setup Script
echo ========================================
echo.

REM Check if Node.js is installed
echo Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo.

REM Setup Backend
echo ========================================
echo Setting up Backend...
echo ========================================
cd back

echo Installing backend dependencies...
npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo Creating .env file from example...
if not exist .env (
    copy .env.example .env
    echo .env file created. Please edit it with your configuration.
) else (
    echo .env file already exists.
)

echo.
echo Generating Prisma client...
npx prisma generate
if %errorlevel% neq 0 (
    echo Warning: Prisma generate failed. Make sure to configure your database.
)

cd ..

REM Setup Frontend
echo.
echo ========================================
echo Setting up Frontend...
echo ========================================
cd front

echo Installing frontend dependencies...
npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo Creating .env file from example...
if not exist .env (
    copy .env.example .env
    echo .env file created. Please edit it with your configuration.
) else (
    echo .env file already exists.
)

cd ..

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Configure your .env files in both 'back' and 'front' directories
echo 2. Set up PostgreSQL database
echo 3. Set up Redis server
echo 4. Get Spotify API credentials from https://developer.spotify.com/
echo 5. Run 'npx prisma db push' in the back directory to create database tables
echo 6. Use start-dev.bat to start the development environment
echo.
echo For detailed instructions, see README.md
echo.
pause
