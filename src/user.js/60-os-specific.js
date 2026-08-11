// -----------------------------------------------------------------------------
// PER-OS SECTIONS
// -----------------------------------------------------------------------------
// Only the prefs tagged below apply to a given OS. Prefs from Arkenfox /
// Betterfox that are harmless everywhere are kept in their general sections
// above; the ones here genuinely differ per platform. Everything in this file
// is per-profile — the system-wide yuzu.js stays OS-agnostic.

// Force Firefox to skip the Red Hat-style geoclue location service entirely
// [SOURCE: Arkenfox] [NOTE: disable Red Hat geoclue location service]
user_pref("geo.provider.use_geoclue", false);

// GVfs (GNOME) must not be used as a proxy bypass / protocol handler
// [1] https://bugzilla.mozilla.org/1433507
// [SOURCE: Arkenfox] [NOTE: block GVfs from acting as protocol handler]
user_pref("network.gio.supported-protocols", "");

// Prefer the XDG Desktop Portal for the file picker dialog
// [SOURCE: cachyos-firefox-settings] [NOTE: use the portal file picker instead of the GTK native dialog]
user_pref("widget.use-xdg-desktop-portal.file-picker", 1);

// Disable the Windows Location Service as a geolocation provider
// [SOURCE: Arkenfox] [NOTE: disable Windows geolocation and UNC paths]
user_pref("geo.provider.ms-windows-location", false);

// Never allow UNC paths to be used as file URLs (defensive on shares)
// [1] https://bugzilla.mozilla.org/1413868
// [SOURCE: Arkenfox] [NOTE: block UNC paths as file URLs]
user_pref("network.file.disable_unc_paths", true);

// No favicon .ico caching / desktop-shortcut favicons
// [SOURCE: Arkenfox] [NOTE: disable taskbar favicons and app restart registration]
user_pref("browser.shell.shortcutFavicons", false);

// Disable the Windows "restart after user signs out / restart to restore" Taskbar mechanism the moment the session ends
// [1] https://bugzilla.mozilla.org/603903
// [SOURCE: Arkenfox] [NOTE: disable Windows taskbar restart registration]
user_pref("toolkit.winRegisterApplicationRestart", false);

// Disable Apple's CoreLocation geolocation provider
// [SOURCE: Arkenfox] [NOTE: disable macOS CoreLocation geolocation]
user_pref("geo.provider.use_corelocation", false);

// (rest of macOS is policy-inherited; yuzu.js is OS-agnostic)
