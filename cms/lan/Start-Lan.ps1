param(
    [ValidatePattern('^[A-Za-z0-9.-]+$')]
    [string]$LanHost = '192.168.0.171',
    [ValidateRange(1024, 65535)]
    [int]$Port = 8443
)

$ErrorActionPreference = 'Stop'
$projectRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../..'))
$cmsRoot = Join-Path $projectRoot 'cms'
$authRoot = Join-Path $projectRoot '.local-services/sveltia-cms-auth'
$caddyRoot = Join-Path $projectRoot '.local-services/caddy'
$runtimeRoot = Join-Path $projectRoot '.local-services/lan'
$stateFile = Join-Path $runtimeRoot 'processes.json'
$nodeExe = (Get-Command node.exe).Source
$caddyExe = Join-Path $caddyRoot 'caddy.exe'
$wranglerScript = Join-Path $authRoot 'node_modules/wrangler/bin/wrangler.js'
$devVars = Join-Path $authRoot '.dev.vars'

foreach ($required in @($caddyExe, $wranglerScript, $devVars, (Join-Path $projectRoot 'build/index.html'), (Join-Path $projectRoot 'build/en/index.html'))) {
    if (-not (Test-Path -LiteralPath $required)) { throw "Missing prerequisite: $required" }
}
New-Item -ItemType Directory -Force -Path $runtimeRoot | Out-Null
if (Test-Path -LiteralPath $stateFile) {
    $recorded = Get-Content -LiteralPath $stateFile -Raw | ConvertFrom-Json
    foreach ($record in $recorded) {
        $running = Get-Process -Id $record.pid -ErrorAction SilentlyContinue
        if ($running -and $running.StartTime.ToUniversalTime().Ticks.ToString() -eq $record.startTimeTicks) {
            throw 'LAN services are already running. Use Stop-Lan.ps1 before restarting.'
        }
    }
}

function Test-LocalPort([int]$ServicePort) {
    $client = New-Object Net.Sockets.TcpClient
    try { $client.Connect('127.0.0.1', $ServicePort); return $true }
    catch { return $false }
    finally { $client.Dispose() }
}
foreach ($servicePort in @(3004, 3005, 8787, 2019, $Port)) {
    if (Test-LocalPort $servicePort) { throw "Port $servicePort is occupied. Stop its existing service before starting this stack." }
}

# Preserve the credentials; only add the exact LAN hostname to the allowlist.
$variables = Get-Content -LiteralPath $devVars -Raw
foreach ($credential in @('GITHUB_CLIENT_ID', 'GITHUB_CLIENT_SECRET')) {
    if ($variables -notmatch "(?m)^$credential=.+$") { throw "Missing OAuth credential: $credential" }
}
$allowlist = @('127.0.0.1', $LanHost) -join ','
if ($variables -match '(?m)^ALLOWED_DOMAINS=.*$') {
    $variables = [regex]::Replace($variables, '(?m)^ALLOWED_DOMAINS=.*$', "ALLOWED_DOMAINS=$allowlist")
} else { $variables = $variables.TrimEnd() + "`nALLOWED_DOMAINS=$allowlist`n" }
[IO.File]::WriteAllText($devVars, $variables, (New-Object Text.UTF8Encoding($false)))

$env:CMS_AUTH_URL = "https://${LanHost}:$Port"
$env:CMS_LAN_HOST = $LanHost
$env:CMS_LAN_PORT = $Port.ToString()
$env:CADDY_DATA_DIR = (Join-Path $caddyRoot 'data').Replace('\', '/')
& $nodeExe (Join-Path $cmsRoot 'scripts/build.mjs')
if ($LASTEXITCODE -ne 0) { throw 'CMS build failed.' }
& $caddyExe validate --config (Join-Path $PSScriptRoot 'Caddyfile') --adapter caddyfile
if ($LASTEXITCODE -ne 0) { throw 'Caddy configuration validation failed.' }

$services = New-Object Collections.Generic.List[object]
function Start-LanService($Name, $Executable, $Arguments, $Directory, $ServicePort) {
    $process = Start-Process -FilePath $Executable -ArgumentList $Arguments -WorkingDirectory $Directory -WindowStyle Hidden -PassThru `
        -RedirectStandardOutput (Join-Path $runtimeRoot "$Name.log") -RedirectStandardError (Join-Path $runtimeRoot "$Name.err.log")
    $services.Add(@{name=$Name; pid=$process.Id; startTimeTicks=$process.StartTime.ToUniversalTime().Ticks.ToString(); executable=$Executable})
    ConvertTo-Json -InputObject $services.ToArray() | Set-Content -LiteralPath $stateFile -Encoding UTF8
    for ($attempt = 0; $attempt -lt 60; $attempt++) {
        if ($process.HasExited) { throw "$Name exited. Inspect $runtimeRoot/$Name.err.log." }
        if (Test-LocalPort $ServicePort) { return }
        Start-Sleep -Milliseconds 250
    }
    throw "$Name did not start within 15 seconds. Inspect its logs under $runtimeRoot."
}

try {
    Start-LanService 'cms' $nodeExe @(('"' + (Join-Path $cmsRoot 'scripts/serve.mjs') + '"')) $cmsRoot 3004
    Start-LanService 'docs' $nodeExe @(('"' + (Join-Path $projectRoot 'node_modules/@docusaurus/core/bin/docusaurus.mjs') + '"'), 'serve', '--host', '127.0.0.1', '--port', '3005', '--no-open') $projectRoot 3005
    Start-LanService 'auth' $nodeExe @(('"' + $wranglerScript + '"'), 'dev', '--local', '--ip', '127.0.0.1', '--port', '8787', '--local-protocol', 'http', '--show-interactive-dev-session=false') $authRoot 8787
    Start-LanService 'caddy' $caddyExe @('run', '--config', ('"' + (Join-Path $PSScriptRoot 'Caddyfile') + '"'), '--adapter', 'caddyfile') $projectRoot $Port
    $publicCertificate = Join-Path $runtimeRoot 'caddy-root.crt'
    Copy-Item -LiteralPath (Join-Path $caddyRoot 'data/pki/authorities/local/root.crt') -Destination $publicCertificate -Force
    Write-Output "CMS: $env:CMS_AUTH_URL/"
    Write-Output "Docs: $env:CMS_AUTH_URL/flow-test/"
    Write-Output "English docs: $env:CMS_AUTH_URL/flow-test/en/"
    Write-Output "Public root certificate for client trust: $publicCertificate"
} catch {
    & (Join-Path $PSScriptRoot 'Stop-Lan.ps1')
    throw
}
