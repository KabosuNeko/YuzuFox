# Tips & rationale

---

## DNS and DoH

YuzuFox leaves DNS resolution to the operating system. **No DoH is forced**;
`network.trr.*` stays at Firefox defaults. Your system resolver
(systemd-resolved, unbound, Pi-hole, whatever) handles DNS — the browser
stays out of that path.

### Enabling DoH

If you prefer DoH, add these to `user.js`:

```js
user_pref("network.trr.mode", 2);                     // 2 = DoH only
user_pref("network.trr.uri", "https://dns.quad9.net/dns-query");
user_pref("network.trr.resolvers", '[{"name":"Quad9","url":"https://dns.quad9.net/dns-query"}]');
```

Swap `quad9.net` for Cloudflare, NextDNS, or Mullvad. Mode values:

| `network.trr.mode` | Behaviour |
|---|---|
| `0` (default) | Off — system resolver |
| `2` | DoH only, no fallback |
| `3` | DoH with system fallback |
| `5` | DoH explicitly, no system resolver |

**Mode 2** is the safest if you go this route — *a silent fallback to plain DNS
defeats the point.*

---

## Safe Browsing

> **⚠️ WARNING:** YuzuFox disables ALL Safe Browsing checks because it
> assumes you have **DNS-level blocking** (Pi-hole, NextDNS, Quad9, AdGuard
> Home, or a system resolver that filters malicious domains). Without that,
> you lose phishing/malware protection entirely. If you are not sure, keep
> Safe Browsing **enabled**.

All Google and Mozilla Safe Browsing checks are disabled. Firefox normally
sends hashed URL prefixes to Google *every ~30 minutes and on every
download*. YuzuFox replaces that with DNS-level blocking (system resolver,
Pi-hole, Quad9) plus uBlock Origin's filter lists.

### Verify you have DNS-level blocking

The DNS resolver must block known-malicious domains itself. Quick checks:

- **Pi-hole / AdGuard Home** — you maintain the blocklist, browser trusts the result
- **NextDNS / Quad9** — DNS provider filters malware/phishing domains upstream
- **Stock ISP router DNS** — ❌ *not sufficient*; re-enable Safe Browsing

If in doubt, re-enable Safe Browsing (see below) — the privacy cost is small
compared to losing malware protection.

### Re-enabling

```js
user_pref("browser.safebrowsing.malware.enabled", true);
user_pref("browser.safebrowsing.phishing.enabled", true);
user_pref("browser.safebrowsing.downloads.enabled", true);
```

This restores core malware/phishing checks. Remote download reputation
lookups *stay off* — those send data to Google on every file download.

---

## Search engines

DuckDuckGo is the default. Startpage is added as a backup (`sp` keyword)
— it proxies Google results without Google tracking.

If DDG results aren't good enough, switch to Startpage: type `sp` before
your query, or change the default in `policies.json`.

---

## Extensions

uBlock Origin is the only extension YuzuFox installs. Adding more blockers
(CanvasBlocker, Privacy Badger, HTTPS Everywhere…) works **against** you:

- uBO and Firefox's built-in fingerprinting protection already cover
  canvas, user-agent, referrer trimming, and tracking.
- Extra blockers double-write rules, break sites, and make your fingerprint
  **more** unique — each extension has recognisable behaviour patterns.
- More code = more attack surface.

Use uBO + one extension you actually need (Bitwarden, Tridactyl,
Violentmonkey). **One, not ten.**

---

## Password manager

Firefox's built-in password manager is disabled:

```js
browser.formfill.enable = false
signon.rememberSignons = false
signon.autofillForms = false
```

Use an **external password manager** instead. It keeps credentials encrypted
outside the browser and syncs across devices:

