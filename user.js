// AUTO-GENERATED from src/user.js/*.js — do not edit directly.
// Run: python3 build.py
//
// =============================================================================
// YuzuFox — Per-Profile Preferences (<profile>/user.js)
// =============================================================================
// Privacy, security hardening, and UI/QoL overrides for this profile.
// System-wide base (telemetry, performance, debloat) lives in yuzu.js.
// Prefs are unlocked. System DNS preserved (network.trr.* untouched).
// Search engines configured via policies.json.
// =============================================================================
// -----------------------------------------------------------------------------
// NETWORK
// -----------------------------------------------------------------------------

// disable HTTP/3 0-RTT
user_pref("network.http.http3.enable_0rtt", false);

// disable DNS prefetching
user_pref("network.dns.disablePrefetch", true);

// disable DNS prefetch from HTTPS pages
user_pref("network.dns.disablePrefetchFromHTTPS", true);

// disable link-mouseover speculative connections
user_pref("network.http.speculative-parallel-limit", 0);

// disable link prefetching
user_pref("network.prefetch-next", false);

// disable urlbar speculative connections
user_pref("browser.urlbar.speculativeConnect.enabled", false);

// disable bookmarks/history speculative connections
user_pref("browser.places.speculativeConnect.enabled", false);

// expose only public IP via WebRTC and enforce proxy routing
user_pref("media.peerconnection.ice.default_address_only", true);
user_pref("media.peerconnection.ice.proxy_only_if_behind_proxy", true);

// reduce maximum redirection hops to limit bounce tracking
user_pref("network.http.redirection-limit", 10);

// resolve DNS remotely when using SOCKS proxy
user_pref("network.proxy.socks_remote_dns", true);
// -----------------------------------------------------------------------------
// PRIVACY
// -----------------------------------------------------------------------------

// enable HTTPS-Only mode
user_pref("dom.security.https_only_mode", true);

// disable HTTP background probe
user_pref("dom.security.https_only_mode_send_http_background_request", false);

// ETP strict mode and fingerprinting protection
user_pref("browser.contentblocking.category", "strict");
user_pref("privacy.fingerprintingProtection", true);
user_pref("privacy.fingerprintingProtection.pbmode", true);

// isolate content script resources
user_pref("privacy.antitracking.isolateContentScriptResources", true);

// disable CSP reporting
user_pref("security.csp.reporting.enabled", false);

// trim cross-origin referrers to scheme+host+port
user_pref("network.http.referer.XOriginTrimmingPolicy", 2);

// opt-in cookie partitioning
user_pref("network.cookie.cookieBehavior.optInPartitioning", true);
user_pref("network.cookie.cookieBehavior.optInPartitioning.pbmode", true);

// strip tracking query parameters
user_pref("privacy.query_stripping.enabled", true);
user_pref("privacy.query_stripping.enabled.pbmode", true);
user_pref("privacy.query_stripping.strip_list", "__hsfp __hssc __hstc __s _hsenc _openstat dclid fbclid gbraid gclid hsCtaTracking igshid mc_eid ml_subscriber ml_subscriber_hash msclkid oft_c oft_ck oft_d oft_id oft_ids oft_k oft_lk oft_sk oly_anon_id oly_enc_id rb_clickid s_cid twclid vero_conv vero_id wbraid wickedid yclid");

// strict tracking protection list channels
user_pref("privacy.annotate_channels.strict_list.enabled", true);

// bounce tracking protection purge mode
user_pref("privacy.bounceTrackingProtection.mode", 1);

// disable search and form history
user_pref("browser.formfill.enable", false);

// disable formless and private browsing password capture
user_pref("signon.formlessCapture.enabled", false);
user_pref("signon.privateBrowsingCapture.enabled", false);

// disable password autofill
user_pref("signon.autofillForms", false);

// block cross-origin subresource HTTP auth prompts
user_pref("network.auth.subresource-http-auth-allow", 1);

// preserve pasted text without truncation
user_pref("editor.truncate_user_pastes", false);

// prevent scripts from moving or resizing windows
user_pref("dom.disable_window_move_resize", true);

// restrict popup events to direct user interaction
user_pref("dom.popup_allowed_events", "click dblclick mousedown pointerdown");

