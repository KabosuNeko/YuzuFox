// -----------------------------------------------------------------------------
// STARTUP & QUIET SESSION
// -----------------------------------------------------------------------------

// [SOURCE: Arkenfox] [NOTE: set startup page to blank]
user_pref("browser.startup.page", 0);

// [SOURCE: Arkenfox] [NOTE: set homepage to blank page]
user_pref("browser.startup.homepage", "chrome://browser/content/blanktab.html");

// [SOURCE: Arkenfox] [NOTE: disable new tab page]
user_pref("browser.newtabpage.enabled", false);

// [SOURCE: Arkenfox + Betterfox] [NOTE: clear preloaded top sites]
user_pref("browser.newtabpage.activity-stream.default.sites", "");

// [SOURCE: Arkenfox] [NOTE: restore open URLs only, no form or auth session data]
user_pref("browser.sessionstore.privacy_level", 2);

// [SOURCE: Betterfox] [NOTE: write session state every 60 seconds]
user_pref("browser.sessionstore.interval", 60000);

// [SOURCE: Arkenfox] [NOTE: block desktop notifications by default]
user_pref("permissions.default.desktop-notification", 2);

// [SOURCE: Betterfox] [NOTE: disable private attribution reporting]
user_pref("dom.private-attribution.submission.enabled", false);

// [SOURCE: Arkenfox + Betterfox] [NOTE: clear default permissions URL]
user_pref("permissions.manager.defaultsUrl", "");
