// AUTO-GENERATED from src/user.js/*.js — do not edit directly.
// Run: python3 build.py
//
// =============================================================================
// YuzuFox — Per-Profile Tuning (installed to <profile>/user.js)
// =============================================================================
// Daily-use privacy / security / speed / QoL for the profiles you use.
// Complements the locked system-wide base (yuzu.js) — never duplicates it.
//
// Curated like Betterfox: no RFP, no JIT-off, no DRM-off — nothing that
// breaks sites. Maintained like Arkenfox: a read-only, safe-by-default
// template for a workstation with system DNS + uBlock Origin.
//
// DNS stays with your system resolver — no DoH, browser.trr.* untouched.
// Search engines are set system-wide via policies.json, not here.
// =============================================================================
// -----------------------------------------------------------------------------
// SECURITY — CERTIFICATE REVOCATION (CRLite only), TLS
// -----------------------------------------------------------------------------
// OCSP is disabled because it leaks visited sites to the CA infrastructure.
// CRLite downloads a compact revocation filter and checks offline; mode 2
// enforces both "Revoked" and "Not Revoked" results.

// [SOURCE: Betterfox] [NOTE: offline CRLite revocation + no speculative connections]
user_pref("security.OCSP.enabled", 0);

// Enforce strict HTTP Public Key Pinning (level 2).
// [SOURCE: Arkenfox] [NOTE: audited against upstream user.js]
user_pref("security.cert_pinning.enforcement_level", 2);

// Require RFC 5746 safe renegotiation; lack of it allows MiTM injection.
// [SOURCE: Arkenfox] [NOTE: audited against upstream user.js]
user_pref("security.ssl.require_safe_negotiation", true);
// [SOURCE: Both] [NOTE: audited against upstream user.js]
user_pref("security.ssl.treat_unsafe_negotiation_as_broken", true);

// TLS 1.3 0-RTT is not forward secret and allows replay attacks.
// [SOURCE: Both] [NOTE: audited against upstream user.js]
user_pref("security.tls.enable_0rtt_data", false);

// QUIC 0-RTT (HTTP/3) has the same replay weakness as TLS 0-RTT.
user_pref("network.http.http3.enable_0rtt", false);

// Show expert bad-cert pages immediately when debugging TLS.
// [SOURCE: Both] [NOTE: audited against upstream user.js]
user_pref("browser.xul.error_pages.expert_bad_cert", true);

// -----------------------------------------------------------------------------
// PRIVACY — SEVER ALL BACKGROUND / SPECULATIVE CONNECTIONS
// -----------------------------------------------------------------------------
// No speculative networking of any kind. Every connection is user-initiated.

// [SOURCE: Both] [NOTE: audited against upstream user.js]
user_pref("network.dns.disablePrefetch", true);
// [SOURCE: Both] [NOTE: audited against upstream user.js]
user_pref("network.dns.disablePrefetchFromHTTPS", true);
// [SOURCE: Both] [NOTE: audited against upstream user.js]
user_pref("network.http.speculative-parallel-limit", 0);
// [SOURCE: Both] [NOTE: audited against upstream user.js]
user_pref("network.prefetch-next", false);
// [SOURCE: Arkenfox] [NOTE: audited against upstream user.js]
user_pref("network.predictor.enabled", false);
// [SOURCE: Arkenfox] [NOTE: audited against upstream user.js]
user_pref("network.predictor.enable-prefetch", false);
// [SOURCE: Both] [NOTE: audited against upstream user.js]
user_pref("browser.urlbar.speculativeConnect.enabled", false);
// [SOURCE: Both] [NOTE: audited against upstream user.js]
user_pref("browser.places.speculativeConnect.enabled", false);
// Only expose the public IP via WebRTC — never the LAN address (192.168.x.x).
// [SOURCE: Arkenfox] [NOTE: WebRTC local-IP leak prevention]
user_pref("media.peerconnection.ice.default_address_only", true);

// -----------------------------------------------------------------------------
// PRIVACY — HTTPS-ONLY MODE
// -----------------------------------------------------------------------------

// Force HTTPS on every top-level navigation.
// [SOURCE: Betterfox] [NOTE: HTTPS-only, tracking protection, and query stripping]
user_pref("dom.security.https_only_mode", true);

