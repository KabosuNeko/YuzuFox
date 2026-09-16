// -----------------------------------------------------------------------------
// STARTUP & QUIET SESSION
// -----------------------------------------------------------------------------


// [SOURCE: Betterfox] [NOTE: enable clean new tab page with shortcuts]
user_pref("browser.newtabpage.enabled", true);
user_pref("browser.newtabpage.activity-stream.default.sites", "");

// [SOURCE: Arkenfox] [NOTE: restore open URLs only, no form or auth session data]
user_pref("browser.sessionstore.privacy_level", 2);

// [SOURCE: Betterfox] [NOTE: write session state every 60 seconds]
user_pref("browser.sessionstore.interval", 60000);

// [SOURCE: Betterfox] [NOTE: load pinned tabs on demand when restoring session]
user_pref("browser.sessionstore.restore_pinned_tabs_on_demand", true);

// [SOURCE: Arkenfox] [NOTE: block desktop notifications by default]
user_pref("permissions.default.desktop-notification", 2);

// [SOURCE: Arkenfox + Betterfox] [NOTE: clear default permissions URL]
user_pref("permissions.manager.defaultsUrl", "");
