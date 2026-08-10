
// -----------------------------------------------------------------------------
// SAFE BROWSING — ON (hash-prefix, local match)
// -----------------------------------------------------------------------------
// Core Safe Browsing (malware + phishing) stays ON at Firefox defaults:
// Firefox sends only 32-bit hash prefixes to Google, then matches locally —
// no full URLs leak. Remote download reputation is the one exception: it
// uploads file metadata to Google, so it stays OFF (same choice as Arkenfox).

// Keep remote download reputation off — sends file info to Google otherwise.
// [SOURCE: Both] [NOTE: audited against upstream user.js]
user_pref("browser.safebrowsing.downloads.remote.enabled", false);

// Keep URL-classifier skip lists so embedded Twitter/Reddit/Instagram content
// still renders when the user visits those sites.
user_pref("urlclassifier.features.socialtracking.skipURLs", "*.instagram.com, *.twitter.com, *.twimg.com");
user_pref("urlclassifier.trackingSkipURLs", "*.reddit.com, *.twitter.com, *.twimg.com");
// -----------------------------------------------------------------------------
// PRIVACY — DOWNLOAD SANDBOXING
// -----------------------------------------------------------------------------

// Stage downloads in tmp and delete the temp file once the external app
// finishes with it.
// [SOURCE: Both] [NOTE: audited against upstream user.js]
user_pref("browser.download.start_downloads_in_tmp_dir", true);
// [SOURCE: Arkenfox] [NOTE: audited against upstream user.js]
user_pref("browser.helperApps.deleteTempFileOnExit", true);

// Keep downloads out of the Recent Documents registry.
// [SOURCE: Both] [NOTE: audited against upstream user.js]
user_pref("browser.download.manager.addToRecentDocs", false);

// The download panel never steals focus; Ctrl+J summons it.
// [SOURCE: Arkenfox] [NOTE: audited against upstream user.js]
user_pref("browser.download.alwaysOpenPanel", false);

// Always ask where to save and how to handle unknown MIME types.
// [SOURCE: Arkenfox] [NOTE: audited against upstream user.js]
user_pref("browser.download.useDownloadDir", false);
// [SOURCE: Arkenfox] [NOTE: audited against upstream user.js]
user_pref("browser.download.always_ask_before_handling_new_types", true);
// Force download PDFs instead of opening in-browser.
user_pref("browser.download.viewableInternally.typeWasRegistered.pdf", false);