// Forbid the 3-second cleartext HTTP background probe when upgrading.
// [SOURCE: Arkenfox] [NOTE: audited against upstream user.js]
user_pref("dom.security.https_only_mode_send_http_background_request", false);
// -----------------------------------------------------------------------------
// PRIVACY — TRACKING PROTECTION & FINGERPRINTING (FFP)
// -----------------------------------------------------------------------------

// Firefox's modern fingerprinting protection: randomises canvas, constrains
// fonts, spoofs timezone, limits concurrency — without the all-or-nothing
// breakage of RFP. Cover normal + private windows.
// [SOURCE: Both] [NOTE: audited against upstream user.js]
user_pref("browser.contentblocking.category", "strict");
user_pref("privacy.fingerprintingProtection", true);

// Isolate content-script resources so a malicious extension cannot use
// content scripts as a cross-origin bridge.
// [SOURCE: Both] [NOTE: audited against upstream user.js]
user_pref("privacy.antitracking.isolateContentScriptResources", true);

// Disable CSP Level 2 report delivery (leaks referrer + policy info, no
// defensive value when the content itself is trusted).
// [SOURCE: Both] [NOTE: audited against upstream user.js]
user_pref("security.csp.reporting.enabled", false);
// -----------------------------------------------------------------------------
// PRIVACY — REFERRERS & GPC
// -----------------------------------------------------------------------------

// Trim cross-origin referrers to scheme+host+port (no path/query leaks).
// [SOURCE: Both] [NOTE: audited against upstream user.js]
user_pref("network.http.referer.XOriginTrimmingPolicy", 2);

// No referrer spoofing (it breaks CSRF protections on Origin-validating sites).

// Global Privacy Control opt-out signal.
// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("privacy.globalprivacycontrol.enabled", true);
// -----------------------------------------------------------------------------
// PRIVACY — COOKIE PARTITIONING & QUERY STRIPPING
// -----------------------------------------------------------------------------

// Opt-in partitioning so an "Allow" exception for one eTLD+1 does not
// unpartition all of its cookies.
user_pref("network.cookie.cookieBehavior.optInPartitioning", true);
user_pref("network.cookie.cookieBehavior.optInPartitioning.pbmode", true);

// Remove tracking parameters (fbclid, gclid, hsCtaTracking, tiktok, etc.)
// at the navigation level before the request leaves.
user_pref("privacy.query_stripping.strip_list", "__hsfp __hssc __hstc __s _hsenc _openstat dclid fbclid gbraid gclid hsCtaTracking igshid mc_eid ml_subscriber ml_subscriber_hash msclkid oft_c oft_ck oft_d oft_id oft_ids oft_k oft_lk oft_sk oly_anon_id oly_enc_id rb_clickid s_cid twclid vero_conv vero_id wbraid wickedid yclid");
// -----------------------------------------------------------------------------
// PRIVACY — FORMS / PASSWORDS / DOM RESTRICTIONS
// -----------------------------------------------------------------------------

// Disable inline autocomplete and the built-in password manager; credential
// capture is delegated to an external passphrase store (pass / KeePassXC).
// [SOURCE: Both] [NOTE: audited against upstream user.js]
user_pref("browser.formfill.enable", false);
user_pref("signon.rememberSignons", false);
// [SOURCE: Both] [NOTE: audited against upstream user.js]
user_pref("signon.formlessCapture.enabled", false);
// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("signon.privateBrowsingCapture.enabled", false);
// [SOURCE: Arkenfox] [NOTE: audited against upstream user.js]
user_pref("signon.autofillForms", false);

// Sub-resources from other origins cannot prompt for HTTP credentials.
// [SOURCE: Both] [NOTE: audited against upstream user.js]
user_pref("network.auth.subresource-http-auth-allow", 1);

// Preserve pasted rich text instead of letting the editor strip formatting.
// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("editor.truncate_user_pastes", false);

// Prevent JS from moving/resizing the window (the tiling WM owns geometry).
// [SOURCE: Arkenfox] [NOTE: audited against upstream user.js]
user_pref("dom.disable_window_move_resize", true);

// Block site access to clipboard events (fingerprinting + data leak vector).
// [SOURCE: Arkenfox] [NOTE: clipboard event access disabled]
user_pref("dom.event.clipboardevents.enabled", false);

