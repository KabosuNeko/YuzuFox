# YuzuFox

A minimalist, hardened Firefox setup tailored for Linux window managers, featuring a one-line UI.

## Overview

YuzuFox transforms Firefox into a privacy-respecting, performance-optimized browser with a compact one-line UI. It consists of four components:

| File | Purpose |
|---|---|
| `yuzu.js` | System autoconfig (840 lines): privacy, performance, UI cleanup |
| `userChrome.css` | One-line layout — tabs and URL bar on the same row |
| `policies.json` | Enterprise policy: uBlock Origin auto-install, enforced privacy |
| `install-settings.sh` | Install/uninstall yuzu.js + policies.json (requires sudo) |
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

### `userChrome.css`

230-line stylesheet collapsing tab bar and navigation bar into a single row on windows wider than 1000 px. Zero border radii, 26 px row height, transparent toolbars, hidden context menu items.

<p align="center">
  <img width="850" alt="YuzuFox One-line UI Preview" src="https://github.com/user-attachments/assets/abe8c52c-9fd5-4c0c-95d4-55ffbbbfb913" style="border-radius: 8px;">
</p>


### `policies.json`

Enterprise Policy auto-installing uBlock Origin with pre-configured filter lists, enforcing privacy settings, and removing Mozilla messaging.

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

## Credits

`yuzu.js` draws inspiration from [Betterfox](https://github.com/yokoffing/Betterfox), [Arkenfox](https://github.com/arkenfox/user.js) and [Firefox-cachyos-settings](https://github.com/CachyOS/CachyOS-PKGBUILDS/tree/master/cachyos-firefox-settings)
