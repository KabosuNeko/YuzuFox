# Tips & Technical Rationale

This document explains the technical choices in YuzuFox, how to customize specific behaviors, and how to troubleshoot common issues.

---

## DNS and DoH

YuzuFox leaves DNS resolution to the operating system (`network.trr.*` untouched). Your system resolver (`systemd-resolved`, `unbound`, Pi-hole, local DNS daemon) handles lookups.

If you prefer DoH managed directly inside Firefox, add these lines to your profile `user.js` or configure via `about:preferences#privacy`:

```js
user_pref("network.trr.mode", 3);                     // 3 = DoH only, no fallback to plaintext
user_pref("network.trr.uri", "https://dns.quad9.net/dns-query");
user_pref("network.trr.resolvers", '[{"name":"Quad9","url":"https://dns.quad9.net/dns-query"}]');
```

Values for `network.trr.mode`:
- `0`: Default (OS resolver)
- `2`: DoH first with system fallback
- `3`: Strict DoH only (no plaintext fallback)
- `5`: DoH explicitly disabled

---

## Safe Browsing

Core Safe Browsing (local hash matching for malware and phishing domains) is active at Firefox defaults. Firefox downloads 32-bit hash prefix lists and matches URLs locally on your machine—full URLs are never sent to Google.

YuzuFox disables only **remote binary reputation checks**:
```js
user_pref("browser.safebrowsing.downloads.remote.enabled", false);
```
This prevents Firefox from sending download metadata (filename, size, URL) to Google servers when downloading executables.

If you want remote executable analysis re-enabled:
```js
user_pref("browser.safebrowsing.downloads.remote.enabled", true);
```

---

## Search Engines

DuckDuckGo is configured as the default search engine in `policies.json`. Five engines with quick-search aliases are included:

| Engine | Alias | Description |
| :--- | :--- | :--- |
| DuckDuckGo | *(default)* | Default private search |
| Startpage | `sp` | Google search results without user tracking |
| DuckDuckGo Lite | `dl` | Minimal, text-only DuckDuckGo interface |
| SearXNG | `sx` | Decentralized privacy metasearch |
| MetaGer | `mg` | Privacy-focused metasearch engine |

Usage in URL bar: type `sp Arch Linux wiki` to search Startpage directly.

---

## Extensions & Fingerprinting

YuzuFox installs **uBlock Origin** via enterprise policy. Adding multiple privacy extensions (e.g., CanvasBlocker, Privacy Badger, User-Agent switchers) is counter-productive:

1. **Fingerprint Uniqueness**: Obscure extensions alter JavaScript prototypes or inject predictable DOM artifacts that fingerprinting scripts (CreepJS, FingerprintJS) flag immediately.
2. **Redundancy**: Firefox native Fingerprinting Protection (FPP) and uBlock Origin already handle canvas noise, tracker script blocking, and third-party cookie isolation.
3. **Rule Conflicts**: Multiple content blockers running concurrently increase memory usage and cause site breakage.

Stick to uBlock Origin plus any tools you strictly need (e.g., password manager, vim bindings).

### Regional Ad Filter Lists (uBlock Origin)
`policies.json` configures uBlock Origin with universal ad and tracking filters. However, domestic websites (news, video streaming, forums in Vietnam, Germany, Russia, Japan, etc.) frequently use local advertising networks that bypass global English rules.

Enable your region-specific filters directly in uBlock Origin:
1. Click the **uBlock Origin** extension icon → click the **Dashboard (gears icon)**.
2. Switch to the **Filter lists** tab.
3. Expand the **Regions, languages** group.
4. Check the list matching your language (e.g. `VIE: ABPVN List`, `DEU: EasyList Germany`, etc.).
5. Click **Apply changes** at the top.

---

## Passwords and Credential Security

YuzuFox hardens form behavior out of the box (`signon.autofillForms = false` prevents silent credential injection into hidden iframes, and `signon.formlessCapture.enabled = false` stops background credential scraping). However, **I strongly recommend avoiding Firefox's built-in password manager entirely and using a dedicated external password manager.**

### Why Avoid Built-in Browser Password Storage?
1. **Target for Info-Stealers**: Browser credential databases (`logins.json` / `key4.db`) are the primary target of generic commodity malware and info-stealers (Lumma, RedLine, Vidar). An external vault requires separate master key authentication and memory protection.
2. **Weak Local Encryption by Default**: Unless you manually configure a strong **Primary Password** in Firefox settings, saved credentials on disk can be extracted by any process running under your user session.
3. **Application Sandboxing & Blast Radius**: Storing your digital identity inside the same process space that parses arbitrary, untrusted web JavaScript and runs third-party extensions increases your overall attack surface.
4. **Portability**: External managers work across multiple browsers, native desktop applications, mobile devices, and CLI environments without locking you into Firefox Sync.