// Disable device sensor APIs — accelerometer, gyroscope, proximity.
// These are fingerprinting vectors with no legitimate use for most sites.
// [SOURCE: Arkenfox] [NOTE: sensor API disabled per Arkenfox 4200+]
user_pref("device.sensors.enabled", false);

// Battery Status API — leaks device type + charge level as fingerprint.
// [SOURCE: Arkenfox] [NOTE: battery API disabled per Arkenfox 4200+]
user_pref("dom.battery.enabled", false);

// Homograph defense: always show Punycode for IDNs.
// [SOURCE: Both] [NOTE: audited against upstream user.js]
user_pref("network.IDN_show_punycode", true);

// PDF.js stays but never runs embedded scripts.
// [SOURCE: Both] [NOTE: audited against upstream user.js]
user_pref("pdfjs.enableScripting", false);
// -----------------------------------------------------------------------------
// PRIVACY — GEOLOCATION & HTTPS-ONLY ERROR PAGE
// -----------------------------------------------------------------------------

// Block geolocation by default; allow per-site via the permission prompt.
// [SOURCE: Betterfox] [NOTE: geolocation default-blocked, allow per site]
user_pref("permissions.default.geo", 2);

// Kill Google's network-based geolocation (fallback when GPS/WiFi is absent).
// [SOURCE: Betterfox] [NOTE: disable Google network geolocation]
user_pref("geo.provider.network.url", "");

// On HTTPS-only errors, do not suggest "continue to HTTP" — prevents
// click-through without thinking.
// [SOURCE: Betterfox] [NOTE: no "continue to HTTP" suggestion on error page]
user_pref("dom.security.https_only_mode_error_page_user_suggestions", false);


// -----------------------------------------------------------------------------
// SAFE BROWSING — ON (hash-prefix, local match)
// -----------------------------------------------------------------------------
// Core Safe Browsing (malware + phishing) stays ON at Firefox defaults:
// Firefox sends only 32-bit hash prefixes to Google, then matches locally —
// no full URLs leak. Remote download reputation is the one exception: it
// uploads file metadata to Google, so it stays OFF (same choice as Arkenfox).

// Keep remote download reputation off — sends file info to Google otherwise.
// [SOURCE: Both] [NOTE: audited against upstream user.js]
user_pref("browser.safebrowsing.downloads.remote.enabled", false);

// Keep URL-classifier skip lists so embedded Twitter/Reddit/Instagram content
// still renders when the user visits those sites.
user_pref("urlclassifier.features.socialtracking.skipURLs", "*.instagram.com, *.twitter.com, *.twimg.com");
user_pref("urlclassifier.trackingSkipURLs", "*.reddit.com, *.twitter.com, *.twimg.com");
// -----------------------------------------------------------------------------
// PRIVACY — DOWNLOAD SANDBOXING
// -----------------------------------------------------------------------------

// Stage downloads in tmp and delete the temp file once the external app
// finishes with it.
// [SOURCE: Both] [NOTE: audited against upstream user.js]
user_pref("browser.download.start_downloads_in_tmp_dir", true);
// [SOURCE: Arkenfox] [NOTE: audited against upstream user.js]
user_pref("browser.helperApps.deleteTempFileOnExit", true);

// Keep downloads out of the Recent Documents registry.
// [SOURCE: Both] [NOTE: audited against upstream user.js]
user_pref("browser.download.manager.addToRecentDocs", false);

// The download panel never steals focus; Ctrl+J summons it.
// [SOURCE: Arkenfox] [NOTE: audited against upstream user.js]
user_pref("browser.download.alwaysOpenPanel", false);

// Always ask where to save and how to handle unknown MIME types.
// [SOURCE: Arkenfox] [NOTE: audited against upstream user.js]
user_pref("browser.download.useDownloadDir", false);
// [SOURCE: Arkenfox] [NOTE: audited against upstream user.js]
user_pref("browser.download.always_ask_before_handling_new_types", true);
// Force download PDFs instead of opening in-browser.
user_pref("browser.download.viewableInternally.typeWasRegistered.pdf", false);

// -----------------------------------------------------------------------------
// STARTUP & SESSION
// -----------------------------------------------------------------------------

