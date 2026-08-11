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

Core Safe Browsing (malware + phishing) is **enabled** at Firefox defaults.
Firefox sends only 32-bit hash prefixes to Google, then matches locally — no
full URLs leave the browser. DNS-level blocking (Pi-hole, NextDNS, Quad9) plus
uBlock Origin's filter lists are an additional layer on top, not a
replacement.

The one thing YuzuFox disables is **remote download reputation**
(`browser.safebrowsing.downloads.remote.enabled = false`) — the same choice
Arkenfox makes. That feature uploads file metadata to Google on every
download, with little marginal protection if you already have DNS-level
blocking.

### Verify you have DNS-level blocking (optional hardening)

- **Pi-hole / AdGuard Home** — you maintain the blocklist
- **NextDNS / Quad9** — DNS provider filters malware/phishing domains upstream
- **Stock ISP router DNS** — Safe Browsing alone still protects you; the
  DNS layer is merely a bonus

If you want remote download reputation back:

```js
user_pref("browser.safebrowsing.downloads.remote.enabled", true);
```

---

## Search engines

DuckDuckGo is the default (also in private windows). Five engines are
configured via `policies.json` — use an alias by typing it before your query
in the URL bar:

| Engine           | Alias | What it is                                                     |
| ---------------- | ----- | -------------------------------------------------------------- |
| DuckDuckGo       | —     | Default; privacy-friendly results                               |
| Startpage        | `sp`  | Proxies Google results without Google tracking                  |
| DuckDuckGo Lite  | `dl`  | Text-only DDG — fast, minimal, good on slow networks            |
| SearXNG          | `sx`  | Metasearch that aggregates many engines without tracking        |
| MetaGer          | `mg`  | German metasearch engine, privacy-first                         |

Example: `sx best noise cancelling headphones` searches SearXNG directly.

Default/aliases live in `policies.json` (`SearchEngines`), so they apply to
every profile. To change the default engine, edit that file.

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
signon.formlessCapture.enabled = false
signon.privateBrowsingCapture.enabled = false
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

## Updating & maintenance

Re-running the installer **is** the update — it always fetches the latest
files from `main` and compares them against what is installed:

- **Unchanged files** are skipped (`policies.json: up to date`).
- **Changed files** are replaced; the old `user.js` is backed up as
  `user.js.yuzubak` automatically.

```bash
# Linux / macOS
bash install.sh --all

# Windows
.\install.ps1 -All
```

After a major update, clean stale prefs. Prefs that YuzuFox removed from
`user.js` can linger in `prefs.js` and keep applying old values (for example
the old Safe Browsing block would keep malware protection off even though
`user.js` no longer disables it).

The simplest reset is to delete the profile's `prefs.js` while Firefox is
closed — it is regenerated from defaults + `user.js` on next start:

```bash
# Linux / macOS — replace <profile> with the profile dir from about:profiles
rm ~/.mozilla/firefox/<profile>/prefs.js

# Windows
del "%APPDATA%\Mozilla\Firefox\Profiles\<profile>\prefs.js"
```

Only manually-set preferences (about:config tweaks, per-site permissions)
are lost.

---

## Notifications & Push

Web Push is left at Firefox defaults (enabled), but the **notification
permission defaults to blocked** (`permissions.default.desktop-notification
= 2`). Sites can still request it, and you can allow individual sites:

1. Visit the site.
2. Click the permission icon in the URL bar (or the notification bell on the
   permission prompt) and choose **Allow**.

Or manage everything in one place: `about:preferences#privacy` →
*Permissions* → *Notifications* → *Settings*. There you can also block a
site that keeps asking.

---

## Geolocation & WebRTC

Geolocation is **blocked by default** (`permissions.default.geo = 2`) and the
network-based fallback (Google location service) is disabled. Sites can still
ask, and you allow per-site the same way as notifications (URL bar permission
icon). If a site genuinely needs location (maps, weather), grant it there.

WebRTC exposes only your **public IP** — the LAN address (192.168.x.x) is
never leaked to websites
(`media.peerconnection.ice.default_address_only`). Video calls, screen
sharing, and file transfer over WebRTC keep working; only the local-network
address is hidden.

---

## Containers

Container tabs isolate first-party storage per tab: work vs personal, dev
vs prod, one account per site — all in one window.

- **Open a container tab**: long-press the **+** (new tab) button → pick a
  container (`privacy.userContext.longPressBehavior = 2`). If the long-press
  does nothing, the picker also lives in the menu: *New Container Tab*.
