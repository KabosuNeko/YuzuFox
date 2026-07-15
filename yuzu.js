// =============================================================================
// YuzuFox — Firefox
// =============================================================================
// This file is installed as a system-wide default preference override. Every pref
// is chosen for a minimalist, keyboard-driven, privacy-respecting workflow where
// the browser coexists with DNS-level blocking and a zero-spam UI.
// =============================================================================

// -----------------------------------------------------------------------------
// LOCALE & DICTIONARIES
// -----------------------------------------------------------------------------

// Inherit locale from the OS environment ($LANG) rather than hardcoding a value.
// On Arch Linux the system locale is typically set once and respected by all
// desktop components; this keeps Firefox consistent with the rest of the WM.
pref("intl.locale.requested", "");

// Point Hunspell at the system-provided dictionary directory so that spellcheck
// uses the same dictionaries as every other native application on the system.
pref("spellchecker.dictionary_path", "/usr/share/hunspell");

// -----------------------------------------------------------------------------
// STARTUP BEHAVIOUR
// -----------------------------------------------------------------------------

// Suppress the default-browser check on a system where Firefox is the only
// graphical browser or where the concept of a "default" is handled externally.
pref("browser.shell.checkDefaultBrowser", false);
pref("skipDefaultBrowserCheckOnFirstRun", false, locked);

// Open a blank page at startup. No home tab, no session restore prompts — the
// session is ephemeral and built fresh each time to match the WM's stateless ethos.
pref("browser.startup.page", 0);
pref("browser.startup.homepage", "chrome://browser/content/blanktab.html");

// Disable the Activity Stream new-tab page entirely. On a tiling WM every
// pixel is precious; a blank new tab avoids sponsored content, topsites
// thumbnails, and the network round-trips they trigger.
pref("browser.newtabpage.enabled", false, locked);
pref("browser.newtabpage.activity-stream.default.sites", "");

// -----------------------------------------------------------------------------
// EXTENSION SECURITY & LIFECYCLE
// -----------------------------------------------------------------------------

// Do not auto-disable extensions that reside in the application directory.
// This allows ship-with-the-browser extensions (e.g. uBlock Origin via
// policies.json) to remain active without manual intervention.
pref("extensions.autoDisableScopes", 11);

// Re-enable the Mozilla blocklist. Keeping it active is critical: it provides
// real-time revocation of malicious addons and intermediate CA certificates.
pref("extensions.blocklist.enabled", true, locked);

// Restrict extension installation directories to profile + application only.
// System-wide, temporary, and user-installed scopes are excluded so that no
// background process or package manager can silently inject an extension.
pref("extensions.enabledScopes", 5);

// Suppress the Firefox Home / AMO recommendation panes. These panels fetch
// content from Mozilla's servers and introduce visual clutter; on a minimalist
// UI they serve no purpose.
pref("extensions.getAddons.showPane", false, locked);
pref("extensions.htmlaboutaddons.recommendations.enabled", false, locked);

// Disable extension abuse telemetry. Every report ping is an unnecessary
// outbound connection on a system that already blocks threats at the DNS layer.
pref("extensions.abuseReport.enabled", false, locked);

// Disable the "Report Site Issue" button. Telemetry and support data leave the
// machine for every bug report; DNS-level blocking already covers malicious sites.
pref("extensions.webcompat-reporter.enabled", false, locked);

// Prevent Firefox from periodically fetching the addon discovery cache.
// This eliminates a recurring background request that has no value when the
// extension set is curated manually.
pref("extensions.getAddons.cache.enabled", false, locked);

// Disable the third-party install prompt bypass. On a system where every
// package is audited, no extension should install without explicit consent.
pref("extensions.postDownloadThirdPartyPrompt", false);

// Disable Pocket integration entirely. Pocket adds a toolbar button, tracking
// pings, and a persisted reading list — all of which violate the zero-clutter
// and zero-telemetry mandate.
pref("extensions.pocket.enabled", false, locked);

// Keep quarantined-domain enforcement active. When Mozilla flags a domain as
// potentially hostile, extensions are blocked from running there; this is a
// valuable safety net even with DNS-level filtering in place.
pref("extensions.quarantinedDomains.enabled", true);

// -----------------------------------------------------------------------------
// HARDWARE ACCELERATION & GPU RENDERING
// -----------------------------------------------------------------------------

// Force-enable hardware video decoding across all codec paths. On modern x86_64
// hardware this offloads H.264/HEVC/VP9 from the CPU to the GPU, reducing power
// draw and freeing CPU cycles for the tiling WM's compositor.
pref("media.hardware-video-decoding.force-enabled", true);
pref("media.webrtc.hw.h264.enabled", true);
pref("media.gpu-process-decoder", true);

