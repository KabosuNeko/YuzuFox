// -----------------------------------------------------------------------------
// PRIVACY
// -----------------------------------------------------------------------------

// [SOURCE: Betterfox] [NOTE: enable HTTPS-Only mode]
user_pref("dom.security.https_only_mode", true);

// [SOURCE: Arkenfox] [NOTE: disable HTTP background probe]
user_pref("dom.security.https_only_mode_send_http_background_request", false);

// [SOURCE: Betterfox] [NOTE: ETP strict mode (enables FPP on known tracking lists without breaking canvas globally)]
user_pref("browser.contentblocking.category", "strict");

// [SOURCE: Arkenfox + Betterfox] [NOTE: isolate content script resources]
user_pref("privacy.antitracking.isolateContentScriptResources", true);

// [SOURCE: Arkenfox + Betterfox] [NOTE: disable CSP reporting]
user_pref("security.csp.reporting.enabled", false);

// [SOURCE: Arkenfox + Betterfox] [NOTE: trim cross-origin referrers to scheme+host+port]
user_pref("network.http.referer.XOriginTrimmingPolicy", 2);

// [SOURCE: Arkenfox] [NOTE: opt-in cookie partitioning]
user_pref("network.cookie.cookieBehavior.optInPartitioning", true);
user_pref("network.cookie.cookieBehavior.optInPartitioning.pbmode", true);

// [SOURCE: Betterfox] [NOTE: strip tracking query parameters via dynamic lists]
user_pref("privacy.query_stripping.enabled", true);
user_pref("privacy.query_stripping.enabled.pbmode", true);

// [SOURCE: Betterfox] [NOTE: strict tracking protection list channels]
user_pref("privacy.annotate_channels.strict_list.enabled", true);

// [SOURCE: Arkenfox + Betterfox] [NOTE: bounce tracking protection purge mode]
user_pref("privacy.bounceTrackingProtection.mode", 1);

// [SOURCE: Arkenfox + Betterfox] [NOTE: disable search and form history]
user_pref("browser.formfill.enable", false);

// [SOURCE: Arkenfox + Betterfox] [NOTE: disable formless and private browsing password capture]
user_pref("signon.formlessCapture.enabled", false);
user_pref("signon.privateBrowsingCapture.enabled", false);

// [SOURCE: Arkenfox] [NOTE: disable password autofill]
user_pref("signon.autofillForms", false);

// [SOURCE: Arkenfox + Betterfox] [NOTE: block cross-origin subresource HTTP auth prompts]
user_pref("network.auth.subresource-http-auth-allow", 1);

// [SOURCE: Betterfox] [NOTE: preserve pasted text without truncation]
user_pref("editor.truncate_user_pastes", false);

// [SOURCE: Arkenfox + Betterfox] [NOTE: always show Punycode for IDNs]
user_pref("network.IDN_show_punycode", true);

// [SOURCE: Arkenfox + Betterfox] [NOTE: disable PDF.js scripting]
user_pref("pdfjs.enableScripting", false);

// [SOURCE: Betterfox] [NOTE: block geolocation by default]
user_pref("permissions.default.geo", 2);

// [SOURCE: Betterfox] [NOTE: use BeaconDB for geolocation]
user_pref("geo.provider.network.url", "https://beacondb.net/v1/geolocate");

