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

// Disable inline autocomplete; password capture is delegated to an external
// passphrase store (pass / KeePassXC).
// [SOURCE: Both] [NOTE: audited against upstream user.js]
user_pref("browser.formfill.enable", false);
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