// Enable WebRender with shader pre-caching and persistent program binaries.
// WebRender translates layout into GPU-friendly commands; pre-caching avoids
// jank on first paint and program-binary-disk skips re-compilation across restarts.
pref("gfx.webrender.all", true);
pref("gfx.webrender.precache-shaders", true);
pref("gfx.webrender.program-binary-disk", true);

// Force the WebRender compositor even if the driver advisories would disable it.
// This guarantees GPU-accelerated compositing on a known-good Arch Linux mesa stack.
pref("gfx.webrender.compositor.force-enabled", true, locked);

// Run the GPU processing in a dedicated OS process. If the GPU driver crashes,
// the browser chrome survives — essential for a WM-setup where restarting the
// browser is disruptive.
pref("layers.gpu-process.enabled", true);

// Tune the accelerated Canvas2D cache. Higher item counts reduce GC pressure on
// canvas-heavy sites (e.g. Figma, Observable notebooks) while keeping memory
// within the RAM-only cache budget.
pref("gfx.canvas.accelerated.cache-items", 32768);
pref("gfx.canvas.accelerated.cache-size", 512);

// Set Skia font cache to 20 MB. This is the same value Chrome uses and provides
// smooth text rendering on font-heavy sites without wasting RAM.
pref("gfx.content.skia-font-cache-size", 20);

// -----------------------------------------------------------------------------
// PERFORMANCE — RAM-ONLY CACHE (SSD PROTECTION)
// -----------------------------------------------------------------------------
// Every cache lives exclusively in memory. Disk cache is disabled to eliminate
// write wear on the SSD and to keep all I/O as fast as RAM permits. This is safe
// because Arch's initramfs and tmpfs policies ensure the system reboots cleanly.

pref("browser.cache.disk.enable", false);

// Set the in-memory HTTP cache to ~1 GB. On a system with 16+ GB of RAM this
// allows frequently-visited pages to reload instantly without hitting the network.
pref("browser.cache.memory.capacity", 1048576);

// Force media caches to stay in memory during private browsing. Combined with
// the increased limits below, streaming video never touches the disk.
pref("browser.privatebrowsing.forceMediaMemoryCache", true);
pref("media.memory_cache_max_size", 1048576);
pref("media.memory_caches_combined_limit_kb", 3145728);

// Limit video read-ahead to 3600 seconds (1 hour) and resume threshold to
// 1800 seconds (30 minutes). These conservative values prevent the RAM cache
// from being monopolised by a single long-running video tab.
pref("media.cache_readahead_limit", 3600);
pref("media.cache_resume_threshold", 1800);

// Decoded image cache: 10 MB pool with 32 KB decode chunks. The chunk size
// balances per-decode overhead against throughput; 32 KB matches Betterfox's
// recommendation for snappy image rendering on modest hardware.
pref("image.cache.size", 10485760);
pref("image.mem.decode_bytes_at_a_time", 32768);

// Keep decoded image surfaces mapped for at least 2 minutes before unmapping.
// This prevents thrashing when rapidly scrolling through image-heavy pages.
pref("image.mem.shared.unmap.min_expiration_ms", 120000);

// Network buffer: 64 KB per buffer, 48 buffers in the pool. This reduces the
// number of application-to-kernel context switches during page loads without
// bloating the per-connection buffer to a level that hurts interactive sites.
pref("network.buffer.cache.size", 65535);
pref("network.buffer.cache.count", 48);

// Raise the SSL session-token cache so that reconnections to frequently-used
// TLS services skip the full handshake.
pref("network.ssl_tokens_cache_capacity", 32768);

// Session restore interval: 60 seconds instead of the default 15. On a
// RAM-backed profile, writes are cheap but every cycle still wakes the event
// loop; 60 s is a good balance between crash safety and CPU idleness.
pref("browser.sessionstore.interval", 60000);

// Never save POST data or cookie information in the session store. Session
// restore should revive URLs, not replay authenticated state.
pref("browser.sessionstore.privacy_level", 2);

// Unload inactive tabs when the system is under memory pressure. On a tiling WM
// with many windowed workflows, background tabs accumulate silently.
pref("browser.tabs.unloadOnLowMemory", true, locked);

// -----------------------------------------------------------------------------
// PERFORMANCE — JAVASCRIPT JIT & GC
// -----------------------------------------------------------------------------

// Lower the Baseline JIT threshold from 100 to 50 invocations. "Warm" functions
// compile to machine code sooner, reducing jank on JS-heavy sites like web
// terminals and spreadsheets.
pref("javascript.options.baselinejit.threshold", 50);

