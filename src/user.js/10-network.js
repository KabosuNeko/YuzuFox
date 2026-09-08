// -----------------------------------------------------------------------------
// NETWORK
// -----------------------------------------------------------------------------

// [SOURCE: Betterfox] [NOTE: disable HTTP/3 0-RTT]
user_pref("network.http.http3.enable_0rtt", false);

// [SOURCE: Arkenfox + Betterfox] [NOTE: disable DNS prefetching]
user_pref("network.dns.disablePrefetch", true);

// [SOURCE: Arkenfox + Betterfox] [NOTE: disable DNS prefetch from HTTPS pages]
user_pref("network.dns.disablePrefetchFromHTTPS", true);

// [SOURCE: Betterfox] [NOTE: disable link-mouseover speculative connections]
user_pref("network.http.speculative-parallel-limit", 0);

// [SOURCE: Arkenfox + Betterfox] [NOTE: disable link prefetching]
user_pref("network.prefetch-next", false);

// [SOURCE: Betterfox] [NOTE: disable urlbar speculative connections]
user_pref("browser.urlbar.speculativeConnect.enabled", false);

// [SOURCE: Arkenfox + Betterfox] [NOTE: disable bookmarks/history speculative connections]
user_pref("browser.places.speculativeConnect.enabled", false);

// [SOURCE: Arkenfox] [NOTE: expose only public IP via WebRTC]
user_pref("media.peerconnection.ice.default_address_only", true);
