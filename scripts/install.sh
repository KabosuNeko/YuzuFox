#!/usr/bin/env bash
#
# YuzuFox — one installer for everything:
#   1. system-wide settings (yuzu.js + policies.json, locked, sudo)
#   2. per-profile tuning   (user.js, pick profiles, no sudo)
#
# Supported platforms:
#   Linux  (distro-packaged Firefox)
#   macOS  (Firefox.app in /Applications)
#   Windows is NOT covered here — use install.ps1 instead.
#
# Paths (verified against Mozilla admin docs + cachyos-firefox-settings):
#   policies.json:
#     Linux  /etc/firefox/policies/policies.json
#     macOS  /Applications/Firefox.app/Contents/Resources/distribution/policies.json
#   yuzu.js (defaults/preferences):
#     Linux  /usr/lib/firefox/browser/defaults/preferences/yuzu.js
#     macOS  /Applications/Firefox.app/Contents/Resources/browser/defaults/preferences/yuzu.js
#
# Usage:
#   ./scripts/install.sh                   install system settings + ask for profiles
#   ./scripts/install.sh --system-only     system-wide settings only
#   ./scripts/install.sh --profiles-only   per-profile user.js only
#   ./scripts/install.sh --dry-run         preview without writing anything
#   ./scripts/install.sh --uninstall       remove system settings + user.js

set -euo pipefail

REPO_URL="https://raw.githubusercontent.com/KabosuNeko/YuzuFox/main"
POLICIES_URL="$REPO_URL/policies.json"
PREFS_URL="$REPO_URL/yuzu.js"
USERJS_URL="$REPO_URL/user.js"

say() { echo ":: $*"; }
say_note() { echo "    $*"; }
die() { echo "!!! Error: $*" >&2; exit 1; }

SYSTEM_TMP=""
USERJS_TMP=""
cleanup() {
    [ -n "$SYSTEM_TMP" ] && rm -rf "$SYSTEM_TMP"
    [ -n "$USERJS_TMP" ] && rm -rf "$USERJS_TMP"
    return 0
}
trap cleanup EXIT

usage() {
    sed -n '2,27p' "$0" 2>/dev/null | grep -v '^#!' | sed 's/^# \{0,1\}//'
    exit 0
}

# --- Flags -------------------------------------------------------------------
DRY_RUN=0
UNINSTALL=0
ALL=0
MODE="all"   # all | system | profiles
while [ $# -gt 0 ]; do
    case "$1" in
        --dry-run) DRY_RUN=1 ;;
        --uninstall) UNINSTALL=1 ;;
        --system-only) MODE="system" ;;
        --profiles-only) MODE="profiles" ;;
        --all) ALL=1 ;;
        -h|--help) usage ;;
        *) die "Unknown option: $1" ;;
    esac
    shift
done

# --- Detect OS ---------------------------------------------------------------
detect_os() {
    case "$(uname -s)" in
        Linux)  echo "linux" ;;
        Darwin) echo "macos" ;;
        *)      echo "unsupported" ;;
    esac
}

# Fail fast when we would need to prompt but stdin is not a terminal
# (e.g. `curl ... | bash` consumes stdin, so read -rp never sees the
# keyboard). Suggest the two non-interactive escapes.
require_tty() {
    [ -t 0 ] || die "cannot prompt: stdin is not a terminal (curl | bash). Use --all, or download and run locally: curl -sSL -o yuzufox-install.sh $REPO_URL/scripts/install.sh && bash yuzufox-install.sh"
}

OS="$(detect_os)"
[ "$OS" = "unsupported" ] && {
    echo "!!! Error: unsupported OS '$(uname -s)'." >&2
    echo "    YuzuFox supports Linux and macOS here." >&2
    echo "    On Windows use install.ps1 instead." >&2
    exit 1
}

case "$OS" in
    linux)
        POLICIES_DEST="/etc/firefox/policies/policies.json"
        PREFS_DEST="/usr/lib/firefox/browser/defaults/preferences/yuzu.js"
        ;;
    macos)
        APP_DIR="/Applications/Firefox.app"
        POLICIES_DEST="$APP_DIR/Contents/Resources/distribution/policies.json"
        PREFS_DEST="$APP_DIR/Contents/Resources/browser/defaults/preferences/yuzu.js"
        ;;
esac

# --- Prerequisites ------------------------------------------------------------
for cmd in curl sudo pgrep; do
    command -v "$cmd" &>/dev/null || die "'$cmd' is required but not installed."
