// -----------------------------------------------------------------------------
// SECURITY — CERTIFICATE REVOCATION (CRLite only), TLS
// -----------------------------------------------------------------------------
// OCSP is disabled because it leaks visited sites to the CA infrastructure.
// CRLite downloads a compact revocation filter and checks offline; mode 2
// enforces both "Revoked" and "Not Revoked" results.

// [SOURCE: Betterfox] [NOTE: offline CRLite revocation + no speculative connections]
user_pref("security.OCSP.enabled", 0);

// Enforce strict HTTP Public Key Pinning (level 2).
// [SOURCE: Arkenfox] [NOTE: audited against upstream user.js]
user_pref("security.cert_pinning.enforcement_level", 2);

// Require RFC 5746 safe renegotiation; lack of it allows MiTM injection.
// [SOURCE: Arkenfox] [NOTE: audited against upstream user.js]
user_pref("security.ssl.require_safe_negotiation", true);
// [SOURCE: Arkenfox + Betterfox] [NOTE: audited against upstream user.js]
user_pref("security.ssl.treat_unsafe_negotiation_as_broken", true);

// TLS 1.3 0-RTT is not forward secret and allows replay attacks.
// [SOURCE: Arkenfox + Betterfox] [NOTE: audited against upstream user.js]
user_pref("security.tls.enable_0rtt_data", false);

// QUIC 0-RTT (HTTP/3) has the same replay weakness as TLS 0-RTT.
user_pref("network.http.http3.enable_0rtt", false);

// Show expert bad-cert pages immediately when debugging TLS.
// [SOURCE: Arkenfox + Betterfox] [NOTE: audited against upstream user.js]
user_pref("browser.xul.error_pages.expert_bad_cert", true);

// -----------------------------------------------------------------------------
// PRIVACY — SEVER ALL BACKGROUND / SPECULATIVE CONNECTIONS
// -----------------------------------------------------------------------------
// No speculative networking of any kind. Every connection is user-initiated.

// [SOURCE: Arkenfox + Betterfox] [NOTE: audited against upstream user.js]
user_pref("network.dns.disablePrefetch", true);
// [SOURCE: Arkenfox + Betterfox] [NOTE: audited against upstream user.js]
user_pref("network.dns.disablePrefetchFromHTTPS", true);
// [SOURCE: Arkenfox + Betterfox] [NOTE: audited against upstream user.js]
user_pref("network.http.speculative-parallel-limit", 0);
// [SOURCE: Arkenfox + Betterfox] [NOTE: audited against upstream user.js]
user_pref("network.prefetch-next", false);
// [SOURCE: Arkenfox] [NOTE: audited against upstream user.js]
user_pref("network.predictor.enabled", false);
// [SOURCE: Arkenfox] [NOTE: audited against upstream user.js]
user_pref("network.predictor.enable-prefetch", false);
// [SOURCE: Arkenfox + Betterfox] [NOTE: audited against upstream user.js]
user_pref("browser.urlbar.speculativeConnect.enabled", false);
// [SOURCE: Arkenfox + Betterfox] [NOTE: audited against upstream user.js]
user_pref("browser.places.speculativeConnect.enabled", false);
// Only expose the public IP via WebRTC — never the LAN address (192.168.x.x).
// [SOURCE: Arkenfox] [NOTE: WebRTC local-IP leak prevention]
user_pref("media.peerconnection.ice.default_address_only", true);

