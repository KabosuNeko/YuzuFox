// =============================================================================
// YuzuFox — System Base (/usr/lib/firefox/browser/defaults/preferences/yuzu.js)
// =============================================================================
// System-wide baseline: locale, extension hygiene, hardware acceleration,
// RAM cache / connection tuning, telemetry removal, and Mozilla debloat.
// Sensitive prefs are locked. Per-profile overrides live in user.js.
// =============================================================================

// OS locale & Hunspell dictionary
pref("intl.locale.requested", "");
pref("spellchecker.dictionary_path", "/usr/share/hunspell");

// Disable default browser check
pref("browser.shell.checkDefaultBrowser", false, locked);

// Extension scope & blocklist
pref("extensions.autoDisableScopes", 11);
pref("extensions.blocklist.enabled", true, locked);
pref("extensions.enabledScopes", 5);
pref("extensions.getAddons.showPane", false, locked);
pref("extensions.htmlaboutaddons.recommendations.enabled", false, locked);
pref("extensions.abuseReport.enabled", false, locked);
pref("extensions.webcompat-reporter.enabled", false, locked);
pref("extensions.getAddons.cache.enabled", false, locked);
pref("extensions.postDownloadThirdPartyPrompt", false);
pref("extensions.quarantinedDomains.enabled", true);

// Hardware acceleration & WebRender
pref("media.hardware-video-decoding.force-enabled", true);
pref("media.webrtc.hw.h264.enabled", true);
pref("media.gpu-process-decoder", true);
pref("gfx.webrender.all", true);
pref("gfx.webrender.precache-shaders", true);
pref("gfx.webrender.program-binary-disk", true);
pref("layers.gpu-process.enabled", true);

// Performance tuning (CachyOS)
// RAM cache (disk cache disabled)
pref("browser.cache.disk.enable", false);
pref("browser.cache.memory.capacity", 1048576);
pref("browser.privatebrowsing.forceMediaMemoryCache", true);
pref("media.memory_cache_max_size", 1048576);
pref("media.memory_caches_combined_limit_kb", 3145728);

// Media buffer
pref("media.cache_readahead_limit", 7200);
pref("media.cache_resume_threshold", 3600);

// Image & font cache
pref("image.cache.size", 10485760);
pref("image.mem.decode_bytes_at_a_time", 65536);
pref("image.mem.shared.unmap.min_expiration_ms", 120000);
pref("network.buffer.cache.size", 65535);
pref("network.buffer.cache.count", 48);
pref("network.ssl_tokens_cache_capacity", 32768);
pref("browser.tabs.unloadOnLowMemory", true);
pref("gfx.canvas.accelerated.cache-items", 32768);
pref("gfx.canvas.accelerated.cache-size", 4096);
pref("gfx.content.skia-font-cache-size", 80);

// JIT thresholds & reflow
pref("javascript.options.baselinejit.threshold", 50);
pref("javascript.options.ion.threshold", 500);
pref("content.notify.interval", 100000);
pref("content.notify.ontimer", true);

// Parallel connections & HTTP/3
pref("network.dnsCacheEntries", 1000);
pref("network.dnsCacheExpiration", 3600);
pref("network.http.max-connections", 1800);
pref("network.http.max-persistent-connections-per-server", 10);
pref("network.http.max-urgent-start-excessive-connections-per-host", 5);
pref("network.http.pacing.requests.enabled", false);
pref("network.http.request.max-start-delay", 5);
pref("network.http.http3.enable", true);
pref("browser.sessionhistory.max_total_viewers", 10);

// -----------------------------------------------------------------------------
// TELEMETRY & EXPERIMENTATION (LOCKED)
// -----------------------------------------------------------------------------
pref("dom.security.unexpected_system_load_telemetry_enabled", false, locked);

// Normandy / Shield / Nimbus
pref("app.normandy.api_url", "", locked);
pref("app.normandy.enabled", false, locked);
pref("app.shield.optoutstudies.enabled", false, locked);
pref("nimbus.rollouts.enabled", false, locked);

// Crash reports
pref("breakpad.reportURL", "", locked);
pref("browser.crashReports.unsubmittedCheck.enabled", false, locked);
pref("browser.crashReports.unsubmittedCheck.autoSubmit2", false, locked);
pref("browser.tabs.crashReporting.sendReport", false, locked);

// Activity stream telemetry
pref("browser.newtabpage.activity-stream.telemetry", false, locked);

// Search telemetry
pref("browser.search.serpEventTelemetryCategorization.enabled", false, locked);
pref("browser.search.serpEventTelemetryCategorization.regionEnabled", false, locked);
pref("browser.search.update", false, locked);

// Startup & URL bar suggestions
pref("browser.startup.homepage_override.mstone", "ignore", locked);
pref("browser.urlbar.addons.featureGate", false, locked);
pref("browser.urlbar.fakespot.featureGate", false, locked);
pref("browser.urlbar.mdn.featureGate", false, locked);
pref("browser.urlbar.weather.featureGate", false, locked);
pref("browser.urlbar.yelp.featureGate", false, locked);

// Data reporting & health report
pref("datareporting.healthreport.uploadEnabled", false, locked);
pref("datareporting.policy.dataSubmissionEnabled", false, locked);
pref("datareporting.usage.uploadEnabled", false, locked);

