<div align="center">
  <img src="https://github.com/user-attachments/assets/cffdbb1c-2676-4df8-94fb-0369edbb86bd" alt="YuzuFox Logo" width="160" />
  <h1>YuzuFox</h1>
  <p><b>Hardened, zero-bloat Firefox configuration focused on performance and privacy without breaking web compatibility.</b></p>
  <p>
    <a href="https://aur.archlinux.org/packages/yuzufox-git"><img src="https://img.shields.io/aur/version/yuzufox-git?color=1793d1&label=AUR&style=flat-square" alt="AUR" /></a>
    <a href="https://www.mozilla.org/firefox"><img src="https://img.shields.io/badge/Target-Firefox_Gecko-e66000?style=flat-square" alt="Firefox" /></a>
    <a href="https://github.com/KabosuNeko/YuzuFox/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-a3be8c?style=flat-square" alt="License" /></a>
  </p>
</div>

---

## Architecture & Components

| Component | Target Location | Scope & Role |
| :--- | :--- | :--- |
| **`yuzu.js`** | `browser/defaults/preferences/yuzu.js` | **System-wide (Locked)**: Hardware video decoding, WebRender, RAM cache (zero disk writes), aggressive connection tuning, and complete telemetry/Normandy purge. |
| **`user.js`** | `<profile>/user.js` | **Per-profile (Unlocked)**: Privacy hardening (ETP strict, FPP, query stripping), security (CRLite mode 2, safe renegotiation), quiet startup, and MSD smooth scrolling. |
| **`policies.json`** | `distribution/policies.json` | **Enterprise Policy**: Pre-configures uBlock Origin, sets DuckDuckGo as default private engine, disables sponsored tiles, telemetry, and promotional bloat. |

> System DNS resolver is strictly preserved (`network.trr.*` untouched). For details and resource tuning, see [TIPS.md](TIPS.md).

---

## Features

- **RAM-Only Cache & Zero Disk Writes**  
  Eliminates browser disk wear and lag by redirecting cache entirely to memory (`browser.cache.disk.enable = false`, 1GB memory cache allocation).

- **Complete Telemetry & Bloatware Purge**  
  All Mozilla diagnostics, Normandy rollouts, Shield studies, PingCentre, Pocket, Activity Stream, and sponsored URLbar suggestions are permanently locked and disabled.

- **Hardened Privacy with Zero Web Breakage**  
  Leverages Mozilla's modern Fingerprinting Protection (FPP), Enhanced Tracking Protection (ETP Strict), bounce tracking purge, and strict referrer trimming without breaking bank logins or everyday sites.

- **URL Tracking Strip**  
  Cleans invasive tracker queries (`fbclid`, `gclid`, `igshid`, `mc_eid`, etc.) upon link navigation, ensuring clean URLs and preventing cross-site behavioral profiling.

- **High-End Usability & Polish**  
  MSD Physics spring smooth scrolling, XDG Desktop Portal native file picker on Linux, middle-click autoscroll, and anti-homograph Punycode display for phishing prevention.

---

## Why YuzuFox?

Most existing Firefox hardening setups fall into two extremes:
1. **Too Aggressive (e.g., Arkenfox)**: Enables extreme Resist Fingerprinting (RFP) that locks your monitor refresh rate to 60Hz, forces light mode, breaks canvas elements, and resets your `about:config` adjustments every time Firefox restarts.
2. **Too Bloated (Default Firefox)**: Filled with sponsored shortcuts, telemetry surveys, AI experiments, and background pre-connections.

**YuzuFox** strikes the perfect balance: **clean, fast, and respectful of your privacy while keeping everyday websites fully functional.** It acts as a rock-solid, production-ready daily driver for power users and privacy enthusiasts alike.

---

## Installation

Close Firefox before installing.

### Arch Linux / CachyOS (AUR)

Install via your preferred AUR helper:

```bash
paru -S yuzufox-git
# or
yay -S yuzufox-git
```

> [!NOTE]
> The AUR package automatically applies the unified system configuration, enterprise policies, and privacy defaults (`provides=('firefox-settings')`).

