<div align="center">
  <img src="https://github.com/user-attachments/assets/cffdbb1c-2676-4df8-94fb-0369edbb86bd" alt="YuzuFox Logo" width="140" />
  <h1>YuzuFox</h1>
  <p>Tuned Firefox configuration for Linux, Windows, and macOS. Focuses on hardware acceleration, RAM caching, telemetry removal, and sane privacy without breaking daily web compatibility.</p>
  <p>
    <a href="https://aur.archlinux.org/packages/yuzufox-git"><img src="https://img.shields.io/aur/version/yuzufox-git?color=1793d1&label=AUR&style=flat-square" alt="AUR" /></a>
    <a href="https://www.mozilla.org/firefox"><img src="https://img.shields.io/badge/Target-Firefox_Gecko-e66000?style=flat-square" alt="Firefox" /></a>
    <a href="https://github.com/KabosuNeko/YuzuFox/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-a3be8c?style=flat-square" alt="License" /></a>
  </p>
</div>

---

## Architecture

YuzuFox separates configuration into three layers:

| Layer | Path | Purpose |
| :--- | :--- | :--- |
| **System Defaults**<br>`yuzu.js` | Linux: `/usr/lib/firefox/browser/defaults/preferences/yuzu.js`<br>macOS: `Firefox.app/.../defaults/preferences/yuzu.js`<br>Windows: `Program Files\\Mozilla Firefox\\browser\\defaults\\preferences\\yuzu.js` | Hardware video decoding (VA-API/GPU), WebRender, 1GB RAM cache (disables disk cache wear), network buffers, and permanently locks out Mozilla telemetry, AI chat, studies, and sponsored tiles. |
| **Enterprise Policy**<br>`policies.json` | Linux: `/etc/firefox/policies/policies.json`<br>macOS: `Firefox.app/.../distribution/policies.json`<br>Windows: `Program Files\\Mozilla Firefox\\distribution\\policies.json` | Deploys uBlock Origin out of the box, removes built-in search engine clutter, sets DuckDuckGo default, and disables Mozilla onboarding/promotional popups. |
| **Profile Overrides**<br>`user.js` | `~/.mozilla/firefox/<profile>/user.js`<br>`~/Library/Application Support/Firefox/Profiles/<profile>/user.js`<br>`%APPDATA%\\Mozilla\\Firefox\\Profiles\\<profile>\\user.js` | Per-profile tuning: Strict ETP, Fingerprinting Protection (FPP), query parameter stripping, CRLite revocation mode 2, and UI tweaks. Can be replaced or extended per profile. |

---

## Key Tweaks

- **In-Memory Caching (`browser.cache.disk.enable = false`)**: Directs page cache entirely to RAM with a 1GB limit. Avoids disk I/O latency and SSD write wear.
- **Telemetry & Sponsored Purge**: Locks Normandy, Shield studies, PingCentre, Activity Stream ads, Pocket, and Firefox AI/ML integration.
- **FPP & ETP Strict**: Employs Mozilla\'s native Fingerprinting Protection (FPP) with per-origin canvas randomization to break cross-site tracking without forcing UTC clock or breaking layout dark modes.
- **Query Stripping**: Removes tracking tokens (`fbclid`, `gclid`, `mc_eid`, `twclid`, etc.) on navigation.
- **Security Baseline**: CRLite mode 2 (offline push-based certificate revocation, avoids real-time OCSP leaks to CAs), safe TLS renegotiation, and disabled speculative pre-connections.
- **Linux & Wayland Polish**: Native XDG Desktop Portal file picker, Wayland fractional scaling, and middle-click autoscroll.
- **Fluid Scrolling & Ergonomics**: MSD Physics (Mass-Spring-Damper) paired with a 300 mouse wheel multiplier eliminates sluggish, jarring notch-scrolling on Linux desktops, with overscroll bounce enabled.
- **Password & Form Safety**: Form history harvesting is disabled (`browser.formfill.enable = false`) to prevent hidden-field credential scraping. Standard password saving remains enabled, while silent autofill is blocked until direct user interaction.

---

## Installation

Close Firefox before running any installation commands.

### Arch Linux / CachyOS (AUR)

```bash
paru -S yuzufox-git
# or
yay -S yuzufox-git
```

