// -----------------------------------------------------------------------------
// PRIVACY
// -----------------------------------------------------------------------------

// [SOURCE: Betterfox] [NOTE: enable HTTPS-Only mode]
user_pref("dom.security.https_only_mode", true);

// [SOURCE: Arkenfox] [NOTE: disable HTTP background probe]
user_pref("dom.security.https_only_mode_send_http_background_request", false);

// [SOURCE: Arkenfox + Betterfox] [NOTE: ETP strict mode and fingerprinting protection]
user_pref("browser.contentblocking.category", "strict");
user_pref("privacy.fingerprintingProtection", true);
user_pref("privacy.fingerprintingProtection.pbmode", true);

// [SOURCE: Arkenfox + Betterfox] [NOTE: isolate content script resources]
user_pref("privacy.antitracking.isolateContentScriptResources", true);

// [SOURCE: Arkenfox + Betterfox] [NOTE: disable CSP reporting]
user_pref("security.csp.reporting.enabled", false);

// [SOURCE: Arkenfox + Betterfox] [NOTE: trim cross-origin referrers to scheme+host+port]
user_pref("network.http.referer.XOriginTrimmingPolicy", 2);

// [SOURCE: Betterfox] [NOTE: enable Global Privacy Control]
user_pref("privacy.globalprivacycontrol.enabled", true);

// [SOURCE: Arkenfox] [NOTE: opt-in cookie partitioning]
user_pref("network.cookie.cookieBehavior.optInPartitioning", true);
user_pref("network.cookie.cookieBehavior.optInPartitioning.pbmode", true);

// [SOURCE: Arkenfox + Betterfox] [NOTE: strip tracking query parameters]
user_pref("privacy.query_stripping.enabled", true);
user_pref("privacy.query_stripping.enabled.pbmode", true);
user_pref("privacy.query_stripping.strip_list", "__hsfp __hssc __hstc __s _hsenc _openstat dclid fbclid gbraid gclid hsCtaTracking igshid mc_eid ml_subscriber ml_subscriber_hash msclkid oft_c oft_ck oft_d oft_id oft_ids oft_k oft_lk oft_sk oly_anon_id oly_enc_id rb_clickid s_cid twclid vero_conv vero_id wbraid wickedid yclid");

// [SOURCE: Betterfox] [NOTE: strict tracking protection list channels]
user_pref("privacy.annotate_channels.strict_list.enabled", true);

// [SOURCE: Arkenfox + Betterfox] [NOTE: bounce tracking protection purge mode]
user_pref("privacy.bounceTrackingProtection.mode", 1);

// [SOURCE: Arkenfox + Betterfox] [NOTE: disable form autofill, addresses, credit cards, and saved passwords]
user_pref("browser.formfill.enable", false);
user_pref("extensions.formautofill.addresses.enabled", false);
user_pref("extensions.formautofill.creditCards.enabled", false);
user_pref("signon.rememberSignons", false);

// [SOURCE: Arkenfox + Betterfox] [NOTE: disable formless and private browsing password capture]
user_pref("signon.formlessCapture.enabled", false);
user_pref("signon.privateBrowsingCapture.enabled", false);

// [SOURCE: Arkenfox] [NOTE: disable password autofill]
user_pref("signon.autofillForms", false);

// [SOURCE: Arkenfox + Betterfox] [NOTE: block cross-origin subresource HTTP auth prompts]
user_pref("network.auth.subresource-http-auth-allow", 1);

// [SOURCE: Betterfox] [NOTE: preserve pasted text without truncation]
user_pref("editor.truncate_user_pastes", false);

// [SOURCE: Arkenfox] [NOTE: prevent scripts from moving or resizing windows]
user_pref("dom.disable_window_move_resize", true);

// [SOURCE: Arkenfox + Betterfox] [NOTE: restrict popup events to direct user interaction]
user_pref("dom.popup_allowed_events", "click dblclick mousedown pointerdown");

// [SOURCE: Arkenfox + Betterfox] [NOTE: disable hyperlink auditing pings]
user_pref("browser.send_pings", false);

// [SOURCE: Arkenfox + Betterfox] [NOTE: disable silent Windows SSO authentication]
user_pref("network.http.windows-sso.enabled", false);

// [SOURCE: Arkenfox] [NOTE: disable device sensor APIs]
user_pref("device.sensors.enabled", false);

// [SOURCE: Arkenfox] [NOTE: disable battery status API]
user_pref("dom.battery.enabled", false);

// [SOURCE: Arkenfox + Betterfox] [NOTE: always show Punycode for IDNs]
user_pref("network.IDN_show_punycode", true);

// [SOURCE: Arkenfox + Betterfox] [NOTE: disable PDF.js scripting]
user_pref("pdfjs.enableScripting", false);

// [SOURCE: Betterfox] [NOTE: block geolocation by default]
user_pref("permissions.default.geo", 2);

// [SOURCE: Betterfox] [NOTE: use BeaconDB for geolocation]
user_pref("geo.provider.network.url", "https://beacondb.net/v1/geolocate");

