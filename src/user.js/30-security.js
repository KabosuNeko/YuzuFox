// -----------------------------------------------------------------------------
// SECURITY
// -----------------------------------------------------------------------------

// [SOURCE: Betterfox] [NOTE: disable OCSP in favor of CRLite]
user_pref("security.OCSP.enabled", 0);

// [SOURCE: Arkenfox] [NOTE: enforce CRLite mode 2]
user_pref("security.pki.crlite_mode", 2);
user_pref("security.remote_settings.crlite_filters.enabled", true);

// [SOURCE: Arkenfox] [NOTE: strict Public Key Pinning]
user_pref("security.cert_pinning.enforcement_level", 2);

// [SOURCE: Arkenfox] [NOTE: require safe TLS renegotiation]
user_pref("security.ssl.require_safe_negotiation", true);

// [SOURCE: Arkenfox + Betterfox] [NOTE: warn on unsafe SSL renegotiation]
user_pref("security.ssl.treat_unsafe_negotiation_as_broken", true);

// [SOURCE: Arkenfox + Betterfox] [NOTE: disable TLS 1.3 0-RTT]
user_pref("security.tls.enable_0rtt_data", false);

// [SOURCE: Arkenfox] [NOTE: disable deprecated TLS versions]
user_pref("security.tls.version.enable-deprecated", false);

// [SOURCE: Arkenfox] [NOTE: disable passkey direct attestation]
user_pref("security.webauthn.always_allow_direct_attestation", false);

// [SOURCE: Arkenfox] [NOTE: add delay on security confirmation dialogs]
user_pref("security.dialog_enable_delay", 1000);

// [SOURCE: Arkenfox + Betterfox] [NOTE: show advanced info on bad cert error pages]
user_pref("browser.xul.error_pages.expert_bad_cert", true);

// [SOURCE: Arkenfox + Betterfox] [NOTE: disable remote Safe Browsing download reputation]
user_pref("browser.safebrowsing.downloads.remote.enabled", false);

// [SOURCE: YuzuFox] [NOTE: URL classifier skip lists for social embeds]
user_pref("urlclassifier.features.socialtracking.skipURLs", "*.instagram.com, *.twitter.com, *.twimg.com, *.x.com");
user_pref("urlclassifier.trackingSkipURLs", "*.reddit.com, *.twitter.com, *.twimg.com, *.x.com");

// [SOURCE: Arkenfox] [NOTE: enable SmartBlock webcompat shims]
user_pref("extensions.webcompat.enable_shims", true);

// [SOURCE: Arkenfox + Betterfox] [NOTE: isolate downloads in temp directory]
user_pref("browser.download.start_downloads_in_tmp_dir", true);

// [SOURCE: Arkenfox] [NOTE: delete temp file after external app exits]
user_pref("browser.helperApps.deleteTempFileOnExit", true);

// [SOURCE: Arkenfox + Betterfox] [NOTE: do not add downloads to recent documents]
user_pref("browser.download.manager.addToRecentDocs", false);

// [SOURCE: Arkenfox] [NOTE: do not open download panel automatically]
user_pref("browser.download.alwaysOpenPanel", false);

// [SOURCE: Arkenfox] [NOTE: always prompt for download location]
user_pref("browser.download.useDownloadDir", false);

// [SOURCE: Arkenfox] [NOTE: always ask before handling new MIME types]
user_pref("browser.download.always_ask_before_handling_new_types", true);
