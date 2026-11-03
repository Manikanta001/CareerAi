$ErrorActionPreference = 'Stop'

if (Get-Process -Name mongod -ErrorAction SilentlyContinue) {
    Write-Host 'A MongoDB process is already running. Confirm it listens on 127.0.0.1:27017.'
    return
}

$mongoRoot = 'C:\Program Files\MongoDB\Server'
$mongoExe = Get-ChildItem $mongoRoot -Directory -ErrorAction SilentlyContinue |
    Where-Object { Test-Path (Join-Path $_.FullName 'bin\mongod.exe') } |
    Sort-Object { try { [version]$_.Name } catch { [version]'0.0' } } -Descending |
    Select-Object -First 1 -ExpandProperty FullName

if (-not $mongoExe) {
    throw 'MongoDB Server was not found. Install MongoDB Community Server or start the mongodb service with Docker Compose.'
}

$dataDir = Join-Path $PSScriptRoot 'data\mongodb'
$logPath = Join-Path $PSScriptRoot 'data\mongod.log'
New-Item -ItemType Directory -Path $dataDir -Force | Out-Null

$mongoProcess = Start-Process `
    -FilePath (Join-Path $mongoExe 'bin\mongod.exe') `
    -ArgumentList @('--dbpath', $dataDir, '--logpath', $logPath, '--bind_ip', '127.0.0.1', '--port', '27017') `
    -WindowStyle Hidden `
    -PassThru

for ($attempt = 0; $attempt -lt 20; $attempt++) {
    Start-Sleep -Milliseconds 500
    $mongoProcess.Refresh()
    if ($mongoProcess.HasExited) {
        $tail = if (Test-Path $logPath) { Get-Content $logPath -Tail 12 | Out-String } else { '' }
        throw "MongoDB exited during startup. $tail"
    }

    if (Test-Path $logPath) {
        $ready = Select-String -Path $logPath -Pattern '"msg":"Waiting for connections"' -Quiet
        if ($ready) {
            Write-Host "MongoDB is ready on 127.0.0.1:27017 (PID $($mongoProcess.Id))."
            Write-Host "Local database files: $dataDir"
            return
        }
    }
}

throw "MongoDB did not become ready. Check $logPath"
