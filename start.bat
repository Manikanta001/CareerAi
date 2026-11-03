@echo off
echo ========================================================
echo Starting CareerAI Services (Backend + Frontend)
echo ========================================================

start "CareerAI Backend" cmd /k "cd /d %~dp0backend && venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000"
start "CareerAI Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo CareerAI is starting up!
echo - Backend API:  http://127.0.0.1:8000
echo - API Docs:     http://127.0.0.1:8000/docs
echo - Frontend App: http://localhost:5173
echo.
echo Both services have opened in separate console windows.
echo Close those windows or press Ctrl+C in them to stop.

