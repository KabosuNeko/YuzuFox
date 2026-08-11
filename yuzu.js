// =============================================================================
// YuzuFox — System Base (installed system-wide)
// =============================================================================
// This file is installed as a SYSTEM-WIDE default preference override via
//   /usr/lib/firefox/browser/defaults/preferences/yuzu.js
//
// It is deliberately limited to what EVERY profile on this machine needs:
//   - locale / dictionary integration
//   - extension lifecycle hygiene
//   - hardware acceleration + performance tuning defaults
//   - COMPLETE Mozilla telemetry removal
//   - Mozilla bloat / service / AI removal
//
// Anything more opinionated (privacy hardening, security, UI/QoL) lives in
// the per-profile `user.js` (see install.sh, install.ps1).
// Prefs in this file are LOCKED on purpose: no profile should be able to
// re-enable telemetry or Mozilla marketing. Do not duplicate a pref here
// if it also appears in user.js — locked wins and the per-profile file
// would silently lose.
// =============================================================================

// Inherit locale from the OS environment ($LANG) instead of hardcoding a value.
// use $LANG to pick locale instead of hardcoding
pref("intl.locale.requested", "");

// Point Hunspell at the system-provided dictionary directory so spellcheck
// uses the same dictionaries as every other native application.
// use system-wide Hunspell dictionaries
pref("spellchecker.dictionary_path", "/usr/share/hunspell");

// Suppress the default-browser check on a system where the concept of a
// "default browser" is handled externally (xdg-settings / the WM).
// disable default-browser nag dialog
pref("browser.shell.checkDefaultBrowser", false, locked);
// skip the first-run default-browser prompt
pref("skipDefaultBrowserCheckOnFirstRun", false, locked);

// Do not auto-disable extensions that reside in the application directory.
// This keeps ship-with-the-browser extensions (e.g. uBlock Origin via
// policies.json) active for every profile without manual intervention.
// allow app-installed extensions to stay enabled
pref("extensions.autoDisableScopes", 11);

// Keep the Mozilla blocklist active. It provides real-time revocation of
// malicious addons and intermediate CA certificates — the baseline every
// profile keeps. (Do not follow cachyos.js here: it disables this.)
// keep addon/CA blocklist active; diverges from cachyos which disables it
pref("extensions.blocklist.enabled", true, locked);

// Restrict extension installation directories to profile + application only.
// block extensions from user/system/temp dirs (5 = profile + application)
pref("extensions.enabledScopes", 5);

// Suppress AMO recommendation panes and recommendation telemetry.
// disable about:addons recommendation pane (uses Google Analytics)
pref("extensions.getAddons.showPane", false, locked);
// disable recommendations in Extensions and Themes panes
pref("extensions.htmlaboutaddons.recommendations.enabled", false, locked);

// Disable extension abuse report pings and the "Report Site Issue" button.
// block addon-abuse-report outbound pings
pref("extensions.abuseReport.enabled", false, locked);
// disable "Report Site Issue" webcompat reporter
pref("extensions.webcompat-reporter.enabled", false, locked);

// Prevent the recurring addon discovery-cache background fetch.
// stop background refresh of extension discovery cache
pref("extensions.getAddons.cache.enabled", false, locked);

// No extension should install without explicit consent.
// block silent third-party extension installs via web APIs
pref("extensions.postDownloadThirdPartyPrompt", false);

// Pocket is a Mozilla service: off for every profile.
// disable Pocket integration (Mozilla content recommendation service)
pref("extensions.pocket.enabled", false, locked);

// Keep quarantined-domain enforcement active (safety net even with
// DNS-level filtering in place).
// keep quarantined-domains restriction (Firefox default; safety net)
pref("extensions.quarantinedDomains.enabled", true);

// Force-enable hardware video decoding across all codec paths.
// force VA-API / NVDEC hardware video decoding on Linux
pref("media.hardware-video-decoding.force-enabled", true);
// enable H.264 hardware encoding in WebRTC
pref("media.webrtc.hw.h264.enabled", true);
// offload video decoding to the GPU process
pref("media.gpu-process-decoder", true);

// Enable WebRender with shader pre-caching; guarantees GPU compositing on a
// known-good Mesa stack.
// force WebRender compositor for all GPUs
pref("gfx.webrender.all", true);
// pre-compile WebRender shaders at startup
pref("gfx.webrender.precache-shaders", true);
// cache compiled shader programs to disk for faster cold starts
pref("gfx.webrender.program-binary-disk", true);
// force WebRender compositor mode; needed on some Mesa/Driver configs
pref("gfx.webrender.compositor.force-enabled", true);

