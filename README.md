# YuzuFox

<p align="center">
  <img src="https://github.com/user-attachments/assets/cffdbb1c-2676-4df8-94fb-0369edbb86bd" alt="YuzuFox Logo" style="width: 192px" />
</p>

Hardened, zero-bloat Firefox configuration focused on performance and privacy without breaking web compatibility.

---

## Architecture

- **`yuzu.js`** (System-wide, locked): Hardware video decoding, WebRender, RAM cache (zero disk writes), aggressive connection tuning, complete telemetry and Mozilla bloat/AI removal.
- **`user.js`** (Per-profile, unlocked): Privacy hardening (ETP strict, FPP, query stripping), security (CRLite mode 2, safe renegotiation), quiet startup, and UI/QoL tweaks.
- **`policies.json`** (Enterprise policy): Preinstalls uBlock Origin, configures private search engines (Startpage default), removes sponsored tiles and promotional services.

System DNS resolver is preserved (`network.trr.*` untouched). For details and resource tuning, see [TIPS.md](TIPS.md).

---

## Installation

Close Firefox before installing.

### Linux & macOS

```bash
# Recommended: download and run interactively (selects profiles)
curl -sSL https://raw.githubusercontent.com/KabosuNeko/YuzuFox/main/install.sh -o install.sh
bash install.sh
```

```bash
# Fast install: apply to all profiles without prompts
curl -sSL https://raw.githubusercontent.com/KabosuNeko/YuzuFox/main/install.sh | bash -s -- --all
```

Installer options:
```bash
bash install.sh                 # Interactive profile picker
bash install.sh --all           # All profiles, no prompt
bash install.sh --system-only   # yuzu.js + policies.json only (requires sudo)
bash install.sh --profiles-only # user.js only (no sudo)
bash install.sh --dry-run       # Preview target paths without writing
```

Target paths:
| OS | `policies.json` | `yuzu.js` | `user.js` |
|---|---|---|---|
| **Linux** | `/etc/firefox/policies/policies.json` | `/usr/lib/firefox/browser/defaults/preferences/yuzu.js` | `~/.mozilla/firefox/<profile>/user.js` |
| **macOS** | `/Applications/Firefox.app/.../distribution/policies.json` | `/Applications/Firefox.app/.../browser/defaults/preferences/yuzu.js` | `~/Library/Application Support/Firefox/Profiles/<profile>/user.js` |

*Existing `user.js` in a profile is backed up as `user.js.yuzubak`.*

### Windows

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

Installer options:
```powershell
.\install.ps1                   # Interactive profile picker
.\install.ps1 -All              # All profiles, no prompt
.\install.ps1 -SystemOnly       # System-wide only
.\install.ps1 -ProfilesOnly     # Per-profile only (no Administrator needed)
.\install.ps1 -DryRun           # Preview target paths
```

Target paths:
| File | Destination |
|---|---|
| `policies.json` | `%ProgramFiles%\Mozilla Firefox\distribution\policies.json` |
| `yuzu.js` | `%ProgramFiles%\Mozilla Firefox\browser\defaults\preferences\yuzu.js` |
| `user.js` | `%APPDATA%\Mozilla\Firefox\Profiles\<profile>\user.js` |

---

## Updating

Re-run the installer. It downloads the latest configuration from `main` and overwrites installed files (backing up existing profile `user.js` to `user.js.yuzubak`).

---

## Uninstall

```bash
# Linux / macOS
bash install.sh --uninstall --all
```

```powershell
# Windows
.\install.ps1 -Uninstall -All
```

To restore your previous profile configuration, rename `user.js.yuzubak` back to `user.js` (or delete `user.js` if you had none).

---

## Development & Build

`user.js` is compiled from modular sources in `src/user.js/`:

```bash
# Rebuild user.js and user.js.lock
python3 build.py

# Verify sync in CI
python3 build.py --check
```

Do not edit `user.js` directly; make changes in `src/user.js/*.js` and run `python3 build.py`.

---

## Credits

- [Betterfox](https://github.com/yokoffing/Betterfox)
- [Arkenfox](https://github.com/arkenfox/user.js)
- [cachyos-firefox-settings](https://github.com/CachyOS/CachyOS-PKGBUILDS/tree/master/cachyos-firefox-settings)
