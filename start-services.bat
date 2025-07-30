@echo off
echo Starting MySQL and Redis services...
echo.

echo Starting MySQL80 service...
net start MySQL80
if %errorlevel% neq 0 (
    echo Failed to start MySQL80. Please run this script as Administrator.
    pause
    exit /b 1
)

echo.
echo Stopping any existing Redis processes...
taskkill /f /im redis-server.exe 2>nul

echo.
echo Starting Redis server...
start "Redis Server" redis-server

echo.
echo Services started successfully!
echo MySQL: Running
echo Redis: Running on port 6379
echo.
pause