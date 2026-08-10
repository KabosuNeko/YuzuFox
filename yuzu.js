// =============================================================================
// YuzuFox — System Base (installed system-wide)
// =============================================================================
// This file is installed as a SYSTEM-WIDE default preference override via
//   /usr/lib/firefox/browser/defaults/preferences/yuzu.js
//
// It is deliberately limited to what EVERY profile on this machine needs:
//   - locale / dictionary integration
//   - extension lifecycle hygiene
//   - hardware acceleration defaults
//   - COMPLETE Mozilla telemetry removal
//   - Mozilla bloat / service / AI removal
//
// Anything more opinionated (privacy hardening, security, caches, speed,
// UI/QoL) lives in the per-profile `user.js` (see install-user-js.sh).
// Prefs in this file are LOCKED on purpose: no profile should be able to
// re-enable telemetry or Mozilla marketing. Do not duplicate a pref here
// if it also appears in user.js — locked wins and the per-profile file
// would silently lose.
// =============================================================================

// -----------------------------------------------------------------------------
// LOCALE & DICTIONARIES
// -----------------------------------------------------------------------------

// Inherit locale from the OS environment ($LANG) instead of hardcoding a value.
pref("intl.locale.requested", "");

// Point Hunspell at the system-provided dictionary directory so spellcheck
// uses the same dictionaries as every other native application.
pref("spellchecker.dictionary_path", "/usr/share/hunspell");

// -----------------------------------------------------------------------------
// DEFAULT BROWSER CHECK
// -----------------------------------------------------------------------------

// Suppress the default-browser check on a system where the concept of a
// "default browser" is handled externally (xdg-settings / the WM).
pref("browser.shell.checkDefaultBrowser", false);
pref("skipDefaultBrowserCheckOnFirstRun", false, locked);

// -----------------------------------------------------------------------------
// EXTENSION LIFE-CYCLE & SECURITY
// -----------------------------------------------------------------------------

// Do not auto-disable extensions that reside in the application directory.
// This keeps ship-with-the-browser extensions (e.g. uBlock Origin via
// policies.json) active for every profile without manual intervention.
pref("extensions.autoDisableScopes", 11);

// Keep the Mozilla blocklist active. It provides real-time revocation of
// malicious addons and intermediate CA certificates — the baseline every
// profile keeps. (Do not follow cachyos.js here: it disables this.)
pref("extensions.blocklist.enabled", true, locked);

// Restrict extension installation directories to profile + application only.
pref("extensions.enabledScopes", 5);

// Suppress AMO recommendation panes and recommendation telemetry.
pref("extensions.getAddons.showPane", false, locked);
pref("extensions.htmlaboutaddons.recommendations.enabled", false, locked);

// Disable extension abuse report pings and the "Report Site Issue" button.
pref("extensions.abuseReport.enabled", false, locked);
pref("extensions.webcompat-reporter.enabled", false, locked);

// Prevent the recurring addon discovery-cache background fetch.
pref("extensions.getAddons.cache.enabled", false, locked);

// No extension should install without explicit consent.
pref("extensions.postDownloadThirdPartyPrompt", false);

// Pocket is a Mozilla service: off for every profile.
pref("extensions.pocket.enabled", false, locked);

// Keep quarantined-domain enforcement active (safety net even with
// DNS-level filtering in place).
pref("extensions.quarantinedDomains.enabled", true);

// -----------------------------------------------------------------------------
// HARDWARE ACCELERATION & GPU RENDERING (defaults)
// -----------------------------------------------------------------------------

// Force-enable hardware video decoding across all codec paths.
pref("media.hardware-video-decoding.force-enabled", true);
pref("media.webrtc.hw.h264.enabled", true);
pref("media.gpu-process-decoder", true);

// Enable WebRender with shader pre-caching; guarantees GPU compositing on a
// known-good Mesa stack.
pref("gfx.webrender.all", true);
pref("gfx.webrender.precache-shaders", true);
pref("gfx.webrender.program-binary-disk", true);
pref("gfx.webrender.compositor.force-enabled", true);

// Run GPU work in a dedicated OS process so a driver crash cannot take
// down the browser chrome.
pref("layers.gpu-process.enabled", true);

// -----------------------------------------------------------------------------
// COMPLETE TELEMETRY BLOCK — EVERY CHANNEL
// -----------------------------------------------------------------------------
// Telemetry, studies, crash reports, coverage pings, and all other forms of
// outbound data collection are unconditionally blocked for every profile.
// No Mozilla endpoint receives any information about this installation.

// System-load telemetry channel (DNS, etc.).
pref("dom.security.unexpected_system_load_telemetry_enabled", false, locked);

// Normandy / Shield studies: remote experimentation system.
pref("app.normandy.api_url", "", locked);
pref("app.normandy.enabled", false, locked);
pref("app.shield.optoutstudies.enabled", false, locked);