> [!TIP]
> **Using Wayland? Pair YuzuFox with `firefox-pure` (CachyOS)**
>
> [`firefox-pure`](https://aur.archlinux.org/packages/firefox-pure) is an ultra-fast, Wayland-only Firefox build by the CachyOS team with `-O3`, PGO, cross-language LTO, and all Mozilla telemetry purged at compile time. *(This is completely optional — if you are using X11 or simply prefer standard Firefox, you can skip this).*
>
> **Why replace `cachyos-firefox-settings`?**  
> `cachyos-firefox-settings` has not been updated in a long time, leaving several preferences outdated. Notably, it completely disables Safe Browsing. While we understand the privacy rationale behind that choice, disabling Safe Browsing entirely for daily use is ill-advised for most users and actually makes your browser fingerprint significantly more unique. No disrespect intended whatsoever — YuzuFox was heavily inspired by CachyOS's work in the first place, and YuzuFox aims to keep those performance gains while modernizing security and privacy for a daily driver.
>
> By default, `firefox-pure` pulls in `cachyos-firefox-settings`, which conflicts with YuzuFox. To install YuzuFox on `firefox-pure`:
> 1. **Install `yuzufox-git` first**:
>    ```bash
>    paru -S yuzufox-git   # or: yay -S yuzufox-git
>    ```
>    *(If you don't have Firefox yet, this will pull regular Firefox as a dependency).*
> 2. **Then install `firefox-pure`**:
>    ```bash
>    sudo pacman -S firefox-pure
>    ```
> 3. Pacman will prompt that `firefox-pure` conflicts with `firefox`. Press **`y`** to remove regular Firefox. It will replace it with `firefox-pure` and keep YuzuFox without pulling in `cachyos-firefox-settings`.

### Linux & macOS (Installer Script)

```bash
# Recommended: download and run interactively (selects profiles)
curl -sSL https://raw.githubusercontent.com/KabosuNeko/YuzuFox/main/install.sh -o install.sh
bash install.sh
```

```bash
# Fast install: apply to all profiles without prompts
curl -sSL https://raw.githubusercontent.com/KabosuNeko/YuzuFox/main/install.sh | bash -s -- --all
```

<details>
<summary><b>Installer options & Target paths</b></summary>

```bash
bash install.sh                 # Interactive profile picker
bash install.sh --all           # All profiles, no prompt
bash install.sh --system-only   # yuzu.js + policies.json only (requires sudo)
bash install.sh --profiles-only # user.js only (no sudo)
bash install.sh --dry-run       # Preview target paths without writing
```

| OS | `policies.json` | `yuzu.js` | `user.js` |
|---|---|---|---|
| **Linux** | `/etc/firefox/policies/policies.json` | `/usr/lib/firefox/browser/defaults/preferences/yuzu.js` | `~/.mozilla/firefox/<profile>/user.js` |
| **macOS** | `/Applications/Firefox.app/.../distribution/policies.json` | `/Applications/Firefox.app/.../browser/defaults/preferences/yuzu.js` | `~/Library/Application Support/Firefox/Profiles/<profile>/user.js` |

*Existing `user.js` in a profile is automatically backed up as `user.js.yuzubak`.*
</details>

### Windows (PowerShell)

Open an elevated PowerShell (Run as Administrator):

```powershell
# Recommended: download and run interactively
irm https://raw.githubusercontent.com/KabosuNeko/YuzuFox/main/install.ps1 -OutFile install.ps1
.\install.ps1
```

```powershell
# Fast install: all profiles
.\install.ps1 -All
```

<details>
<summary><b>Installer options & Target paths</b></summary>

```powershell
.\install.ps1                   # Interactive profile picker
.\install.ps1 -All              # All profiles, no prompt
.\install.ps1 -SystemOnly       # System-wide only
.\install.ps1 -ProfilesOnly     # Per-profile only (no Administrator needed)
.\install.ps1 -DryRun           # Preview target paths
```

| File | Destination |
|---|---|
| `policies.json` | `%ProgramFiles%\Mozilla Firefox\distribution\policies.json` |
| `yuzu.js` | `%ProgramFiles%\Mozilla Firefox\browser\defaults\preferences\yuzu.js` |
| `user.js` | `%APPDATA%\Mozilla\Firefox\Profiles\<profile>\user.js` |
</details>

---

## Updating

### Arch Linux / CachyOS (AUR)

```bash
paru -Syu --devel
# or
yay -Syu --devel
```

### Script Installer (Linux, macOS, Windows)

Re-run the installer. It downloads the latest configuration from `main` and updates the files (preserving backups of previous configurations).

---

## Uninstall

### Arch Linux / CachyOS (AUR)

```bash
sudo pacman -R yuzufox-git
```

### Script Installer

```bash
# Linux / macOS
bash install.sh --uninstall --all

# Windows (PowerShell)
.\install.ps1 -Uninstall -All
```

To restore your previous profile configuration, rename `user.js.yuzubak` back to `user.js` (or remove `user.js` if you had none).

---

## Development & Build

`user.js` is compiled from modular sources inside `src/user.js/`:

```bash
# Rebuild user.js and user.js.lock
python3 build.py

# Verify sync in CI
python3 build.py --check
```

Do not edit `user.js` directly; make your modifications in `src/user.js/*.js` and run `python3 build.py`.

---

## Credits

- [Betterfox](https://github.com/yokoffing/Betterfox)
- [Arkenfox](https://github.com/arkenfox/user.js)
- [cachyos-firefox-settings](https://github.com/CachyOS/CachyOS-PKGBUILDS/tree/master/cachyos-firefox-settings)