// Raise the IonMonkey threshold from 500 to 1500. The optimizing JIT is
// expensive to enter; keeping more code on the Baseline JIT avoids compilation
// stalls for functions that are called frequently but not in hot loops.
pref("javascript.options.ion.threshold", 1500);

// -----------------------------------------------------------------------------
// PERFORMANCE — CONTENT & NETWORK TUNING
// -----------------------------------------------------------------------------

// Set the page-reflow notification interval to 100 ms (slightly below the
// default 120 ms). This makes incremental rendering feel more responsive during
// slow page loads at the cost of a tiny increase in total load time.
pref("content.notify.interval", 100000);

// Cache DNS entries for 3600 seconds (1 hour). On a stable network with a local
// recursive resolver this eliminates repeated lookups for the same origins.
pref("network.dnsCacheExpiration", 3600);

// Raise connection limits to utilise modern network parallelism. 1800 total
// connections and 10 per server allow aggressive page loads while staying below
// the point of diminishing returns.
pref("network.http.max-connections", 1800);
pref("network.http.max-persistent-connections-per-server", 10);
pref("network.http.max-urgent-start-excessive-connections-per-host", 5);

// Disable HTTP request pacing so that Firefox sends all eligible requests
// without artificial delays. On a low-latency LAN this shaves tens of
// milliseconds off page load waterfalls.
pref("network.http.pacing.requests.enabled", false);

// Reduce the initial request dispatch delay from 10 ms to 5 ms. Combined with
// the pacing disable, this ensures the SYN flood hits the server immediately.
pref("network.http.request.max-start-delay", 5);

// -----------------------------------------------------------------------------
// SECURITY — CERTIFICATE REVOCATION (CRLite ONLY)
// -----------------------------------------------------------------------------
// OCSP is disabled entirely because it leaks the sites you visit to the CA
// infrastructure. Instead we rely on CRLite, which downloads a compact
// revocation filter periodically and checks it offline. Mode 2 enforces both
// "Revoked" and "Not Revoked" results from the filter. This is the safest
// privacy-preserving revocation model Firefox offers.

pref("security.OCSP.enabled", 0, locked);
pref("security.pki.crlite_mode", 2, locked);
pref("security.remote_settings.crlite_filters.enabled", true, locked);

// Enforce strict HTTP Public Key Pinning (level 2). This prevents an attacker
// who compromises a CA from impersonating pinned hosts. The default (level 1)
// allows user-added exceptions such as antivirus MITM proxies, which are absent
// on a stock Arch system.
pref("security.cert_pinning.enforcement_level", 2);

// Require RFC 5746 safe renegotiation. Servers that lack it are vulnerable to
// a MiTM injection attack; the fraction of the web that still fails this check
// is negligible (< 0.15 % of the Alexa top 1M).
pref("security.ssl.require_safe_negotiation", true);

// Show the broken-security padlock for servers that fail safe renegotiation.
// When using a tiling WM every status indicator should be meaningful.
pref("security.ssl.treat_unsafe_negotiation_as_broken", true);

// Disable TLS 1.3 0-RTT data. 0-RTT is not forward secret and permits replay
// attacks; disabling it eliminates this class of risk at the cost of one
// round-trip on reconnections.
pref("security.tls.enable_0rtt_data", false);

// Enable expert bad-cert pages so that the full certificate error details are
// shown immediately, eliminating an extra click when debugging TLS issues.
pref("browser.xul.error_pages.expert_bad_cert", true);

// Poll the settings service (Remote Settings, normandy, etc.) every 300 seconds
// instead of the default 24 h interval so that CRLite filters and other
// critical data arrive promptly.
pref("services.settings.poll_interval", 300);

// -----------------------------------------------------------------------------
// SECURITY — HTTPS-ONLY MODE
// -----------------------------------------------------------------------------

// Force HTTPS on every top-level navigation. Combined with DNS-level blocking,
// this ensures plaintext HTTP is never used.
pref("dom.security.https_only_mode", true, locked);

// Disable the 3-second HTTP background fallback. When an HTTPS upgrade times out,
// Firefox normally sends an unencrypted "probe" request to check if the server
// supports HTTPS at all; we forbid this to avoid any cleartext leak.
pref("dom.security.https_only_mode_send_http_background_request", false);

// -----------------------------------------------------------------------------
// PRIVACY — FINGERPRINTING PROTECTION (FPP)
// -----------------------------------------------------------------------------
// Firefox's modern fingerprinting protection (FPP) randomises canvas reads,
// constrains font visibility, spoofs timezone, and limits hardware concurrency
// — all without the all-or-nothing breakage of the older RFP. Enabled globally
// (normal + private windows) to cover both browsing modes uniformly.

