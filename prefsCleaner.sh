#!/usr/bin/env bash
#
# YuzuFox prefsCleaner — reset stale prefs left in prefs.js
#
# When YuzuFox removes a pref from user.js (deprecated, renamed, or no longer
# wanted), the old value can stay active in <profile>/prefs.js forever. This
# script deletes those lines so Firefox falls back to its built-in defaults.
#
# Usage:
#   ./prefsCleaner.sh                          # clean the default profile
#   ./prefsCleaner.sh <profile-dir> [more...]  # clean specific profiles
#   ./prefsCleaner.sh --all                    # every profile in profiles.ini
#   ./prefsCleaner.sh --dry-run                # show what would be removed
#
# Backs up each prefs.js to prefs.js.yuzubak before touching it.
# Run with Firefox closed.

set -euo pipefail

DRY_RUN=0
ALL=0
PROFILE_DIRS=()

usage() {
    sed -n '2,22p' "$0" 2>/dev/null | grep -v '^#!' | sed 's/^# \{0,1\}//'
    exit 0
}

say() { echo ":: $*"; }
say_note() { echo "    $*"; }
die() { echo "!!! Error: $*" >&2; exit 1; }

while [ $# -gt 0 ]; do
    case "$1" in
        --dry-run) DRY_RUN=1 ;;
        --all) ALL=1 ;;
        -h|--help) usage ;;
        -*) die "Unknown option: $1" ;;
        *) PROFILE_DIRS+=("$1") ;;
    esac
    shift
done

# --- Prefs removed from YuzuFox user.js ---------------------------------------
# Safe Browsing was disabled wholesale before 2026-08-10; core is now re-enabled
# and the following lines would keep it off if left in prefs.js.
REMOVED_PREFS=(
    browser.safebrowsing.allowOverride
    browser.safebrowsing.blockedURIs.enabled
    browser.safebrowsing.downloads.enabled
    browser.safebrowsing.downloads.remote.block_dangerous
    browser.safebrowsing.downloads.remote.block_dangerous_host
    browser.safebrowsing.downloads.remote.block_potentially_unwanted
    browser.safebrowsing.downloads.remote.block_uncommon
    browser.safebrowsing.downloads.remote.remote.url
    browser.safebrowsing.id
    browser.safebrowsing.malware.enabled
    browser.safebrowsing.phishing.enabled
    browser.safebrowsing.provider.google.advisoryURL
    browser.safebrowsing.provider.google.gethashURL
    browser.safebrowsing.provider.google.lists
    browser.safebrowsing.provider.google.malwareReportURL
    browser.safebrowsing.provider.google.pver
    browser.safebrowsing.provider.google.reportMalwareMistakeURL
    browser.safebrowsing.provider.google.reportPhishMistakeURL
    browser.safebrowsing.provider.google.reportURL
    browser.safebrowsing.provider.google.updateURL
    browser.safebrowsing.provider.google4.advisoryURL
    browser.safebrowsing.provider.google4.dataSharing.enabled
    browser.safebrowsing.provider.google4.gethashURL
    browser.safebrowsing.provider.google4.lists
    browser.safebrowsing.provider.google4.pver
    browser.safebrowsing.provider.google4.reportMalwareMistakeURL
    browser.safebrowsing.provider.google4.reportPhishMistakeURL
    browser.safebrowsing.provider.google4.reportURL
    browser.safebrowsing.provider.google4.updateURL
    browser.safebrowsing.provider.mozilla.gethashURL
    browser.safebrowsing.provider.mozilla.lists
    browser.safebrowsing.provider.mozilla.lists.base
    browser.safebrowsing.provider.mozilla.lists.content
    browser.safebrowsing.provider.mozilla.pver
    browser.safebrowsing.provider.mozilla.reportURL
    browser.safebrowsing.provider.mozilla.updateURL
    browser.safebrowsing.reportPhishURL
    # Redundant prefs at Firefox defaults, removed 2026-08-09.
    browser.search.suggest.enabled
    browser.search.separatePrivateDefault
    browser.urlbar.quicksuggest.enabled
    browser.urlbar.suggest.searches
    browser.urlbar.suggest.quicksuggest.nonsponsored
    browser.urlbar.suggest.quicksuggest.sponsored
    browser.urlbar.amp.featureGate
    browser.urlbar.wikipedia.featureGate
    dom.push.enabled
    javascript.options.ion.threshold
    network.http.referer.spoofSource
    privacy.fingerprintingProtection.pbmode
    security.pki.crlite_mode
    security.remote_settings.crlite_filters.enabled
)

