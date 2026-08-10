<#
.SYNOPSIS
YuzuFox prefsCleaner — reset stale prefs left in prefs.js (Windows).

.DESCRIPTION
When YuzuFox removes a pref from user.js (deprecated, renamed, or no longer
wanted), the old value can stay active in <profile>\prefs.js forever. This
script deletes those lines so Firefox falls back to its built-in defaults.

Backs up each prefs.js to prefs.js.yuzubak before touching it.
Run with Firefox closed.

.PARAMETER DryRun
Show which stale prefs would be reset, write nothing.

.PARAMETER All
Clean every profile listed in profiles.ini.

.PARAMETER Profile
Clean only the profile at this exact path (repeatable not supported; pass
once). If omitted and -All is not set, cleans the first existing profile.

.EXAMPLE
.\prefsCleaner.ps1 -DryRun
.\prefsCleaner.ps1 -All
.\prefsCleaner.ps1 -Profile "$env:APPDATA\Mozilla\Firefox\Profiles\abc.default"
#>
param(
    [switch]$DryRun,
    [switch]$All,
    [string]$Profile
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Say     { Write-Host ":: $args" }
function SayNote { Write-Host "    $args" }

# --- Prefs removed from YuzuFox user.js --------------------------------------
# Safe Browsing was disabled wholesale before 2026-08-10; core is now
# re-enabled and these lines would keep it off if left in prefs.js.
$RemovedPrefs = @(
    'browser.safebrowsing.allowOverride'
    'browser.safebrowsing.blockedURIs.enabled'
    'browser.safebrowsing.downloads.enabled'
    'browser.safebrowsing.downloads.remote.block_dangerous'
    'browser.safebrowsing.downloads.remote.block_dangerous_host'
    'browser.safebrowsing.downloads.remote.block_potentially_unwanted'
    'browser.safebrowsing.downloads.remote.block_uncommon'
    'browser.safebrowsing.downloads.remote.remote.url'
    'browser.safebrowsing.id'
    'browser.safebrowsing.malware.enabled'
    'browser.safebrowsing.phishing.enabled'
    'browser.safebrowsing.provider.google.advisoryURL'
    'browser.safebrowsing.provider.google.gethashURL'
    'browser.safebrowsing.provider.google.lists'
    'browser.safebrowsing.provider.google.malwareReportURL'
    'browser.safebrowsing.provider.google.pver'
    'browser.safebrowsing.provider.google.reportMalwareMistakeURL'
    'browser.safebrowsing.provider.google.reportPhishMistakeURL'
    'browser.safebrowsing.provider.google.reportURL'
    'browser.safebrowsing.provider.google.updateURL'
    'browser.safebrowsing.provider.google4.advisoryURL'
    'browser.safebrowsing.provider.google4.dataSharing.enabled'
    'browser.safebrowsing.provider.google4.gethashURL'
    'browser.safebrowsing.provider.google4.lists'
    'browser.safebrowsing.provider.google4.pver'
    'browser.safebrowsing.provider.google4.reportMalwareMistakeURL'
    'browser.safebrowsing.provider.google4.reportPhishMistakeURL'
    'browser.safebrowsing.provider.google4.reportURL'
    'browser.safebrowsing.provider.google4.updateURL'
    'browser.safebrowsing.provider.mozilla.gethashURL'
    'browser.safebrowsing.provider.mozilla.lists'
    'browser.safebrowsing.provider.mozilla.lists.base'
    'browser.safebrowsing.provider.mozilla.lists.content'
    'browser.safebrowsing.provider.mozilla.pver'
    'browser.safebrowsing.provider.mozilla.reportURL'
    'browser.safebrowsing.provider.mozilla.updateURL'
    'browser.safebrowsing.reportPhishURL'
    # Redundant prefs at Firefox defaults, removed 2026-08-09.
    'browser.search.suggest.enabled'
    'browser.search.separatePrivateDefault'
    'browser.urlbar.quicksuggest.enabled'
    'browser.urlbar.suggest.searches'
    'browser.urlbar.suggest.quicksuggest.nonsponsored'
    'browser.urlbar.suggest.quicksuggest.sponsored'
    'browser.urlbar.amp.featureGate'
    'browser.urlbar.wikipedia.featureGate'
    'dom.push.enabled'
    'javascript.options.ion.threshold'
    'network.http.referer.spoofSource'
    'privacy.fingerprintingProtection.pbmode'
    'security.pki.crlite_mode'
    'security.remote_settings.crlite_filters.enabled'
)

# --- Locate profiles ---------------------------------------------------------
function Get-Profiles {
    $profilesIni = "$env:APPDATA\Mozilla\Firefox\profiles.ini"
    if (-not (Test-Path $profilesIni)) { return @() }
    $profilesDir = Split-Path -Parent $profilesIni
    $result = [System.Collections.Generic.List[string]]::new()
    $pName = ""; $pPath = ""; $pRel = $true

    foreach ($line in Get-Content $profilesIni) {
        $t = $line.Trim()
        if ($t -match '^\[Profile') {
            if ($pName -and $pPath) {
                if ($pRel) { $pPath = Join-Path $profilesDir $pPath }
                $result.Add($pPath)
            }
            $pName = ""; $pPath = ""; $pRel = $true
        }
        elseif ($t -match '^Name=(.+)$')       { $pName = $Matches[1] }
        elseif ($t -match '^Path=(.+)$')       { $pPath = $Matches[1] }
        elseif ($t -match '^IsRelative=(.+)$') { $pRel = ($Matches[1] -eq '1') }
    }
    if ($pName -and $pPath) {
        if ($pRel) { $pPath = Join-Path $profilesDir $pPath }
        $result.Add($pPath)
    }
    return $result
}

# --- Clean one prefs.js ------------------------------------------------------
function Clear-Prefs {
    param([string]$Dir)
    $prefs = Join-Path $Dir "prefs.js"
    if (-not (Test-Path $prefs)) { SayNote "[~] No prefs.js in $Dir"; return }

    $lines = Get-Content $prefs
    $removed = 0
    $kept = [System.Collections.Generic.List[string]]::new()

    foreach ($line in $lines) {
        $name = ""
        if ($line -match '^user_pref\("([^"]+)"') { $name = $Matches[1] }
        if ($name -and ($RemovedPrefs -contains $name)) {
            if ($DryRun) { SayNote "[x] $name" }
            $removed++
            continue
        }
        $kept.Add($line)
    }

    if ($DryRun) {
        Say "  ($Dir): $removed stale pref(s) would be reset"
        return
    }
    if ($removed -eq 0) { SayNote "[~] $Dir: nothing to clean"; return }

    Copy-Item -Force $prefs "$prefs.yuzubak"
    Set-Content -Path $prefs -Value $kept -Encoding UTF8
    SayNote "[+] $Dir: reset $removed stale pref(s); backup: prefs.js.yuzubak"
}

# --- Main --------------------------------------------------------------------
if (-not $DryRun) {
    if (Get-Process firefox -ErrorAction SilentlyContinue) {
        Write-Host "!!! Error: Firefox is running. Please close it first." -ForegroundColor Red
        exit 1
    }
}

$targets = @()
if ($Profile) {
    $targets = @($Profile)
}
elseif ($All) {
    $targets = @(Get-Profiles)
    if ($targets.Count -eq 0) {
        Write-Host "!!! Error: No profiles.ini at $env:APPDATA\Mozilla\Firefox\profiles.ini" -ForegroundColor Red
        exit 1
    }
}
else {
    $targets = @(Get-Profiles)
    if ($targets.Count -eq 0) {
        Write-Host "!!! Error: No Firefox profiles found." -ForegroundColor Red
        exit 1
    }
}

foreach ($dir in $targets) {
    if (-not (Test-Path $dir)) { SayNote "[!] Skipped missing profile: $dir"; continue }
    Clear-Prefs $dir
}
Say "Done. Restart Firefox to apply."
exit 0
