// AUTO-GENERATED from src/user.js/*.js — do not edit directly.
// Run: python3 build.py
//
// =============================================================================
// YuzuFox — Per-Profile Tuning (installed to <profile>/user.js)
// =============================================================================
// This file is installed as a per-profile preference override via
//   <profile>/user.js
//
// It is deliberately limited to what THIS profile needs:
//   - privacy / security hardening
//   - UI / QoL
//
// Anything that EVERY profile on the machine needs (telemetry removal,
// hardware acceleration + performance tuning, Mozilla bloat removal) lives
// in the system-wide `yuzu.js` (see install.sh, install.ps1).
// Prefs in this file are NOT locked: they follow the profile and stay
// tunable. Do not duplicate a pref here if it also appears in yuzu.js —
// locked wins and the per-profile file would silently lose.
//
// Curated like Betterfox: no RFP, no JIT-off, no DRM-off — nothing that
// breaks sites. Maintained like Arkenfox: a read-only, safe-by-default
// template for a workstation with system DNS + uBlock Origin.
//
// DNS stays with your system resolver — no DoH, browser.trr.* untouched.
// Search engines are set system-wide via policies.json, not here.
// =============================================================================
// -----------------------------------------------------------------------------
// NETWORK — CONNECTION BEHAVIOR
// -----------------------------------------------------------------------------
// HTTP/3 0-RTT, speculative connections, DNS prefetch, and WebRTC exposure.
// Nothing here is a privacy policy — every pref controls when and where
// Firefox opens a connection without the user asking.

// QUIC 0-RTT (HTTP/3) — same replay weakness as TLS 0-RTT
user_pref("network.http.http3.enable_0rtt", false);

// disable DNS prefetching
// DNS prefetch leaks browsed domains to the resolver
user_pref("network.dns.disablePrefetch", true);
// disable DNS prefetch from HTTPS pages
// DNS prefetch from HTTPS pages leaks domain info
user_pref("network.dns.disablePrefetchFromHTTPS", true);
// disable link-mouseover pre-connections
// prevent silent pre-connections on link mouseover
user_pref("network.http.speculative-parallel-limit", 0);
// disable link prefetching
// block speculative page prefetch via link tags
user_pref("network.prefetch-next", false);
// disable the network predictor
// predictor learns browsing patterns; leaks habits
user_pref("network.predictor.enabled", false);
// disable predictor prefetch
// predictor-initiated prefetch leaks future intent
user_pref("network.predictor.enable-prefetch", false);
// disable urlbar speculative connections
// urlbar pre-connects to autofill candidates
user_pref("browser.urlbar.speculativeConnect.enabled", false);
// disable bookmarks/history speculative connections
// bookmarks/history pre-connections on mousedown
user_pref("browser.places.speculativeConnect.enabled", false);
// expose only the public IP via WebRTC
// WebRTC local-IP leak prevention
user_pref("media.peerconnection.ice.default_address_only", true);
// -----------------------------------------------------------------------------
// PRIVACY — HTTPS-ONLY, TRACKING PROTECTION, REFERRERS, FORMS, DOM
// -----------------------------------------------------------------------------
// Everything that reduces what sites learn about you: HTTPS-only mode,
// fingerprinting protection, cookie partitioning, query stripping, and
// DOM API restrictions. Credential handling is delegated to an external
// passphrase store (pass / KeePassXC).

// Force HTTPS on every top-level navigation
// HTTPS-only, tracking protection, and query stripping
user_pref("dom.security.https_only_mode", true);

// Forbid the 3-second cleartext HTTP background probe when upgrading
// [1] https://bugzilla.mozilla.org/buglist.cgi?bug_id=1642387,1660945
// disable the 3s cleartext HTTP probe — leaks visited domain in plaintext
user_pref("dom.security.https_only_mode_send_http_background_request", false);

// Enable ETP Strict Mode with fingerprinting protection
// [1] https://blog.mozilla.org/security/2021/02/23/total-cookie-protection/
// ETP Strict enables Total Cookie Protection + FPP for fingerprinting defense
user_pref("browser.contentblocking.category", "strict");
user_pref("privacy.fingerprintingProtection", true);

// Isolate content-script resources so a malicious extension cannot use content scripts as a cross-origin bridge
// block referrer and storage access via content scripts (cross-origin bridge)
user_pref("privacy.antitracking.isolateContentScriptResources", true);

// Disable CSP Level 2 report delivery (leaks referrer + policy info, no defensive value when the content itself is trusted)
// CSP reports leak referrer and policy details to third-party endpoints
user_pref("security.csp.reporting.enabled", false);