// Run GPU work in a dedicated OS process so a driver crash cannot take
// down the browser chrome.
// isolate GPU work in a dedicated process for crash resilience
pref("layers.gpu-process.enabled", true);

// Cache, JIT, and network tuning for this machine's hardware. These are
// These tweaks are from cachyos-firefox-settings.

// RAM-only cache: no disk writes, no SSD wear, all I/O at RAM speed.
// disable disk cache
pref("browser.cache.disk.enable", false);
// set memory cache capacity
pref("browser.cache.memory.capacity", 1048576);
// force media cache into RAM in private browsing
pref("browser.privatebrowsing.forceMediaMemoryCache", true);
// set media memory cache max size
pref("media.memory_cache_max_size", 1048576);
pref("media.memory_caches_combined_limit_kb", 3145728);

// Larger video buffers for machines with RAM to spare.
// double read-ahead and resume threshold
pref("media.cache_readahead_limit", 7200);
pref("media.cache_resume_threshold", 3600);

// Decoded image cache: 10 MB pool with 64 KB decode chunks.
// set decoded image cache pool
pref("image.cache.size", 10485760);
// set image decode chunk size
pref("image.mem.decode_bytes_at_a_time", 65536);
pref("image.mem.shared.unmap.min_expiration_ms", 120000);

// Network buffers and TLS session cache.
// 64 KB network I/O buffer, fewer syscalls for higher throughput
pref("network.buffer.cache.size", 65535);
// larger network buffer pool, less contention under multi-tab load
pref("network.buffer.cache.count", 48);
// set TLS session cache capacity
pref("network.ssl_tokens_cache_capacity", 32768);

// Unload inactive tabs under memory pressure.
// unload inactive tabs under memory pressure
pref("browser.tabs.unloadOnLowMemory", true);

// Canvas2D and Skia font caches for GPU-accelerated rendering.
// set canvas cache items
pref("gfx.canvas.accelerated.cache-items", 32768);
// set canvas cache size
pref("gfx.canvas.accelerated.cache-size", 4096);
// set Skia font cache size
pref("gfx.content.skia-font-cache-size", 80);

// Lower JIT thresholds: warm JS compiles sooner on modern hardware.
// lower Baseline JIT threshold
pref("javascript.options.baselinejit.threshold", 50);
// lower Ion JIT threshold
pref("javascript.options.ion.threshold", 500);

// Snappier incremental rendering during slow page loads.
// set incremental reflow notify interval
pref("content.notify.interval", 100000);

// Aggressive-but-safe parallel connection tuning.
// DNS cache lives 1 hour (default 60s), avoids repeated lookup latency
pref("network.dnsCacheExpiration", 3600);
// higher parallel-connection ceiling (default 900), more concurrent loads
pref("network.http.max-connections", 1800);
// more keep-alive conns per server (default 6), less TCP handshake overhead
pref("network.http.max-persistent-connections-per-server", 10);
// more urgent-start slots per host (default 3), above-fold resources fetch sooner
pref("network.http.max-urgent-start-excessive-connections-per-host", 5);
// disable request pacing for lower latency
pref("network.http.pacing.requests.enabled", false);
// shorter queued-request wait (default 10s), pages complete sooner
pref("network.http.request.max-start-delay", 5);

// Force HTTP/3 (QUIC) for lower-latency connections where supported.
pref("network.http.http3.enable", true);

// Cache more back/forward page states for instant history navigation.
pref("browser.sessionhistory.max_total_viewers", 10);

// Telemetry, studies, crash reports, coverage pings, and all other forms of
// outbound data collection are unconditionally blocked for every profile.
// No Mozilla endpoint receives any information about this installation.

// System-load telemetry channel (DNS, etc.).
// block unexpected-system-load telemetry (DNS load events)
pref("dom.security.unexpected_system_load_telemetry_enabled", false, locked);

// Normandy / Shield studies: remote experimentation system.
// block Normandy server endpoint
pref("app.normandy.api_url", "", locked);
// disable Normandy/Shield recipe deployment system
pref("app.normandy.enabled", false, locked);
// disable Shield opt-out studies (remote experimentation)
pref("app.shield.optoutstudies.enabled", false, locked);

// Crash reports: breakpad and tab-crash submission.
// disable Breakpad crash report upload endpoint
pref("breakpad.reportURL", "", locked);
// prevent auto-submission of backlogged crash reports
pref("browser.crashReports.unsubmittedCheck.autoSubmit2", false, locked);
// disable tab-level crash report submission
pref("browser.tabs.crashReporting.sendReport", false, locked);