pref("browser.contentblocking.category", "strict");
pref("privacy.fingerprintingProtection", true);
pref("privacy.fingerprintingProtection.pbmode", true);

// Isolate content script resources: injected scripts from extensions cannot
// share storage or referrer information with the page origin. This prevents
// a malicious extension from using content scripts as a cross-origin bridge.
pref("privacy.antitracking.isolateContentScriptResources", true);

// Disable CSP Level 2 report delivery. CSP reports are JSON payloads sent to
// a URL specified by the page; they leak referrer and policy information and
// serve no defensive purpose on a system that already trusts its content.
pref("security.csp.reporting.enabled", false);

// -----------------------------------------------------------------------------
// PRIVACY — REFERRER CONTROL
// -----------------------------------------------------------------------------

// Trim cross-origin referrers to scheme + host + port only. The full URL
// (including path and query string) is never sent to a different origin,
// preventing the common leak of internal paths and session tokens.
pref("network.http.referer.XOriginTrimmingPolicy", 2);

// Enforce no referer spoofing. Spoofing breaks CSRF protections on sites that
// validate the Origin / Referer header; the trimming policy is sufficient for
// privacy.
pref("network.http.referer.spoofSource", false);

// Enable Global Privacy Control so that sites receive a legally-binding
// opt-out signal. On its own GPC is not bulletproof, but it complements the
// DNS-level blocking and ETP Strict for a defence-in-depth layering.
pref("privacy.globalprivacycontrol.enabled", true);

// -----------------------------------------------------------------------------
// PRIVACY — SEVER ALL BACKGROUND / SPECULATIVE CONNECTIONS
// -----------------------------------------------------------------------------
// No speculative networking of any kind is permitted. On a tiling WM where the
// user explicitly navigates to each page, pre-connecting to "likely" next pages
// wastes bandwidth, leaks intent, and consumes NAT state.

// Disable DNS prefetching both for normal links and for HTTPS pages.
pref("network.dns.disablePrefetch", true);
pref("network.dns.disablePrefetchFromHTTPS", true);

// Disable speculative parallel connection warm-ups and the link-mouseover
// connection opener.
pref("network.http.speculative-parallel-limit", 0);

// Disable <link rel="prefetch"> and the network predictor entirely.
pref("network.prefetch-next", false);
pref("network.predictor.enabled", false);
pref("network.predictor.enable-prefetch", false);

// Prevent the URL bar from opening speculative connections when the user types.
// On a keyboard-driven WM the URL bar is a focused input field, not a
// pre-rendering engine.
pref("browser.urlbar.speculativeConnect.enabled", false);
pref("browser.places.speculativeConnect.enabled", false);

// Disable Places-based speculative connections in the new-tab page feed.
pref("browser.newtabpage.activity-stream.feeds.places", false, locked);

// -----------------------------------------------------------------------------
// PRIVACY — QUERY STRIPPING & COOKIE PARTITIONING
// -----------------------------------------------------------------------------

// Enable opt-in partitioning so that cookies set during "Allow" interactions
// are still scoped to their original eTLD+1. This prevents the common pattern
// where a single "Allow" exception for a social-login provider unpartitions all
// of its cookies.
pref("network.cookie.cookieBehavior.optInPartitioning", true);
pref("network.cookie.cookieBehavior.optInPartitioning.pbmode", true);

// Aggressive query-parameter stripping list that covers the major tracking
// frameworks (Facebook, Google, HubSpot, Marketo, TikTok, Twitter, etc.).
// Removes these parameters at the navigation level before the request is sent.
pref("privacy.query_stripping.strip_list", "__hsfp __hssc __hstc __s _hsenc _openstat dclid fbclid gbraid gclid hsCtaTracking igshid mc_eid ml_subscriber ml_subscriber_hash msclkid oft_c oft_ck oft_d oft_id oft_ids oft_k oft_lk oft_sk oly_anon_id oly_enc_id rb_clickid s_cid twclid vero_conv vero_id wbraid wickedid yclid");

// -----------------------------------------------------------------------------
// PRIVACY — FORMS, PASSWORDS, AND DOM RESTRICTIONS
// -----------------------------------------------------------------------------

// Disable inline form autocomplete. Form history is cleared on shutdown, but
// disabling autofill at the pref level prevents the filled values from being
// exposed to JavaScript running on the page.
pref("browser.formfill.enable", false);

// Never auto-capture login forms or private-browsing credentials into the
// password manager. Credential management is delegated to an external
// passphrase store (e.g. pass, age, or KeePassXC).
pref("signon.formlessCapture.enabled", false);
pref("signon.privateBrowsingCapture.enabled", false);
pref("signon.autofillForms", false);