### Recommended Alternatives
| Manager | Model | Best For |
| :--- | :--- | :--- |
| **[Bitwarden](https://bitwarden.com/)** | Cloud (or self-hosted Vaultwarden) | Open-source, audited, easy multi-device sync. |
| **[KeePassXC](https://keepassxc.org/)** | Local file (`.kdbx`) | Offline security purists, no cloud dependency, Argon2id KDF. |
| **[Proton Pass](https://proton.me/pass)** | Open-source cloud | End-to-end encrypted, audited, privacy-first Swiss ecosystem. |
| **[pass](https://www.passwordstore.org/)** | CLI (GPG + Git) | Minimalist Unix philosophy. |

### How to Disable Built-in Password Prompts
If you use an external manager, disable Firefox's built-in password saving prompts completely by adding this to your profile `user.js`:
```js
user_pref("signon.rememberSignons", false);
```

---

## Scrolling & Ergonomics

- **MSD Physics Smoothing**: Employs Mass-Spring-Damper physics simulation (`general.smoothScroll.msdPhysics.enabled = true`) to calculate natural motion curves in real time. This replaces Firefox's rigid step-based scroll easing with fluid inertia.
- **Mouse Wheel Delta**: YuzuFox keeps `mousewheel.default.delta_multiplier_y` at default `100` to prevent JavaScript behavioral fingerprinting (`WheelEvent.deltaY` anomaly detection). If you are on a Linux desktop with a notched wheel and prefer faster scrolling (~300px per notch), you can add the following to your personal overrides:
  ```js
  user_pref("mousewheel.default.delta_multiplier_y", 300);
  ```
- **Overscroll**: `apz.overscroll.enabled = true` enables the subtle bounce animation when reaching the top or bottom of a page.

To revert completely to stock mechanical scrolling:
```js
user_pref("general.smoothScroll.msdPhysics.enabled", false);
```

### Media Autoplay Exceptions
YuzuFox blocks media from playing audio automatically (`media.autoplay.default = 1`) to prevent intrusive auto-playing video ads with sound on news and blog pages.

To allow media to autoplay on streaming sites (YouTube, Twitch, Spotify):
1. Open the target website.
2. Click the **permissions icon** (left of the address bar, next to the padlock).
3. Find **Autoplay** and select **Allow Audio and Video**.

---

## Hardware Acceleration & Resource Usage

YuzuFox trades idle memory headroom for lower rendering latency and disk endurance:

### Memory Caching (Zero Disk Cache Writes)
| Preference | Default | YuzuFox | Purpose |
| :--- | :--- | :--- | :--- |
| `browser.cache.disk.enable` | `true` | `false` | Eliminates disk cache I/O; protects SSDs from continuous small writes |
| `browser.cache.memory.capacity` | `-1` (auto) | `1048576` | 1 GB memory cache pool |
| `media.memory_cache_max_size` | auto | `1048576` | 1 GB per media element buffer |
| `media.memory_caches_combined_limit_kb` | auto | `3145728` | 3 GB total media buffer cap |
| `browser.sessionhistory.max_total_viewers` | auto | `10` | Keeps up to 10 recent tabs in memory for instant back/forward navigation |

### GPU Acceleration
| Preference | Default | YuzuFox | Purpose |
| :--- | :--- | :--- | :--- |
| `media.hardware-video-decoding.force-enabled` | auto | `true` | Enforces hardware video decoding |
| `media.gpu-process-decoder` | auto | `true` | Isolates video decoding inside dedicated GPU process |
| `gfx.webrender.precache-shaders` | auto | `true` | Pre-compiles shaders to avoid first-paint stutter |
| `gfx.webrender.program-binary-disk` | auto | `true` | Caches compiled shader binaries to disk |

### Verifying Hardware Video Decoding
To confirm that your GPU is decoding video rather than consuming CPU:
1. Open `about:support` in Firefox.
2. Under **Graphics**, verify **Compositing** is `WebRender` and hardware decoding flags show `Supported`.
3. Under Linux terminal, play a 4K 60fps YouTube video and inspect GPU activity:
   - Intel: `sudo intel_gpu_top` (observe the `Video` bar).
   - NVIDIA / AMD: `nvtop` (observe the `DEC` percentage).

> [!TIP]
> **Older iGPUs (H.264 fallback)**: If your CPU spikes to 100% on YouTube because an older GPU lacks native VP9/AV1 hardware decoding, install the [enhanced-h264ify](https://addons.mozilla.org/firefox/addon/enhanced-h264ify/) extension to force YouTube to serve lightweight H.264 streams that your GPU handles natively.

### Low-RAM Profile Override (Systems with ≤ 4–6 GB RAM)
If your system has limited physical memory, add these lines to your profile `user.js`:

```js
user_pref("browser.cache.memory.capacity", 524288);          // 512 MB cache
user_pref("media.memory_caches_combined_limit_kb", 1048576);   // 1 GB media limit
user_pref("browser.sessionhistory.max_total_viewers", 3);    // 3 back/forward pages
user_pref("media.memory_cache_max_size", 262144);            // 256 MB per media stream
user_pref("network.http.max-connections", 900);              // Stock connection count
```

---

## Linux Font & Emoji Rendering

Under Fingerprinting Protection (FPP), Firefox restricts font visibility to system-packaged fonts to avoid local font enumeration attacks. Minimal Linux installations may display tofu boxes for Asian diacritics or emojis if base fonts are missing.

Install complete system font coverage:
- **Arch Linux / CachyOS**:
  ```bash
  sudo pacman -S noto-fonts noto-fonts-cjk noto-fonts-emoji ttf-jetbrains-mono
  ```
- **Fedora**:
  ```bash
  sudo dnf install google-noto-sans-cjk-fonts google-noto-color-emoji-fonts jetbrains-mono-fonts
  ```
- **Debian / Ubuntu**:
  ```bash
  sudo apt install fonts-noto-core fonts-noto-cjk fonts-noto-color-emoji fonts-jetbrains-mono
  ```

---

## Container Tabs

Firefox Multi-Account Containers let you separate cookies and sessions per tab:

- Containers engine is enabled out of the box (`privacy.userContext.enabled = true`, `privacy.userContext.ui.enabled = true`).
- Left-clicking the **+** button opens a normal tab instantly without interruption. Long-press or right-click the **+** button to open the container selection menu.
- Install Mozilla's official [Multi-Account Containers extension](https://addons.mozilla.org/firefox/addon/multi-account-containers/) if you want automatic domain-to-container routing rules.

---

## Troubleshooting

### Handling Broken Websites (Smart Unbreak)
If a strict banking portal, university login, or government service fails to load under Strict Tracking Protection or FPP, **never downgrade your browser-wide security settings**:

1. Click the **shield icon** on the left of the address bar.
2. Toggle **Enhanced Tracking Protection** to **OFF** for that specific website.
3. Refresh the page.

Firefox stores this exception exclusively for that single domain, keeping all your other browsing sessions fully hardened.

### Inspecting Profile Preferences
Check currently applied preferences by navigating to `about:config` or `about:support`.
To check system-wide preferences, inspect `/usr/lib/firefox/browser/defaults/preferences/yuzu.js` or open `about:preferences`.

### Reverting Profile Overrides
If an individual website behaves unexpectedly, test without `user.js`:
```bash
# Temporarily disable profile user.js
mv ~/.mozilla/firefox/<profile>/user.js ~/.mozilla/firefox/<profile>/user.js.bak

# Restore backup generated by installer
mv ~/.mozilla/firefox/<profile>/user.js.yuzubak ~/.mozilla/firefox/<profile>/user.js
```

### Full Clean Uninstall
```bash
# Linux / macOS
bash install.sh --uninstall --all

# Windows
.\install.ps1 -Uninstall -All
```

---

## Editing Preferences in Source

`user.js` is automatically assembled by `build.py`. **Do not edit `user.js` directly in the repository root.**

Source organization:
- `src/user.js/10-network.js`: Sockets, speculative connections, prefetching
- `src/user.js/20-privacy.js`: ETP Strict, FPP, query stripping, form security
- `src/user.js/30-security.js`: CRLite, TLS, certificate verification
- `src/user.js/40-telemetry-connections.js`: Startup pages, session storage
- `src/user.js/50-ui-qol.js`: UI layout, search suggestions, URL bar, scroll settings
- `src/user.js/60-os-specific.js`: Linux (Wayland/XDG portal), Windows, macOS

Rebuild after editing:
```bash
python3 build.py
python3 build.py --check
```
