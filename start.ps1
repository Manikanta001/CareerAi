Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Starting CareerAI Services (Backend + Frontend)" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

# Start Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot\backend'; & '.\venv\Scripts\python.exe' -m uvicorn app.main:app --reload --port 8000"

# Start Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot\frontend'; npm run dev"

Write-Host ""
Write-Host "CareerAI services launched in separate windows!" -ForegroundColor Green
Write-Host "  * Backend API:  http://127.0.0.1:8000" -ForegroundColor Yellow
Write-Host "  * API Docs:     http://127.0.0.1:8000/docs" -ForegroundColor Yellow
Write-Host "  * Frontend App: http://localhost:5173" -ForegroundColor Yellow
Write-Host ""
Write-Host "To stop the servers, close the respective terminal windows or press Ctrl+C." -ForegroundColor Gray

