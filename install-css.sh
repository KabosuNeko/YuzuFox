#!/usr/bin/env bash

REPO_URL="https://raw.githubusercontent.com/KabosuNeko/YuzuFox/main"
CSS_URL="$REPO_URL/userChrome.css"
FIREFOX_DIR="$HOME/.config/mozilla/firefox"

# Check prerequisites
for cmd in curl pgrep; do
    if ! command -v "$cmd" &>/dev/null; then
        echo "!!! Error: '$cmd' is required but not installed." >&2
        exit 1
    fi
done

# Check Firefox is not running
if pgrep -x firefox &>/dev/null || pgrep -x firefox-esr &>/dev/null; then
    echo "!!! Error: Firefox is running. Please close it first." >&2
    exit 1
fi

# Dry-run mode
if [ "${1:-}" = "--dry-run" ]; then
    echo ":: [DRY-RUN] Would install userChrome.css to:"
    shopt -s nullglob
    for p in "$FIREFOX_DIR"/*.default* "$FIREFOX_DIR"/*.dev-edition-default; do
        echo "    - $(basename "$p")/chrome/userChrome.css"
    done
    shopt -u nullglob
    exit 0
fi

# --- Uninstall ---
if [ "${1:-}" = "--uninstall" ]; then
    echo ":: YuzuFox — Uninstall CSS from profiles"
    echo "    This will remove userChrome.css from all Firefox profiles."
    read -rp "    Continue? [y/N] " confirm
    if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
        echo "    Aborted."
        exit 0
    fi
    shopt -s nullglob
    PROFILES=("$FIREFOX_DIR"/*.default* "$FIREFOX_DIR"/*.dev-edition-default)
    shopt -u nullglob
    if [ ${#PROFILES[@]} -eq 0 ]; then
        echo "!!! No profiles found in $FIREFOX_DIR."
    else
        declare -A seen
        for profile_dir in "${PROFILES[@]}"; do
            [ -n "${seen[$profile_dir]:-}" ] && continue
            seen[$profile_dir]=1
            profile_name=$(basename "$profile_dir")
            css_file="$profile_dir/chrome/userChrome.css"
            if [ -f "$css_file" ]; then
                rm -f "$css_file"
                echo "[+] Removed from profile: $profile_name"
            else
                echo "[~] No userChrome.css in profile: $profile_name"
            fi
        done
    fi
    echo "===> Done. Restart Firefox to restore default styling."
    exit 0
fi

# --- Install ---
echo ":: Downloading userChrome.css..."
TEMP_DIR=$(mktemp -d)
trap 'rm -rf "$TEMP_DIR"' EXIT

curl -sSL "$CSS_URL" -o "$TEMP_DIR/userChrome.css" || { echo "!!! Error: Failed to download userChrome.css" >&2; exit 1; }

echo ":: Applying one-line UI to Firefox profiles..."
shopt -s nullglob
PROFILES=("$FIREFOX_DIR"/*.default* "$FIREFOX_DIR"/*.dev-edition-default)
shopt -u nullglob

if [ ${#PROFILES[@]} -eq 0 ]; then
    echo "!!! No profiles found in $FIREFOX_DIR."
    echo "!!! Open Firefox once to create a profile, then run this script again."
else
    declare -A seen
    for profile_dir in "${PROFILES[@]}"; do
        [ -n "${seen[$profile_dir]:-}" ] && continue
        seen[$profile_dir]=1
        profile_name=$(basename "$profile_dir")
        echo "[+] Profile: $profile_name"
        mkdir -p "$profile_dir/chrome"
        cp -f "$TEMP_DIR/userChrome.css" "$profile_dir/chrome/userChrome.css"
    done
fi

rm -rf "$TEMP_DIR"

echo "===> userChrome.css installed to all profiles."
echo "     Ensure 'toolkit.legacyUserProfileCustomizations.stylesheets' is true in about:config."