// Trim cross-origin referrers to scheme+host+port (no path/query leaks)
// value 2=only scheme+host+port — strips path and query from cross-origin referrers
user_pref("network.http.referer.XOriginTrimmingPolicy", 2);

// No referrer spoofing (it breaks CSRF protections on Origin-validating sites).

// Global Privacy Control opt-out signal
// signal Do Not Sell/Share to sites — legal privacy right under CCPA/GDPR
user_pref("privacy.globalprivacycontrol.enabled", true);

// Opt-in partitioning so an "Allow" exception for one eTLD+1 does not unpartition all of its cookies
user_pref("network.cookie.cookieBehavior.optInPartitioning", true);
user_pref("network.cookie.cookieBehavior.optInPartitioning.pbmode", true);

// Remove tracking parameters at the navigation level before the request leaves
user_pref("privacy.query_stripping.strip_list", "__hsfp __hssc __hstc __s _hsenc _openstat dclid fbclid gbraid gclid hsCtaTracking igshid mc_eid ml_subscriber ml_subscriber_hash msclkid oft_c oft_ck oft_d oft_id oft_ids oft_k oft_lk oft_sk oly_anon_id oly_enc_id rb_clickid s_cid twclid vero_conv vero_id wbraid wickedid yclid");

// Disable inline autocomplete and the built-in password manager; credential capture is delegated to an external passphrase store (pass / KeePassXC)
// [1] https://blog.mindedsecurity.com/2011/10/autocompleteagain.html
// autocomplete form data readable by third parties; password mgr delegated to external store
user_pref("browser.formfill.enable", false);
user_pref("signon.rememberSignons", false);
// Disable formless login capture for Password Manager
// block password capture on non-standard login forms (attack surface reduction)
user_pref("signon.formlessCapture.enabled", false);
// Disable credential capture in private browsing windows
// no credential capture in private windows — defeats PB isolation purpose
user_pref("signon.privateBrowsingCapture.enabled", false);
// Disable auto-filling username and password form fields
// [1] https://freedom-to-tinker.com/2017/12/27/no-boundaries-for-user-identities-web-trackers-exploit-browser-login-managers/
// auto-fill leaks credentials via cross-site forms and spoofed fields
user_pref("signon.autofillForms", false);

// Sub-resources from other origins cannot prompt for HTTP credentials
// value 1 blocks cross-origin auth prompts — prevents credential phishing
user_pref("network.auth.subresource-http-auth-allow", 1);

// Preserve pasted rich text instead of letting the editor strip formatting
// prevent silent password truncation on paste into maxlength fields
user_pref("editor.truncate_user_pastes", false);

// Prevent JS from moving/resizing the window (the tiling WM owns geometry)
// prevent scripts from repositioning window — anti-spoofing/phishing defense
user_pref("dom.disable_window_move_resize", true);

// Block site access to clipboard events (fingerprinting + data leak vector)
// clipboard event access disabled
user_pref("dom.event.clipboardevents.enabled", false);

// Disable device sensor APIs — accelerometer, gyroscope, proximity
// sensor API disabled per Arkenfox 4200+
user_pref("device.sensors.enabled", false);

// Disable Battery Status API — leaks device type + charge level as fingerprint
// battery API disabled per Arkenfox 4200+
user_pref("dom.battery.enabled", false);

// Homograph defense: always show Punycode for IDNs
// [1] https://wiki.mozilla.org/IDN_Display_Algorithm
// show raw punycode to defeat IDN homograph attacks (e.g. Cyrillic apple.com)
user_pref("network.IDN_show_punycode", true);

// PDF.js stays but never runs embedded scripts
// [1] https://cve.mitre.org/cgi-bin/cvekey.cgi?keyword=pdf.js+firefox
// embedded JS in PDFs is a malware/exploit vector — PDF rendering only
user_pref("pdfjs.enableScripting", false);

// Block geolocation by default; allow per-site via the permission prompt
// geolocation default-blocked, allow per site
user_pref("permissions.default.geo", 2);

// Kill Google's network-based geolocation (fallback when GPS/WiFi is absent)
// disable Google network geolocation
user_pref("geo.provider.network.url", "");

// On HTTPS-only errors, do not suggest "continue to HTTP"
// no "continue to HTTP" suggestion on error page
user_pref("dom.security.https_only_mode_error_page_user_suggestions", false);

// -----------------------------------------------------------------------------
// SECURITY — TLS, SAFE BROWSING, DOWNLOAD SANDBOXING
// -----------------------------------------------------------------------------
// Connection-layer security (CRLite revocation, TLS renegotiation, 0-RTT),
// Safe Browsing policy, and download isolation. Safe Browsing stays ON
// with hash-prefix lookups; only remote download reputation is off.

