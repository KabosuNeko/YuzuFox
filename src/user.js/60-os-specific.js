// -----------------------------------------------------------------------------
// OS SPECIFIC
// -----------------------------------------------------------------------------

// Linux: disable geoclue, portal file picker, enable middle-click autoscroll
// [SOURCE: Arkenfox] [NOTE: disable Red Hat geoclue location service]
user_pref("geo.provider.use_geoclue", false);

// [SOURCE: cachyos-firefox-settings] [NOTE: use XDG portal file picker]
user_pref("widget.use-xdg-desktop-portal.file-picker", 1);

// [SOURCE: Betterfox] [NOTE: enable middle-click autoscroll (matches Windows behavior)]
user_pref("general.autoScroll", true);

// [SOURCE: cachyos-firefox-settings] [NOTE: enable fractional scaling on Wayland]
user_pref("widget.wayland.fractional-scale.enabled", true);

// Windows: disable location, block UNC paths, disable favicons & restart
// [SOURCE: Arkenfox] [NOTE: disable Windows geolocation service]
user_pref("geo.provider.ms-windows-location", false);

// [SOURCE: Arkenfox] [NOTE: block UNC paths as file URLs]
user_pref("network.file.disable_unc_paths", true);

// [SOURCE: Arkenfox] [NOTE: disable taskbar shortcut favicons]
user_pref("browser.shell.shortcutFavicons", false);

// [SOURCE: Arkenfox] [NOTE: disable Windows taskbar restart registration]
user_pref("toolkit.winRegisterApplicationRestart", false);

// [SOURCE: Betterfox] [NOTE: keep private windows grouped in taskbar]
user_pref("browser.privateWindowSeparation.enabled", false);

// [SOURCE: Betterfox] [NOTE: use natural ClearType font rendering on Windows]
user_pref("gfx.font_rendering.cleartype_params.rendering_mode", 5);

// macOS: disable CoreLocation
// [SOURCE: Arkenfox] [NOTE: disable macOS CoreLocation geolocation]
user_pref("geo.provider.use_corelocation", false);
