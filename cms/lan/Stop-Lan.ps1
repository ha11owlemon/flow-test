$ErrorActionPreference = 'Stop'
$projectRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../..'))
$stateFile = Join-Path $projectRoot '.local-services/lan/processes.json'
if (-not (Test-Path -LiteralPath $stateFile)) { Write-Output 'No recorded LAN services.'; return }
$services = @(Get-Content -LiteralPath $stateFile -Raw | ConvertFrom-Json)
[array]::Reverse($services)
foreach ($record in $services) {
    $process = Get-Process -Id $record.pid -ErrorAction SilentlyContinue
    if ($process -and $process.StartTime.ToUniversalTime().Ticks.ToString() -eq $record.startTimeTicks -and $process.Path -eq $record.executable) {
        # Stop only the recorded service and its child processes (Wrangler/workerd).
        & taskkill.exe /PID $record.pid /T /F | Out-Null
    }
}
Remove-Item -LiteralPath $stateFile
Write-Output 'Recorded LAN services stopped.'