# --- Locate profile dirs ------------------------------------------------------
MOZ_DIRS=(
  "$HOME/.mozilla/firefox"
  "$HOME/.config/mozilla/firefox"
  "$HOME/.var/app/org.mozilla.firefox/.mozilla/firefox"
  "$HOME/Library/Application Support/Firefox"
)

resolve_profiles() {
    local ini profiles_dir name="" path="" rel="1"
    for ini in "${MOZ_DIRS[@]/%//profiles.ini}"; do
        [ -f "$ini" ] || continue
        profiles_dir=$(dirname "$ini")
        while IFS= read -r line || [ -n "$line" ]; do
            case "$line" in
                "[Profile"*)
                    [ -n "$name" ] && [ -n "$path" ] && add_profile "$name" "$path"
                    name=""; path=""; rel="1"
                    ;;
                "Name="*) name="${line#Name=}" ;;
                "IsRelative="*) rel="${line#IsRelative=}" ;;
                "Path="*)
                    path="${line#Path=}"
                    [ "$rel" = "1" ] && path="$profiles_dir/$path"
                    ;;
            esac
        done < "$ini"
        [ -n "$name" ] && [ -n "$path" ] && add_profile "$name" "$path"
        return 0
    done
    return 1
}

add_profile() { PROFILE_DIRS+=("$2"); }

if [ "$ALL" = "1" ]; then
    resolve_profiles || die "No profiles.ini found (tried: ${MOZ_DIRS[*]})"
fi
if [ "${#PROFILE_DIRS[@]}" -eq 0 ]; then
    # Default: the first existing profile dir found.
    resolve_profiles || die "No Firefox profiles found."
fi

# --- Clean one prefs.js -------------------------------------------------------
clean_prefs() {
    local dir="$1" prefs tmp name removed=0
    prefs="$dir/prefs.js"
    [ -f "$prefs" ] || { say_note "[~] No prefs.js in $dir"; return 0; }

    if [ "$DRY_RUN" = "1" ]; then
        while IFS= read -r line; do
            [[ "$line" =~ ^user_pref\(\"([^\"]+)\" ]] || continue
            name="${BASH_REMATCH[1]}"
            if printf '%s\n' "${REMOVED_PREFS[@]}" | grep -qx "$name"; then
                say_note "[x] $name"
                removed=$((removed+1))
            fi
        done < "$prefs"
        say "  ($dir): $removed stale pref(s) would be reset"
        return 0
    fi

    tmp="$dir/.prefs.js.clean"
    : > "$tmp"
    while IFS= read -r line || [ -n "$line" ]; do
        name=""
        [[ "$line" =~ ^user_pref\(\"([^\"]+)\" ]] && name="${BASH_REMATCH[1]}"
        if [ -n "$name" ] && printf '%s\n' "${REMOVED_PREFS[@]}" | grep -qx "$name"; then
            removed=$((removed+1))
            continue
        fi
        printf '%s\n' "$line" >> "$tmp"
    done < "$prefs"

    if [ "$removed" -gt 0 ]; then
        cp -f "$prefs" "$prefs.yuzubak"   # original backup (pre-clean)
        mv -f "$tmp" "$prefs"
        say_note "[+] $dir: reset $removed stale pref(s); backup: prefs.js.yuzubak"
    else
        rm -f "$tmp"
        say_note "[~] $dir: nothing to clean"
    fi
}

# --- Main ---------------------------------------------------------------------
if pgrep -x firefox &>/dev/null || pgrep -x firefox-esr &>/dev/null; then
    die "Firefox is running. Please close it first."
fi

for dir in "${PROFILE_DIRS[@]}"; do
    [ -d "$dir" ] || { say_note "[!] Skipped missing profile: $dir"; continue; }
    clean_prefs "$dir"
done
say "Done. Restart Firefox to apply."