- Or install the official
  [Multi-Account Containers](https://addons.mozilla.org/firefox/addon/multi-account-containers/)
  extension for per-site rules ("always open example.com in Work").

Containers do **not** replace a VPN or a separate browser profile — they
separate cookies/storage, not network identity.

---

## Why YuzuFox uses more RAM / CPU / GPU than vanilla Firefox

YuzuFox prioritises **speed over resource frugality** — it trades idle RAM /
GPU / CPU headroom for lower latency and snappier browsing. Every pref below
is deliberate; if your machine has 8+ GB of RAM and a modern GPU, the
trade-off is a pure win. If you are on 4 GB or an integrated-only GPU, some
values can be dialled down (see "Tuning for low-RAM machines" at the bottom).

### RAM — cache everything in memory, never touch the SSD

| Pref                                           | Firefox default | YuzuFox   | What it does                                                |
| ---------------------------------------------- | --------------- | --------- | ----------------------------------------------------------- |
| `browser.cache.disk.enable`                      | `true`            | `false`     | All cached pages live in RAM; SSD write wear is eliminated  |
| `browser.cache.memory.capacity`                  | `-1` (auto)      | `1048576`   | 1 GB pool for page cache                                    |
| `media.memory_cache_max_size`                    | auto             | `1048576`   | 1 GB per media element (video, audio)                       |
| `media.memory_caches_combined_limit_kb`          | auto             | `3145728`   | 3 GB total media cache                                      |
| `image.cache.size`                               | auto             | `10485760`  | 10 MB decoded-image pool — images re-render from cache      |
| `gfx.content.skia-font-cache-size`               | auto             | `80` (MB)   | Larger font cache → fewer glyph re-renders during scroll    |
| `browser.sessionhistory.max_total_viewers`       | `-1` (auto)      | `10`        | Back/forward cache holds 10 full page states (~20-50 MB each) |

### CPU — compile JavaScript sooner, render faster

| Pref                                        | Firefox default | YuzuFox | What it does                                                   |
| ------------------------------------------- | --------------- | ------- | -------------------------------------------------------------- |
| `javascript.options.baselinejit.threshold`    | `100`             | `50`     | Warm functions compile to Baseline JIT after 50 iterations     |
| `javascript.options.ion.threshold`            | `~1000`           | `500`    | Hot-paths compile to Ion JIT (optimising compiler) sooner      |
| `content.notify.interval`                     | `120000` (μs)    | `100000` | Incremental reflow timer fires more often → pages paint faster |

More JIT compilation = higher CPU usage during page load. On a modern
multi-core CPU this is imperceptible; the result is faster Time-to-Interactive.

### GPU — force hardware acceleration for everything

| Pref                                          | Firefox default | YuzuFox | What it does                                      |
| --------------------------------------------- | --------------- | ------- | ------------------------------------------------- |
| `gfx.webrender.compositor.force-enabled`        | auto             | `true`    | Compositor always uses GPU (~50-100 MB VRAM extra) |
| `media.hardware-video-decoding.force-enabled`   | auto             | `true`    | Video decode always on GPU hardware               |
| `media.gpu-process-decoder`                     | auto             | `true`    | Dedicated GPU process for video (extra ~30 MB)    |
| `gfx.webrender.precache-shaders`                | auto             | `true`    | Compile shaders ahead of time (faster first paint) |
| `gfx.webrender.program-binary-disk`             | auto             | `true`    | Cache compiled shaders on disk → skip recompile    |

GPU stays active and uses more VRAM, but video playback is smooth and page
compositing never falls back to software rendering.

### Network — more connections, more socket buffers

| Pref                                             | Firefox default | YuzuFox  | What it does                                              |
| ------------------------------------------------ | --------------- | -------- | --------------------------------------------------------- |
| `network.http.max-connections`                     | `900`             | `1800`     | Twice as many parallel connections → more socket buffers  |
| `network.http.max-persistent-connections-per-server` | `6`               | `10`       | More keep-alive sockets per host                          |
| `network.http.http3.enable`                        | `true` (default) | `true`     | Explicitly enforce QUIC (HTTP/3)                          |

### Total estimate

YuzuFox uses roughly **500 MB to 1.5 GB more RAM** than vanilla Firefox
(depends on open-tab count and media load). GPU is always active. CPU spikes
are higher during page load but settle faster.

### Tuning for low-RAM machines (4-6 GB)

Add these overrides to your `user.js` *after* YuzuFox is installed (they go
at the end of the file so they take precedence):

```js
user_pref("browser.cache.memory.capacity", 524288);        // 512 MB instead of 1 GB
user_pref("media.memory_caches_combined_limit_kb", 1048576); // 1 GB instead of 3 GB
user_pref("browser.sessionhistory.max_total_viewers", 3);  // 3 pages instead of 10
user_pref("gfx.content.skia-font-cache-size", 40);         // 40 MB instead of 80 MB
user_pref("media.memory_cache_max_size", 524288);          // 512 MB per media element
user_pref("network.http.max-connections", 900);            // Firefox default
```

Restart Firefox after editing. You keep the privacy/security hardening while
cutting RAM usage roughly in half.

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
curl -sSL https://raw.githubusercontent.com/KabosuNeko/YuzuFox/main/install.sh | bash -s -- --uninstall --all
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

Safe Browsing core (malware + phishing) is on by default. If warnings are
missing, something else has switched them off — check under
`about:preferences#privacy` → *Security* that "Block dangerous and
deceptive content" and "Block dangerous downloads" are ticked, or verify in
`about:config` that `browser.safebrowsing.malware.enabled` and
`browser.safebrowsing.phishing.enabled` are `true`.

The only Safe Browsing feature YuzuFox keeps off is *remote download
reputation* (`browser.safebrowsing.downloads.remote.enabled`) — see
[Safe Browsing](#safe-browsing) for why, and how to turn it back on.

### How to fully revert

Run the uninstall command for your platform:

```bash
# Linux / macOS
curl -sSL https://raw.githubusercontent.com/KabosuNeko/YuzuFox/main/install.sh | bash -s -- --uninstall --all
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
| `50-ui-qol.js` | UI tweaks, URL bar, containers, scrolling |
| `60-os-specific.js` | Linux, Windows, macOS blocks |

After editing, run `python3 build.py` to regenerate `user.js` and `user.js.lock`
before committing.
