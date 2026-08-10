// -----------------------------------------------------------------------------
// UI / QoL — ONE-LINE LOOK
// -----------------------------------------------------------------------------
// Optional UI prefs. YuzuFox itself no longer ships a userChrome.css theme,
// but keeping stylesheet support enabled lets you drop in your own if you
// want a compact/two-row layout without touching the locked system prefs.

// [SOURCE: Betterfox] [NOTE: compact UI, URL-bar cleanup, and physics scrolling]
user_pref("toolkit.legacyUserProfileCustomizations.stylesheets", true);
// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("browser.compactmode.show", true);

// Strip https:// and undecorate the URL bar.
// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("browser.urlbar.trimHttps", true);
// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("browser.urlbar.untrimOnUserInteraction.featureGate", true);

// Remove Firefox View and URL-bar group labels; show real URLs.
user_pref("browser.tabs.firefox-view", false);
user_pref("browser.tabs.firefox-view-next", false);
// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("browser.urlbar.groupLabels.enabled", false);
// [SOURCE: Arkenfox] [NOTE: audited against upstream user.js]
user_pref("browser.urlbar.showSearchTerms.enabled", false);

// Kill every URL-bar suggestion category (Quicksuggest, trends, addons...).
// Search suggestions from the default engine are left at Firefox defaults (on).
user_pref("browser.urlbar.suggest.addons", false);
// [SOURCE: CachyOS] [NOTE: QuickSuggest master switch + sponsored/nonsponsored off]
user_pref("browser.urlbar.quicksuggest.enabled", false);
user_pref("browser.urlbar.suggest.quicksuggest.fakespot", false);
user_pref("browser.urlbar.suggest.quicksuggest.nonsponsored", false);
user_pref("browser.urlbar.suggest.quicksuggest.sponsored", false);
user_pref("browser.urlbar.suggest.quicksuggest.topsites", false);
user_pref("browser.urlbar.suggest.trending", false);
// [SOURCE: Arkenfox] [NOTE: audited against upstream user.js]
user_pref("browser.urlbar.importantDates.featureGate", false);
// [SOURCE: Arkenfox] [NOTE: audited against upstream user.js]
user_pref("browser.urlbar.market.featureGate", false);
// [SOURCE: Arkenfox] [NOTE: audited against upstream user.js]
user_pref("browser.urlbar.yelpRealtime.featureGate", false);
// [SOURCE: Arkenfox + Betterfox] [NOTE: audited against upstream user.js]
user_pref("browser.urlbar.trending.featureGate", false);

// Separately configurable private-window search engine.
// [SOURCE: Arkenfox + Betterfox] [NOTE: audited against upstream user.js]
user_pref("browser.search.separatePrivateDefault.ui.enabled", true);

// Fullscreen transitions are instant in a tiling WM.
// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("full-screen-api.transition-duration.enter", "0 0");
// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("full-screen-api.transition-duration.leave", "0 0");
// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("full-screen-api.warning.timeout", 0);

// Open PDF attachments inline; close bookmark menu after one click.
// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("browser.download.open_pdf_attachments_inline", true);
// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("browser.bookmarks.openInTabClosesMenu", false);

// Find bar highlights all matches by default.
// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("findbar.highlightAll", true);
// -----------------------------------------------------------------------------
// CONTAINERS
// -----------------------------------------------------------------------------

// Container Tabs for first-party isolation (work vs personal, dev vs prod)
// without needing a separate profile.
// [SOURCE: Arkenfox] [NOTE: audited against upstream user.js]
user_pref("privacy.userContext.enabled", true);
// [SOURCE: Arkenfox + Betterfox] [NOTE: audited against upstream user.js]
user_pref("privacy.userContext.ui.enabled", true);
// Long-press + new tab button opens container picker.
user_pref("privacy.userContext.longPressBehavior", 2);
// -----------------------------------------------------------------------------
// SMOOTH SCROLLING — PHYSICS-BASED (MSD MODEL)
// -----------------------------------------------------------------------------
// Mass-Spring-Damper model: a responsive but controlled GTK/Qt-like feel.

// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("general.smoothScroll.msdPhysics.continuousMotionMaxDeltaMS", 12);
// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("general.smoothScroll.msdPhysics.enabled", true);
user_pref("general.smoothScroll.msdPhysics.motionBeginSpringConstant", 200);
user_pref("general.smoothScroll.msdPhysics.regularSpringConstant", 250);
// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("general.smoothScroll.msdPhysics.slowdownMinDeltaMS", 25);
user_pref("general.smoothScroll.msdPhysics.slowdownMinDeltaRatio", "2.0");
// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("general.smoothScroll.msdPhysics.slowdownSpringConstant", 250);
user_pref("general.smoothScroll.currentVelocityWeighting", "1.0");
user_pref("general.smoothScroll.stopDecelerationWeighting", "1.0");
// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("mousewheel.default.delta_multiplier_y", 300);
// -----------------------------------------------------------------------------
// FEATURE ENABLEMENT
// -----------------------------------------------------------------------------

// Experimental CSS Masonry layout engine (grid-template-masonry).
user_pref("layout.css.grid-template-masonry-value.enabled", true);
// -----------------------------------------------------------------------------
// DESKTOP / SECURITY MISC
// -----------------------------------------------------------------------------
// Do not search for clipboard content on accidental middle-click.
// [SOURCE: Arkenfox] [NOTE: disable middle-click clipboard search]
user_pref("browser.tabs.searchclipboardfor.middleclick", false);