// OCSP is disabled because it leaks visited sites to the CA infrastructure.
// CRLite downloads a compact revocation filter and checks offline; mode 2
// enforces both "Revoked" and "Not Revoked" results.

// disable OCSP
// offline CRLite revocation + no speculative connections
user_pref("security.OCSP.enabled", 0);

// enforce strict HTTP Public Key Pinning (level 2)
// strict PKP to prevent certificate MiTM by hostile CAs
user_pref("security.cert_pinning.enforcement_level", 2);

// require RFC 5746 safe renegotiation; lack of it allows MiTM injection
// [1] https://wiki.mozilla.org/Security:Renegotiation
// block servers lacking RFC 5746 renegotiation (MiTM CVE-2009-3555)
user_pref("security.ssl.require_safe_negotiation", true);
// display padlock warning on unsafe SSL renegotiation
// [1] https://wiki.mozilla.org/Security:Renegotiation
// padlock warning on unsafe renegotiation
user_pref("security.ssl.treat_unsafe_negotiation_as_broken", true);

// TLS 1.3 0-RTT is not forward secret and allows replay attacks
// [1] https://github.com/tlswg/tls13-spec/issues/1001
// 0-RTT not forward secret; allows cross-connection replay
user_pref("security.tls.enable_0rtt_data", false);

// show expert bad-cert pages immediately when debugging TLS
// show advanced info on insecure-connection pages
user_pref("browser.xul.error_pages.expert_bad_cert", true);

// Core Safe Browsing (malware + phishing) stays ON at Firefox defaults:
// Firefox sends only 32-bit hash prefixes to Google, then matches locally —
// no full URLs leak. Remote download reputation is the one exception: it
// uploads file metadata to Google, so it stays OFF (same choice as Arkenfox).

// keep remote download reputation off — sends file info to Google otherwise
// sends file name, origin, size and hash to Google SB for remote lookup
user_pref("browser.safebrowsing.downloads.remote.enabled", false);

// keep URL-classifier skip lists so embedded Twitter/Reddit/Instagram content still renders when the user visits those sites
user_pref("urlclassifier.features.socialtracking.skipURLs", "*.instagram.com, *.twitter.com, *.twimg.com");
user_pref("urlclassifier.trackingSkipURLs", "*.reddit.com, *.twitter.com, *.twimg.com");

// stage downloads in tmp and delete the temp file once the external app finishes with it
// [1] https://bugzilla.mozilla.org/buglist.cgi?bug_id=302433,1738574
// isolates downloads in /tmp to avoid file-system fingerprinting of the profile directory
user_pref("browser.download.start_downloads_in_tmp_dir", true);
// clean up temp file after external helper application exits
// [1] https://bugzilla.mozilla.org/buglist.cgi?bug_id=302433,1738574
// cleans up the temp file after the external helper application exits
user_pref("browser.helperApps.deleteTempFileOnExit", true);

// keep downloads out of the Recent Documents registry
// keeps download filenames out of the OS recent documents list, which is visible to other applications
user_pref("browser.download.manager.addToRecentDocs", false);

// the download panel never steals focus; Ctrl+J summons it
// prevents the downloads panel from stealing focus on every download
user_pref("browser.download.alwaysOpenPanel", false);

// always ask where to save downloads
// forces a save dialog so the user consciously chooses the download location, blocking drive-by saves
user_pref("browser.download.useDownloadDir", false);
// force user approval before handling unfamiliar MIME types
// forces explicit user approval before handling unfamiliar MIME types, blocking silent drive-by execution
user_pref("browser.download.always_ask_before_handling_new_types", true);
// force download PDFs instead of opening in-browser
user_pref("browser.download.viewableInternally.typeWasRegistered.pdf", false);
// -----------------------------------------------------------------------------
// STARTUP & CONNECTIONS — QUIET SESSION
// -----------------------------------------------------------------------------
// Blank startup, no sponsored new-tab content, no push or attribution
// pings, session restore without authenticated state, and default-deny
// permission prompts.

// Blank page at startup and a blank new tab — no sponsored content, no
// round-trips, no Activity Stream noise.
// set startup page to blank
// quiet startup and disable push/attribution pings
user_pref("browser.startup.page", 0);
// set homepage to blank page
// blank inline page — no external content, no network round-trips at startup or new window
user_pref("browser.startup.homepage", "chrome://browser/content/blanktab.html");
// disable new tab page
// disable Activity Stream on new tabs to prevent content loads and network requests
user_pref("browser.newtabpage.enabled", false);
// clear preloaded top sites
// clear preloaded default top sites (Facebook, YouTube, etc.) to avoid automated connections to those domains
user_pref("browser.newtabpage.activity-stream.default.sites", "");

