# YuzuFox

<p><br/></p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/cffdbb1c-2676-4df8-94fb-0369edbb86bd" alt="yuzufox Logo" style="width: 192px" />
</p>
<p><br/></p>

**Hardened, zero-bloat Firefox. Seamless one-line UI.**

## Overview

YuzuFox transforms Firefox into a privacy-respecting and performance-optimized browser with a seamless one-line UI, securing your data without breaking sites. It consists of four components:

| File | Purpose |
|---|---|
| `yuzu.js` | System autoconfig (840 lines): privacy, performance, UI cleanup |
| `userChrome.css` | One-line layout — tabs and URL bar on the same row |
| `policies.json` | Enterprise policy: uBlock Origin auto-install, enforced privacy |
| `install-settings.sh` | Install/uninstall yuzu.js + policies.json (Auto Region/Language Filter)  (requires sudo) |
| `install-css.sh` | Install/uninstall userChrome.css to Firefox profiles (user-level) |

### `yuzu.js`

Over 300 locked preferences covering:

- **CRLite-only revocation** — OCSP disabled; certificate checks offline via CRLite mode 2
- **RAM-only cache** — disk cache disabled; 1 GB memory cache, 3 GB media cache
- **Zero background connections** — all speculativeConnect, DNS prefetch, predictor flags severed
- **Fingerprinting Protection** — Firefox FFP, content script isolation, referrer trimming
- **Safe Browsing disabled** — delegated to DNS-level blocking
- **Complete telemetry block** — Normandy, studies, crash reports, coverage, activity stream all capped
- **Mozilla bloat removed** — Pocket, VPN, AI, sponsored content, promotions all disabled
- **WebRender forced** — GPU compositing, hardware video decoding, Skia font cache

### `policies.json`

Enterprise Policy auto-installing uBlock Origin with pre-configured filter lists, enforcing privacy settings, and removing Mozilla messaging.

### `userChrome.css`

230-line stylesheet collapsing tab bar and navigation bar into a single row on windows wider than 1000 px. Zero border radii, 26 px row height, transparent toolbars, hidden context menu items.

<p align="center">
  <img width="850" alt="YuzuFox One-line UI Preview" src="https://github.com/user-attachments/assets/abe8c52c-9fd5-4c0c-95d4-55ffbbbfb913" style="border-radius: 8px;">
</p>

## Install

### Settings (requires sudo)

```bash
curl -sSL https://raw.githubusercontent.com/KabosuNeko/YuzuFox/main/install-settings.sh | bash
```

### Css (user-level)

```bash
curl -sSL https://raw.githubusercontent.com/KabosuNeko/YuzuFox/main/install-css.sh | bash
```

> **Note:** After installation, go to `about:config` and set `toolkit.legacyUserProfileCustomizations.stylesheets` to `true`.

## Uninstall

### Settings

```bash
curl -sSL https://raw.githubusercontent.com/KabosuNeko/YuzuFox/main/install-settings.sh | bash -s -- --uninstall
```

### Css

```bash
curl -sSL https://raw.githubusercontent.com/KabosuNeko/YuzuFox/main/install-css.sh | bash -s -- --uninstall
```
## Troubleshooting

This configuration strictly prioritizes privacy and performance, which may occasionally break certain web features. Here is how to quickly resolve common edge cases without altering the core setup:

* **Broken SSO Logins or Payment Gateways:** Strict cross-origin referrer trimming might block third-party authentication handshakes.
  * *Fix:* Press `Ctrl + L` to focus the URL bar, tab to the **Shield Icon** (Enhanced Tracking Protection), and toggle it off for that specific site.
* **Cannot Access Router / Local IPs:** HTTPS-Only mode is strictly enforced. Local HTTP servers will show a secure connection warning.
  * *Fix:* Simply click the **"Continue to HTTP Site"** button on the warning page.
* **Fillable PDF Forms Not Working:** JavaScript execution within the built-in PDF viewer is disabled for security.
  * *Fix:* Download the document and open it with a native lightweight PDF reader (e.g., `zathura` or `mupdf`).
* **Missing Comments or Social Widgets:** Aggressive ad-blocking (uBlock Origin) combined with Strict ETP might block third-party frames like Disqus or embedded posts.
  * *Fix:* Click the uBlock Origin extension icon and disable it temporarily for the site, or turn off the ETP shield.
  
## Credits

`yuzu.js` draws inspiration from [Betterfox](https://github.com/yokoffing/Betterfox), [Arkenfox](https://github.com/arkenfox/user.js) and [Firefox-cachyos-settings](https://github.com/CachyOS/CachyOS-PKGBUILDS/tree/master/cachyos-firefox-settings)