> [!NOTE]
> The AUR package installs `yuzu.js`, `user.js` (as system defaults in `/usr/lib/firefox/browser/defaults/preferences/user.js`), and `policies.json` entirely system-wide (`provides=('firefox-settings')`). All existing and newly created profiles automatically inherit the entire configuration out-of-the-box—no profile scripts required. If you prefer applying YuzuFox only to specific profiles rather than system-wide, please use the [interactive script](#linux--macos-interactive-script) below instead of the AUR package.

> [!TIP]
> **Using Wayland? Pair YuzuFox with `firefox-pure` (CachyOS)**
>
> [`firefox-pure`](https://aur.archlinux.org/packages/firefox-pure) is an ultra-fast, Wayland-only Firefox build by the CachyOS team with `-O3`, PGO, cross-language LTO, and all Mozilla telemetry purged at compile time. *(This is completely optional — if you are using X11 or simply prefer standard Firefox, you can skip this).*
>
> **Why replace `cachyos-firefox-settings`?**  
> `cachyos-firefox-settings` has not been updated in a long time, leaving several preferences outdated. Notably, it completely disables Safe Browsing. While I understand the privacy rationale behind that choice, disabling Safe Browsing entirely for daily use is ill-advised for most users and actually makes your browser fingerprint significantly more unique. No disrespect intended whatsoever — YuzuFox was heavily inspired by CachyOS's work in the first place, and YuzuFox aims to keep those performance gains while modernizing security and privacy for a daily driver.
>
> By default, `firefox-pure` pulls in `cachyos-firefox-settings`, which conflicts with YuzuFox. To install YuzuFox on `firefox-pure`:
> 1. **Install `yuzufox-git` first**:
>    ```bash
>    paru -S yuzufox-git   # or: yay -S yuzufox-git
>    ```
>    *(If you don't have Firefox yet, this will pull regular Firefox as a dependency).*
> 2. **Then install `firefox-pure`**:
>    ```bash
>    paru -S firefox-pure   # or: yay -S firefox-pure
>    ```
> 3. Pacman will prompt that `firefox-pure` conflicts with `firefox`. Press **`y`** to remove regular Firefox. It will replace it with `firefox-pure` and keep YuzuFox without pulling in `cachyos-firefox-settings`.

### Linux & macOS (Interactive Script)

```bash
curl -sSL https://raw.githubusercontent.com/KabosuNeko/YuzuFox/main/install.sh -o install.sh
bash install.sh
```

Flags:
```bash
bash install.sh                 # Interactive profile selection
bash install.sh --all           # Apply to all detected profiles
bash install.sh --system-only   # System-wide (yuzu.js + policies.json, requires sudo)
bash install.sh --profiles-only # Profile user.js only (no root)
bash install.sh --dry-run       # Print target paths without writing
bash install.sh --uninstall     # Clean up installed files
```

*Existing `user.js` files are backed up as `user.js.yuzubak`.*

### Windows (PowerShell)

Open an Administrator PowerShell prompt:

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

## Updating & Uninstallation

### Updating

To update, rerun the installer script or pull the latest package from AUR (`paru -Syu --devel`).

> [!IMPORTANT]
> **Updating YuzuFox?**  
> Firefox writes preferences from `user.js` into your profile's persistent `prefs.js` file on startup. If a newer YuzuFox version removes or reverts a preference back to Firefox defaults, `prefs.js` will keep holding the old value unless cleared. To ensure newly updated settings and defaults take effect cleanly, **close Firefox completely** and delete `prefs.js` before updating:
> ```bash
> killall firefox firefox-bin 2>/dev/null
> rm ~/.mozilla/firefox/*.default*/prefs.js
> ```
> *(Firefox will automatically regenerate a fresh `prefs.js` on next launch. Your bookmarks, extensions, history, and saved passwords are stored in separate SQLite databases and remain completely safe).*

### Uninstallation

To uninstall:

```bash
# Linux / macOS
bash install.sh --uninstall --all

# Windows
.\install.ps1 -Uninstall -All

# Arch Linux package
sudo pacman -R yuzufox-git
```

To restore your old profile settings, rename `user.js.yuzubak` back to `user.js`.

---

## Development

The root `user.js` is generated from modular source files inside `src/user.js/`:

```
src/user.js/
├── 00-header.js
├── 10-network.js
├── 20-privacy.js
├── 30-security.js
├── 40-telemetry-connections.js
├── 50-ui-qol.js
└── 60-os-specific.js
```

Do not edit `user.js` directly. Modify the appropriate file in `src/user.js/` and build:

```bash
# Compile user.js and update user.js.lock
python3 build.py

# Validate sync in CI
python3 build.py --check
```

---

## Technical Notes

- **DNS**: YuzuFox leaves DNS handling to your operating system (`network.trr.*` untouched). If you want DoH inside the browser, configure it in `about:preferences#privacy` or check [TIPS.md](TIPS.md).
- **Safe Browsing**: Standard local hash checks for malware and phishing remain active. Only remote binary upload reputation (`browser.safebrowsing.downloads.remote.enabled`) is disabled to prevent sending download filenames to Google.
- **Hardware Resources**: With in-memory caching and larger network buffers, expect Firefox to use roughly 500 MB to 1 GB more RAM under heavy browsing compared to default disk caching. See [TIPS.md](TIPS.md) for low-memory tuning.

---

## Credits

- [Betterfox](https://github.com/yokoffing/Betterfox)
- [Arkenfox user.js](https://github.com/arkenfox/user.js)
- [cachyos-firefox-settings](https://github.com/CachyOS/CachyOS-PKGBUILDS/tree/master/cachyos-firefox-settings)