// disable silent Windows SSO authentication
user_pref("network.http.windows-sso.enabled", false);

// disable device sensor APIs
user_pref("device.sensors.enabled", false);

// always show Punycode for IDNs
user_pref("network.IDN_show_punycode", true);

// disable PDF.js scripting
user_pref("pdfjs.enableScripting", false);

// block geolocation by default
user_pref("permissions.default.geo", 2);

// use BeaconDB for geolocation
user_pref("geo.provider.network.url", "https://beacondb.net/v1/geolocate");

// -----------------------------------------------------------------------------
// SECURITY
// -----------------------------------------------------------------------------

// disable OCSP in favor of CRLite
user_pref("security.OCSP.enabled", 0);

// enforce CRLite mode 2
user_pref("security.pki.crlite_mode", 2);

// strict Public Key Pinning
user_pref("security.cert_pinning.enforcement_level", 2);

// require safe TLS renegotiation
user_pref("security.ssl.require_safe_negotiation", true);

// warn on unsafe SSL renegotiation
user_pref("security.ssl.treat_unsafe_negotiation_as_broken", true);

// disable TLS 1.3 0-RTT
user_pref("security.tls.enable_0rtt_data", false);

// prevent WebAuthn hardware batch cert attestation leak
user_pref("security.webauthn.always_allow_direct_attestation", false);

// show advanced info on bad cert error pages
user_pref("browser.xul.error_pages.expert_bad_cert", true);

// disable remote Safe Browsing download reputation
user_pref("browser.safebrowsing.downloads.remote.enabled", false);

// URL classifier skip lists for social embeds
user_pref("urlclassifier.features.socialtracking.skipURLs", "*.instagram.com, *.twitter.com, *.twimg.com, *.x.com");
user_pref("urlclassifier.trackingSkipURLs", "*.reddit.com, *.twitter.com, *.twimg.com, *.x.com");

// isolate downloads in temp directory
user_pref("browser.download.start_downloads_in_tmp_dir", true);

// delete temp file after external app exits
user_pref("browser.helperApps.deleteTempFileOnExit", true);

// do not add downloads to recent documents
user_pref("browser.download.manager.addToRecentDocs", false);

// do not open download panel automatically
user_pref("browser.download.alwaysOpenPanel", false);


// always ask before handling new MIME types
user_pref("browser.download.always_ask_before_handling_new_types", true);
// -----------------------------------------------------------------------------
// STARTUP & QUIET SESSION
// -----------------------------------------------------------------------------


// restore open URLs only, no form or auth session data
user_pref("browser.sessionstore.privacy_level", 2);

// write session state every 60 seconds
user_pref("browser.sessionstore.interval", 60000);

// load pinned tabs on demand when restoring session
user_pref("browser.sessionstore.restore_pinned_tabs_on_demand", true);

// block desktop notifications by default
user_pref("permissions.default.desktop-notification", 2);

// clear default permissions URL
user_pref("permissions.manager.defaultsUrl", "");
// -----------------------------------------------------------------------------
// UI & QUALITY OF LIFE
// -----------------------------------------------------------------------------

// enable userChrome/userContent stylesheets
user_pref("toolkit.legacyUserProfileCustomizations.stylesheets", true);

// enable compact density option
user_pref("browser.compactmode.show", true);

// trim https scheme from urlbar, restore on interaction
user_pref("browser.urlbar.trimHttps", true);
user_pref("browser.urlbar.untrimOnUserInteraction.featureGate", true);

// disable urlbar suggestion group labels
user_pref("browser.urlbar.groupLabels.enabled", false);

// show real URL instead of search terms in address bar
user_pref("browser.urlbar.showSearchTerms.enabled", false);

// disable urlbar suggestions, quicksuggest, and trending
user_pref("browser.urlbar.suggest.addons", false);
user_pref("browser.urlbar.quicksuggest.enabled", false);
user_pref("browser.urlbar.suggest.quicksuggest.nonsponsored", false);
user_pref("browser.urlbar.suggest.quicksuggest.sponsored", false);
user_pref("browser.urlbar.suggest.trending", false);
user_pref("browser.urlbar.trending.featureGate", false);

// disable about:config warning and welcome onboarding
user_pref("browser.aboutConfig.showWarning", false);
user_pref("browser.aboutwelcome.enabled", false);