// Crash reports: breakpad and tab-crash submission.
pref("breakpad.reportURL", "", locked);
pref("browser.crashReports.unsubmittedCheck.autoSubmit2", false, locked);
pref("browser.tabs.crashReporting.sendReport", false, locked);

// Activity Stream telemetry: new-tab impressions, clicks, interactions.
pref("browser.newtabpage.activity-stream.feeds.telemetry", false, locked);
pref("browser.newtabpage.activity-stream.telemetry", false, locked);
pref("browser.newtabpage.activity-stream.telemetry.structuredIngestion.endpoint", 0, locked);
pref("browser.newtabpage.activity-stream.telemetry.ut.event", false, locked);
pref("browser.newtabpage.activity-stream.telemetry.ut.events", false, locked);
pref("browser.newtabpage.activity-stream.trendingSearch.blockedAds", "", locked);
pref("browser.newtabpage.activity-stream.trendingSearch.enabled", false, locked);
pref("browser.newtabpage.activity-stream.trendingSearch.variant", "", locked);

// Ping-centre: generic measurement system.
pref("browser.ping-centre.telemetry", false, locked);

// Search telemetry: SERP event categorisation and update pings.
pref("browser.search.serpEventTelemetryCategorization.enabled", false, locked);
pref("browser.search.serpEventTelemetryCategorization.regionEnabled", false, locked);
pref("browser.search.update", false, locked);

// Shopping / price-tracking telemetry.
pref("browser.shopping.experience2023.enabled", false, locked);

// Version-ping override and URL-bar feature gates (also phone home).
pref("browser.startup.homepage_override.mstone", "ignore", locked);
pref("browser.urlbar.addons.featureGate", false, locked);
pref("browser.urlbar.fakespot.featureGate", false, locked);
pref("browser.urlbar.mdn.featureGate", false, locked);
pref("browser.urlbar.pocket.featureGate", false, locked);
pref("browser.urlbar.weather.featureGate", false, locked);
pref("browser.urlbar.yelp.featureGate", false, locked);

// Health report and unified telemetry.
pref("datareporting.healthreport.uploadEnabled", false, locked);
pref("datareporting.policy.dataSubmissionEnabled", false, locked);
pref("datareporting.usage.uploadEnabled", false, locked);

// Network-level telemetry: captive portal, connectivity checks, traffic analysis.
pref("network.captive-portal-service.enabled", false, locked);
pref("network.connectivity-service.enabled", false, locked);
pref("network.traffic_analyzer.enabled", false, locked);
pref("network.trr.confirmation_telemetry_enabled", false, locked);

// Certificate-error telemetry.
pref("security.certerrors.recordEventTelemetry", false, locked);

// Toolkit content relevancy (Firefox "top hits" ML pipeline).
pref("toolkit.contentRelevancy.enabled", false, locked);

// Toolkit-level telemetry.
pref("toolkit.coverage.endpoint.base", "", locked);
pref("toolkit.coverage.opt-out", true, locked);
pref("toolkit.telemetry.archive.enabled", false, locked);
pref("toolkit.telemetry.bhrPing.enabled", false, locked);
pref("toolkit.telemetry.cachedClientID", "", locked);
pref("toolkit.telemetry.cachedProfileGroupID", "", locked);
pref("toolkit.telemetry.coverage.opt-out", true, locked);
pref("toolkit.telemetry.enabled", false, locked);
pref("toolkit.telemetry.firstShutdownPing.enabled", false, locked);
pref("toolkit.telemetry.newProfilePing.enabled", false, locked);
pref("toolkit.telemetry.server", "data:,", locked);
pref("toolkit.telemetry.shutdownPingSender.enabled", false, locked);
pref("toolkit.telemetry.unified", false, locked);
pref("toolkit.telemetry.updatePing.enabled", false, locked);

// -----------------------------------------------------------------------------
// MOZILLA BLOAT REMOVAL — SERVICES, AI, MARKETING
// -----------------------------------------------------------------------------
// Every Mozilla-branded service, promotion, sponsored slot, AI assistant,
// VPN banner, and onboarding panel is removed. The browser must not display
// any element that originates from Mozilla's marketing or telemetry pipeline.

// Content Analysis / DLP agent — enterprise monitoring, irrelevant on Arch.
pref("browser.contentanalysis.default_result", 0, locked);
pref("browser.contentanalysis.enabled", false, locked);

// VPN, Lockwise, Monitor, Proxy promotions from the protection panel.
pref("browser.contentblocking.report.hide_vpn_banner", true, locked);
pref("browser.contentblocking.report.lockwise.enabled", false);
pref("browser.contentblocking.report.mobile-android.url", "", locked);
pref("browser.contentblocking.report.mobile-ios.url", "", locked);
pref("browser.contentblocking.report.monitor.enabled", false);
pref("browser.contentblocking.report.proxy.enabled", false);
pref("browser.contentblocking.report.proxy_extension.url", "", locked);
pref("browser.contentblocking.report.show_mobile_app", false, locked);
pref("browser.contentblocking.report.vpn-android.url", "", locked);
pref("browser.contentblocking.report.vpn-ios.url", "", locked);
pref("browser.contentblocking.report.vpn-promo.url", "", locked);
pref("browser.contentblocking.report.vpn.url", "", locked);

