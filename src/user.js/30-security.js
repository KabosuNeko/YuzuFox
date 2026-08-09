
// -----------------------------------------------------------------------------
// PRIVACY & SECURITY — SAFE BROWSING OFF (DNS-delegated)
// -----------------------------------------------------------------------------
// All Safe Browsing features are disabled because the system's DNS resolver
// already blocks known-malicious domains. The browser must never ping Google
// or Mozilla servers for URL reputation checks. If you do not have DNS-level
// blocking, skip this section.
//
// This includes: Google Safe Browsing (all protocol versions), Mozilla's own
// Safe Browsing service, download reputation lookups, malware/phishing checks,
// and the blocklist override page.

// [SOURCE: YuzuFox] [NOTE: Safe Browsing disabled — not active in Betterfox/Arkenfox upstream]
user_pref("browser.safebrowsing.allowOverride", false);
user_pref("browser.safebrowsing.blockedURIs.enabled", false);
user_pref("browser.safebrowsing.downloads.enabled", false);
user_pref("browser.safebrowsing.downloads.remote.block_dangerous", false);
user_pref("browser.safebrowsing.downloads.remote.block_dangerous_host", false);
user_pref("browser.safebrowsing.downloads.remote.block_potentially_unwanted", false);
user_pref("browser.safebrowsing.downloads.remote.block_uncommon", false);
// [SOURCE: Both] [NOTE: audited against upstream user.js]
user_pref("browser.safebrowsing.downloads.remote.enabled", false);
user_pref("browser.safebrowsing.downloads.remote.remote.url", "");
user_pref("browser.safebrowsing.id", "");
user_pref("browser.safebrowsing.malware.enabled", false);
user_pref("browser.safebrowsing.phishing.enabled", false);
user_pref("browser.safebrowsing.provider.google.advisoryURL", "");
user_pref("browser.safebrowsing.provider.google.gethashURL", "");
user_pref("browser.safebrowsing.provider.google.lists", "");
user_pref("browser.safebrowsing.provider.google.malwareReportURL", "");
user_pref("browser.safebrowsing.provider.google.pver", 0);
user_pref("browser.safebrowsing.provider.google.reportMalwareMistakeURL", "");
user_pref("browser.safebrowsing.provider.google.reportPhishMistakeURL", "");
user_pref("browser.safebrowsing.provider.google.reportURL", "");
user_pref("browser.safebrowsing.provider.google.updateURL", "");
user_pref("browser.safebrowsing.provider.google4.advisoryURL", "");
user_pref("browser.safebrowsing.provider.google4.dataSharing.enabled", false);
user_pref("browser.safebrowsing.provider.google4.gethashURL", "");
user_pref("browser.safebrowsing.provider.google4.lists", "");
user_pref("browser.safebrowsing.provider.google4.pver", 0);
user_pref("browser.safebrowsing.provider.google4.reportMalwareMistakeURL", "");
user_pref("browser.safebrowsing.provider.google4.reportPhishMistakeURL", "");
user_pref("browser.safebrowsing.provider.google4.reportURL", "");
user_pref("browser.safebrowsing.provider.google4.updateURL", "");
user_pref("browser.safebrowsing.provider.mozilla.gethashURL", "");
user_pref("browser.safebrowsing.provider.mozilla.lists", "");
user_pref("browser.safebrowsing.provider.mozilla.lists.base", "");
user_pref("browser.safebrowsing.provider.mozilla.lists.content", "");
user_pref("browser.safebrowsing.provider.mozilla.pver", 0);
user_pref("browser.safebrowsing.provider.mozilla.reportURL", "");
user_pref("browser.safebrowsing.provider.mozilla.updateURL", "");
user_pref("browser.safebrowsing.reportPhishURL", "");

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