| Manager | Type | Notes |
|---|---|---|
| [Bitwarden](https://bitwarden.com/) | Cloud | Free tier, open-source, browser extension + mobile |
| [KeePassXC](https://keepassxc.org/) | Local | Offline .kdbx file, sync via Syncthing/Nextcloud |
| [pass](https://www.passwordstore.org/) | CLI | GPG + Git, minimal, Unix philosophy |

**Recommended:** Bitwarden for most people (easiest), KeePassXC if you want
full offline control, `pass` if you live in terminal.

If you must use Firefox's built-in manager, re-enable:

```js
user_pref("browser.formfill.enable", true);
user_pref("signon.rememberSignons", true);
```

---

## Region-specific filter lists

YuzuFox ships with a universal uBO filter set. After installing, open
uBlock Origin → *Dashboard* → *Filter lists* to enable region-specific
filters (Vietnamese, RU AdList, etc. — see
[yokoffing's filterlists guide](https://github.com/yokoffing/filterlists)).
No regional list is forced on everyone.

---

## Firefox forks and zero-days

Zen, Waterfox, Pulse, Floorp and similar forks are maintained by small
teams that ship security patches slower than Mozilla. A zero-day exploited
in the wild hours after disclosure can sit unpatched in a fork for weeks.

YuzuFox targets **stock Firefox** so zero-day coverage comes from Mozilla
directly. You can copy the config files into a fork, but the fork itself
remains the *bottleneck* — every layer between you and Mozilla's release
cycle is added delay.

---

## Troubleshooting

### Firefox won't start or pages won't load

Close Firefox, then temporarily disable the per-profile tuning:

```bash
mv <profile>/user.js <profile>/user.js.off
```

Start Firefox. If it starts, the issue is in `user.js`. Restore the backup:

```bash
mv <profile>/user.js.yuzubak <profile>/user.js
```

If you don't have a backup, remove `user.js.off` and run the uninstaller
(see [How to fully revert](#how-to-fully-revert)).

If Firefox still won't start, remove the system-wide files:

```bash
curl -sSL https://raw.githubusercontent.com/KabosuNeko/YuzuFox/main/install.sh | bash -s -- --uninstall
```

### Some website breaks

First try disabling uBlock Origin on that site. If the site still breaks,
test without `user.js`:

1. Close Firefox.
2. Rename `<profile>/user.js` to `<profile>/user.js.off`.
3. Restart Firefox and revisit the site.

If the site works, the cause is a `user.js` pref. Restore `user.js.yuzubak`
if you have it, or narrow the issue by re-enabling half the prefs at a time.

### DNS/DoH issues

If pages fail to resolve, make sure Firefox is using the system resolver.
In `about:config`, confirm:

```js
network.trr.mode = 0
```

If you enabled DoH earlier, see [DNS and DoH](#dns-and-doh) for the correct
settings. You can also clear the DNS cache at `about:networking#dns`.

### Safe Browsing warnings missing

YuzuFox disables Safe Browsing by default. To bring warnings back, see
[Safe Browsing](#safe-browsing) and set:

```js
user_pref("browser.safebrowsing.malware.enabled", true);
user_pref("browser.safebrowsing.phishing.enabled", true);
user_pref("browser.safebrowsing.downloads.enabled", true);
```

### How to fully revert

Run the uninstall command for your platform:

```bash
# Linux / macOS
curl -sSL https://raw.githubusercontent.com/KabosuNeko/YuzuFox/main/install.sh | bash -s -- --uninstall
```

```powershell
# Windows
$s = irm https://raw.githubusercontent.com/KabosuNeko/YuzuFox/main/install.ps1
& ([scriptblock]::Create($s)) -Uninstall
```

Then restore each profile's backup:

```bash
mv <profile>/user.js.yuzubak <profile>/user.js
```

If `user.js.yuzubak` does not exist, the installer had no previous `user.js`
to back up. In that case, simply delete `<profile>/user.js`.

Restart Firefox.

### Permission denied on Linux/macOS

The installer uses `sudo` for system-wide paths (`/etc/firefox`,
`/usr/lib/firefox`, `/Applications/Firefox.app`). Make sure your account has
sudo rights and that Firefox is not running. Do not run the profile step with
sudo, because `user.js` belongs in your own profile directory.

If you need to install manually:

```bash
sudo mkdir -p /etc/firefox/policies
sudo cp policies.json /etc/firefox/policies/policies.json
sudo mkdir -p /usr/lib/firefox/browser/defaults/preferences
sudo cp yuzu.js /usr/lib/firefox/browser/defaults/preferences/yuzu.js
```

On macOS, replace `/usr/lib/firefox/...` with the paths inside
`/Applications/Firefox.app/Contents/Resources/`.

---

## Credits

`yuzu.js` and `user.js` draw from
[Betterfox](https://github.com/yokoffing/Betterfox),
[Arkenfox](https://github.com/arkenfox/user.js), and
[cachyos-firefox-settings](https://github.com/CachyOS/CachyOS-PKGBUILDS/tree/master/cachyos-firefox-settings).
Installers verified against [Firefox admin docs](https://firefox-admin-docs.mozilla.org/)
and [policy templates](https://github.com/mozilla/policy-templates).

## Editing preferences

`user.js` is generated. **Do not edit `user.js` directly** — your changes
will be overwritten the next time `python3 build.py` runs.

Instead, edit the appropriate source file under `src/user.js/`:

| Source file | Contents |
|---|---|
| `00-header.js` | Project header |
| `10-network.js` | DNS, network, speculative connections, OCSP/CRLite |
| `20-privacy.js` | HTTPS-only, fingerprinting, referrers, GPC, cookies |
| `30-security.js` | Safe Browsing, download sandboxing |
| `40-telemetry-connections.js` | Startup, push, attribution |
| `45-performance.js` | Cache, rendering, JIT/GC, network feeds |
| `50-ui-qol.js` | UI tweaks, URL bar, containers, scrolling |
| `60-os-specific.js` | Linux, Windows, macOS blocks |

After editing, run `python3 build.py` to regenerate `user.js` and `user.js.lock`
before committing.