// -----------------------------------------------------------------------------
// PRIVACY — HTTPS-ONLY, TRACKING PROTECTION, REFERRERS, FORMS, DOM
// -----------------------------------------------------------------------------
// Everything that reduces what sites learn about you: HTTPS-only mode,
// fingerprinting protection, cookie partitioning, query stripping, and
// DOM API restrictions. Credential handling is delegated to an external
// passphrase store (pass / KeePassXC).

// Force HTTPS on every top-level navigation
// [SOURCE: Betterfox] [NOTE: HTTPS-only, tracking protection, and query stripping]
user_pref("dom.security.https_only_mode", true);

// Forbid the 3-second cleartext HTTP background probe when upgrading
// [1] https://bugzilla.mozilla.org/buglist.cgi?bug_id=1642387,1660945
// [SOURCE: Arkenfox] [NOTE: disable the 3s cleartext HTTP probe — leaks visited domain in plaintext]
user_pref("dom.security.https_only_mode_send_http_background_request", false);

// Enable ETP Strict Mode with fingerprinting protection
// [1] https://blog.mozilla.org/security/2021/02/23/total-cookie-protection/
// [SOURCE: Arkenfox + Betterfox] [NOTE: ETP Strict enables Total Cookie Protection + FPP for fingerprinting defense]
user_pref("browser.contentblocking.category", "strict");
user_pref("privacy.fingerprintingProtection", true);

// Isolate content-script resources so a malicious extension cannot use content scripts as a cross-origin bridge
// [SOURCE: Arkenfox + Betterfox] [NOTE: block referrer and storage access via content scripts (cross-origin bridge)]
user_pref("privacy.antitracking.isolateContentScriptResources", true);

// Disable CSP Level 2 report delivery (leaks referrer + policy info, no defensive value when the content itself is trusted)
// [SOURCE: Arkenfox + Betterfox] [NOTE: CSP reports leak referrer and policy details to third-party endpoints]
user_pref("security.csp.reporting.enabled", false);

// Trim cross-origin referrers to scheme+host+port (no path/query leaks)
// [SOURCE: Arkenfox + Betterfox] [NOTE: value 2=only scheme+host+port — strips path and query from cross-origin referrers]
user_pref("network.http.referer.XOriginTrimmingPolicy", 2);

// No referrer spoofing (it breaks CSRF protections on Origin-validating sites).

// Global Privacy Control opt-out signal
// [SOURCE: Betterfox] [NOTE: signal Do Not Sell/Share to sites — legal privacy right under CCPA/GDPR]
user_pref("privacy.globalprivacycontrol.enabled", true);

// Opt-in partitioning so an "Allow" exception for one eTLD+1 does not unpartition all of its cookies
user_pref("network.cookie.cookieBehavior.optInPartitioning", true);
user_pref("network.cookie.cookieBehavior.optInPartitioning.pbmode", true);

// Remove tracking parameters at the navigation level before the request leaves
user_pref("privacy.query_stripping.strip_list", "__hsfp __hssc __hstc __s _hsenc _openstat dclid fbclid gbraid gclid hsCtaTracking igshid mc_eid ml_subscriber ml_subscriber_hash msclkid oft_c oft_ck oft_d oft_id oft_ids oft_k oft_lk oft_sk oly_anon_id oly_enc_id rb_clickid s_cid twclid vero_conv vero_id wbraid wickedid yclid");

// Disable inline autocomplete and the built-in password manager; credential capture is delegated to an external passphrase store (pass / KeePassXC)
// [1] https://blog.mindedsecurity.com/2011/10/autocompleteagain.html
// [SOURCE: Arkenfox + Betterfox] [NOTE: autocomplete form data readable by third parties; password mgr delegated to external store]
user_pref("browser.formfill.enable", false);
user_pref("signon.rememberSignons", false);
// Disable formless login capture for Password Manager
// [SOURCE: Arkenfox + Betterfox] [NOTE: block password capture on non-standard login forms (attack surface reduction)]
user_pref("signon.formlessCapture.enabled", false);
// Disable credential capture in private browsing windows
// [SOURCE: Betterfox] [NOTE: no credential capture in private windows — defeats PB isolation purpose]
user_pref("signon.privateBrowsingCapture.enabled", false);
// Disable auto-filling username and password form fields
// [1] https://freedom-to-tinker.com/2017/12/27/no-boundaries-for-user-identities-web-trackers-exploit-browser-login-managers/
// [SOURCE: Arkenfox] [NOTE: auto-fill leaks credentials via cross-site forms and spoofed fields]
user_pref("signon.autofillForms", false);

// Sub-resources from other origins cannot prompt for HTTP credentials
// [SOURCE: Arkenfox + Betterfox] [NOTE: value 1 blocks cross-origin auth prompts — prevents credential phishing]
user_pref("network.auth.subresource-http-auth-allow", 1);

// Preserve pasted rich text instead of letting the editor strip formatting
// [SOURCE: Betterfox] [NOTE: prevent silent password truncation on paste into maxlength fields]
user_pref("editor.truncate_user_pastes", false);

// Prevent JS from moving/resizing the window (the tiling WM owns geometry)
// [SOURCE: Arkenfox] [NOTE: prevent scripts from repositioning window — anti-spoofing/phishing defense]
user_pref("dom.disable_window_move_resize", true);

// Block site access to clipboard events (fingerprinting + data leak vector)
// [SOURCE: Arkenfox] [NOTE: clipboard event access disabled]
user_pref("dom.event.clipboardevents.enabled", false);

// Disable device sensor APIs — accelerometer, gyroscope, proximity
// [SOURCE: Arkenfox] [NOTE: sensor API disabled per Arkenfox 4200+]
user_pref("device.sensors.enabled", false);

// Disable Battery Status API — leaks device type + charge level as fingerprint
// [SOURCE: Arkenfox] [NOTE: battery API disabled per Arkenfox 4200+]
user_pref("dom.battery.enabled", false);

// Homograph defense: always show Punycode for IDNs
// [1] https://wiki.mozilla.org/IDN_Display_Algorithm
// [SOURCE: Arkenfox + Betterfox] [NOTE: show raw punycode to defeat IDN homograph attacks (e.g. Cyrillic apple.com)]
user_pref("network.IDN_show_punycode", true);

// PDF.js stays but never runs embedded scripts
// [1] https://cve.mitre.org/cgi-bin/cvekey.cgi?keyword=pdf.js+firefox
// [SOURCE: Arkenfox + Betterfox] [NOTE: embedded JS in PDFs is a malware/exploit vector — PDF rendering only]
user_pref("pdfjs.enableScripting", false);

// Block geolocation by default; allow per-site via the permission prompt
// [SOURCE: Betterfox] [NOTE: geolocation default-blocked, allow per site]
user_pref("permissions.default.geo", 2);

// Kill Google's network-based geolocation (fallback when GPS/WiFi is absent)
// [SOURCE: Betterfox] [NOTE: disable Google network geolocation]
user_pref("geo.provider.network.url", "");

// On HTTPS-only errors, do not suggest "continue to HTTP"
// [SOURCE: Betterfox] [NOTE: no "continue to HTTP" suggestion on error page]
user_pref("dom.security.https_only_mode_error_page_user_suggestions", false);