// Activity Stream telemetry: new-tab impressions, clicks, interactions.
// disable new-tab page telemetry feed
pref("browser.newtabpage.activity-stream.feeds.telemetry", false, locked);
// disable new-tab page telemetry
pref("browser.newtabpage.activity-stream.telemetry", false, locked);
// disable structured telemetry ingestion endpoint for new-tab
pref("browser.newtabpage.activity-stream.telemetry.structuredIngestion.endpoint", 0, locked);
// disable unified telemetry event tracking on new-tab
pref("browser.newtabpage.activity-stream.telemetry.ut.event", false, locked);
// disable unified telemetry events on new-tab
pref("browser.newtabpage.activity-stream.telemetry.ut.events", false, locked);
// block trending-search ad endpoint on new-tab
pref("browser.newtabpage.activity-stream.trendingSearch.blockedAds", "", locked);
// disable trending-search feature on new-tab
pref("browser.newtabpage.activity-stream.trendingSearch.enabled", false, locked);
// clear trending-search variant to prevent A/B tests
pref("browser.newtabpage.activity-stream.trendingSearch.variant", "", locked);

// Ping-centre: generic measurement system.
// disable PingCentre generic measurement pipeline
pref("browser.ping-centre.telemetry", false, locked);

// Search telemetry: SERP event categorisation and update pings.
// disable SERP event telemetry categorization
pref("browser.search.serpEventTelemetryCategorization.enabled", false, locked);
// disable region-based SERP telemetry
pref("browser.search.serpEventTelemetryCategorization.regionEnabled", false, locked);
// disable search-engine metadata update pings
pref("browser.search.update", false, locked);

// Shopping / price-tracking telemetry.
// disable Fakespot shopping-review integration
pref("browser.shopping.experience2023.enabled", false, locked);

// Version-ping override and URL-bar feature gates (also phone home).
// suppress version-aware milestone ping on startup
pref("browser.startup.homepage_override.mstone", "ignore", locked);
// disable addons urlbar suggestion feature gate
pref("browser.urlbar.addons.featureGate", false, locked);
// disable Fakespot urlbar suggestions
pref("browser.urlbar.fakespot.featureGate", false, locked);
// disable MDN documentation urlbar suggestions
pref("browser.urlbar.mdn.featureGate", false, locked);
// disable Pocket urlbar suggestions
pref("browser.urlbar.pocket.featureGate", false, locked);
// disable weather urlbar suggestions
pref("browser.urlbar.weather.featureGate", false, locked);
// disable Yelp urlbar suggestions
pref("browser.urlbar.yelp.featureGate", false, locked);

// Health report and unified telemetry.
// disable Firefox Health Report upload (FHR)
pref("datareporting.healthreport.uploadEnabled", false, locked);
// revoke data-collection policy consent
pref("datareporting.policy.dataSubmissionEnabled", false, locked);
// disable anonymized usage-statistic uploads
pref("datareporting.usage.uploadEnabled", false, locked);

// Network-level telemetry: captive portal, connectivity checks, traffic analysis.
// disable captive-portal detection (phones home to detectportal.firefox.com)
pref("network.captive-portal-service.enabled", false, locked);
// disable network connectivity check service
pref("network.connectivity-service.enabled", false, locked);
// disable network traffic analyzer telemetry
pref("network.traffic_analyzer.enabled", false, locked);
// disable TRR (DoH) confirmation telemetry
pref("network.trr.confirmation_telemetry_enabled", false, locked);

// Certificate-error telemetry.
// disable TLS/SSL certificate-error event telemetry
pref("security.certerrors.recordEventTelemetry", false, locked);

// Toolkit content relevancy (Firefox "top hits" ML pipeline).
// disable content-relevancy ML pipeline for top-hits suggestions
pref("toolkit.contentRelevancy.enabled", false, locked);

// Toolkit-level telemetry.
// disable telemetry coverage endpoint
pref("toolkit.coverage.endpoint.base", "", locked);
// opt out of telemetry coverage pings
pref("toolkit.coverage.opt-out", true, locked);
// disable telemetry archive (local ping storage)
pref("toolkit.telemetry.archive.enabled", false, locked);
// disable background-hang-reporter ping
pref("toolkit.telemetry.bhrPing.enabled", false, locked);
// clear cached telemetry client ID
pref("toolkit.telemetry.cachedClientID", "", locked);
// clear cached telemetry profile-group ID
pref("toolkit.telemetry.cachedProfileGroupID", "", locked);
// opt out of telemetry coverage
pref("toolkit.telemetry.coverage.opt-out", true, locked);
// master switch — disable all Firefox telemetry
pref("toolkit.telemetry.enabled", false, locked);
// disable first-shutdown ping
pref("toolkit.telemetry.firstShutdownPing.enabled", false, locked);
// disable new-profile ping
pref("toolkit.telemetry.newProfilePing.enabled", false, locked);
// override telemetry server to no-op data: URL
pref("toolkit.telemetry.server", "data:,", locked);
// disable shutdown ping sender
pref("toolkit.telemetry.shutdownPingSender.enabled", false, locked);
// disable unified telemetry subsystem
pref("toolkit.telemetry.unified", false, locked);
// disable update ping
pref("toolkit.telemetry.updatePing.enabled", false, locked);

