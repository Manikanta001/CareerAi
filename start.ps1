Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Starting CareerAI Services (Backend + Frontend)" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

# Start Backend
$backendDir = Join-Path $PSScriptRoot 'backend'
$frontendDir = Join-Path $PSScriptRoot 'frontend'
$backendPython = Join-Path $backendDir '.venv\Scripts\python.exe'
if (-not (Test-Path $backendPython)) {
    Write-Error 'Backend environment missing. Run .\setup.ps1 first.'
    exit 1
}
Start-Process powershell -ArgumentList '-NoExit', '-Command', "Set-Location -LiteralPath '$backendDir'; & '$backendPython' -m uvicorn app.main:app --reload --port 8000"

# Start Frontend
Start-Process powershell -ArgumentList '-NoExit', '-Command', "Set-Location -LiteralPath '$frontendDir'; npm run dev"

Write-Host ""
Write-Host "CareerAI services launched in separate windows!" -ForegroundColor Green
Write-Host "  * Backend API:  http://127.0.0.1:8000" -ForegroundColor Yellow
Write-Host "  * API Docs:     http://127.0.0.1:8000/docs" -ForegroundColor Yellow
Write-Host "  * Frontend App: http://localhost:5173" -ForegroundColor Yellow
Write-Host ""
Write-Host "To stop the servers, close the respective terminal windows or press Ctrl+C." -ForegroundColor Gray

