// -----------------------------------------------------------------------------
// SECURITY — TLS, SAFE BROWSING, DOWNLOAD SANDBOXING
// -----------------------------------------------------------------------------
// Connection-layer security (CRLite revocation, TLS renegotiation, 0-RTT),
// Safe Browsing policy, and download isolation. Safe Browsing stays ON
// with hash-prefix lookups; only remote download reputation is off.

// OCSP is disabled because it leaks visited sites to the CA infrastructure.
// CRLite downloads a compact revocation filter and checks offline; mode 2
// enforces both "Revoked" and "Not Revoked" results.

// disable OCSP
// [SOURCE: Betterfox] [NOTE: offline CRLite revocation + no speculative connections]
user_pref("security.OCSP.enabled", 0);

// enforce strict HTTP Public Key Pinning (level 2)
// [SOURCE: Arkenfox] [NOTE: strict PKP to prevent certificate MiTM by hostile CAs]
user_pref("security.cert_pinning.enforcement_level", 2);

// require RFC 5746 safe renegotiation; lack of it allows MiTM injection
// [1] https://wiki.mozilla.org/Security:Renegotiation
// [SOURCE: Arkenfox] [NOTE: block servers lacking RFC 5746 renegotiation (MiTM CVE-2009-3555)]
user_pref("security.ssl.require_safe_negotiation", true);
// display padlock warning on unsafe SSL renegotiation
// [1] https://wiki.mozilla.org/Security:Renegotiation
// [SOURCE: Arkenfox + Betterfox] [NOTE: padlock warning on unsafe renegotiation]
user_pref("security.ssl.treat_unsafe_negotiation_as_broken", true);

// TLS 1.3 0-RTT is not forward secret and allows replay attacks
// [1] https://github.com/tlswg/tls13-spec/issues/1001
// [SOURCE: Arkenfox + Betterfox] [NOTE: 0-RTT not forward secret; allows cross-connection replay]
user_pref("security.tls.enable_0rtt_data", false);

// show expert bad-cert pages immediately when debugging TLS
// [SOURCE: Arkenfox + Betterfox] [NOTE: show advanced info on insecure-connection pages]
user_pref("browser.xul.error_pages.expert_bad_cert", true);

// Core Safe Browsing (malware + phishing) stays ON at Firefox defaults:
// Firefox sends only 32-bit hash prefixes to Google, then matches locally —
// no full URLs leak. Remote download reputation is the one exception: it
// uploads file metadata to Google, so it stays OFF (same choice as Arkenfox).

// keep remote download reputation off — sends file info to Google otherwise
// [SOURCE: Arkenfox + Betterfox] [NOTE: sends file name, origin, size and hash to Google SB for remote lookup]
user_pref("browser.safebrowsing.downloads.remote.enabled", false);

// keep URL-classifier skip lists so embedded Twitter/Reddit/Instagram content still renders when the user visits those sites
user_pref("urlclassifier.features.socialtracking.skipURLs", "*.instagram.com, *.twitter.com, *.twimg.com");
user_pref("urlclassifier.trackingSkipURLs", "*.reddit.com, *.twitter.com, *.twimg.com");

// stage downloads in tmp and delete the temp file once the external app finishes with it
// [1] https://bugzilla.mozilla.org/buglist.cgi?bug_id=302433,1738574
// [SOURCE: Arkenfox + Betterfox] [NOTE: isolates downloads in /tmp to avoid file-system fingerprinting of the profile directory]
user_pref("browser.download.start_downloads_in_tmp_dir", true);
// clean up temp file after external helper application exits
// [1] https://bugzilla.mozilla.org/buglist.cgi?bug_id=302433,1738574
// [SOURCE: Arkenfox] [NOTE: cleans up the temp file after the external helper application exits]
user_pref("browser.helperApps.deleteTempFileOnExit", true);

// keep downloads out of the Recent Documents registry
// [SOURCE: Arkenfox + Betterfox] [NOTE: keeps download filenames out of the OS recent documents list, which is visible to other applications]
user_pref("browser.download.manager.addToRecentDocs", false);

// the download panel never steals focus; Ctrl+J summons it
// [SOURCE: Arkenfox] [NOTE: prevents the downloads panel from stealing focus on every download]
user_pref("browser.download.alwaysOpenPanel", false);

// always ask where to save downloads
// [SOURCE: Arkenfox] [NOTE: forces a save dialog so the user consciously chooses the download location, blocking drive-by saves]
user_pref("browser.download.useDownloadDir", false);
// force user approval before handling unfamiliar MIME types
// [SOURCE: Arkenfox] [NOTE: forces explicit user approval before handling unfamiliar MIME types, blocking silent drive-by execution]
user_pref("browser.download.always_ask_before_handling_new_types", true);
// force download PDFs instead of opening in-browser
user_pref("browser.download.viewableInternally.typeWasRegistered.pdf", false);