// Every Mozilla-branded service, promotion, sponsored slot, AI assistant,
// VPN banner, and onboarding panel is removed. The browser must not display
// any element that originates from Mozilla's marketing or telemetry pipeline.

// Content Analysis / DLP agent — enterprise monitoring, irrelevant on Arch.
// block DLP content-analysis requests; irrelevant for personal machines
pref("browser.contentanalysis.default_result", 0, locked);
// disable DLP content-analysis agent entirely
pref("browser.contentanalysis.enabled", false, locked);

// VPN, Lockwise, Monitor, Proxy promotions from the protection panel.
// hide VPN banner in content-blocking report panel
pref("browser.contentblocking.report.hide_vpn_banner", true, locked);
// disable Firefox Lockwise password manager promotion
pref("browser.contentblocking.report.lockwise.enabled", false);
// block Firefox mobile-app download link
pref("browser.contentblocking.report.mobile-android.url", "", locked);
// block Firefox iOS-app download link
pref("browser.contentblocking.report.mobile-ios.url", "", locked);
// disable Firefox Monitor breach-alert promotion
pref("browser.contentblocking.report.monitor.enabled", false);
// disable Firefox Proxy addon promotion
pref("browser.contentblocking.report.proxy.enabled", false);
// clear proxy-extension promo URL
pref("browser.contentblocking.report.proxy_extension.url", "", locked);
// hide mobile-app promo in protection panel
pref("browser.contentblocking.report.show_mobile_app", false, locked);
// clear VPN Android promo URL
pref("browser.contentblocking.report.vpn-android.url", "", locked);
// clear VPN iOS promo URL
pref("browser.contentblocking.report.vpn-ios.url", "", locked);
// clear VPN promo URL
pref("browser.contentblocking.report.vpn-promo.url", "", locked);
// clear VPN descriptor URL
pref("browser.contentblocking.report.vpn.url", "", locked);

// Disable feature recommendations and discovery streams.
// disable data-driven feature recommendations
pref("browser.dataFeatureRecommendations.enabled", false, locked);
// disable personalized extension recommendations (uses telemetry)
pref("browser.discovery.enabled", false, locked);

// IP Protection (Mozilla's proxied-load feature) — disabled entirely.
// disable Mozilla IP Protection (proxy-based IP masking service)
pref("browser.ipProtection.enabled", false, locked);
// clear IP Protection guardian endpoint
pref("browser.ipProtection.guardian.endpoint", "", locked);
// clear IP Protection experiment variant
pref("browser.ipProtection.variant", "", locked);

// Activity Stream — kill every feed, ad pipeline, and sponsored surface.
// disable about:preferences feed in new-tab page
pref("browser.newtabpage.activity-stream.feeds.aboutpreferences", false, locked);
// disable ad feed in new-tab page
pref("browser.newtabpage.activity-stream.feeds.adsfeed", false, locked);
// disable Discovery Stream content feed (Pocket recommendations)
pref("browser.newtabpage.activity-stream.feeds.discoverystreamfeed", false, locked);
// disable extension recommendation provider in new-tab
pref("browser.newtabpage.activity-stream.feeds.recommendationprovider", false, locked);
// disable system top-sites feed (Mozilla-curated)
pref("browser.newtabpage.activity-stream.feeds.system.topsites", false, locked);
// disable system top-stories feed (Pocket-curated)
pref("browser.newtabpage.activity-stream.feeds.system.topstories", false, locked);
// disable user top-sites feed
pref("browser.newtabpage.activity-stream.feeds.topsites", false, locked);
// disable Pocket-recommended stories section on new-tab
pref("browser.newtabpage.activity-stream.feeds.section.topstories", false, locked);
// hide "Support Firefox" sponsored checkbox on new-tab
pref("browser.newtabpage.activity-stream.showSponsoredCheckboxes", false, locked);
// disable system-level sponsored content on new-tab
pref("browser.newtabpage.activity-stream.system.showSponsored", false, locked);
// disable unified ad feed on new-tab
pref("browser.newtabpage.activity-stream.unifiedAds.adsFeed.enabled", false, locked);
// disable sponsored content in unified ad feed
pref("browser.newtabpage.activity-stream.unifiedAds.adsFeed.spocs.enabled", false, locked);
// disable ad tiles in unified ad feed
pref("browser.newtabpage.activity-stream.unifiedAds.adsFeed.tiles.enabled", false, locked);
// clear unified-ad endpoint URL
pref("browser.newtabpage.activity-stream.unifiedAds.endpoint", "", locked);
// disable sponsored-content cards in unified ads
pref("browser.newtabpage.activity-stream.unifiedAds.spocs.enabled", false, locked);
// disable ad-tile integration in unified ads
pref("browser.newtabpage.activity-stream.unifiedAds.tiles.enabled", false, locked);