// Session restore revives URLs but never replays authenticated state.
// 0 = restore all, 1 = skip HTTPS cookies, 2 = restore nothing.
// store no extra session data
// never store form content, cookies, or POST data in the session — restore open URLs only
user_pref("browser.sessionstore.privacy_level", 2);
// Notifications blocked by default; whitelist per-site in
// about:preferences#privacy > Permissions > Notifications.
user_pref("permissions.default.desktop-notification", 2);
user_pref("dom.private-attribution.submission.enabled", false);
// No mozilla.org domain receives special permissions by default.
// clear permissions defaults URL
// Firefox ships a permissions file that auto-grants special privileges to mozilla.org domains — clear it
user_pref("permissions.manager.defaultsUrl", "");
// -----------------------------------------------------------------------------
// UI / QoL — LOOK, FEEL, CONTAINERS, SCROLLING
// -----------------------------------------------------------------------------
// Optional UI preferences: compact density, URL-bar behavior, fullscreen
// transitions, containers, and physics-based scrolling. Safe to drop in
// or out per profile — nothing here affects security or privacy.

// enable legacy stylesheet customizations
// compact UI, URL-bar cleanup, and physics scrolling
user_pref("toolkit.legacyUserProfileCustomizations.stylesheets", true);
// enable compact density mode
// restore compact density option (removed in Proton redesign)
user_pref("browser.compactmode.show", true);

// Strip https:// and undecorate the URL bar
// hide https:// scheme in address bar; copied URL still includes it
user_pref("browser.urlbar.trimHttps", true);
// restore full URL on address-bar click
// restore full URL on address-bar click, re-trim on blur
user_pref("browser.urlbar.untrimOnUserInteraction.featureGate", true);

// Remove Firefox View and URL-bar group labels; show real URLs
user_pref("browser.tabs.firefox-view", false);
user_pref("browser.tabs.firefox-view-next", false);
// hide Firefox Suggest section labels
// hide "Firefox Suggest" section labels in urlbar dropdown
user_pref("browser.urlbar.groupLabels.enabled", false);
// show real URL on search results pages
// show real URL on search-results pages, not the typed search query
user_pref("browser.urlbar.showSearchTerms.enabled", false);

// Kill every URL-bar suggestion category
user_pref("browser.urlbar.suggest.addons", false);
// disable QuickSuggest
// [1] https://blog.mozilla.org/data/2021/09/15/data-and-firefox-suggest/
// QuickSuggest master switch + sponsored/nonsponsored off
user_pref("browser.urlbar.quicksuggest.enabled", false);
user_pref("browser.urlbar.suggest.quicksuggest.fakespot", false);
user_pref("browser.urlbar.suggest.quicksuggest.nonsponsored", false);
user_pref("browser.urlbar.suggest.quicksuggest.sponsored", false);
user_pref("browser.urlbar.suggest.quicksuggest.topsites", false);
user_pref("browser.urlbar.suggest.trending", false);
// disable Important Dates urlbar suggestion
// disable Important Dates urlbar suggestion (privacy; not a needed feature)
user_pref("browser.urlbar.importantDates.featureGate", false);
// disable stock-market urlbar suggestion
// disable stock-market urlbar suggestion (privacy; not a needed feature)
user_pref("browser.urlbar.market.featureGate", false);
// disable Yelp realtime urlbar suggestion
// disable Yelp realtime urlbar suggestion (privacy; not a needed feature)
user_pref("browser.urlbar.yelpRealtime.featureGate", false);
// disable trending urlbar suggestions
// disable trending urlbar suggestions (noise + extra network requests)
user_pref("browser.urlbar.trending.featureGate", false);

// Separately configurable private-window search engine
// show per-window search-engine picker in search settings
user_pref("browser.search.separatePrivateDefault.ui.enabled", true);

// Fullscreen transitions are instant in a tiling WM
// remove fullscreen entry fade animation (instant; default 200ms)
user_pref("full-screen-api.transition-duration.enter", "0 0");
// remove fullscreen exit fade animation
// remove fullscreen exit fade animation (instant; default 200ms)
user_pref("full-screen-api.transition-duration.leave", "0 0");
// suppress fullscreen warning overlay
// suppress fullscreen warning overlay (default 3s popup; set 1250 if concerned)
user_pref("full-screen-api.warning.timeout", 0);

