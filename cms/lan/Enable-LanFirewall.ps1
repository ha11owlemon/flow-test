param(
    [ValidatePattern('^\d{1,3}(\.\d{1,3}){3}$')]
    [string]$LanHost = '192.168.0.171',
    [ValidateRange(1024, 65535)]
    [int]$Port = 8443,
    [ValidatePattern('^\d{1,3}(\.\d{1,3}){3}/\d{1,2}$')]
    [string]$RemoteSubnet = '192.168.0.0/24'
)

$ErrorActionPreference = 'Stop'
$identity = [Security.Principal.WindowsIdentity]::GetCurrent()
$principal = New-Object Security.Principal.WindowsPrincipal($identity)
if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    throw 'Run this script from an administrator PowerShell window.'
}
$ruleName = "FlowTest-Caddy-LAN-$Port"
$rule = Get-NetFirewallRule -Name $ruleName -ErrorAction SilentlyContinue
if ($rule) {
    $rule | Set-NetFirewallRule -Enabled True -Direction Inbound -Action Allow -Profile Private,Domain
    $rule | Get-NetFirewallPortFilter | Set-NetFirewallPortFilter -Protocol TCP -LocalPort $Port
    $rule | Get-NetFirewallAddressFilter | Set-NetFirewallAddressFilter -LocalAddress $LanHost -RemoteAddress $RemoteSubnet
} else {
    New-NetFirewallRule -Name $ruleName -DisplayName 'FlowTest Caddy HTTPS LAN' -Direction Inbound -Action Allow `
        -Protocol TCP -LocalAddress $LanHost -LocalPort $Port -RemoteAddress $RemoteSubnet -Profile Private,Domain | Out-Null
}
$projectRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../..'))
$runtimeRoot = Join-Path $projectRoot '.local-services/lan'
New-Item -ItemType Directory -Force -Path $runtimeRoot | Out-Null
@{rule=$ruleName; localAddress=$LanHost; port=$Port; remoteSubnet=$RemoteSubnet; configuredAt=[DateTime]::UtcNow.ToString('o')} |
    ConvertTo-Json | Set-Content -LiteralPath (Join-Path $runtimeRoot 'firewall.json') -Encoding UTF8
Write-Output "LAN firewall rule configured: $LanHost TCP $Port, clients $RemoteSubnet."
