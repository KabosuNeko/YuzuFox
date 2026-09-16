// -----------------------------------------------------------------------------
// UI & QUALITY OF LIFE
// -----------------------------------------------------------------------------

// [SOURCE: Betterfox] [NOTE: enable userChrome/userContent stylesheets]
user_pref("toolkit.legacyUserProfileCustomizations.stylesheets", true);

// [SOURCE: Betterfox] [NOTE: enable compact density option]
user_pref("browser.compactmode.show", true);

// [SOURCE: Betterfox] [NOTE: trim https scheme from urlbar, restore on interaction]
user_pref("browser.urlbar.trimHttps", true);
user_pref("browser.urlbar.untrimOnUserInteraction.featureGate", true);

// [SOURCE: Betterfox] [NOTE: disable urlbar suggestion group labels]
user_pref("browser.urlbar.groupLabels.enabled", false);

// [SOURCE: Arkenfox] [NOTE: show real URL instead of search terms in address bar]
user_pref("browser.urlbar.showSearchTerms.enabled", false);

// [SOURCE: cachyos-firefox-settings] [NOTE: disable urlbar suggestions and trending]
user_pref("browser.urlbar.suggest.addons", false);
user_pref("browser.urlbar.suggest.quicksuggest.nonsponsored", false);
user_pref("browser.urlbar.suggest.quicksuggest.sponsored", false);
user_pref("browser.urlbar.suggest.trending", false);
user_pref("browser.urlbar.trending.featureGate", false);

// [SOURCE: Betterfox] [NOTE: disable about:config warning and welcome onboarding]
user_pref("browser.aboutConfig.showWarning", false);
user_pref("browser.aboutwelcome.enabled", false);

// [SOURCE: Arkenfox + Betterfox] [NOTE: disable live search suggestions and engine switcher buttons]
user_pref("browser.search.suggest.enabled", false);
user_pref("browser.urlbar.suggest.searches", false);
user_pref("browser.urlbar.suggest.engines", false);

// [SOURCE: Arkenfox + Betterfox] [NOTE: separate search engine for private windows UI]
user_pref("browser.search.separatePrivateDefault.ui.enabled", true);

// [SOURCE: Betterfox] [NOTE: disable fullscreen warning delay]
user_pref("full-screen-api.warning.timeout", 0);

// [SOURCE: Betterfox] [NOTE: open PDF attachments inline]
user_pref("browser.download.open_pdf_attachments_inline", true);

// [SOURCE: Betterfox] [NOTE: open bookmarks in background tab without stealing focus]
user_pref("browser.tabs.loadBookmarksInTabs", true);
user_pref("browser.tabs.loadBookmarksInBackground", true);

// [SOURCE: Betterfox] [NOTE: keep bookmarks menu open on middle-click]
user_pref("browser.bookmarks.openInTabClosesMenu", false);

// [SOURCE: YuzuFox / Betterfox] [NOTE: keep window open when closing last tab]
user_pref("browser.tabs.closeWindowWithLastTab", false);

// [SOURCE: YuzuFox] [NOTE: open new tabs next to the active tab]
user_pref("browser.tabs.insertAfterCurrent", true);

// [SOURCE: Betterfox] [NOTE: highlight all findbar matches and modal dimming]
user_pref("findbar.highlightAll", true);
user_pref("findbar.modalHighlight", true);

// [SOURCE: Betterfox] [NOTE: MSD physics smooth scrolling]
user_pref("general.smoothScroll.msdPhysics.continuousMotionMaxDeltaMS", 12);
user_pref("general.smoothScroll.msdPhysics.enabled", true);
user_pref("general.smoothScroll.msdPhysics.motionBeginSpringConstant", 200);
user_pref("general.smoothScroll.msdPhysics.regularSpringConstant", 250);
user_pref("general.smoothScroll.msdPhysics.slowdownMinDeltaMS", 25);
user_pref("general.smoothScroll.msdPhysics.slowdownMinDeltaRatio", "2.0");
user_pref("general.smoothScroll.msdPhysics.slowdownSpringConstant", 250);
user_pref("general.smoothScroll.currentVelocityWeighting", "1.0");
user_pref("general.smoothScroll.stopDecelerationWeighting", "1.0");
user_pref("mousewheel.default.delta_multiplier_y", 300);
user_pref("apz.overscroll.enabled", true);

// [SOURCE: Arkenfox] [NOTE: disable middle-click clipboard search]
user_pref("browser.tabs.searchclipboardfor.middleclick", false);

// [SOURCE: Betterfox + Arkenfox] [NOTE: block media autoplay with sound by default]
user_pref("media.autoplay.default", 1);

// [SOURCE: YuzuFox] [NOTE: prevent single-tap Alt key from focusing menu bar on Linux]
user_pref("ui.key.menuAccessKeyFocuses", false);

// [SOURCE: YuzuFox] [NOTE: wrap long lines in View Page Source]
user_pref("view_source.wrap_long_lines", true);

// [SOURCE: Betterfox] [NOTE: suggest www. on HTTPS-Only warning pages]
user_pref("dom.security.https_only_mode_error_page_user_suggestions", true);

// [SOURCE: YuzuFox] [NOTE: enable playback speed controls in Picture-in-Picture window]
user_pref("media.videocontrols.picture-in-picture.playback-speed.enabled", true);

// [SOURCE: YuzuFox] [NOTE: stop word selection at punctuation on double-click]
user_pref("layout.word_select.stop_at_punctuation", true);