// Open PDF attachments inline
// open PDF attachments in-browser instead of downloading to temp
user_pref("browser.download.open_pdf_attachments_inline", true);
// keep bookmarks menu open after middle-click
// keep bookmarks menu open after middle-click opening a bookmark
user_pref("browser.bookmarks.openInTabClosesMenu", false);

// Find bar highlights all matches by default
// turn on "Highlight All" matches in find bar by default
user_pref("findbar.highlightAll", true);

// Container Tabs for first-party isolation
// enable Container Tabs engine (site isolation without separate profiles)
user_pref("privacy.userContext.enabled", true);
// show Container Tabs UI
// show Container Tabs UI (context menu + new-tab button picker)
user_pref("privacy.userContext.ui.enabled", true);
// Long-press + new tab button opens container picker
user_pref("privacy.userContext.longPressBehavior", 2);
// Mass-Spring-Damper model: a responsive but controlled GTK/Qt-like feel.

// tighten MSD motion-update interval
// tighten MSD motion-update interval for responsive scroll feel (12ms)
user_pref("general.smoothScroll.msdPhysics.continuousMotionMaxDeltaMS", 12);
// enable MSD physics scrolling
// enable mass-spring-damper physics scrolling (more natural than step-based)
user_pref("general.smoothScroll.msdPhysics.enabled", true);
user_pref("general.smoothScroll.msdPhysics.motionBeginSpringConstant", 200);
user_pref("general.smoothScroll.msdPhysics.regularSpringConstant", 250);
// start momentum-deceleration updates sooner
// start momentum-deceleration updates sooner for faster scroll dampening
user_pref("general.smoothScroll.msdPhysics.slowdownMinDeltaMS", 25);
user_pref("general.smoothScroll.msdPhysics.slowdownMinDeltaRatio", "2.0");
// moderate slowdown spring tension
// moderate slowdown spring tension for controlled momentum fade
user_pref("general.smoothScroll.msdPhysics.slowdownSpringConstant", 250);
user_pref("general.smoothScroll.currentVelocityWeighting", "1.0");
user_pref("general.smoothScroll.stopDecelerationWeighting", "1.0");
// boost scroll-wheel speed to 3x
// boost scroll-wheel speed to 3x (default 100; tune to preference)
user_pref("mousewheel.default.delta_multiplier_y", 300);

// Experimental CSS Masonry layout engine
user_pref("layout.css.grid-template-masonry-value.enabled", true);

// Do not search for clipboard content on accidental middle-click
// disable middle-click clipboard search
user_pref("browser.tabs.searchclipboardfor.middleclick", false);
// -----------------------------------------------------------------------------
// PER-OS SECTIONS
// -----------------------------------------------------------------------------
// Only the prefs tagged below apply to a given OS. Prefs from Arkenfox /
// Betterfox that are harmless everywhere are kept in their general sections
// above; the ones here genuinely differ per platform. Everything in this file
// is per-profile — the system-wide yuzu.js stays OS-agnostic.

// Force Firefox to skip the Red Hat-style geoclue location service entirely
// disable Red Hat geoclue location service
user_pref("geo.provider.use_geoclue", false);

// GVfs (GNOME) must not be used as a proxy bypass / protocol handler
// [1] https://bugzilla.mozilla.org/1433507
// block GVfs from acting as protocol handler
user_pref("network.gio.supported-protocols", "");

// Prefer the XDG Desktop Portal for the file picker dialog
// use the portal file picker instead of the GTK native dialog
user_pref("widget.use-xdg-desktop-portal.file-picker", 1);

// Disable the Windows Location Service as a geolocation provider
// disable Windows geolocation and UNC paths
user_pref("geo.provider.ms-windows-location", false);

// Never allow UNC paths to be used as file URLs (defensive on shares)
// [1] https://bugzilla.mozilla.org/1413868
// block UNC paths as file URLs
user_pref("network.file.disable_unc_paths", true);

// No favicon .ico caching / desktop-shortcut favicons
// disable taskbar favicons and app restart registration
user_pref("browser.shell.shortcutFavicons", false);

// Disable the Windows "restart after user signs out / restart to restore" Taskbar mechanism the moment the session ends
// [1] https://bugzilla.mozilla.org/603903
// disable Windows taskbar restart registration
user_pref("toolkit.winRegisterApplicationRestart", false);

// Disable Apple's CoreLocation geolocation provider
// disable macOS CoreLocation geolocation
user_pref("geo.provider.use_corelocation", false);

// (rest of macOS is policy-inherited; yuzu.js is OS-agnostic)
