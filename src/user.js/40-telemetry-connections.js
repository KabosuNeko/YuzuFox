// -----------------------------------------------------------------------------
// STARTUP & SESSION
// -----------------------------------------------------------------------------

// Blank page at startup and a blank new tab — no sponsored content, no
// round-trips, no Activity Stream noise.
// [SOURCE: Arkenfox] [NOTE: quiet startup and disable push/attribution pings]
user_pref("browser.startup.page", 0);
// [SOURCE: Arkenfox] [NOTE: audited against upstream user.js]
user_pref("browser.startup.homepage", "chrome://browser/content/blanktab.html");
// [SOURCE: Arkenfox] [NOTE: audited against upstream user.js]
user_pref("browser.newtabpage.enabled", false);
// [SOURCE: Both] [NOTE: audited against upstream user.js]
user_pref("browser.newtabpage.activity-stream.default.sites", "");

// Session restore revives URLs but never replays authenticated state.
// 0 = restore all, 1 = skip HTTPS cookies, 2 = restore nothing.
// [SOURCE: Arkenfox] [NOTE: audited against upstream user.js]
user_pref("browser.sessionstore.privacy_level", 2);
// Notifications blocked by default; whitelist per-site in
// about:preferences#privacy > Permissions > Notifications.
user_pref("permissions.default.desktop-notification", 2);
user_pref("dom.private-attribution.submission.enabled", false);
// No mozilla.org domain receives special permissions by default.
// [SOURCE: Both] [NOTE: audited against upstream user.js]
user_pref("permissions.manager.defaultsUrl", "");
