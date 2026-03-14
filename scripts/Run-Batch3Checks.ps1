# scripts/Run-Batch3Checks.ps1
# Launcher for Batch 3 exit state verification.
# Run from project root: .\scripts\Run-Batch3Checks.ps1
#
# Uses Node.js to copy the check script to avoid PowerShell UTF-8 BOM corruption.
# Requires: Node.js v24+ installed, terminal in C:\Users\0xm1d\autonomousgovernance

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot

Write-Host ""
Write-Host "UFTAGP Batch 3 Exit State Checks" -ForegroundColor Cyan
Write-Host "Project root: $projectRoot" -ForegroundColor Gray
Write-Host ""

# Confirm Node is available.
try {
    $nodeVersion = node --version
    Write-Host "Node: $nodeVersion" -ForegroundColor Gray
} catch {
    Write-Host "[ERROR] Node.js not found. Install Node.js v24+ and retry." -ForegroundColor Red
    exit 1
}

# Confirm we are in the right directory.
if (-not (Test-Path (Join-Path $projectRoot "package.json"))) {
    Write-Host "[ERROR] package.json not found. Run this script from the project root." -ForegroundColor Red
    exit 1
}

# Run the check script.
$checkScript = Join-Path $projectRoot "scripts\check-batch3.cjs"

if (-not (Test-Path $checkScript)) {
    Write-Host "[ERROR] scripts\check-batch3.cjs not found." -ForegroundColor Red
    Write-Host "        Place check-batch3.cjs in your scripts\ directory first." -ForegroundColor Yellow
    exit 1
}

Write-Host "Running automated checks..." -ForegroundColor Cyan
Write-Host ""

node $checkScript
$exitCode = $LASTEXITCODE

Write-Host ""
if ($exitCode -eq 0) {
    Write-Host "All automated checks passed. Complete the browser checklist above." -ForegroundColor Green
} else {
    Write-Host "Automated checks failed. Resolve failures before browser checks." -ForegroundColor Red
}

exit $exitCode