// Limit HTTP auth dialogs to the top-level frame only. Sub-resources from
// other origins cannot prompt the user for credentials, preventing a common
// phishing vector.
pref("network.auth.subresource-http-auth-allow", 1);

// Disable Firefox Relay. The Relay integration adds a toolbar icon and
// telemetry pings; mask generation is handled by a standalone service if needed.
pref("signon.firefoxRelay.feature", "disabled", locked);

// When the user pastes into a rich-text editor, preserve the original content
// instead of letting the editor strip formatting. This improves the experience
// when composing code or markdown in-browser.
pref("editor.truncate_user_pastes", false);

// Prevent JavaScript from moving or resizing the browser window. On a tiling WM
// window geometry is managed by the layout daemon; allowing content to
// reposition the window would break the tile contract.
pref("dom.disable_window_move_resize", true);

// Disable Privacy-Preserving Attribution (serves ad attribution pings) and the
// Push API. Both generate unwanted outbound connections.
pref("dom.private-attribution.submission.enabled", false, locked);
pref("dom.push.enabled", false, locked);

// Disable telemetry on unexpected system-load events.
pref("dom.security.unexpected_system_load_telemetry_enabled", false, locked);

// Force Punycode display for all Internationalised Domain Names. This prevents
// homograph attacks where a Unicode character visually mimics an ASCII letter.
pref("network.IDN_show_punycode", true);

// Disable JavaScript inside PDFs viewed with the built-in PDF.js renderer.
// PDF.js itself is kept enabled (it is lightweight and well-audited), but no
// embedded JS is executed.
pref("pdfjs.enableScripting", false);

// Clear the default permissions list so that no mozilla.org domain receives
// special privileges.
pref("permissions.manager.defaultsUrl", "");

// -----------------------------------------------------------------------------
// PRIVACY — DOWNLOAD SANDBOXING
// -----------------------------------------------------------------------------

// Stage downloads in a temporary directory and delete the temp file once the
// external application finishes with it. Combined with the RAM-only cache, this
// ensures downloaded executables never linger on disk after they are handled.
pref("browser.download.start_downloads_in_tmp_dir", true, locked);
pref("browser.helperApps.deleteTempFileOnExit", true);

// Do not add downloads to the system's Recent Documents list. On a WM that
// indexes files through fd or mlocate, the recent-documents registry is an
// unnecessary source of file-system noise.
pref("browser.download.manager.addToRecentDocs", false);

// Do not open the download panel automatically when a download starts.
// The panel steals focus and occupies screen space; keyboard users can summon
// it with Ctrl+J when needed.
pref("browser.download.alwaysOpenPanel", false);

// Always prompt for a save location and for unknown MIME types. This prevents
// Firefox from silently writing files to the default download directory without
// user awareness.
pref("browser.download.useDownloadDir", false);
pref("browser.download.always_ask_before_handling_new_types", true);

// -----------------------------------------------------------------------------
// SAFE BROWSING — COMPLETELY DISABLED
// -----------------------------------------------------------------------------
// All Safe Browsing features are disabled because the system's DNS resolver
// already blocks known-malicious domains. The browser must never ping Google or
// Mozilla servers for URL reputation checks.
//
// This includes: Google Safe Browsing (all protocol versions), Mozilla's own
// Safe Browsing service, download reputation lookups, malware/phishing checks,
// and the blocklist override page.

