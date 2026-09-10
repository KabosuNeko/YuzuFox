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

// [SOURCE: cachyos-firefox-settings] [NOTE: disable urlbar suggestions and quicksuggest]
user_pref("browser.urlbar.suggest.addons", false);
user_pref("browser.urlbar.quicksuggest.enabled", false);
user_pref("browser.urlbar.suggest.quicksuggest.nonsponsored", false);
user_pref("browser.urlbar.suggest.quicksuggest.sponsored", false);
user_pref("browser.urlbar.suggest.trending", false);

// [SOURCE: Arkenfox] [NOTE: disable urlbar feature gate suggestions]
user_pref("browser.urlbar.importantDates.featureGate", false);
user_pref("browser.urlbar.market.featureGate", false);
user_pref("browser.urlbar.yelpRealtime.featureGate", false);
user_pref("browser.urlbar.trending.featureGate", false);
user_pref("browser.urlbar.amp.featureGate", false);
user_pref("browser.urlbar.wikipedia.featureGate", false);

// [SOURCE: Betterfox] [NOTE: disable about:config warning and welcome onboarding]
user_pref("browser.aboutConfig.showWarning", false);
user_pref("browser.aboutwelcome.enabled", false);

// [SOURCE: Arkenfox + Betterfox] [NOTE: disable live search suggestions]
user_pref("browser.search.suggest.enabled", false);
user_pref("browser.urlbar.suggest.searches", false);

// [SOURCE: Arkenfox + Betterfox] [NOTE: separate search engine for private windows]
user_pref("browser.search.separatePrivateDefault.ui.enabled", true);
user_pref("browser.search.separatePrivateDefault", true);

// [SOURCE: Betterfox] [NOTE: instant fullscreen transitions]
user_pref("full-screen-api.transition-duration.enter", "0 0");
user_pref("full-screen-api.transition-duration.leave", "0 0");
user_pref("full-screen-api.warning.timeout", 0);

// [SOURCE: Betterfox] [NOTE: open PDF attachments inline]
user_pref("browser.download.open_pdf_attachments_inline", true);

// [SOURCE: Betterfox] [NOTE: open bookmarks in new tab]
user_pref("browser.tabs.loadBookmarksInTabs", true);

// [SOURCE: Betterfox] [NOTE: keep bookmarks menu open on middle-click]
user_pref("browser.bookmarks.openInTabClosesMenu", false);

// [SOURCE: Betterfox] [NOTE: highlight all findbar matches and modal dimming]
user_pref("findbar.highlightAll", true);
user_pref("findbar.modalHighlight", true);

// [SOURCE: Arkenfox + Mozilla] [NOTE: enable Container Tabs, UI, and open container menu on new tab left click]
user_pref("privacy.userContext.enabled", true);
user_pref("privacy.userContext.ui.enabled", true);
user_pref("privacy.userContext.newTabContainerOnLeftClick.enabled", true);

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

// [SOURCE: YuzuFox] [NOTE: enable CSS masonry layout]
user_pref("layout.css.grid-template-masonry-value.enabled", true);

// [SOURCE: Arkenfox] [NOTE: disable middle-click clipboard search]
user_pref("browser.tabs.searchclipboardfor.middleclick", false);

// [SOURCE: Betterfox + Arkenfox] [NOTE: block media autoplay with sound by default]
user_pref("media.autoplay.default", 1);
