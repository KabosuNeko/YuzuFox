// -----------------------------------------------------------------------------
// SECURITY
// -----------------------------------------------------------------------------

// [SOURCE: Betterfox] [NOTE: disable OCSP in favor of CRLite]
user_pref("security.OCSP.enabled", 0);

// [SOURCE: Betterfox] [NOTE: warn on unsafe SSL renegotiation]
user_pref("security.ssl.treat_unsafe_negotiation_as_broken", true);

// [SOURCE: Betterfox] [NOTE: disable TLS 1.3 0-RTT]
user_pref("security.tls.enable_0rtt_data", false);

// [SOURCE: Arkenfox + Betterfox] [NOTE: show advanced info on bad cert error pages]
user_pref("browser.xul.error_pages.expert_bad_cert", true);

// [SOURCE: Arkenfox + Betterfox] [NOTE: disable remote Safe Browsing download reputation]
user_pref("browser.safebrowsing.downloads.remote.enabled", false);

// [SOURCE: YuzuFox] [NOTE: URL classifier skip lists for social embeds]
user_pref("urlclassifier.features.socialtracking.skipURLs", "*.instagram.com, *.twitter.com, *.twimg.com, *.x.com");
user_pref("urlclassifier.trackingSkipURLs", "*.reddit.com, *.twitter.com, *.twimg.com, *.x.com");

// [SOURCE: Arkenfox + Betterfox] [NOTE: isolate downloads in temp directory]
user_pref("browser.download.start_downloads_in_tmp_dir", true);

// [SOURCE: Arkenfox + Betterfox] [NOTE: do not add downloads to recent documents]
user_pref("browser.download.manager.addToRecentDocs", false);

// [SOURCE: Arkenfox] [NOTE: do not open download panel automatically]
user_pref("browser.download.alwaysOpenPanel", false);


// [SOURCE: Arkenfox] [NOTE: always ask before handling new MIME types]
user_pref("browser.download.always_ask_before_handling_new_types", true);