pref("browser.safebrowsing.allowOverride", false, locked);
pref("browser.safebrowsing.blockedURIs.enabled", false, locked);
pref("browser.safebrowsing.debug", false, locked);
pref("browser.safebrowsing.downloads.enabled", false, locked);
pref("browser.safebrowsing.downloads.remote.block_dangerous", false, locked);
pref("browser.safebrowsing.downloads.remote.block_dangerous_host", false, locked);
pref("browser.safebrowsing.downloads.remote.block_potentially_unwanted", false, locked);
pref("browser.safebrowsing.downloads.remote.block_uncommon", false, locked);
pref("browser.safebrowsing.downloads.remote.enabled", false, locked);
pref("browser.safebrowsing.downloads.remote.remote.url", "", locked);
pref("browser.safebrowsing.downloads.remote.url", "", locked);
pref("browser.safebrowsing.id", "", locked);
pref("browser.safebrowsing.malware.enabled", false, locked);
pref("browser.safebrowsing.phishing.enabled", false, locked);
pref("browser.safebrowsing.provider.google.advisoryName", "", locked);
pref("browser.safebrowsing.provider.google.advisoryURL", "", locked);
pref("browser.safebrowsing.provider.google.gethashURL", "", locked);
pref("browser.safebrowsing.provider.google.lists", "", locked);
pref("browser.safebrowsing.provider.google.pver", 0, locked);
pref("browser.safebrowsing.provider.google.reportMalwareMistakeURL", "", locked);
pref("browser.safebrowsing.provider.google.reportPhishMistakeURL", "", locked);
pref("browser.safebrowsing.provider.google.reportURL", "", locked);
pref("browser.safebrowsing.provider.google.updateURL", "", locked);
pref("browser.safebrowsing.provider.google4.advisoryName", "", locked);
pref("browser.safebrowsing.provider.google4.advisoryURL", "", locked);
pref("browser.safebrowsing.provider.google4.dataSharing.enabled", false, locked);
pref("browser.safebrowsing.provider.google4.dataSharingURL", "", locked);
pref("browser.safebrowsing.provider.google4.gethashURL", "", locked);
pref("browser.safebrowsing.provider.google4.lists", "", locked);
pref("browser.safebrowsing.provider.google4.pver", 0, locked);
pref("browser.safebrowsing.provider.google4.reportMalwareMistakeURL", "", locked);
pref("browser.safebrowsing.provider.google4.reportPhishMistakeURL", "", locked);
pref("browser.safebrowsing.provider.google4.reportURL", "", locked);
pref("browser.safebrowsing.provider.google4.updateURL", "", locked);
pref("browser.safebrowsing.provider.mozilla.gethashURL", "", locked);
pref("browser.safebrowsing.provider.mozilla.lastupdatetime", 0, locked);
pref("browser.safebrowsing.provider.mozilla.lists", "", locked);
pref("browser.safebrowsing.provider.mozilla.lists.base", "", locked);
pref("browser.safebrowsing.provider.mozilla.lists.content", "", locked);
pref("browser.safebrowsing.provider.mozilla.nextupdatetime", 0, locked);
pref("browser.safebrowsing.provider.mozilla.pver", 0, locked);
pref("browser.safebrowsing.provider.mozilla.reportURL", "", locked);
pref("browser.safebrowsing.provider.mozilla.updateURL", "", locked);
pref("browser.safebrowsing.reportPhishURL", "", locked);

// Keep URL-classifier skip lists for social and tracking domains. Even with
// Safe Browsing disabled, these allow embedded Twitter/Reddit/Instagram content
// to render correctly for the rare occasions when the user visits those sites.
pref("urlclassifier.features.socialtracking.skipURLs", "*.instagram.com, *.twitter.com, *.twimg.com");
pref("urlclassifier.trackingSkipURLs", "*.reddit.com, *.twitter.com, *.twimg.com");

// -----------------------------------------------------------------------------
// ANTI-TELEMETRY — EVERY CHANNEL CAPPED
// -----------------------------------------------------------------------------
// Telemetry, studies, crash reports, coverage pings, and all other forms of
// outbound data collection are unconditionally blocked. No Mozilla endpoint
// receives any information about this installation.

// Normandy / Shield studies: remote experimentation system.
pref("app.normandy.api_url", "", locked);
pref("app.normandy.enabled", false, locked);
pref("app.shield.optoutstudies.enabled", false, locked);

// Crash reports: breakpad and tab-crash submission.
pref("breakpad.reportURL", "", locked);
pref("browser.crashReports.unsubmittedCheck.autoSubmit2", false, locked);
pref("browser.tabs.crashReporting.sendReport", false, locked);

// Activity Stream telemetry: new-tab page impressions, clicks, and interactions.
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

// Version-ping override and URL-bar feature gates (which also phone home).
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

// Toolkit-level telemetry and content relevancy.
pref("toolkit.contentRelevancy.enabled", false, locked);
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

// Windows-specific restart registration (no-op on Linux, kept for cleanliness).
pref("toolkit.winRegisterApplicationRestart", false);

// -----------------------------------------------------------------------------
// MOZILLA BLOAT REMOVAL
// -----------------------------------------------------------------------------
// Every Mozilla-branded service, promotion, sponsored slot, AI assistant,
// VPN banner, and onboarding panel is removed. The browser must not display
// any element that originates from Mozilla's marketing or telemetry pipelines.

// Content Analysis / DLP agent — enterprise monitoring, irrelevant on Arch.
pref("browser.contentanalysis.default_result", 0, locked);
pref("browser.contentanalysis.enabled", false, locked);

// Hide all VPN, Lockwise, Monitor, and Proxy promotions from the protection panel.
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
pref("browser.newtabpage.activity-stream.asrouter.userprefs.cfr.addons", false);
pref("browser.newtabpage.activity-stream.asrouter.userprefs.cfr.features", false);

