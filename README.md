# YuzuFox

<p><br/></p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/cffdbb1c-2676-4df8-94fb-0369edbb86bd" alt="yuzufox Logo" style="width: 192px" />
</p>
<p><br/></p>

**Hardened, zero-bloat Firefox for daily use.**

---

## Overview

YuzuFox configures Firefox in **two layers**:

| Layer | File | Scope |
|---|---|---|
| System-wide | `yuzu.js` + `policies.json` | Every profile, locked prefs, installed once with sudo |
| Per-profile | `user.js` | Optional per-profile tuning, updated independently |

- **`yuzu.js`** — system base: telemetry block, Mozilla bloat removal,
  WebRender/GPU, locale, desktop integration. Locked prefs, installed once.
- **`policies.json`** — enterprise policy: auto-installs uBlock Origin, sets
  DuckDuckGo as default search, disables telemetry and Pocket at the policy
  level.
- **`user.js`** — per-profile tuning: privacy & security, performance, QoL.
  *Generated from `src/user.js/*.js` by `build.py`.* Install into the profiles
  you use. Updated separately from the system base.
- **`install.sh`** — one script for Linux/macOS: system-wide + per-profile.
- **`install.ps1`** — same for Windows.

### Why two config files

`yuzu.js` rarely changes — only when Mozilla reshuffles a pref. You install it
once and it stays as a **locked** floor for every profile.

`user.js` tracks Firefox updates more closely. Privacy prefs get renamed or
deprecated; this file absorbs that churn. **Update it every few weeks** without
ever touching the system-wide base.

Keeping them separate also prevents per-profile choices from being overwritten
by a system-wide re-install.

## Install

### Linux / macOS

Detects the platform, installs system-wide settings (asks for sudo), then
lists profiles and asks which ones to install `user.js` into.

> **Piped installs can't prompt.** `curl ... | bash` feeds the script through
> stdin, so the interactive profile picker has no keyboard to read.
> Download the script first, then run it locally:

```bash
curl -sSL https://raw.githubusercontent.com/KabosuNeko/YuzuFox/main/install.sh -o install.sh
bash install.sh
```

> For a non-interactive install (every profile, no prompt, works in a pipe):

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

### Updating

Re-running the installer **is** the update: it always fetches the latest files
from `main` and compares them against what is installed. Unchanged files are
skipped ("up to date"); changed ones are replaced (with a backup of the old
`user.js`).

### Cleaning stale prefs

Prefs removed from `user.js` can linger in a profile's `prefs.js` and keep
applying old values (e.g. the old Safe Browsing block). `prefsCleaner` resets
them to Firefox defaults:

```bash
# Linux / macOS
bash prefsCleaner.sh --dry-run   # preview
bash prefsCleaner.sh --all       # clean every profile

# Windows
.\prefsCleaner.ps1 -DryRun
.\prefsCleaner.ps1 -All
```

Each `prefs.js` is backed up to `prefs.js.yuzubak` first. Close Firefox
before running.

### Windows

Open an **elevated** PowerShell, download the script, and run it locally:

```powershell
irm https://raw.githubusercontent.com/KabosuNeko/YuzuFox/main/install.ps1 -OutFile install.ps1
.\install.ps1
```

> If execution policy blocks `.ps1` files, bypass it for this run:
>
> ```powershell
> powershell -ExecutionPolicy Bypass -File .\install.ps1
> ```

For a non-interactive install (every profile, no prompt), add `-All`:

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

## Further reading

See **[TIPS.md](TIPS.md)** for DNS/DoH, Safe Browsing, search engines,
extensions, and zero-day rationale.

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