// Suppress in-content-recommendation (CFR) doorhangers for addons and features.
// disable addon-recommendation CFR doorhangers (browser chrome popups)
pref("browser.newtabpage.activity-stream.asrouter.userprefs.cfr.addons", false, locked);
// disable feature-recommendation CFR doorhangers
pref("browser.newtabpage.activity-stream.asrouter.userprefs.cfr.features", false, locked);

// Speculative Places feed in the new-tab page (also a background network hook).
// disable Places (bookmarks/history) feed on new-tab; blocks background network fetch
pref("browser.newtabpage.activity-stream.feeds.places", false, locked);

// Places interaction tracking (used for "jump back in" suggestions).
// disable Places interaction logging for "jump back in" suggestions
pref("browser.places.interactions.enabled", false, locked);

// Private-browsing promos.
// clear private-browsing VPN promo URL
pref("browser.privatebrowsing.vpnpromourl", "", locked);
// disable cookie-banner promo callout
pref("browser.promo.cookiebanners.enabled", false, locked);
// disable Firefox Focus promo
pref("browser.promo.focus.enabled", false, locked);
// disable pin-to-taskbar promo
pref("browser.promo.pin.enabled", false, locked);
// mark protection-panel info message as seen to suppress it
pref("browser.protections_panel.infoMessage.seen", true);

// "Send to device" locale detection and Smart Tab Groups.
// clear send-to-device locale list (no cross-device tab push)
pref("browser.send_to_device_locales", "");
// disable smart tab-group user suggestion
pref("browser.tabs.groups.smart.userEnabled", false, locked);

// UITour — remote-controllable UI tour system; disabled.
// disable UITour backend (remote page UI control API)
pref("browser.uitour.enabled", false, locked);
// clear UITour URL; defense-in-depth against remote UI control
pref("browser.uitour.url", "", locked);

// VPN promo and captive portal detection (pt0).
// disable VPN promo on about:newtab and settings
pref("browser.vpn_promo.enabled", false, locked);
// disable captive-portal detection URL (prevents connectivity test fetch)
pref("captivedetect.canonicalURL", "", locked);

// Cookie-banner UI callout.
// disable cookie-banner desktop UI callout popup
pref("cookiebanners.ui.desktop.showCallout", false, locked);

// Remote debugging — explicitly off (default is false, locked for defence).
// disable remote debugger listener (security; locked for defense-in-depth)
pref("devtools.debugger.remote-enabled", false, locked);

// OpenH264 plugin auto-update — prevented so no outbound check occurs.
// disable OpenH264 codec auto-update (prevents outbound update check)
pref("media.gmp-gmpopenh264.autoupdate", false, locked);

// Mozilla AI / ML assistant, link preview, smart tab groups.
// disable Mozilla ML engine (local AI inference backend)
pref("browser.ml.enable", false, locked);
// disable ML chat sidebar feature
pref("browser.ml.chat.enabled", false, locked);
// disable ML chat page-integration
pref("browser.ml.chat.page", false, locked);
// disable ML chat context-menu entry
pref("browser.ml.chat.menu", false);
// disable AI link-preview popup on hover
pref("browser.ml.linkPreview.enabled", false, locked);
// disable smart tab-grouping (AI-powered automatic tab organization)
pref("browser.tabs.groups.smart.enabled", false);
// block websites from accessing browser AI APIs (e.g. Prompt API)
pref("browser.ai.control.default", "blocked");

// Firefox Relay (Mozilla-operated service; mask generation is handled by a
// standalone service if needed).
// disable Firefox Relay email-masking integration
pref("signon.firefoxRelay.feature", "disabled", locked);
