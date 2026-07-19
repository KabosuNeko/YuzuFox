#!/usr/bin/env bash

REPO_URL="https://raw.githubusercontent.com/KabosuNeko/YuzuFox/main"
POLICIES_URL="$REPO_URL/policies.json"
PREFS_URL="$REPO_URL/yuzu.js"
POLICIES_DEST="/etc/firefox/policies/policies.json"
PREFS_DEST="/usr/lib/firefox/browser/defaults/preferences/yuzu.js"

# Check prerequisites
for cmd in curl sudo pgrep; do
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
    echo ":: [DRY-RUN] Would install:"
    echo "    - $POLICIES_DEST"
    echo "    - $PREFS_DEST"
    echo "    - Region filter would be detected from timezone (offline)"
    exit 0
fi

# --- Uninstall ---
if [ "${1:-}" = "--uninstall" ]; then
    echo ":: YuzuFox — Uninstall system settings"
    echo "    This will remove:"
    echo "    - $POLICIES_DEST"
    echo "    - $PREFS_DEST"
    read -rp "    Continue? [y/N] " confirm
    if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
        echo "    Aborted."
        exit 0
    fi
    echo ":: Removing files (requires sudo)..."
    sudo rm -f "$POLICIES_DEST"
    sudo rm -f "$PREFS_DEST"
    echo "===> Done. Please restart Firefox."
    exit 0
fi

# --- Install ---
echo ":: Downloading configuration files..."
TEMP_DIR=$(mktemp -d)

trap 'rm -rf "$TEMP_DIR"' EXIT

curl -sSL "$POLICIES_URL" -o "$TEMP_DIR/policies.json" || { echo "!!! Error: Failed to download policies.json"; exit 1; }
curl -sSL "$PREFS_URL" -o "$TEMP_DIR/yuzu.js" || { echo "!!! Error: Failed to download yuzu.js"; exit 1; }

# --- Auto Region/Language Filter Injection (Offline Mode) ---
if command -v jq &> /dev/null; then
    echo ":: Detecting geographic location locally (Offline)..."
    
    GEO_LOC=""
    
    SYS_TZ=$(timedatectl show --property=Timezone --value 2>/dev/null)
    if [ -n "$SYS_TZ" ] && [ -f "/usr/share/zoneinfo/zone.tab" ]; then
        GEO_LOC=$(awk -v tz="$SYS_TZ" '$3 == tz {print tolower($1)}' /usr/share/zoneinfo/zone.tab | head -n 1)
    fi

    echo ":: [DEBUG] Timezone-based region: '${GEO_LOC:-NONE}'"

    FILTER_CODE=""

    case "$GEO_LOC" in
        al|xk) FILTER_CODE="ALB-0" ;;       # Albania
        bg) FILTER_CODE="BGR-0" ;;          # Bulgaria
        cn|tw|hk|mo) FILTER_CODE="CHN-0" ;; # China/Taiwan
        cz|sk) FILTER_CODE="CZE-0" ;;       # Czech/Slovak
        de|ch|at) FILTER_CODE="DEU-0" ;;    # Germany/Switzerland/Austria
        ee) FILTER_CODE="EST-0" ;;          # Estonia
        eg|sa|ma|dz|ae|iq|lb) FILTER_CODE="ara-0" ;; # Arabic countries
        es|ar|mx|co|cl|pe) FILTER_CODE="spa-0" ;;    # Spanish
        br|pt) FILTER_CODE="spa-1" ;;       # Brazil/Portugal
        fi) FILTER_CODE="FIN-0" ;;          # Finland
        fr|be|ca) FILTER_CODE="FRA-0" ;;    # France/Belgium/Canada
        gr|cy) FILTER_CODE="GRC-0" ;;       # Greece/Cyprus
        hr|rs|ba|me) FILTER_CODE="HRV-0" ;; # Serbo-Croatian
        hu) FILTER_CODE="HUN-0" ;;          # Hungary
        id|my) FILTER_CODE="IDN-0" ;;       # Indonesia/Malaysia
        il) FILTER_CODE="ISR-0" ;;          # Israel
        in|lk|np) FILTER_CODE="IND-0" ;;    # India/Sri Lanka/Nepal
        ir) FILTER_CODE="IRN-0" ;;          # Iran
        is) FILTER_CODE="ISL-0" ;;          # Iceland
        it) FILTER_CODE="ITA-0" ;;          # Italy
        jp) FILTER_CODE="JPN-1" ;;          # Japan
        kr) FILTER_CODE="KOR-1" ;;          # Korea
        lt) FILTER_CODE="LTU-0" ;;          # Lithuania
        lv) FILTER_CODE="LVA-0" ;;          # Latvia
        mk) FILTER_CODE="MKD-0" ;;          # Macedonia
        nl) FILTER_CODE="NLD-0" ;;          # Netherlands
        no|dk) FILTER_CODE="NOR-0" ;;       # Norway/Denmark
        pl) FILTER_CODE="POL-0" ;;          # Poland
        ro|md) FILTER_CODE="ROU-1" ;;       # Romania/Moldova
        ru|uz|kz|by) FILTER_CODE="RUS-0" ;; # Russia/Uzbekistan/Kazakhstan
        se) FILTER_CODE="SWE-1" ;;          # Sweden
        si) FILTER_CODE="SVN-0" ;;          # Slovenia
        th) FILTER_CODE="THA-0" ;;          # Thailand
        tr) FILTER_CODE="TUR-0" ;;          # Turkey
        ua) FILTER_CODE="UKR-0" ;;          # Ukraine
        vn) FILTER_CODE="VIE-1" ;;          # Vietnam
    esac

    if [ -n "$FILTER_CODE" ]; then
        echo ":: Region mapped to '$GEO_LOC'. Injecting filter '$FILTER_CODE'..."

        jq --arg filter "$FILTER_CODE" '
            .policies["3rdparty"].Extensions["uBlock0@raymondhill.net"].adminSettings.selectedFilterLists |=
            (if type == "array" then (if index($filter) then . else . + [$filter] end) else [$filter] end)
        ' "$TEMP_DIR/policies.json" > "$TEMP_DIR/policies_tmp.json"

        if [ $? -eq 0 ]; then
            mv "$TEMP_DIR/policies_tmp.json" "$TEMP_DIR/policies.json"
            echo ":: [DEBUG] Filter injection successful."
        else
            echo "!!! [ERROR] jq failed to modify policies.json."
        fi
    elif [ -n "$GEO_LOC" ] && [ "$GEO_LOC" != "none" ]; then
        echo ":: Unmapped region '$GEO_LOC'. No regional filter injected (Defaulting to Global rules)."
    fi
else
    echo "!!! Warning: 'jq' is not installed. You MUST install 'jq' (e.g., sudo pacman -S jq) for auto-region filter to work!"
fi

echo ":: Installing system-wide (requires sudo)..."
sudo mkdir -p "$(dirname "$POLICIES_DEST")"
sudo cp -f "$TEMP_DIR/policies.json" "$POLICIES_DEST"

sudo mkdir -p "$(dirname "$PREFS_DEST")"
sudo cp -f "$TEMP_DIR/yuzu.js" "$PREFS_DEST"

echo "===> Settings installed. Restart Firefox to apply."
echo "    Run 'install-css.sh' to apply the one-line UI stylesheet."