done

if [ "$OS" = "macos" ] && [ ! -d "/Applications/Firefox.app" ]; then
    die "/Applications/Firefox.app not found. Firefox must be installed first."
fi

# Firefox profile locations, in preference order.
MOZ_DIRS=(
  "$HOME/.mozilla/firefox"
  "$HOME/.config/mozilla/firefox"
  "$HOME/.var/app/org.mozilla.firefox/.mozilla/firefox"
  "$HOME/Library/Application Support/Firefox"
)
PROFILES_INI_CANDIDATES=(
  "${MOZ_DIRS[0]}/profiles.ini"
  "${MOZ_DIRS[1]}/profiles.ini"
  "${MOZ_DIRS[2]}/profiles.ini"
  "${MOZ_DIRS[3]}/profiles.ini"
)

# -----------------------------------------------------------------------------
# Parse profiles.ini into global arrays: PROFILE_NAME[], PROFILE_PATH[]
# Path is relative to the profiles.ini dir (or absolute when IsRelative=0).
# -----------------------------------------------------------------------------
read_profiles() {
    local ini profiles_dir name="" path="" rel="1"
    PROFILE_NAME=()
    PROFILE_PATH=()
    for ini in "${PROFILES_INI_CANDIDATES[@]}"; do
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
                    if [ "$rel" = "1" ]; then
                        path="$profiles_dir/$path"
                    fi
                    ;;
            esac
        done < "$ini"
        [ -n "$name" ] && [ -n "$path" ] && add_profile "$name" "$path"
        return 0
    done
    return 1
}

add_profile() { PROFILE_NAME+=("$1"); PROFILE_PATH+=("$2"); }

# -----------------------------------------------------------------------------
# Ask which profiles to touch; fills SELECTED_IDX[].
# -----------------------------------------------------------------------------
select_profiles() {
  local i selection
  if [ "$ALL" = "1" ]; then
    SELECTED_IDX=("${!PROFILE_NAME[@]}")
    return
  fi
  require_tty
  say "Available Firefox profiles:"
  for i in "${!PROFILE_NAME[@]}"; do
    if [ -d "${PROFILE_PATH[$i]}" ]; then
      say_note "[$((i+1))] ${PROFILE_NAME[$i]}  (${PROFILE_PATH[$i]})"
    else
      say_note "[$((i+1))] ${PROFILE_NAME[$i]}  (missing: ${PROFILE_PATH[$i]})"
    fi
  done
  echo
  read -rp "    Select profile numbers to install to (space separated, or 'all'): " selection
  case "$selection" in
      "" ) die "No selection given." ;;
      all) SELECTED_IDX=("${!PROFILE_NAME[@]}") ;;
      *)
          SELECTED_IDX=()
          for n in $selection; do
              case "$n" in
                  *[!0-9]*|"") die "Invalid selection: $n" ;;
                  *) [ "$n" -ge 1 ] 2>/dev/null && [ "$n" -le "${#PROFILE_NAME[@]}" ] || die "Out of range: $n" ;;
              esac
              SELECTED_IDX+=("$((n-1))")
          done
          ;;
  esac
}

# --- System-wide actions ------------------------------------------------------
# Compare a freshly downloaded file against what is installed. Returns 0
# (up to date) or 1 (new version available / not installed yet).
needs_update() {
    local new="$1" dest="$2"
    [ -f "$dest" ] || return 1
    cmp -s "$new" "$dest"
}

install_system() {
  say "Downloading configuration files..."
  SYSTEM_TMP=$(mktemp -d)
  curl -sSL "$POLICIES_URL" -o "$SYSTEM_TMP/policies.json" || die "Failed to download policies.json"
  curl -sSL "$PREFS_URL" -o "$SYSTEM_TMP/yuzu.js" || die "Failed to download yuzu.js"

  local changed=0
  if needs_update "$SYSTEM_TMP/policies.json" "$POLICIES_DEST"; then
    say_note "policies.json: up to date"
  else
    changed=1
    say_note "policies.json: new version"
  fi
  if needs_update "$SYSTEM_TMP/yuzu.js" "$PREFS_DEST"; then
    say_note "yuzu.js: up to date"
  else
    changed=1
    say_note "yuzu.js: new version"
  fi
  [ "$changed" = "0" ] && { say_note "System settings already up to date."; return 0; }

  say "Installing system-wide [$OS] (requires sudo)..."
  sudo mkdir -p "$(dirname "$POLICIES_DEST")"
  sudo cp -f "$SYSTEM_TMP/policies.json" "$POLICIES_DEST"
  sudo mkdir -p "$(dirname "$PREFS_DEST")"
  sudo cp -f "$SYSTEM_TMP/yuzu.js" "$PREFS_DEST"
  say_note "Settings installed. Restart Firefox to apply."
}

