<#
.SYNOPSIS
Install or uninstall YuzuFox on Windows — system-wide settings + per-profile user.js.

.DESCRIPTION
System-wide (requires Administrator):
  policies.json  -> %ProgramFiles%\Mozilla Firefox\distribution\policies.json
  yuzu.js        -> %ProgramFiles%\Mozilla Firefox\browser\defaults\preferences\yuzu.js

Per-profile (Firefox must not be running):
  user.js        -> picked profiles under %APPDATA%\Mozilla\Firefox\Profiles\

.PARAMETER DryRun
Preview paths and profiles, write nothing.

.PARAMETER Uninstall
Remove settings instead of installing.

.PARAMETER SystemOnly
System-wide yuzu.js + policies.json only (skip per-profile user.js).

.PARAMETER ProfilesOnly
Per-profile user.js only (no Administrator needed).

.PARAMETER All
Install user.js into every profile without asking (non-interactive).

.EXAMPLE
irm https://raw.githubusercontent.com/KabosuNeko/YuzuFox/main/install.ps1 -OutFile install.ps1
.\install.ps1

.EXAMPLE
.\install.ps1 -DryRun

.EXAMPLE
.\install.ps1 -Uninstall

.EXAMPLE
.\install.ps1 -ProfilesOnly
#>
param(
    [switch]$DryRun,
    [switch]$Uninstall,
    [switch]$SystemOnly,
    [switch]$ProfilesOnly,
    [switch]$All
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$RepoUrl      = "https://raw.githubusercontent.com/KabosuNeko/YuzuFox/main"
$PoliciesUrl  = "$RepoUrl/policies.json"
$PrefsUrl     = "$RepoUrl/yuzu.js"
$UserJsUrl    = "$RepoUrl/user.js"

function Say     { Write-Host ":: $args" }
function SayNote { Write-Host "    $args" }

# --- Mode ---------------------------------------------------------------
if ($SystemOnly)    { $Mode = "system" }
elseif ($ProfilesOnly) { $Mode = "profiles" }
else                { $Mode = "all" }

# --- Helpers ------------------------------------------------------------
function Find-FirefoxDir {
    $candidates = @(
        "${env:ProgramFiles}\Mozilla Firefox",
        "${env:ProgramFiles(x86)}\Mozilla Firefox",
        "${env:LOCALAPPDATA}\Mozilla Firefox"
    )
    foreach ($d in $candidates) {
        if (Test-Path "$d\firefox.exe") { return $d }
        if (Test-Path "$d\distribution\policies.json") { return $d }
    }
    return ""
}

function Check-Elevated {
    $identity = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = [Security.Principal.WindowsPrincipal]$identity
    $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

# ==========================================================================
#   SYSTEM-WIDE
# ==========================================================================
if ($Mode -ne "profiles") {
    if (-not (Check-Elevated)) {
        Write-Host "!!! Error: Administrator rights required for system-wide." -ForegroundColor Red
        Write-Host "    Use -ProfilesOnly for per-profile only, or re-run elevated." -ForegroundColor Red
        return
    }
    $FirefoxDir = Find-FirefoxDir
    if (-not $FirefoxDir) {
        Write-Host "!!! Error: Firefox not found (default location). Install it first." -ForegroundColor Red
        return
    }
    $PoliciesDest = Join-Path $FirefoxDir "distribution\policies.json"
    $PrefsDest    = Join-Path $FirefoxDir "browser\defaults\preferences\yuzu.js"

    Say "YuzuFox [Windows]  —  Firefox: $FirefoxDir"

    if ($DryRun) {
        Say "[DRY-RUN] Would install:"
        SayNote "$PoliciesDest"
        SayNote "$PrefsDest"
    }
    elseif ($Uninstall) {
        Say "Uninstall system settings — this will remove:"
        SayNote "$PoliciesDest"
        SayNote "$PrefsDest"
        $c = Read-Host "    Continue? [y/N]"
        if ($c -notmatch '^[yY]') { Say "Aborted."; return }
        Remove-Item -Force -ErrorAction SilentlyContinue $PoliciesDest
        Remove-Item -Force -ErrorAction SilentlyContinue $PrefsDest
        SayNote "System-wide settings removed."
    }
    else {
        $tmp = Join-Path $env:TEMP "yuzufox-sys"
        New-Item -ItemType Directory -Force -Path $tmp | Out-Null
        try {
            Say "Downloading system configuration..."
            Invoke-WebRequest -Uri $PoliciesUrl -OutFile "$tmp\policies.json" -UseBasicParsing
            Invoke-WebRequest -Uri $PrefsUrl    -OutFile "$tmp\yuzu.js"     -UseBasicParsing

            Say "Installing system-wide (requires Administrator)..."
            New-Item -ItemType Directory -Force -Path (Split-Path -Parent $PoliciesDest) | Out-Null
            Copy-Item -Force "$tmp\policies.json" $PoliciesDest
            New-Item -ItemType Directory -Force -Path (Split-Path -Parent $PrefsDest) | Out-Null
            Copy-Item -Force "$tmp\yuzu.js" $PrefsDest
            SayNote "System settings installed. DNS is left to the system resolver."
        }
        finally { Remove-Item -Recurse -Force $tmp -ErrorAction SilentlyContinue }
    }
}

# ==========================================================================
#   PER-PROFILE  user.js
# ==========================================================================
if ($Mode -ne "system") {
    # Firefox must be closed when we're about to write into profile folders.
    if (-not $DryRun) {
        if (Get-Process firefox -ErrorAction SilentlyContinue) {
            Write-Host "!!! Error: Firefox is running. Please close it first." -ForegroundColor Red
            return
        }
    }

    $profilesIni = "$env:APPDATA\Mozilla\Firefox\profiles.ini"
    if (-not (Test-Path $profilesIni)) {
        if ($Mode -eq "profiles") {
            Write-Host "!!! Error: No profiles.ini at $profilesIni" -ForegroundColor Red
            return
        }
        SayNote "[!] No Firefox profiles found — skipping per-profile user.js."
        if (-not ($DryRun -or $Uninstall)) { return }
    }
    else {
        $profilesDir = Split-Path -Parent $profilesIni
        $Profiles = [System.Collections.Generic.List[PSObject]]::new()
        $inProfile = $false; $pName = ""; $pPath = ""; $pRel = $true

        foreach ($line in Get-Content $profilesIni) {
            $t = $line.Trim()
            if ($t -match '^\[Profile') {
                if ($pName -and $pPath) {
                    if ($pRel) { $pPath = Join-Path $profilesDir $pPath }
                    $Profiles.Add([PSCustomObject]@{Name=$pName; Path=$pPath})
                }
                $pName = ""; $pPath = ""; $pRel = $true
            }
            elseif ($t -match '^Name=(.+)$')       { $pName = $Matches[1] }
            elseif ($t -match '^Path=(.+)$')       { $pPath = $Matches[1] }
            elseif ($t -match '^IsRelative=(.+)$') { $pRel = ($Matches[1] -eq '1') }
        }
        if ($pName -and $pPath) {
            if ($pRel) { $pPath = Join-Path $profilesDir $pPath }
            $Profiles.Add([PSCustomObject]@{Name=$pName; Path=$pPath})
        }

        if ($Profiles.Count -eq 0) {
            if ($Mode -eq "profiles") {
                Write-Host "!!! Error: No profiles found in $profilesIni" -ForegroundColor Red
                return
            }
            SayNote "[!] No Firefox profiles found — skipping per-profile user.js."
            return
        }

        # --- Selection ---------------------------------------------------
        $Selected = @()
        if ($DryRun) {
            Say "[DRY-RUN] Would install user.js to:"
            for ($i = 0; $i -lt $Profiles.Count; $i++) {
                $p = $Profiles[$i]
                $ex = if (Test-Path (Join-Path $p.Path "user.js")) { " [backup -> user.js.yuzubak]" } else { "" }
                SayNote "[$($i+1)] $($p.Name)  ($($p.Path))$ex"
            }
            Say "Done."; return
        }

        if ($All) {
            for ($i = 0; $i -lt $Profiles.Count; $i++) { $Selected += $i }
        }
        else {
            Say "Available profiles:"
            for ($i = 0; $i -lt $Profiles.Count; $i++) {
                $p = $Profiles[$i]
                $ex = if ($Uninstall -and (Test-Path (Join-Path $p.Path "user.js"))) { " [has user.js]" }
                      elseif (-not $Uninstall -and (Test-Path (Join-Path $p.Path "user.js"))) { " [backup -> user.js.yuzubak]" }
                      else { "" }
                SayNote "[$($i+1)] $($p.Name)  ($($p.Path))$ex"
            }
            ""
            $sel = Read-Host "    Select profile numbers (space separated, or 'all')"
            if (-not $sel) { Say "No selection — skipping."; return }
            if ($sel -eq "all") {
                for ($i = 0; $i -lt $Profiles.Count; $i++) { $Selected += $i }
            }
            else {
                foreach ($n in ($sel -split '\s+')) {
                    if ($n -match '^\d+$' -and [int]$n -ge 1 -and [int]$n -le $Profiles.Count) {
                        $Selected += ([int]$n - 1)
                    }
                    else { Write-Host "!!! Error: Invalid: $n" -ForegroundColor Red; return }
                }
            }
        }

        # --- Act ---------------------------------------------------------
        if ($Uninstall) {
            foreach ($i in $Selected) {
                $f = Join-Path $Profiles[$i].Path "user.js"
                if (Test-Path $f) { Remove-Item -Force $f; SayNote "[+] Removed $f" }
                else               { SayNote "[~] No user.js in $($Profiles[$i].Path)" }
            }
            Say "Done. Restart Firefox to apply."
        }
        else {
            $tmp = Join-Path $env:TEMP "yuzufox-usr"
            New-Item -ItemType Directory -Force -Path $tmp | Out-Null
            try {
                Say "Downloading user.js..."
                Invoke-WebRequest -Uri $UserJsUrl -OutFile "$tmp\user.js" -UseBasicParsing

                foreach ($i in $Selected) {
                    $p = $Profiles[$i]
                    if (-not (Test-Path $p.Path)) {
                        SayNote "[!] Skipped missing profile $($p.Name) ($($p.Path))"; continue
                    }
                    $dest = Join-Path $p.Path "user.js"
                    if (Test-Path $dest) {
                        Copy-Item -Force $dest "$dest.yuzubak"
                        SayNote "[~] Backup: user.js.yuzubak"
                    }
                    Copy-Item -Force "$tmp\user.js" $dest
                    SayNote "[+] Installed $($p.Name) ($dest)"
                }
                Say "user.js installed to selected profiles. Restart Firefox to apply."
            }
            finally { Remove-Item -Recurse -Force $tmp -ErrorAction SilentlyContinue }
        }
    }
}

if ($DryRun) { return }
Say "Done. Restart Firefox to apply."