// Blank page at startup and a blank new tab — no sponsored content, no
// round-trips, no Activity Stream noise.
// [SOURCE: Arkenfox] [NOTE: quiet startup and disable push/attribution pings]
user_pref("browser.startup.page", 0);
// [SOURCE: Arkenfox] [NOTE: audited against upstream user.js]
user_pref("browser.startup.homepage", "chrome://browser/content/blanktab.html");
// [SOURCE: Arkenfox] [NOTE: audited against upstream user.js]
user_pref("browser.newtabpage.enabled", false);
// [SOURCE: Both] [NOTE: audited against upstream user.js]
user_pref("browser.newtabpage.activity-stream.default.sites", "");

// Session restore revives URLs but never replays authenticated state.
// 0 = restore all, 1 = skip HTTPS cookies, 2 = restore nothing.
// [SOURCE: Arkenfox] [NOTE: audited against upstream user.js]
user_pref("browser.sessionstore.privacy_level", 2);
// Notifications blocked by default; whitelist per-site in
// about:preferences#privacy > Permissions > Notifications.
user_pref("permissions.default.desktop-notification", 2);
user_pref("dom.private-attribution.submission.enabled", false);
// No mozilla.org domain receives special permissions by default.
// [SOURCE: Both] [NOTE: audited against upstream user.js]
user_pref("permissions.manager.defaultsUrl", "");
// -----------------------------------------------------------------------------
// PERFORMANCE — RAM-ONLY CACHE (SSD PROTECTION)
// -----------------------------------------------------------------------------
// Every cache lives exclusively in memory. Disk cache is disabled to eliminate
// write wear on the SSD and keep all I/O as fast as RAM permits.

// [SOURCE: Betterfox] [NOTE: RAM-only cache and JIT/GC tuning for responsiveness]
user_pref("browser.cache.disk.enable", false);
user_pref("browser.cache.memory.capacity", 1048576);
// [SOURCE: Both] [NOTE: audited against upstream user.js]
user_pref("browser.privatebrowsing.forceMediaMemoryCache", true);
user_pref("media.memory_cache_max_size", 1048576);
user_pref("media.memory_caches_combined_limit_kb", 3145728);

// Larger video buffers for machines with RAM to spare.
// [SOURCE: CachyOS] [NOTE: double read-ahead and resume threshold]
user_pref("media.cache_readahead_limit", 7200);
user_pref("media.cache_resume_threshold", 3600);

// Block all autoplay (audio + video); saves CPU/bandwidth on multi-tab sessions.
// Per-site allow via URL bar permission icon.
// [SOURCE: CachyOS] [NOTE: 5 = block all, same as upstream cachyos.js]
user_pref("media.autoplay.default", 5);

// Decoded image cache: 10 MB pool with 64 KB decode chunks.
user_pref("image.cache.size", 10485760);
// [SOURCE: CachyOS] [NOTE: 64 KB decode chunks for faster image rendering]
user_pref("image.mem.decode_bytes_at_a_time", 65536);
user_pref("image.mem.shared.unmap.min_expiration_ms", 120000);

// Network buffers and TLS token cache.
// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("network.buffer.cache.size", 65535);
// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("network.buffer.cache.count", 48);
user_pref("network.ssl_tokens_cache_capacity", 32768);

// Unload inactive tabs under memory pressure.
user_pref("browser.tabs.unloadOnLowMemory", true);
// -----------------------------------------------------------------------------
// PERFORMANCE — RENDERING, JAVASCRIPT JIT & GC
// -----------------------------------------------------------------------------

// Canvas2D acceleration cache tuning (Figma, Observable etc.).
user_pref("gfx.canvas.accelerated.cache-items", 32768);
// [SOURCE: CachyOS] [NOTE: 4 MB canvas cache for GPU-accelerated canvas apps]
user_pref("gfx.canvas.accelerated.cache-size", 4096);
// [SOURCE: CachyOS] [NOTE: 80 MB Skia font cache, faster text rendering]
user_pref("gfx.content.skia-font-cache-size", 80);

// Lower Baseline JIT threshold (100 -> 50): warm functions compile sooner.
// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("javascript.options.baselinejit.threshold", 50);

// Lower Ion JIT threshold (~1000 -> 500): JS hot-path compiles twice as fast.
// [SOURCE: CachyOS] [NOTE: IonMonkey aggressive warm-up, safe on modern hardware]
user_pref("javascript.options.ion.threshold", 500);