uninstall_system() {
  echo "    This will remove:"
  echo "    - $POLICIES_DEST"
  echo "    - $PREFS_DEST"
  if [ "$ALL" != "1" ]; then
    require_tty
    read -rp "    Continue? [y/N] " confirm
    if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
      say_note "Aborted."
      return 1
    fi
  fi
  say "Removing files (requires sudo)..."
  sudo rm -f "$POLICIES_DEST"
  sudo rm -f "$PREFS_DEST"
  say_note "Done."
}

# --- Per-profile actions ------------------------------------------------------
install_profiles() {
  say "Downloading user.js..."
  USERJS_TMP=$(mktemp -d)
  curl -sSL "$USERJS_URL" -o "$USERJS_TMP/user.js" || die "Failed to download user.js"

  select_profiles
  local changed=0
  for i in "${SELECTED_IDX[@]}"; do
    p="${PROFILE_PATH[$i]}"
    [ -d "$p" ] || { say_note "[!] Skipped missing profile ${PROFILE_NAME[$i]} ($p)"; continue; }
    if [ -f "$p/user.js" ] && cmp -s "$USERJS_TMP/user.js" "$p/user.js"; then
      say_note "[~] ${PROFILE_NAME[$i]}: user.js up to date"
      continue
    fi
    changed=1
    if [ -f "$p/user.js" ]; then
      cp -f "$p/user.js" "$p/user.js.yuzubak"
      say_note "[~] Existing user.js backed up to user.js.yuzubak"
    fi
    cp -f "$USERJS_TMP/user.js" "$p/user.js"
    say_note "[+] Installed ${PROFILE_NAME[$i]} ($p/user.js)"
  done
  [ "$changed" = "0" ] && { say "user.js already up to date in all selected profiles."; return 0; }
  say "user.js installed to selected profiles. Restart Firefox to apply."
}

uninstall_profiles() {
  select_profiles
  for i in "${SELECTED_IDX[@]}"; do
    f="${PROFILE_PATH[$i]}/user.js"
    if [ -f "$f" ]; then
      rm -f "$f"
      say_note "[+] Removed $f"
    else
      say_note "[~] No user.js in ${PROFILE_PATH[$i]}"
    fi
  done
  say "Done. Restart Firefox to apply."
}

# --- Main ---------------------------------------------------------------------

# curl | bash consumes stdin, so any read prompt would silently get EOF.
# Fail fast BEFORE touching the system: if we will need to ask anything
# (profile picker, or the uninstall confirmation) and stdin is not a
# terminal and the caller did not pass --all, refuse to start.
if [ "$ALL" != "1" ] && [ ! -t 0 ] && { [ "$MODE" != "system" ] || [ "$UNINSTALL" = "1" ]; }; then
  require_tty
fi

if pgrep -x firefox &>/dev/null || pgrep -x firefox-esr &>/dev/null; then
  die "Firefox is running. Please close it first."
fi

if [ "$MODE" != "profiles" ]; then
  if [ "$DRY_RUN" = "1" ]; then
    say "[DRY-RUN] [$OS] Would install:"
    say_note "    - $POLICIES_DEST"
    say_note "    - $PREFS_DEST"
  elif [ "$UNINSTALL" = "1" ]; then
    say "YuzuFox [$OS] — Uninstall system settings"
    uninstall_system
  else
    install_system
  fi
fi

if [ "$MODE" != "system" ]; then
  if read_profiles; then
    if [ "$DRY_RUN" = "1" ]; then
      say "[DRY-RUN] Would install user.js to:"
      select_profiles
      for idx in "${SELECTED_IDX[@]}"; do
        say_note "  $(basename "${PROFILE_PATH[$idx]}")/user.js"
      done
      exit 0
    elif [ "$UNINSTALL" = "1" ]; then
      say "Uninstall per-profile user.js"
      uninstall_profiles
    else
      install_profiles
    fi
  else
    if [ "$MODE" = "profiles" ]; then
      die "No profiles.ini found (tried: ${PROFILES_INI_CANDIDATES[*]})"
    fi
    say_note "[!] No Firefox profiles found — skipped per-profile user.js (system-wide was applied)."
  fi
fi