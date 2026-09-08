# YuzuFox — Tuning & Reference

Practical guide for customization, resource tuning, and troubleshooting.

---

## 1. Search Engine Shortcuts

Configured via `policies.json` across all profiles. Prefix your query with an alias in the address bar:

| Engine | Alias | Description |
|---|---|---|
| **Startpage** | `sp` | Default (normal and private). Proxies Google results privately |
| **DuckDuckGo Lite** | `dl` | Text-only DuckDuckGo; fast and bandwidth-efficient |
| **SearXNG** | `sx` | Open metasearch aggregating multiple engines |
| **MetaGer** | `mg` | German privacy-first metasearch engine |

*Example:* typing `sx rust async tutorial` queries SearXNG directly.

---

## 2. DNS & DoH

YuzuFox preserves your system DNS resolver (`network.trr.mode = 0`). Resolution stays with your local or network setup (systemd-resolved, unbound, Pi-hole, AdGuard Home).

To force DNS-over-HTTPS (DoH) inside Firefox, add to your profile `user.js`:

```javascript
user_pref("network.trr.mode", 3); // 3 = DoH only, no fallback
user_pref("network.trr.uri", "https://dns.quad9.net/dns-query");
user_pref("network.trr.resolvers", '[{"name":"Quad9","url":"https://dns.quad9.net/dns-query"}]');
```

*Modes:* `0` = Off (system DNS), `2` = DoH with system fallback, `3` = DoH strictly (recommended if using DoH), `5` = Disabled.

---

## 3. Safe Browsing

Core Safe Browsing (malware and phishing protection) remains **active** using Firefox defaults:
- Firefox queries 32-bit hash prefixes locally without sending full URLs to Google.
- Remote download reputation (`browser.safebrowsing.downloads.remote.enabled = false`) is disabled to prevent uploading file metadata to remote servers.

To re-enable remote download reputation:

```javascript
user_pref("browser.safebrowsing.downloads.remote.enabled", true);
```

---

## 4. Performance & Resource Tuning

YuzuFox trades idle memory for responsiveness and SSD longevity:
- **Disk cache disabled**: All cache I/O runs in RAM (`browser.cache.disk.enable = false`). Eliminates disk wear.
- **Aggressive buffers & JIT**: Video buffers, font cache, and parallel connection ceilings are increased for lower latency.

### Low-RAM Machines (4–6 GB RAM)

If your machine is memory-constrained, add these overrides at the bottom of your profile `user.js`:

```javascript
user_pref("browser.cache.memory.capacity", 524288);          // 512 MB cache (default: 1 GB)
user_pref("media.memory_caches_combined_limit_kb", 1048576); // 1 GB media cache (default: 3 GB)
user_pref("media.memory_cache_max_size", 524288);            // 512 MB per video element
user_pref("browser.sessionhistory.max_total_viewers", 3);    // 3 back/forward cached pages (default: 10)
user_pref("gfx.content.skia-font-cache-size", 40);           // 40 MB font cache (default: 80 MB)
user_pref("network.http.max-connections", 900);              // 900 connections (default: 1800)
```

Restart Firefox to apply.

---

## 5. Passwords & Extensions

- **Extensions**: uBlock Origin is preinstalled via `policies.json`. Avoid installing redundant ad/tracker blockers (Privacy Badger, CanvasBlocker), as overlapping extensions increase fingerprint uniqueness and site breakage.
- **Password Manager**: Firefox's internal form autofill and password saving are disabled by default. Use a dedicated password manager (Bitwarden, KeePassXC, or `pass`).

To restore Firefox's built-in password manager:

```javascript
user_pref("browser.formfill.enable", true);
user_pref("signon.rememberSignons", true);
user_pref("signon.autofillForms", true);
```

---

## 6. Geolocation & Permissions

- **Geolocation**: Blocked by default (`permissions.default.geo = 2`). Google's location provider is replaced with [BeaconDB](https://beacondb.net/v1/geolocate). When a website genuinely needs location, allow it per-site via the URL bar permission icon.
- **WebRTC**: Bound to public IP only (`media.peerconnection.ice.default_address_only = true`). Local LAN IPs (192.168.x.x) are never exposed.

---

## 7. Troubleshooting & Recovery

### A website breaks
1. Click uBlock Origin on the toolbar and toggle power off for that site.
2. If the site still fails, test whether `user.js` is the cause:
   - Close Firefox.
   - Rename `<profile>/user.js` to `user.js.off`.
   - Restart Firefox and test.
3. If fixed without `user.js`, revert with `cp user.js.yuzubak user.js`.

### Resetting stale preferences
Preferences removed from `user.js` can linger in a profile's `prefs.js`. To perform a clean reset:

```bash
# Linux
rm ~/.config/mozilla/firefox/<profile>/prefs.js

# macOS
rm ~/Library/Application\ Support/Firefox/Profiles/<profile>/prefs.js

# Windows
del "%APPDATA%\Mozilla\Firefox\Profiles\<profile>\prefs.js"
```

Firefox will recreate `prefs.js` cleanly from defaults and `user.js` on the next launch.

---

## 8. Source Modular Structure

When customizing the codebase, edit files under `src/user.js/`:

| Source File | Scope |
|---|---|
| `00-header.js` | Configuration header |
| `10-network.js` | Speculative connections, prefetching, WebRTC |
| `20-privacy.js` | HTTPS-Only, ETP strict, FPP, query stripping, form autofill |
| `30-security.js` | CRLite, safe renegotiation, Safe Browsing, download temp isolation |
| `40-telemetry-connections.js` | Blank startup, quiet tabs, session storage privacy |
| `50-ui-qol.js` | URL bar feature gates, containers, smooth scrolling |
| `60-os-specific.js` | Platform specific overrides (Linux, Windows, macOS) |

Rebuild after editing:

```bash
python3 build.py
python3 build.py --check
```