// Network connectivity checks
pref("network.captive-portal-service.enabled", false, locked);
pref("network.connectivity-service.enabled", false, locked);
pref("network.traffic_analyzer.enabled", false, locked);

// Toolkit telemetry
pref("toolkit.contentRelevancy.enabled", false, locked);
pref("toolkit.coverage.endpoint.base", "", locked);
pref("toolkit.coverage.opt-out", true, locked);
pref("toolkit.telemetry.archive.enabled", false, locked);
pref("toolkit.telemetry.bhrPing.enabled", false, locked);
pref("toolkit.telemetry.cachedClientID", "", locked);
pref("toolkit.telemetry.cachedProfileGroupID", "", locked);
pref("toolkit.telemetry.enabled", false, locked);
pref("toolkit.telemetry.firstShutdownPing.enabled", false, locked);
pref("toolkit.telemetry.newProfilePing.enabled", false, locked);
pref("toolkit.telemetry.server", "data:,", locked);
pref("toolkit.telemetry.shutdownPingSender.enabled", false, locked);
pref("toolkit.telemetry.unified", false, locked);
pref("toolkit.telemetry.updatePing.enabled", false, locked);

// -----------------------------------------------------------------------------
// MOZILLA SERVICES, PROMOS & BLOAT (LOCKED)
// -----------------------------------------------------------------------------
// Content Analysis (DLP)
pref("browser.contentanalysis.default_result", 0, locked);
pref("browser.contentanalysis.enabled", false, locked);

// Protection panel promos (VPN, Lockwise, Monitor)
pref("browser.contentblocking.report.hide_vpn_banner", true, locked);
pref("browser.contentblocking.report.lockwise.enabled", false);
pref("browser.contentblocking.report.mobile-android.url", "", locked);
pref("browser.contentblocking.report.mobile-ios.url", "", locked);
pref("browser.contentblocking.report.monitor.enabled", false);
pref("browser.contentblocking.report.show_mobile_app", false, locked);
pref("browser.contentblocking.report.vpn-android.url", "", locked);
pref("browser.contentblocking.report.vpn-ios.url", "", locked);
pref("browser.contentblocking.report.vpn-promo.url", "", locked);
pref("browser.contentblocking.report.vpn.url", "", locked);

// Feature recommendations & settings promos
pref("browser.dataFeatureRecommendations.enabled", false, locked);
pref("browser.discovery.enabled", false, locked);
pref("browser.preferences.moreFromMozilla", false, locked);

// IP Protection
pref("browser.ipProtection.enabled", false, locked);
pref("browser.ipProtection.guardian.endpoint", "", locked);

// Activity Stream & sponsored feeds
pref("browser.newtabpage.activity-stream.feeds.system.topsites", false, locked);
pref("browser.newtabpage.activity-stream.feeds.system.topstories", false, locked);
pref("browser.newtabpage.activity-stream.feeds.topsites", false, locked);
pref("browser.newtabpage.activity-stream.feeds.section.topstories", false, locked);
pref("browser.newtabpage.activity-stream.showSponsored", false, locked);
pref("browser.newtabpage.activity-stream.showSponsoredTopSites", false, locked);
pref("browser.newtabpage.activity-stream.showSponsoredCheckboxes", false, locked);
pref("browser.newtabpage.activity-stream.system.showSponsored", false, locked);
pref("browser.newtabpage.activity-stream.unifiedAds.adsFeed.enabled", false, locked);
pref("browser.newtabpage.activity-stream.unifiedAds.adsFeed.tiles.enabled", false, locked);
pref("browser.newtabpage.activity-stream.unifiedAds.endpoint", "", locked);
pref("browser.newtabpage.activity-stream.unifiedAds.spocs.enabled", false, locked);
pref("browser.newtabpage.activity-stream.unifiedAds.tiles.enabled", false, locked);

// CFR recommendation popups
pref("browser.newtabpage.activity-stream.asrouter.userprefs.cfr.addons", false, locked);
pref("browser.newtabpage.activity-stream.asrouter.userprefs.cfr.features", false, locked);

// Places feed & interaction tracking
pref("browser.places.interactions.enabled", false, locked);

// Onboarding promos & captive portal
pref("browser.promo.pin.enabled", false, locked);
pref("browser.protections_panel.infoMessage.seen", true);
pref("browser.send_to_device_locales", "");
pref("browser.tabs.groups.smart.userEnabled", false, locked);
pref("browser.uitour.enabled", false, locked);
pref("browser.uitour.url", "", locked);
pref("browser.vpn_promo.enabled", false, locked);
pref("captivedetect.canonicalURL", "", locked);
pref("devtools.debugger.remote-enabled", false, locked);

// Mozilla AI / ML & smart tab groups
pref("browser.ml.enable", false, locked);
pref("browser.ml.chat.enabled", false, locked);
pref("browser.ml.chat.page", false, locked);
pref("browser.ml.chat.menu", false);
pref("browser.ml.linkPreview.enabled", false, locked);
pref("browser.tabs.groups.smart.enabled", false);
pref("browser.ai.control.default", "blocked");

// Firefox Relay
pref("signon.firefoxRelay.feature", "disabled", locked);
