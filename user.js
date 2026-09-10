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

// expose only public IP via WebRTC
user_pref("media.peerconnection.ice.default_address_only", true);
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

// enable Global Privacy Control
user_pref("privacy.globalprivacycontrol.enabled", true);

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

// disable form autofill, addresses, credit cards, and saved passwords
user_pref("browser.formfill.enable", false);
user_pref("extensions.formautofill.addresses.enabled", false);
user_pref("extensions.formautofill.creditCards.enabled", false);
user_pref("signon.rememberSignons", false);

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

// disable battery status API
user_pref("dom.battery.enabled", false);

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
user_pref("security.remote_settings.crlite_filters.enabled", true);

// strict Public Key Pinning
user_pref("security.cert_pinning.enforcement_level", 2);

// require safe TLS renegotiation
user_pref("security.ssl.require_safe_negotiation", true);

// warn on unsafe SSL renegotiation
user_pref("security.ssl.treat_unsafe_negotiation_as_broken", true);

// disable TLS 1.3 0-RTT
user_pref("security.tls.enable_0rtt_data", false);

// add delay on security confirmation dialogs
user_pref("security.dialog_enable_delay", 1000);

// show advanced info on bad cert error pages
user_pref("browser.xul.error_pages.expert_bad_cert", true);

// disable remote Safe Browsing download reputation
user_pref("browser.safebrowsing.downloads.remote.enabled", false);

// URL classifier skip lists for social embeds
user_pref("urlclassifier.features.socialtracking.skipURLs", "*.instagram.com, *.twitter.com, *.twimg.com, *.x.com");
user_pref("urlclassifier.trackingSkipURLs", "*.reddit.com, *.twitter.com, *.twimg.com, *.x.com");

// enable SmartBlock webcompat shims
user_pref("extensions.webcompat.enable_shims", true);

// isolate downloads in temp directory
user_pref("browser.download.start_downloads_in_tmp_dir", true);

// delete temp file after external app exits
user_pref("browser.helperApps.deleteTempFileOnExit", true);

// do not add downloads to recent documents
user_pref("browser.download.manager.addToRecentDocs", false);

// do not open download panel automatically
user_pref("browser.download.alwaysOpenPanel", false);

// always prompt for download location
user_pref("browser.download.useDownloadDir", false);

// always ask before handling new MIME types
user_pref("browser.download.always_ask_before_handling_new_types", true);
// -----------------------------------------------------------------------------
// STARTUP & QUIET SESSION
// -----------------------------------------------------------------------------

// set startup page to blank
user_pref("browser.startup.page", 0);

// set homepage to blank page
user_pref("browser.startup.homepage", "chrome://browser/content/blanktab.html");

// disable new tab page
user_pref("browser.newtabpage.enabled", false);

// clear preloaded top sites
user_pref("browser.newtabpage.activity-stream.default.sites", "");

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

// disable urlbar suggestions and quicksuggest
user_pref("browser.urlbar.suggest.addons", false);
user_pref("browser.urlbar.quicksuggest.enabled", false);
user_pref("browser.urlbar.suggest.quicksuggest.nonsponsored", false);
user_pref("browser.urlbar.suggest.quicksuggest.sponsored", false);
user_pref("browser.urlbar.suggest.trending", false);

// disable urlbar feature gate suggestions
user_pref("browser.urlbar.importantDates.featureGate", false);
user_pref("browser.urlbar.market.featureGate", false);
user_pref("browser.urlbar.yelpRealtime.featureGate", false);
user_pref("browser.urlbar.trending.featureGate", false);
user_pref("browser.urlbar.amp.featureGate", false);
user_pref("browser.urlbar.wikipedia.featureGate", false);

// disable about:config warning and welcome onboarding
user_pref("browser.aboutConfig.showWarning", false);
user_pref("browser.aboutwelcome.enabled", false);

// disable live search suggestions
user_pref("browser.search.suggest.enabled", false);
user_pref("browser.urlbar.suggest.searches", false);

// separate search engine for private windows
user_pref("browser.search.separatePrivateDefault.ui.enabled", true);
user_pref("browser.search.separatePrivateDefault", true);

// instant fullscreen transitions
user_pref("full-screen-api.transition-duration.enter", "0 0");
user_pref("full-screen-api.transition-duration.leave", "0 0");
user_pref("full-screen-api.warning.timeout", 0);

// open PDF attachments inline
user_pref("browser.download.open_pdf_attachments_inline", true);

// open bookmarks in new tab
user_pref("browser.tabs.loadBookmarksInTabs", true);

// keep bookmarks menu open on middle-click
user_pref("browser.bookmarks.openInTabClosesMenu", false);

// highlight all findbar matches and modal dimming
user_pref("findbar.highlightAll", true);
user_pref("findbar.modalHighlight", true);

// enable Container Tabs, UI, and open container menu on new tab left click
user_pref("privacy.userContext.enabled", true);
user_pref("privacy.userContext.ui.enabled", true);
user_pref("privacy.userContext.newTabContainerOnLeftClick.enabled", true);

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

// enable CSS masonry layout
user_pref("layout.css.grid-template-masonry-value.enabled", true);

// disable middle-click clipboard search
user_pref("browser.tabs.searchclipboardfor.middleclick", false);

// block media autoplay with sound by default
user_pref("media.autoplay.default", 1);
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

// macOS: disable CoreLocation
// disable macOS CoreLocation geolocation
user_pref("geo.provider.use_corelocation", false);
