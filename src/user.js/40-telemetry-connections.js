// -----------------------------------------------------------------------------
// STARTUP & CONNECTIONS — QUIET SESSION
// -----------------------------------------------------------------------------
// Blank startup, no sponsored new-tab content, no push or attribution
// pings, session restore without authenticated state, and default-deny
// permission prompts.

// Blank page at startup and a blank new tab — no sponsored content, no
// round-trips, no Activity Stream noise.
// set startup page to blank
// [SOURCE: Arkenfox] [NOTE: quiet startup and disable push/attribution pings]
user_pref("browser.startup.page", 0);
// set homepage to blank page
// [SOURCE: Arkenfox] [NOTE: blank inline page — no external content, no network round-trips at startup or new window]
user_pref("browser.startup.homepage", "chrome://browser/content/blanktab.html");
// disable new tab page
// [SOURCE: Arkenfox] [NOTE: disable Activity Stream on new tabs to prevent content loads and network requests]
user_pref("browser.newtabpage.enabled", false);
// clear preloaded top sites
// [SOURCE: Arkenfox + Betterfox] [NOTE: clear preloaded default top sites (Facebook, YouTube, etc.) to avoid automated connections to those domains]
user_pref("browser.newtabpage.activity-stream.default.sites", "");

// Session restore revives URLs but never replays authenticated state.
// 0 = restore all, 1 = skip HTTPS cookies, 2 = restore nothing.
// store no extra session data
// [SOURCE: Arkenfox] [NOTE: never store form content, cookies, or POST data in the session — restore open URLs only]
user_pref("browser.sessionstore.privacy_level", 2);
// Notifications blocked by default; whitelist per-site in
// about:preferences#privacy > Permissions > Notifications.
user_pref("permissions.default.desktop-notification", 2);
user_pref("dom.private-attribution.submission.enabled", false);
// No mozilla.org domain receives special permissions by default.
// clear permissions defaults URL
// [SOURCE: Arkenfox + Betterfox] [NOTE: Firefox ships a permissions file that auto-grants special privileges to mozilla.org domains — clear it]
user_pref("permissions.manager.defaultsUrl", "");