// disable live search suggestions and engine switcher buttons
user_pref("browser.search.suggest.enabled", false);
user_pref("browser.urlbar.suggest.searches", false);
user_pref("browser.urlbar.suggest.engines", false);

// separate search engine for private windows UI
user_pref("browser.search.separatePrivateDefault.ui.enabled", true);

// disable fullscreen warning delay
user_pref("full-screen-api.warning.timeout", 0);

// open PDF attachments inline
user_pref("browser.download.open_pdf_attachments_inline", true);

// open bookmarks in background tab without stealing focus
user_pref("browser.tabs.loadBookmarksInTabs", true);
user_pref("browser.tabs.loadBookmarksInBackground", true);

// keep bookmarks menu open on middle-click
user_pref("browser.bookmarks.openInTabClosesMenu", false);

// keep window open when closing last tab
user_pref("browser.tabs.closeWindowWithLastTab", false);

// open new tabs next to the active tab
user_pref("browser.tabs.insertAfterCurrent", true);

// highlight all findbar matches and modal dimming
user_pref("findbar.highlightAll", true);
user_pref("findbar.modalHighlight", true);

// MSD physics smooth scrolling
user_pref("general.smoothScroll.msdPhysics.continuousMotionMaxDeltaMS", 12);
user_pref("general.smoothScroll.msdPhysics.enabled", true);
user_pref("general.smoothScroll.msdPhysics.motionBeginSpringConstant", 200);
user_pref("general.smoothScroll.msdPhysics.regularSpringConstant", 250);
user_pref("general.smoothScroll.msdPhysics.slowdownMinDeltaMS", 25);
user_pref("general.smoothScroll.msdPhysics.slowdownMinDeltaRatio", "2.0");
user_pref("general.smoothScroll.msdPhysics.slowdownSpringConstant", 250);
user_pref("general.smoothScroll.currentVelocityWeighting", "1.0");
user_pref("general.smoothScroll.stopDecelerationWeighting", "1.0");
user_pref("mousewheel.default.delta_multiplier_y", 300);
user_pref("apz.overscroll.enabled", true);

// disable middle-click clipboard search
user_pref("browser.tabs.searchclipboardfor.middleclick", false);

// block media autoplay with sound by default
user_pref("media.autoplay.default", 1);

// prevent single-tap Alt key from focusing menu bar on Linux
user_pref("ui.key.menuAccessKeyFocuses", false);

// wrap long lines in View Page Source
user_pref("view_source.wrap_long_lines", true);

// suggest www. on HTTPS-Only warning pages
user_pref("dom.security.https_only_mode_error_page_user_suggestions", true);

// enable playback speed controls in Picture-in-Picture window
user_pref("media.videocontrols.picture-in-picture.playback-speed.enabled", true);

// stop word selection at punctuation on double-click
user_pref("layout.word_select.stop_at_punctuation", true);
// -----------------------------------------------------------------------------
// OS SPECIFIC
// -----------------------------------------------------------------------------

// Linux: disable geoclue, portal file picker, enable middle-click autoscroll
// disable Red Hat geoclue location service
user_pref("geo.provider.use_geoclue", false);

// use XDG portal file picker
user_pref("widget.use-xdg-desktop-portal.file-picker", 1);

// enable middle-click autoscroll (matches Windows behavior)
user_pref("general.autoScroll", true);

// enable fractional scaling on Wayland
user_pref("widget.wayland.fractional-scale.enabled", true);

// Windows: disable location, block UNC paths, disable favicons & restart
// disable Windows geolocation service
user_pref("geo.provider.ms-windows-location", false);

// block UNC paths as file URLs
user_pref("network.file.disable_unc_paths", true);

// disable taskbar shortcut favicons
user_pref("browser.shell.shortcutFavicons", false);

// disable Windows taskbar restart registration
user_pref("toolkit.winRegisterApplicationRestart", false);

// keep private windows grouped in taskbar
user_pref("browser.privateWindowSeparation.enabled", false);

// use natural ClearType font rendering on Windows
user_pref("gfx.font_rendering.cleartype_params.rendering_mode", 5);

// macOS: disable CoreLocation
// disable macOS CoreLocation geolocation
user_pref("geo.provider.use_corelocation", false);