// Disable feature recommendations and discovery streams.
pref("browser.dataFeatureRecommendations.enabled", false, locked);
pref("browser.discovery.enabled", false, locked);

// IP Protection (Mozilla's proxied-load feature) — disabled entirely.
pref("browser.ipProtection.enabled", false, locked);
pref("browser.ipProtection.guardian.endpoint", "", locked);
pref("browser.ipProtection.variant", "", locked);

// Activity Stream — kill every feed, ad pipeline, and sponsored surface.
pref("browser.newtabpage.activity-stream.feeds.aboutpreferences", false, locked);
pref("browser.newtabpage.activity-stream.feeds.adsfeed", false, locked);
pref("browser.newtabpage.activity-stream.feeds.discoverystreamfeed", false, locked);
pref("browser.newtabpage.activity-stream.feeds.recommendationprovider", false, locked);
pref("browser.newtabpage.activity-stream.feeds.system.topsites", false, locked);
pref("browser.newtabpage.activity-stream.feeds.system.topstories", false, locked);
pref("browser.newtabpage.activity-stream.feeds.topsites", false, locked);
pref("browser.newtabpage.activity-stream.feeds.section.topstories", false, locked);
pref("browser.newtabpage.activity-stream.showSponsoredCheckboxes", false, locked);
pref("browser.newtabpage.activity-stream.system.showSponsored", false, locked);
pref("browser.newtabpage.activity-stream.unifiedAds.adsFeed.enabled", false, locked);
pref("browser.newtabpage.activity-stream.unifiedAds.adsFeed.spocs.enabled", false, locked);
pref("browser.newtabpage.activity-stream.unifiedAds.adsFeed.tiles.enabled", false, locked);
pref("browser.newtabpage.activity-stream.unifiedAds.endpoint", "", locked);
pref("browser.newtabpage.activity-stream.unifiedAds.spocs.enabled", false, locked);
pref("browser.newtabpage.activity-stream.unifiedAds.tiles.enabled", false, locked);

// Suppress in-content-recommendation (CFR) doorhangers for addons and features.
pref("browser.newtabpage.activity-stream.asrouter.userprefs.cfr.addons", false, locked);
pref("browser.newtabpage.activity-stream.asrouter.userprefs.cfr.features", false, locked);

// Speculative Places feed in the new-tab page (also a background network hook).
pref("browser.newtabpage.activity-stream.feeds.places", false, locked);

// Places interaction tracking (used for "jump back in" suggestions).
pref("browser.places.interactions.enabled", false, locked);

// Private-browsing promos.
pref("browser.privatebrowsing.vpnpromourl", "", locked);
pref("browser.promo.cookiebanners.enabled", false, locked);
pref("browser.promo.focus.enabled", false, locked);
pref("browser.promo.pin.enabled", false, locked);
pref("browser.protections_panel.infoMessage.seen", true);

// "Send to device" locale detection and Smart Tab Groups.
pref("browser.send_to_device_locales", "");
pref("browser.tabs.groups.smart.userEnabled", false, locked);

// UITour — remote-controllable UI tour system; disabled.
pref("browser.uitour.enabled", false, locked);
pref("browser.uitour.url", "", locked);

// VPN promo and captive portal detection (pt0).
pref("browser.vpn_promo.enabled", false, locked);
pref("captivedetect.canonicalURL", "", locked);

// Cookie-banner UI callout.
pref("cookiebanners.ui.desktop.showCallout", false, locked);

// Remote debugging — explicitly off (default is false, locked for defence).
pref("devtools.debugger.remote-enabled", false, locked);

// OpenH264 plugin auto-update — prevented so no outbound check occurs.
pref("media.gmp-gmpopenh264.autoupdate", false, locked);

// Mozilla AI / ML assistant, link preview, smart tab groups.
pref("browser.ml.enable", false, locked);
pref("browser.ml.chat.enabled", false, locked);
pref("browser.ml.chat.page", false, locked);
pref("browser.ml.chat.menu", false);
pref("browser.ml.linkPreview.enabled", false, locked);
pref("browser.tabs.groups.smart.enabled", false);
pref("browser.ai.control.default", "blocked");

// Firefox Relay (Mozilla-operated service; mask generation is handled by a
// standalone service if needed).
pref("signon.firefoxRelay.feature", "disabled", locked);

// -----------------------------------------------------------------------------
// DESKTOP INTEGRATION
// -----------------------------------------------------------------------------

// Prefer the XDG Desktop Portal for the file picker dialog.
pref("widget.use-xdg-desktop-portal.file-picker", 1);
