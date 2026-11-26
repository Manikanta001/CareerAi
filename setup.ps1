$ErrorActionPreference = 'Stop'
$repoRoot = $PSScriptRoot
$backendDir = Join-Path $repoRoot 'backend'
$frontendDir = Join-Path $repoRoot 'frontend'
$python = Get-Command py -ErrorAction SilentlyContinue
if (-not $python) { $python = Get-Command python -ErrorAction SilentlyContinue }
if (-not $python) { throw 'Python 3.11+ is required. Install Python and rerun setup.ps1.' }
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) { throw 'Node.js 20+ and npm are required. Install them and rerun setup.ps1.' }

$venvPython = Join-Path $backendDir '.venv\Scripts\python.exe'
if (-not (Test-Path $venvPython)) {
    Push-Location $backendDir
    try {
        if ($python.Name -eq 'py.exe') { & $python.Source -3 -m venv .venv }
        else { & $python.Source -m venv .venv }
    } finally { Pop-Location }
}
if (-not (Test-Path $venvPython)) { throw 'Python environment was not created. Check your Python installation.' }
& $venvPython -m pip install --upgrade pip
if ($LASTEXITCODE -ne 0) { throw 'Could not upgrade pip in the backend environment.' }
& $venvPython -m pip install -r (Join-Path $backendDir 'requirements.txt')
if ($LASTEXITCODE -ne 0) { throw 'Backend dependency installation failed.' }
& npm --prefix $frontendDir ci
if ($LASTEXITCODE -ne 0) { throw 'Frontend dependency installation failed.' }

Write-Host 'Dependencies are ready.' -ForegroundColor Green
if (-not (Test-Path (Join-Path $backendDir '.env'))) {
    Write-Host 'Copy backend/.env.example to backend/.env and set MONGODB_URI and a unique JWT_SECRET.' -ForegroundColor Yellow
}
Write-Host 'Make sure MongoDB is running, then use .\start.ps1 to launch CareerAI.' -ForegroundColor Cyan
