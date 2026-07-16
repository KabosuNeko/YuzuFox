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

# --- Auto Region/Language Filter Injection via IP Geolocation ---
if command -v jq &> /dev/null; then
    echo ":: Detecting geographic location via Cloudflare..."
    GEO_LOC=$(curl -sSL --max-time 3 https://cloudflare.com/cdn-cgi/trace 2>/dev/null | grep -E '^loc=' | cut -d'=' -f2 | tr '[:upper:]' '[:lower:]')
    
    FILTER_CODE=""

    case "$GEO_LOC" in
        al|xk) FILTER_CODE="alb-0" ;;       # Albania
        bg) FILTER_CODE="bgr-0" ;;          # Bulgaria
        cn|tw|hk|mo) FILTER_CODE="chn-0" ;; # China/Taiwan (AdGuard Chinese)
        cz|sk) FILTER_CODE="cze-0" ;;       # Czech/Slovak
        de|ch|at) FILTER_CODE="deu-0" ;;    # Germany/Switzerland/Austria
        ee) FILTER_CODE="est-0" ;;          # Estonia
        eg|sa|ma|dz|ae|iq|lb) FILTER_CODE="ara-0" ;; # Arabic countries (Liste AR)
        es|ar|mx|co|cl|pe) FILTER_CODE="spa-0" ;;    # Spanish (EasyList Spanish)
        br|pt) FILTER_CODE="spa-1" ;;       # Brazil/Portugal (AdGuard Spanish/Portuguese)
        fi) FILTER_CODE="fin-0" ;;          # Finland
        fr|be|ca) FILTER_CODE="fra-0" ;;    # France/Belgium/Canada
        gr|cy) FILTER_CODE="grc-0" ;;       # Greece/Cyprus
        hr|rs|ba|me) FILTER_CODE="hrv-0" ;; # Serbo-Croatian
        hu) FILTER_CODE="hun-0" ;;          # Hungary
        id|my) FILTER_CODE="idn-0" ;;       # Indonesia/Malaysia (ABPindo)
        il) FILTER_CODE="isr-0" ;;          # Israel (Hebrew)
        in|lk|np) FILTER_CODE="ind-0" ;;    # India/Sri Lanka/Nepal (IndianList)
        ir) FILTER_CODE="irn-0" ;;          # Iran (PersianBlocker)
        is) FILTER_CODE="isl-0" ;;          # Iceland
        it) FILTER_CODE="ita-0" ;;          # Italy
        jp) FILTER_CODE="jpn-1" ;;          # Japan (AdGuard Japanese)
        kr) FILTER_CODE="kor-1" ;;          # Korea (List-KR Classic)
        lt) FILTER_CODE="ltu-0" ;;          # Lithuania
        lv) FILTER_CODE="lva-0" ;;          # Latvia
        mk) FILTER_CODE="mkd-0" ;;          # Macedonia
        nl) FILTER_CODE="nld-0" ;;          # Netherlands
        no|dk) FILTER_CODE="nor-0" ;;       # Norway/Denmark (Nordic)
        pl) FILTER_CODE="pol-0" ;;          # Poland
        ro|md) FILTER_CODE="rou-0" ;;       # Romania/Moldova
        ru|uz|kz|by) FILTER_CODE="rus-0" ;; # Russia/Uzbekistan/Kazakhstan (RU AdList)
        se) FILTER_CODE="swe-1" ;;          # Sweden (Frellwit)
        si) FILTER_CODE="svn-0" ;;          # Slovenia
        th) FILTER_CODE="tha-0" ;;          # Thailand
        tr) FILTER_CODE="tur-0" ;;          # Turkey
        ua) FILTER_CODE="ukr-1" ;;          # Ukraine (AdGuard Ukrainian)
        vn) FILTER_CODE="vie-0" ;;          # Vietnam (ABPVN List)
    esac

    if [ -n "$FILTER_CODE" ]; then
        echo ":: IP Location mapped to region '$GEO_LOC'. Injecting filter '$FILTER_CODE'..."
        jq --arg filter "$FILTER_CODE" '
            .policies["3rdparty"].Extensions["uBlock0@raymondhill.net"].adminSettings.selectedFilterLists |=
            (if index($filter) then . else . + [$filter] end)
        ' "$TEMP_DIR/policies.json" > "$TEMP_DIR/policies_tmp.json" && mv "$TEMP_DIR/policies_tmp.json" "$TEMP_DIR/policies.json"
    elif [ -n "$GEO_LOC" ]; then
        echo ":: Unmapped region '$GEO_LOC'. No regional filter injected."
    else
        echo ":: Could not detect location (network issue). Skipping regional filter injection."
    fi
else
    echo ":: Warning: 'jq' is not installed. Skipping auto-region filter injection."
fi

echo ":: Installing system-wide (requires sudo)..."
sudo mkdir -p /etc/firefox/policies/
sudo cp -f "$TEMP_DIR/policies.json" /etc/firefox/policies/policies.json

sudo mkdir -p /usr/lib/firefox/browser/defaults/preferences/
sudo cp -f "$TEMP_DIR/yuzu.js" /usr/lib/firefox/browser/defaults/preferences/yuzu.js

rm -rf "$TEMP_DIR"

echo "===> Settings installed. Restart Firefox to apply."
echo "    Run 'install-css.sh' to apply the one-line UI stylesheet."
