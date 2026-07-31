# YuzuFox

<p><br/></p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/cffdbb1c-2676-4df8-94fb-0369edbb86bd" alt="yuzufox Logo" style="width: 192px" />
</p>
<p><br/></p>

**Hardened, zero-bloat Firefox. Compact, pywal-themed UI.**

YuzuFox transforms Firefox into a privacy-respecting and performance-optimized browser with a compact two-row UI that auto-tints to your wallpaper, securing your data without breaking sites.

## Overview

| File | Purpose |
|---|---|
| `yuzu.js` | System autoconfig (840 lines): privacy, performance, UI cleanup |
| `userChrome.css` | Compact two-row UI — 16 px tabs + auto-hiding navbar, pywal-tinted colors |
| `policies.json` | Enterprise policy: uBlock Origin auto-install, enforced privacy |
| `install-settings.sh` | Install/uninstall yuzu.js + policies.json (Auto Region/Language Filter via offline timezone detection, not IP-based)  (requires sudo) |
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

> **Third-party data sources:** `policies.json` configures uBlock Origin to fetch filter lists from:
> - [uBlock Origin built-in lists](https://github.com/uBlockOrigin/uAssets) (maintained by uBlock developers)
> - [EasyList / EasyPrivacy](https://easylist.to/) (community-maintained ad blocking lists)
> - [DandelionSprout's Legitimate URL Shortener](https://github.com/DandelionSprout/adfilt) (anti-tracking list)
> - Region-specific filters (injected at install time based on timezone)
>
> These lists are fetched directly by uBlock Origin at runtime, not by YuzuFox itself.

### `userChrome.css`

~500-line stylesheet with a compact two-row layout: 16 px pixel-dense tabs (Maple Mono NF / JetBrains Mono Nerd Font) and an auto-hiding navigation bar that slides in on hover or URL bar focus. Colors are pulled live from [pywal](https://github.com/dylanaraps/pywal) via `@import` of `~/.cache/wal/colors.css` — run `wal -i <wallpaper>` and restart Firefox to re-tint the whole UI. Machines without pywal fall back to a fixed palette, so the layout never breaks.

Also includes: zero border radii, transparent URL bar, debloated navbar (back/forward/reload/home/library buttons removed), hidden tab close buttons, no window controls, container indicators shown via tab title color, and full theming of menus/popups, selection and scrollbars. The active tab is tinted orange at 30% opacity.

<p align="center">
  <img width="850" alt="YuzuFox UI Preview" src="https://github.com/user-attachments/assets/14acea91-6871-422c-b081-401516b9f0ee" style="border-radius: 8px;">
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
>
> **Optional (pywal colors):** install [pywal](https://github.com/dylanaraps/pywal) (`pip install pywal`) and run `wal -i /path/to/wallpaper`, then restart Firefox. Without pywal, the default fallback palette is used.
>
> **Dry-run:** Run `install-settings.sh --dry-run` or `install-css.sh --dry-run` to preview changes without applying them.

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