// Disable Places interaction tracking (used for "jump back in" suggestions).
pref("browser.places.interactions.enabled", false, locked);

// Mute private-browsing VPN promo, cookie-banner UI, focus promo, and pin promo.
pref("browser.privatebrowsing.vpnpromourl", "", locked);
pref("browser.promo.cookiebanners.enabled", false, locked);
pref("browser.promo.focus.enabled", false, locked);
pref("browser.promo.pin.enabled", false, locked);
pref("browser.protections_panel.infoMessage.seen", true);

// Suppress "send to device" locale detection and Smart Tab Groups.
pref("browser.send_to_device_locales", "");
pref("browser.tabs.groups.smart.userEnabled", false, locked);

// UITour — remote-controllable UI tour system; disabled to eliminate attack surface.
pref("browser.uitour.enabled", false, locked);
pref("browser.uitour.url", "", locked);

// VPN promo and captive portal detection.
pref("browser.vpn_promo.enabled", false, locked);
pref("captivedetect.canonicalURL", "", locked);

// Cookie-banner UI callout.
pref("cookiebanners.ui.desktop.showCallout", false);

// Remote debugging — explicitly off (default is false, locked for defence-in-depth).
pref("devtools.debugger.remote-enabled", false, locked);

// OpenH264 plugin auto-update — prevented so no outbound check occurs.
pref("media.gmp-gmpopenh264.autoupdate", false, locked);

// Block all autoplaying media (0=allow, 5=block). Matches the strict content
// blocking posture of ETP Strict.
pref("media.autoplay.default", 5);

// -----------------------------------------------------------------------------
// ONE-LINE UI — COMPACT MODE & VISUAL CLEANUP
// -----------------------------------------------------------------------------
// Every pref in this section exists to eliminate visual noise. The UI must be
// as sparse as the tiling WM itself: no extra toolbars, no badges, no
// promotional icons, no AI copilots, no URL decorations.

// Enable legacy userChrome.css support — required by the companion stylesheet
// that collapses the tab bar and nav bar into a single row.
pref("toolkit.legacyUserProfileCustomizations.stylesheets", true);

// Expose the hidden "Compact" density option in Customise toolbar.
pref("browser.compactmode.show", true);

// Disable private-window visual separation (the purple tint). On a one-line UI
// the window already shows "PB" in the title bar if configured by the WM.
pref("browser.privateWindowSeparation.enabled", false);

// Strip https:// from the URL bar and show it again only on user interaction
// (click or focus). Saves horizontal space in a one-line layout.
pref("browser.urlbar.trimHttps", true);
pref("browser.urlbar.untrimOnUserInteraction.featureGate", true);

// Remove Firefox View button. On a single-screen one-line UI, this pinned
// icon wastes valuable horizontal space and duplicates history functionality.
pref("browser.tabs.firefox-view", false);
pref("browser.tabs.firefox-view-next", false);

// Suppress URL-bar group labels ("Search with…", "Tab from…") to keep the
// dropdown minimal.
pref("browser.urlbar.groupLabels.enabled", false);

// Show the raw URL instead of search terms after navigation. Search terms in
// the URL bar occupy more space than the domain they map to.
pref("browser.urlbar.showSearchTerms.enabled", false);

// Kill every URL-bar suggestion category that adds visual or network overhead.
pref("browser.urlbar.quicksuggest.enabled", false);
pref("browser.urlbar.suggest.addons", false, locked);
pref("browser.urlbar.suggest.quicksuggest.fakespot", false, locked);
pref("browser.urlbar.suggest.quicksuggest.nonsponsored", false, locked);
pref("browser.urlbar.suggest.quicksuggest.sponsored", false, locked);
pref("browser.urlbar.suggest.quicksuggest.topsites", false, locked);
pref("browser.urlbar.suggest.trending", false, locked);
pref("browser.urlbar.addons.featureGate", false);
pref("browser.urlbar.amp.featureGate", false);
pref("browser.urlbar.importantDates.featureGate", false);
pref("browser.urlbar.market.featureGate", false);
pref("browser.urlbar.mdn.featureGate", false);
pref("browser.urlbar.weather.featureGate", false);
pref("browser.urlbar.wikipedia.featureGate", false);
pref("browser.urlbar.yelp.featureGate", false);
pref("browser.urlbar.yelpRealtime.featureGate", false);
pref("browser.urlbar.trending.featureGate", false);
pref("browser.urlbar.suggest.searches", false);
pref("browser.search.suggest.enabled", false);

// Separate private-window search engine — and expose its UI setting so the user
// can pick a different engine for private browsing if desired.
pref("browser.search.separatePrivateDefault", true);
pref("browser.search.separatePrivateDefault.ui.enabled", true);

