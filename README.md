# YuzuFox

<p><br/></p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/cffdbb1c-2676-4df8-94fb-0369edbb86bd" alt="yuzufox Logo" style="width: 192px" />
</p>
<p><br/></p>

**Hardened, zero-bloat Firefox for daily use.**

YuzuFox is a Firefox config that kills telemetry, hardens privacy, and tunes
performance — without breaking the sites you visit. It expects a modern machine
and uses the hardware you paid for.

---
### Why YuzuFox

YuzuFox sits at the intersection: **Arkenfox-grade telemetry/privacy +
Betterfox-grade daily-use curation + CachyOS-grade performance via aggressive
hardware tuning + enterprise-policy layer + maintenance tooling** — without
the daily-use breakage that comes from extremes.

See [TIPS.md](TIPS.md) for the resource-usage rationale and tuning guide.

## Install

### Linux / macOS

Detects the platform, installs system-wide settings (asks for sudo), then
lists profiles and asks which ones to install `user.js` into.

> Download the script first, then run it locally (recommended):

```bash
curl -sSL https://raw.githubusercontent.com/KabosuNeko/YuzuFox/main/install.sh -o install.sh
bash install.sh
```

> For a fast install (run directly, it'll install user.js for every profile):

```bash
curl -sSL https://raw.githubusercontent.com/KabosuNeko/YuzuFox/main/install.sh | bash -s -- --all
```

The installer refuses to prompt over a pipe and tells you exactly that, with
the two commands above.

| | policies.json | yuzu.js |
|---|---|---|
| **Linux** | `/etc/firefox/policies/policies.json` | `/usr/lib/firefox/browser/defaults/preferences/yuzu.js` |
| **macOS** | `/Applications/Firefox.app/.../distribution/policies.json` | `/Applications/Firefox.app/.../browser/defaults/preferences/yuzu.js` |

Variants:

```bash
bash install.sh                 # interactive profile picker
bash install.sh --system-only   # yuzu.js + policies.json only
bash install.sh --profiles-only # user.js only (no sudo)
bash install.sh --all           # every profile, no prompt
bash install.sh --dry-run       # preview, write nothing
```

Existing `user.js` is **backed up** as `user.js.yuzubak`.

### Windows

Open an **elevated** PowerShell, download the script, and run it locally (recommended):

```powershell
irm https://raw.githubusercontent.com/KabosuNeko/YuzuFox/main/install.ps1 -OutFile install.ps1
.\install.ps1
```

> If execution policy blocks `.ps1` files, bypass it for this run:
>
> ```powershell
> powershell -ExecutionPolicy Bypass -File .\install.ps1
> ```

For a fast install (run directly, it'll install user.js for every profile):

```powershell
irm https://raw.githubusercontent.com/KabosuNeko/YuzuFox/main/install.ps1 -OutFile install.ps1
.\install.ps1 -All
```

| File | Path |
|---|---|
| policies.json | `%ProgramFiles%\Mozilla Firefox\distribution\policies.json` |
| yuzu.js | `%ProgramFiles%\Mozilla Firefox\browser\defaults\preferences\yuzu.js` |
| user.js | selected profiles under `%APPDATA%\Mozilla\Firefox\Profiles\` |

## Uninstall

```bash
# Linux / macOS — every profile, no confirm prompt (works with the pipe)
curl -sSL https://raw.githubusercontent.com/KabosuNeko/YuzuFox/main/install.sh | bash -s -- --uninstall --all

# Or download first for the interactive [y/N] confirmation
curl -sSL https://raw.githubusercontent.com/KabosuNeko/YuzuFox/main/install.sh -o install.sh
bash install.sh --uninstall
```

```powershell
# Windows
irm https://raw.githubusercontent.com/KabosuNeko/YuzuFox/main/install.ps1 -OutFile install.ps1
.\install.ps1 -Uninstall
```

### Updating

Re-running the installer **is** the update: it always fetches the latest files
from `main` and compares them against what is installed. Unchanged files are
skipped ("up to date"); changed ones are replaced (with a backup of the old
`user.js`).

### Cleaning stale prefs

Prefs removed from `user.js` can linger in a profile's `prefs.js` and keep
applying old values (e.g. the old Safe Browsing block). If you see behavior
from a pref that is no longer in `user.js`, reset the profile's prefs:

```bash
# Close Firefox, then delete the pref file — it is regenerated from
# defaults + user.js on next start
rm ~/.mozilla/firefox/<profile>/prefs.js
```

The file is regenerated automatically; only manually-set preferences
(about:config tweaks, permissions granted per-site) are lost.

## Contributing

`user.js` is generated from modular source files under `src/user.js/`.
To change a pref, edit the appropriate source file and run `python3 build.py`.
CI enforces that `user.js` and `user.js.lock` stay in sync via `build.py --check`.
`yuzu.js` and `policies.json` remain standalone.

## Credits

[Betterfox](https://github.com/yokoffing/Betterfox) ·
[Arkenfox](https://github.com/arkenfox/user.js) ·
[cachyos-firefox-settings](https://github.com/CachyOS/CachyOS-PKGBUILDS/tree/master/cachyos-firefox-settings) ·
[Firefox admin docs](https://firefox-admin-docs.mozilla.org/)
