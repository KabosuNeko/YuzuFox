// -----------------------------------------------------------------------------
// UI / QoL — LOOK, FEEL, CONTAINERS, SCROLLING
// -----------------------------------------------------------------------------
// Optional UI preferences: compact density, URL-bar behavior, fullscreen
// transitions, containers, and physics-based scrolling. Safe to drop in
// or out per profile — nothing here affects security or privacy.

// enable legacy stylesheet customizations
// [SOURCE: Betterfox] [NOTE: compact UI, URL-bar cleanup, and physics scrolling]
user_pref("toolkit.legacyUserProfileCustomizations.stylesheets", true);
// enable compact density mode
// [SOURCE: Betterfox] [NOTE: restore compact density option (removed in Proton redesign)]
user_pref("browser.compactmode.show", true);

// Strip https:// and undecorate the URL bar
// [SOURCE: Betterfox] [NOTE: hide https:// scheme in address bar; copied URL still includes it]
user_pref("browser.urlbar.trimHttps", true);
// restore full URL on address-bar click
// [SOURCE: Betterfox] [NOTE: restore full URL on address-bar click, re-trim on blur]
user_pref("browser.urlbar.untrimOnUserInteraction.featureGate", true);

// Remove Firefox View and URL-bar group labels; show real URLs
user_pref("browser.tabs.firefox-view", false);
user_pref("browser.tabs.firefox-view-next", false);
// hide Firefox Suggest section labels
// [SOURCE: Betterfox] [NOTE: hide "Firefox Suggest" section labels in urlbar dropdown]
user_pref("browser.urlbar.groupLabels.enabled", false);
// show real URL on search results pages
// [SOURCE: Arkenfox] [NOTE: show real URL on search-results pages, not the typed search query]
user_pref("browser.urlbar.showSearchTerms.enabled", false);

// Kill every URL-bar suggestion category
user_pref("browser.urlbar.suggest.addons", false);
// disable QuickSuggest
// [1] https://blog.mozilla.org/data/2021/09/15/data-and-firefox-suggest/
// [SOURCE: cachyos-firefox-settings] [NOTE: QuickSuggest master switch + sponsored/nonsponsored off]
user_pref("browser.urlbar.quicksuggest.enabled", false);
user_pref("browser.urlbar.suggest.quicksuggest.fakespot", false);
user_pref("browser.urlbar.suggest.quicksuggest.nonsponsored", false);
user_pref("browser.urlbar.suggest.quicksuggest.sponsored", false);
user_pref("browser.urlbar.suggest.quicksuggest.topsites", false);
user_pref("browser.urlbar.suggest.trending", false);
// disable Important Dates urlbar suggestion
// [SOURCE: Arkenfox] [NOTE: disable Important Dates urlbar suggestion (privacy; not a needed feature)]
user_pref("browser.urlbar.importantDates.featureGate", false);
// disable stock-market urlbar suggestion
// [SOURCE: Arkenfox] [NOTE: disable stock-market urlbar suggestion (privacy; not a needed feature)]
user_pref("browser.urlbar.market.featureGate", false);
// disable Yelp realtime urlbar suggestion
// [SOURCE: Arkenfox] [NOTE: disable Yelp realtime urlbar suggestion (privacy; not a needed feature)]
user_pref("browser.urlbar.yelpRealtime.featureGate", false);
// disable trending urlbar suggestions
// [SOURCE: Arkenfox + Betterfox] [NOTE: disable trending urlbar suggestions (noise + extra network requests)]
user_pref("browser.urlbar.trending.featureGate", false);

// Separately configurable private-window search engine
// [SOURCE: Arkenfox + Betterfox] [NOTE: show per-window search-engine picker in search settings]
user_pref("browser.search.separatePrivateDefault.ui.enabled", true);

// Fullscreen transitions are instant in a tiling WM
// [SOURCE: Betterfox] [NOTE: remove fullscreen entry fade animation (instant; default 200ms)]
user_pref("full-screen-api.transition-duration.enter", "0 0");
// remove fullscreen exit fade animation
// [SOURCE: Betterfox] [NOTE: remove fullscreen exit fade animation (instant; default 200ms)]
user_pref("full-screen-api.transition-duration.leave", "0 0");
// suppress fullscreen warning overlay
// [SOURCE: Betterfox] [NOTE: suppress fullscreen warning overlay (default 3s popup; set 1250 if concerned)]
user_pref("full-screen-api.warning.timeout", 0);

// Open PDF attachments inline
// [SOURCE: Betterfox] [NOTE: open PDF attachments in-browser instead of downloading to temp]
user_pref("browser.download.open_pdf_attachments_inline", true);
// keep bookmarks menu open after middle-click
// [SOURCE: Betterfox] [NOTE: keep bookmarks menu open after middle-click opening a bookmark]
user_pref("browser.bookmarks.openInTabClosesMenu", false);

// Find bar highlights all matches by default
// [SOURCE: Betterfox] [NOTE: turn on "Highlight All" matches in find bar by default]
user_pref("findbar.highlightAll", true);

// Container Tabs for first-party isolation
// [SOURCE: Arkenfox] [NOTE: enable Container Tabs engine (site isolation without separate profiles)]
user_pref("privacy.userContext.enabled", true);
// show Container Tabs UI
// [SOURCE: Arkenfox + Betterfox] [NOTE: show Container Tabs UI (context menu + new-tab button picker)]
user_pref("privacy.userContext.ui.enabled", true);
// Long-press + new tab button opens container picker
user_pref("privacy.userContext.longPressBehavior", 2);
// Mass-Spring-Damper model: a responsive but controlled GTK/Qt-like feel.

// tighten MSD motion-update interval
// [SOURCE: Betterfox] [NOTE: tighten MSD motion-update interval for responsive scroll feel (12ms)]
user_pref("general.smoothScroll.msdPhysics.continuousMotionMaxDeltaMS", 12);
// enable MSD physics scrolling
// [SOURCE: Betterfox] [NOTE: enable mass-spring-damper physics scrolling (more natural than step-based)]
user_pref("general.smoothScroll.msdPhysics.enabled", true);
user_pref("general.smoothScroll.msdPhysics.motionBeginSpringConstant", 200);
user_pref("general.smoothScroll.msdPhysics.regularSpringConstant", 250);
// start momentum-deceleration updates sooner
// [SOURCE: Betterfox] [NOTE: start momentum-deceleration updates sooner for faster scroll dampening]
user_pref("general.smoothScroll.msdPhysics.slowdownMinDeltaMS", 25);
user_pref("general.smoothScroll.msdPhysics.slowdownMinDeltaRatio", "2.0");
// moderate slowdown spring tension
// [SOURCE: Betterfox] [NOTE: moderate slowdown spring tension for controlled momentum fade]
user_pref("general.smoothScroll.msdPhysics.slowdownSpringConstant", 250);
user_pref("general.smoothScroll.currentVelocityWeighting", "1.0");
user_pref("general.smoothScroll.stopDecelerationWeighting", "1.0");
// boost scroll-wheel speed to 3x
// [SOURCE: Betterfox] [NOTE: boost scroll-wheel speed to 3x (default 100; tune to preference)]
user_pref("mousewheel.default.delta_multiplier_y", 300);

// Experimental CSS Masonry layout engine
user_pref("layout.css.grid-template-masonry-value.enabled", true);

// Do not search for clipboard content on accidental middle-click
// [SOURCE: Arkenfox] [NOTE: disable middle-click clipboard search]
user_pref("browser.tabs.searchclipboardfor.middleclick", false);