// Snappier incremental rendering during slow page loads.
// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("content.notify.interval", 100000);
// -----------------------------------------------------------------------------
// PERFORMANCE — NETWORK FEED WELLS
// -----------------------------------------------------------------------------
// Aggressive-but-safe parallel connection tuning. Harmless today.

// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("network.dnsCacheExpiration", 3600);
// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("network.http.max-connections", 1800);
// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("network.http.max-persistent-connections-per-server", 10);
// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("network.http.max-urgent-start-excessive-connections-per-host", 5);
user_pref("network.http.pacing.requests.enabled", false);
// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("network.http.request.max-start-delay", 5);

// Force HTTP/3 (QUIC) for lower-latency connections where supported.
user_pref("network.http.http3.enable", true);

// Cache more back/forward page states for instant history navigation.
user_pref("browser.sessionhistory.max_total_viewers", 10);
// -----------------------------------------------------------------------------
// UI / QoL — ONE-LINE LOOK
// -----------------------------------------------------------------------------
// Optional UI prefs. YuzuFox itself no longer ships a userChrome.css theme,
// but keeping stylesheet support enabled lets you drop in your own if you
// want a compact/two-row layout without touching the locked system prefs.

// [SOURCE: Betterfox] [NOTE: compact UI, URL-bar cleanup, and physics scrolling]
user_pref("toolkit.legacyUserProfileCustomizations.stylesheets", true);
// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("browser.compactmode.show", true);

// Strip https:// and undecorate the URL bar.
// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("browser.urlbar.trimHttps", true);
// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("browser.urlbar.untrimOnUserInteraction.featureGate", true);

// Remove Firefox View and URL-bar group labels; show real URLs.
user_pref("browser.tabs.firefox-view", false);
user_pref("browser.tabs.firefox-view-next", false);
// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("browser.urlbar.groupLabels.enabled", false);
// [SOURCE: Arkenfox] [NOTE: audited against upstream user.js]
user_pref("browser.urlbar.showSearchTerms.enabled", false);

// Kill every URL-bar suggestion category (Quicksuggest, trends, addons...).
// Search suggestions from the default engine are left at Firefox defaults (on).
user_pref("browser.urlbar.suggest.addons", false);
// [SOURCE: CachyOS] [NOTE: QuickSuggest master switch + sponsored/nonsponsored off]
user_pref("browser.urlbar.quicksuggest.enabled", false);
user_pref("browser.urlbar.suggest.quicksuggest.fakespot", false);
user_pref("browser.urlbar.suggest.quicksuggest.nonsponsored", false);
user_pref("browser.urlbar.suggest.quicksuggest.sponsored", false);
user_pref("browser.urlbar.suggest.quicksuggest.topsites", false);
user_pref("browser.urlbar.suggest.trending", false);
// [SOURCE: Arkenfox] [NOTE: audited against upstream user.js]
user_pref("browser.urlbar.importantDates.featureGate", false);
// [SOURCE: Arkenfox] [NOTE: audited against upstream user.js]
user_pref("browser.urlbar.market.featureGate", false);
// [SOURCE: Arkenfox] [NOTE: audited against upstream user.js]
user_pref("browser.urlbar.yelpRealtime.featureGate", false);
// [SOURCE: Both] [NOTE: audited against upstream user.js]
user_pref("browser.urlbar.trending.featureGate", false);

// Separately configurable private-window search engine.
// [SOURCE: Both] [NOTE: audited against upstream user.js]
user_pref("browser.search.separatePrivateDefault.ui.enabled", true);

// Fullscreen transitions are instant in a tiling WM.
// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("full-screen-api.transition-duration.enter", "0 0");
// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("full-screen-api.transition-duration.leave", "0 0");
// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("full-screen-api.warning.timeout", 0);

// Open PDF attachments inline; close bookmark menu after one click.
// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("browser.download.open_pdf_attachments_inline", true);
// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("browser.bookmarks.openInTabClosesMenu", false);

// Find bar highlights all matches by default.
// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("findbar.highlightAll", true);
// -----------------------------------------------------------------------------
// CONTAINERS
// -----------------------------------------------------------------------------

