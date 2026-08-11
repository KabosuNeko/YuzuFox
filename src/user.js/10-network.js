// -----------------------------------------------------------------------------
// NETWORK — CONNECTION BEHAVIOR
// -----------------------------------------------------------------------------
// HTTP/3 0-RTT, speculative connections, DNS prefetch, and WebRTC exposure.
// Nothing here is a privacy policy — every pref controls when and where
// Firefox opens a connection without the user asking.

// QUIC 0-RTT (HTTP/3) — same replay weakness as TLS 0-RTT
user_pref("network.http.http3.enable_0rtt", false);

// disable DNS prefetching
// [SOURCE: Arkenfox + Betterfox] [NOTE: DNS prefetch leaks browsed domains to the resolver]
user_pref("network.dns.disablePrefetch", true);
// disable DNS prefetch from HTTPS pages
// [SOURCE: Arkenfox + Betterfox] [NOTE: DNS prefetch from HTTPS pages leaks domain info]
user_pref("network.dns.disablePrefetchFromHTTPS", true);
// disable link-mouseover pre-connections
// [SOURCE: Arkenfox + Betterfox] [NOTE: prevent silent pre-connections on link mouseover]
user_pref("network.http.speculative-parallel-limit", 0);
// disable link prefetching
// [SOURCE: Arkenfox + Betterfox] [NOTE: block speculative page prefetch via link tags]
user_pref("network.prefetch-next", false);
// disable the network predictor
// [SOURCE: Arkenfox] [NOTE: predictor learns browsing patterns; leaks habits]
user_pref("network.predictor.enabled", false);
// disable predictor prefetch
// [SOURCE: Arkenfox] [NOTE: predictor-initiated prefetch leaks future intent]
user_pref("network.predictor.enable-prefetch", false);
// disable urlbar speculative connections
// [SOURCE: Arkenfox + Betterfox] [NOTE: urlbar pre-connects to autofill candidates]
user_pref("browser.urlbar.speculativeConnect.enabled", false);
// disable bookmarks/history speculative connections
// [SOURCE: Arkenfox + Betterfox] [NOTE: bookmarks/history pre-connections on mousedown]
user_pref("browser.places.speculativeConnect.enabled", false);
// expose only the public IP via WebRTC
// [SOURCE: Arkenfox] [NOTE: WebRTC local-IP leak prevention]
user_pref("media.peerconnection.ice.default_address_only", true);
