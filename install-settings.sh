#!/usr/bin/env bash

REPO_URL="https://raw.githubusercontent.com/KabosuNeko/YuzuFox/main"
POLICIES_URL="$REPO_URL/policies.json"
PREFS_URL="$REPO_URL/yuzu.js"

# --- Uninstall ---
if [ "$1" = "--uninstall" ]; then
    echo ":: YuzuFox — Uninstall system settings"
    echo "    This will remove:"
    echo "    - /etc/firefox/policies/policies.json"
    echo "    - /usr/lib/firefox/browser/defaults/preferences/yuzu.js"
    read -rp "    Continue? [y/N] " confirm
    if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
        echo "    Aborted."
        exit 0
    fi
    echo ":: Removing files (requires sudo)..."
    sudo rm -f /etc/firefox/policies/policies.json
    sudo rm -f /usr/lib/firefox/browser/defaults/preferences/yuzu.js
    echo "===> Done. Please restart Firefox."
    exit 0
fi

# --- Install ---
echo ":: Downloading configuration files..."
TEMP_DIR=$(mktemp -d)

curl -sSL "$POLICIES_URL" -o "$TEMP_DIR/policies.json" || { echo "!!! Error: Failed to download policies.json"; exit 1; }
curl -sSL "$PREFS_URL" -o "$TEMP_DIR/yuzu.js" || { echo "!!! Error: Failed to download yuzu.js"; exit 1; }

echo ":: Installing system-wide (requires sudo)..."
sudo mkdir -p /etc/firefox/policies/
sudo cp -f "$TEMP_DIR/policies.json" /etc/firefox/policies/policies.json

sudo mkdir -p /usr/lib/firefox/browser/defaults/preferences/
sudo cp -f "$TEMP_DIR/yuzu.js" /usr/lib/firefox/browser/defaults/preferences/yuzu.js

rm -rf "$TEMP_DIR"

echo "===> Settings installed. Restart Firefox to apply."
echo "     Run 'install-css.sh' to apply the one-line UI stylesheet."