// Container Tabs for first-party isolation (work vs personal, dev vs prod)
// without needing a separate profile.
// [SOURCE: Arkenfox] [NOTE: audited against upstream user.js]
user_pref("privacy.userContext.enabled", true);
// [SOURCE: Both] [NOTE: audited against upstream user.js]
user_pref("privacy.userContext.ui.enabled", true);
// Long-press + new tab button opens container picker.
user_pref("privacy.userContext.longPressBehavior", 2);
// -----------------------------------------------------------------------------
// SMOOTH SCROLLING — PHYSICS-BASED (MSD MODEL)
// -----------------------------------------------------------------------------
// Mass-Spring-Damper model: a responsive but controlled GTK/Qt-like feel.

// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("general.smoothScroll.msdPhysics.continuousMotionMaxDeltaMS", 12);
// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("general.smoothScroll.msdPhysics.enabled", true);
user_pref("general.smoothScroll.msdPhysics.motionBeginSpringConstant", 200);
user_pref("general.smoothScroll.msdPhysics.regularSpringConstant", 250);
// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("general.smoothScroll.msdPhysics.slowdownMinDeltaMS", 25);
user_pref("general.smoothScroll.msdPhysics.slowdownMinDeltaRatio", "2.0");
// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("general.smoothScroll.msdPhysics.slowdownSpringConstant", 250);
user_pref("general.smoothScroll.currentVelocityWeighting", "1.0");
user_pref("general.smoothScroll.stopDecelerationWeighting", "1.0");
// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("mousewheel.default.delta_multiplier_y", 300);
// -----------------------------------------------------------------------------
// FEATURE ENABLEMENT
// -----------------------------------------------------------------------------

// Experimental CSS Masonry layout engine (grid-template-masonry).
user_pref("layout.css.grid-template-masonry-value.enabled", true);
// -----------------------------------------------------------------------------
// DESKTOP / SECURITY MISC
// -----------------------------------------------------------------------------
// Do not search for clipboard content on accidental middle-click.
// [SOURCE: Arkenfox] [NOTE: disable middle-click clipboard search]
user_pref("browser.tabs.searchclipboardfor.middleclick", false);

// -----------------------------------------------------------------------------
// PER-OS SECTIONS
// -----------------------------------------------------------------------------
// Only the prefs tagged below apply to a given OS. Prefs from Arkenfox /
// Betterfox that are harmless everywhere are kept in their general sections
// above; the ones here genuinely differ per platform. Everything in this file
// is per-profile — the system-wide yuzu.js stays OS-agnostic.

// --- [LINUX] ---
// Force Firefox to skip the Red Hat-style geoclue location service entirely.
// [FF102+] [LINUX] (Arkenfox 0203)
// [SOURCE: Arkenfox] [NOTE: disable Red Hat geoclue location service]
user_pref("geo.provider.use_geoclue", false);

// GVfs (GNOME) must not be used as a proxy bypass / protocol handler.
// [LINUX] (Betterfox: network.gio.supported-protocols)
// [SOURCE: Arkenfox] [NOTE: block GVfs from acting as protocol handler]
user_pref("network.gio.supported-protocols", "");

// --- [WINDOWS] ---
// Disable the Windows Location Service as a geolocation provider.
// [WINDOWS] (Arkenfox 0203, Betterfox Securefox)
// [SOURCE: Arkenfox] [NOTE: disable Windows geolocation and UNC paths]
user_pref("geo.provider.ms-windows-location", false);

// Never allow UNC paths to be used as file URLs (defensive on shares).
// [WINDOWS] (Arkenfox 0008)
// [SOURCE: Arkenfox] [NOTE: block UNC paths as file URLs]
user_pref("network.file.disable_unc_paths", true);

// No favicon .ico caching / desktop-shortcut favicons.
// [WINDOWS] (Arkenfox 1006, Betterfox Securefox)
// [SOURCE: Arkenfox] [NOTE: disable taskbar favicons and app restart registration]
user_pref("browser.shell.shortcutFavicons", false);

// Disable the Windows "restart after user signs out / restart to restore"
// Taskbar mechanism the moment the session ends.
// [WINDOWS] (Arkenfox 1005)
// [SOURCE: Arkenfox] [NOTE: disable Windows taskbar restart registration]
user_pref("toolkit.winRegisterApplicationRestart", false);

// --- [macOS] ---
// Disable Apple's CoreLocation geolocation provider.
// [SOURCE: Arkenfox] [NOTE: disable macOS CoreLocation geolocation]
user_pref("geo.provider.use_corelocation", false);

// (rest of macOS is policy-inherited; yuzu.js is OS-agnostic)