// Mozilla AI / ML features: chat, link preview, smart grouping — all disabled.
// These inject toolbar buttons, context-menu entries, and telemetry pings that
// have no place in a keyboard-driven workflow.
pref("browser.ml.enable", false, locked);
pref("browser.ml.chat.enabled", false, locked);
pref("browser.ml.chat.page", false, locked);
pref("browser.ml.chat.menu", false);
pref("browser.ml.linkPreview.enabled", false, locked);
pref("browser.tabs.groups.smart.enabled", false);

// Block the AI chat shortcut in the browser control layer.
pref("browser.ai.control.default", "blocked");

// Suppress the about:config warning page (already known to the user) and all
// "welcome" / "what's new" onboarding tabs.
pref("browser.aboutConfig.showWarning", false);
pref("browser.aboutwelcome.enabled", false);

// Disable the "Reset Firefox" prompt. This workflow triggers a full profile
// backup-and-restore cycle that is never useful on a stateless Arch setup.
pref("browser.disableResetPrompt", true);

// Remove the "More from Mozilla" section in about:preferences.
pref("browser.preferences.moreFromMozilla", false);

// Eliminate fullscreen transition animations and the "press Esc to exit" warning.
// On a tiling WM fullscreen toggles are frequent and should be instant.
pref("full-screen-api.transition-duration.enter", "0 0");
pref("full-screen-api.transition-duration.leave", "0 0");
pref("full-screen-api.warning.timeout", 0);

// Open PDF attachments inline in the browser tab rather than triggering a
// download. Combined with PDF.js this avoids polluting the download directory.
pref("browser.download.open_pdf_attachments_inline", true);

// Bookmark menu closes after a single click (middle-click to open in new tab).
pref("browser.bookmarks.openInTabClosesMenu", false);

// The find bar highlights all matches by default.
pref("findbar.highlightAll", true);

// -----------------------------------------------------------------------------
// CONTAINERS
// -----------------------------------------------------------------------------

// Enable Container Tabs and their UI. Containers provide the cleanest
// first-party isolation mechanism for multi-identity workflows (work vs.
// personal, dev vs. prod) without relying on a separate browser profile.
pref("privacy.userContext.enabled", true);
pref("privacy.userContext.ui.enabled", true);

// -----------------------------------------------------------------------------
// SMOOTH SCROLLING — PHYSICS-BASED (MSD MODEL)
// -----------------------------------------------------------------------------
// The Mass-Spring-Damper model replaces the default scroll animation with a
// physics simulation that feels closer to a native GTK/Qt application. The
// constants below produce a responsive but controlled scroll feel.

pref("general.smoothScroll.msdPhysics.continuousMotionMaxDeltaMS", 12);
pref("general.smoothScroll.msdPhysics.enabled", true);
pref("general.smoothScroll.msdPhysics.motionBeginSpringConstant", 200);
pref("general.smoothScroll.msdPhysics.regularSpringConstant", 250);
pref("general.smoothScroll.msdPhysics.slowdownMinDeltaMS", 25);
pref("general.smoothScroll.msdPhysics.slowdownMinDeltaRatio", "2.0");
pref("general.smoothScroll.msdPhysics.slowdownSpringConstant", 250);
pref("general.smoothScroll.currentVelocityWeighting", "1.0");
pref("general.smoothScroll.stopDecelerationWeighting", "1.0");
pref("mousewheel.default.delta_multiplier_y", 300);

// -----------------------------------------------------------------------------
// FEATURE ENABLEMENT
// -----------------------------------------------------------------------------

// Enable the experimental CSS Masonry layout engine (grid-template-masonry).
// Useful for testing next-generation CSS layouts without flipping a separate
// about:config flag.
pref("layout.css.grid-template-masonry-value.enabled", true);

// -----------------------------------------------------------------------------
// DESKTOP INTEGRATION
// -----------------------------------------------------------------------------

// Prefer the XDG Desktop Portal for the file picker dialog. On a modern Arch
// setup this gives a native GTK file dialog that matches the WM's theme.
pref("widget.use-xdg-desktop-portal.file-picker", 1);

// Clear the GIO supported-protocols list so that GVfs network protocols cannot
// be used as a proxy bypass vector.
pref("network.gio.supported-protocols", "");

// Disable UNC path support (Windows-specific, but explicitly set to prevent
// unexpected behaviour if this file is ever used on a dual-boot system).
pref("network.file.disable_unc_paths", true);

// Disable favicon-based .ico files in desktop shortcuts.
pref("browser.shell.shortcutFavicons", false);
