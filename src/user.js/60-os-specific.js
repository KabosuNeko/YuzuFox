// -----------------------------------------------------------------------------
// PER-OS SECTIONS
// -----------------------------------------------------------------------------
// Only the prefs tagged below apply to a given OS. Prefs from Arkenfox /
// Betterfox that are harmless everywhere are kept in their general sections
// above; the ones here genuinely differ per platform. Everything in this file
// is per-profile — the system-wide yuzu.js stays OS-agnostic.

// --- [LINUX] ---
// Force Firefox to skip the Red Hat-style geoclue location service entirely.
// [FF102+] [LINUX] (Arkenfox 0203)
// [SOURCE: Arkenfox] [NOTE: disable Red Hat geoclue location service]
user_pref("geo.provider.use_geoclue", false);

// GVfs (GNOME) must not be used as a proxy bypass / protocol handler.
// [LINUX] (Betterfox: network.gio.supported-protocols)
// [SOURCE: Arkenfox] [NOTE: block GVfs from acting as protocol handler]
user_pref("network.gio.supported-protocols", "");

// --- [WINDOWS] ---
// Disable the Windows Location Service as a geolocation provider.
// [WINDOWS] (Arkenfox 0203, Betterfox Securefox)
// [SOURCE: Arkenfox] [NOTE: disable Windows geolocation and UNC paths]
user_pref("geo.provider.ms-windows-location", false);

// Never allow UNC paths to be used as file URLs (defensive on shares).
// [WINDOWS] (Arkenfox 0008)
// [SOURCE: Arkenfox] [NOTE: block UNC paths as file URLs]
user_pref("network.file.disable_unc_paths", true);

// No favicon .ico caching / desktop-shortcut favicons.
// [WINDOWS] (Arkenfox 1006, Betterfox Securefox)
// [SOURCE: Arkenfox] [NOTE: disable taskbar favicons and app restart registration]
user_pref("browser.shell.shortcutFavicons", false);

// Disable the Windows "restart after user signs out / restart to restore"
// Taskbar mechanism the moment the session ends.
// [WINDOWS] (Arkenfox 1005)
// [SOURCE: Arkenfox] [NOTE: disable Windows taskbar restart registration]
user_pref("toolkit.winRegisterApplicationRestart", false);

// --- [macOS] ---
// Disable Apple's CoreLocation geolocation provider.
// [SOURCE: Arkenfox] [NOTE: disable macOS CoreLocation geolocation]
user_pref("geo.provider.use_corelocation", false);

// (rest of macOS is policy-inherited; yuzu.js is OS-agnostic)
