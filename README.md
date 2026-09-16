<div align="center">
  <img src="https://github.com/user-attachments/assets/cffdbb1c-2676-4df8-94fb-0369edbb86bd" alt="YuzuFox Logo" width="120" />
  <h1>YuzuFox</h1>
  <p>Tuned Firefox profile for Linux, Windows, and macOS.<br>Enterprise AI suppression, zero-disk RAM caching, 101 vetted preferences, and Betterfox fingerprint parity.</p>
  <p>
    <a href="https://aur.archlinux.org/packages/yuzufox-git"><img src="https://img.shields.io/aur/version/yuzufox-git?color=1793d1&label=AUR&style=flat-square" alt="AUR" /></a>
    <a href="https://www.mozilla.org/firefox"><img src="https://img.shields.io/badge/Gecko-156.0-e66000?style=flat-square" alt="Firefox" /></a>
    <a href="https://github.com/KabosuNeko/YuzuFox/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-a3be8c?style=flat-square" alt="License" /></a>
  </p>
</div>

---

## Architecture

YuzuFox isolates configuration into three distinct layers:

| Layer | Configuration Path | Scope & Enforcement |
| :--- | :--- | :--- |
| **System Defaults**<br>`yuzu.js` | Linux: `/usr/lib/firefox/browser/defaults/preferences/yuzu.js`<br>macOS: `Firefox.app/.../defaults/preferences/yuzu.js`<br>Windows: `Program Files\Mozilla Firefox\browser\defaults\preferences\yuzu.js` | Zero disk cache writes (1GB RAM cache pool, 3GB media buffer cap), GPU process video decoding, WebRender precache, and engine-level telemetry lockout. |
| **Enterprise Policy**<br>`policies.json` | Linux: `/etc/firefox/policies/policies.json`<br>macOS: `Firefox.app/.../distribution/policies.json`<br>Windows: `Program Files\Mozilla Firefox\distribution\policies.json` | Locked Generative AI suppression (Chatbot, LinkPreviews, TabGroups), uBlock Origin deployment, DuckDuckGo default search, and removal of Pocket/Studies/Suggest sponsored tiles. |
| **Profile Overrides**<br>`user.js` | Linux: `~/.mozilla/firefox/<profile>/user.js`<br>macOS: `~/Library/Application Support/Firefox/Profiles/<profile>/user.js`<br>Windows: `%APPDATA%\Mozilla\Firefox\Profiles\<profile>\user.js` | 101 verified preferences: Strict ETP, Total Cookie Protection (dFPI), dynamic query stripping, HTTPS-Only mode, disabled PDF scripting, and Wayland/XDG portal integration. |

---

## Installation

Close Firefox before installing.

### Arch Linux / CachyOS (AUR)

```bash
paru -S yuzufox-git
# or
yay -S yuzufox-git
```

> [!NOTE]
> The AUR package installs `yuzu.js`, `policies.json`, and `user.js` system-wide (`provides=('firefox-settings')`), automatically applying to all existing and new profiles.
>
> **Using `firefox-pure` (CachyOS)?** Install `yuzufox-git` first, then `firefox-pure`. When pacman prompts that `firefox-pure` conflicts with `firefox`, confirm `y` to replace it without pulling in outdated `cachyos-firefox-settings`.

### Linux & macOS (Installer Script)

```bash
curl -sSL https://raw.githubusercontent.com/KabosuNeko/YuzuFox/main/install.sh -o install.sh
bash install.sh
```

Flags:
```bash
bash install.sh                 # Interactive profile selection
bash install.sh --all           # Apply to all detected profiles
bash install.sh --system-only   # System-wide only (yuzu.js + policies.json, requires sudo)
bash install.sh --profiles-only # Profile user.js only (no root required)
bash install.sh --dry-run       # Preview target paths without writing
bash install.sh --uninstall     # Remove installed configurations
```

### Windows (PowerShell Administrator)

```powershell
irm https://raw.githubusercontent.com/KabosuNeko/YuzuFox/main/install.ps1 -OutFile install.ps1
.\install.ps1
```

Flags:
```powershell
.\install.ps1 -All              # Apply to all profiles
.\install.ps1 -SystemOnly       # System defaults and policies only
.\install.ps1 -ProfilesOnly     # user.js only
.\install.ps1 -Uninstall        # Remove installed configurations
```

---

## Updating

When updating YuzuFox, close Firefox and delete `prefs.js` so newly reverted defaults take effect cleanly (bookmarks, history, and passwords are kept in SQLite databases and remain completely intact):

```bash
killall firefox firefox-bin 2>/dev/null
rm ~/.mozilla/firefox/*.default*/prefs.js
```

Then rerun the installer script or update via AUR (`paru -Syu --devel`).

---

## Core Technical Profile

* **Zero Disk Cache Writes**: Directs page and media cache entirely to RAM (`browser.cache.disk.enable = false`, 1GB memory capacity, 3GB combined media cap). Eliminates SSD write wear and disk latency.
* **Betterfox Fingerprint Parity**: Eliminates anomalous signatures (`WheelEvent.deltaY = 100` stock, standard mDNS WebRTC ICE candidates, native DOM sensor APIs). Uses native ETP Strict rather than global synthetic noise to prevent "Canvas Lie" flags.
* **Enterprise AI & Bloat Suppression**: Policies lock out Firefox 156 Generative AI (`Chatbot`, `LinkPreviews`, `TabGroups`), Pocket, Normandy, Shield studies, and Suggest sponsored queries.
* **Web Breakage Prevention**: Standard HTTP redirection limit (20) eliminates `NS_ERROR_REDIRECT_LOOP` on multi-hop enterprise SSO and banking portals.
* **Attack Surface Reduction**: Enforced HTTPS-Only, disabled PDF.js scripting, blocked cross-origin subresource HTTP auth prompts, and disabled speculative pre-connections.
* **Linux Desktop Ergonomics**: Native XDG Portal file picker, Wayland fractional scaling, Alt key menu focus suppression, and Mass-Spring-Damper (MSD) physics smooth scrolling.

See [TIPS.md](TIPS.md) for low-memory tuning, hardware VA-API verification, DNS over HTTPS, and custom overrides.

---

## Development

`user.js` and `user.js.lock` are generated from modular source files:

```bash
src/user.js/
├── 00-header.js
├── 10-network.js
├── 20-privacy.js
├── 30-security.js
├── 40-telemetry-connections.js
├── 50-ui-qol.js
└── 60-os-specific.js
```

```bash
python3 build.py         # Recompile user.js and lockfile
python3 build.py --check # Verify build integrity in CI (exit 0)
```

---

## Credits

* [Betterfox](https://github.com/yokoffing/Betterfox) — Upstream baseline for smooth browsing and practical privacy.
* [Arkenfox](https://github.com/arkenfox/user.js) — Security threat model and preference reference.
* [CachyOS](https://github.com/CachyOS/CachyOS-PKGBUILDS/tree/master/cachyos-firefox-settings) — Performance and Linux desktop optimizations.
