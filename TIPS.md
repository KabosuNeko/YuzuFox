# Tips & Technical Reference

Technical rationale, configuration overrides, and troubleshooting guide for YuzuFox.

---

## 1. Memory & Hardware Tuning

YuzuFox eliminates disk cache I/O to protect SSDs from continuous write cycles and reduce page load latency.

### Memory Cache Allocation
| Preference | Default | YuzuFox | Purpose |
| :--- | :--- | :--- | :--- |
| `browser.cache.disk.enable` | `true` | `false` | Eliminates disk cache writes completely |
| `browser.cache.memory.capacity` | `-1` (auto) | `1048576` | 1 GB memory cache pool |
| `media.memory_cache_max_size` | auto | `1048576` | 1 GB buffer per media stream |
| `media.memory_caches_combined_limit_kb` | auto | `3145728` | 3 GB total media buffer cap |
| `browser.sessionhistory.max_total_viewers` | auto | `10` | Keeps 10 tabs in memory for instant back/forward navigation |

### Low-RAM Override (Systems with ≤ 4–6 GB RAM)
Add to your profile `user.js`:
```js
user_pref("browser.cache.memory.capacity", 524288);          // 512 MB cache pool
user_pref("media.memory_caches_combined_limit_kb", 1048576);   // 1 GB total media cap
user_pref("media.memory_cache_max_size", 262144);            // 256 MB per stream
user_pref("browser.sessionhistory.max_total_viewers", 3);    // 3 back/forward cached pages
user_pref("network.http.max-connections", 900);              // Stock connection count
```

---

## 2. Hardware Video Decoding

### Verification
1. Open `about:support` in Firefox. Under **Graphics**, ensure **Compositing** is `WebRender` and hardware decoding shows `Supported`.
2. Play a 4K 60fps video on YouTube and inspect GPU utilization in terminal:
   - **Intel**: `sudo intel_gpu_top` (monitor the `Video` engine).
   - **NVIDIA / AMD**: `nvtop` (monitor the `DEC` percentage).

### Legacy iGPUs (H.264 Fallback)
If CPU spikes to 100% on older processors lacking VP9/AV1 hardware decoding, install [enhanced-h264ify](https://addons.mozilla.org/firefox/addon/enhanced-h264ify/) to force YouTube to stream lightweight AVC/H.264 video.

---

## 3. DNS over HTTPS (DoH)

YuzuFox defaults to your operating system resolver (`systemd-resolved`, local Pi-hole, or unbound).

To enforce encrypted DoH directly inside Firefox:
```js
user_pref("network.trr.mode", 3);                     // 3 = Strict DoH (no plaintext fallback)
user_pref("network.trr.uri", "https://dns.quad9.net/dns-query");
user_pref("network.trr.resolvers", '[{"name":"Quad9","url":"https://dns.quad9.net/dns-query"}]');
```

| Mode | Behavior |
| :---: | :--- |
| `0` | Native OS DNS only (default) |
| `2` | DoH preferred; fallback to system resolver on error |
| `3` | Strict DoH only (fails connection if DoH resolver is unreachable) |
| `5` | DoH hard-disabled |

---

## 4. Safe Browsing

Local 32-bit hash prefix matching remains active at Firefox defaults (URLs are checked locally against downloaded databases; full URLs are never leaked to Google).

Only **remote binary reputation upload** is disabled to prevent sending downloaded filenames, sizes, and origin hashes to Google servers:
```js
user_pref("browser.safebrowsing.downloads.remote.enabled", false);
```

To re-enable Google remote binary analysis (useful if frequently downloading untrusted third-party executables):
```js
user_pref("browser.safebrowsing.downloads.remote.enabled", true);
```

---

## 5. Scrolling & Ergonomics

- **MSD Physics**: Fluid Mass-Spring-Damper physics simulation (`general.smoothScroll.msdPhysics.enabled = true`) replaces rigid step-based scroll easing with inertia.
- **Mouse Wheel Delta**: Kept at default `100` to prevent JavaScript behavioral fingerprinting (`WheelEvent.deltaY` anomaly detection).

### Optional: Faster Linux Notched Wheel Scrolling
If using a notched mouse on Linux and prefer faster page navigation (~300px per notch):
```js
user_pref("mousewheel.default.delta_multiplier_y", 300);
```

### Revert to Mechanical Scrolling
```js
user_pref("general.smoothScroll.msdPhysics.enabled", false);
```

---

## 6. Password Management

Browser password databases are primary targets for commodity infostealers. Use an external vault (Bitwarden, KeePassXC, Proton Pass) and disable built-in browser credential prompts:

```js
user_pref("signon.rememberSignons", false);
```

---

## 7. Regional Ad Filters (uBlock Origin)

`policies.json` deploys uBlock Origin with global filter lists. For domestic ads (Vietnam, Germany, Russia, Japan, etc.):
1. Click **uBlock Origin** icon → **Dashboard (gears icon)** → **Filter lists** tab.
2. Expand **Regions, languages** → check your language list (e.g. `VIE: ABPVN List`).
3. Click **Apply changes**.

---

## 8. Search Engines & Aliases

DuckDuckGo is the default engine. Search directly from the URL bar via aliases:

| Alias | Engine | Purpose |
| :---: | :--- | :--- |
| *(none)* | DuckDuckGo | Default private search |
| `sp` | Startpage | Google search index without tracking |
| `dl` | DuckDuckGo Lite | Minimal, text-only interface |
| `sx` | SearXNG | Decentralized metasearch |
| `mg` | MetaGer | Privacy-focused German metasearch |

*Example:* Type `sp Linux kernel` in the address bar to search Startpage.

---

## 9. System Fonts & Emoji (Linux)

To prevent diacritic / emoji fallback rendering issues on minimal Linux installations:

* **Arch / CachyOS**:
  ```bash
  sudo pacman -S noto-fonts noto-fonts-cjk noto-fonts-emoji ttf-jetbrains-mono
  ```
* **Fedora**:
  ```bash
  sudo dnf install google-noto-sans-cjk-fonts google-noto-color-emoji-fonts jetbrains-mono-fonts
  ```
* **Debian / Ubuntu**:
  ```bash
  sudo apt install fonts-noto-core fonts-noto-cjk fonts-noto-color-emoji fonts-jetbrains-mono
  ```

---

## 10. Container Tabs

Multi-Account Containers are enabled by default (`privacy.userContext.enabled = true`):
- Long-press or right-click the **+** tab button to select a container.
- Use Mozilla's [Multi-Account Containers](https://addons.mozilla.org/firefox/addon/multi-account-containers/) addon to configure automatic URL-to-container routing rules.

---

## 11. Troubleshooting & Smart Unbreak

### Site Breakage (Strict ETP)
If a strict portal (banking, government, university SSO) fails to load:
1. Click the **shield icon** on the left of the address bar.
2. Toggle **Enhanced Tracking Protection** to **OFF** for that domain only.
3. Reload the page.

Firefox preserves this exception exclusively for that domain without degrading security on other websites.

### Reverting to Default Profile
```bash
# Temporarily disable user.js
mv ~/.mozilla/firefox/<profile>/user.js ~/.mozilla/firefox/<profile>/user.js.bak

# Restore backup generated by installer
mv ~/.mozilla/firefox/<profile>/user.js.yuzubak ~/.mozilla/firefox/<profile>/user.js
```
