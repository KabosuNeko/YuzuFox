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
// [SOURCE: Both] [NOTE: audited against upstream user.js]
user_pref("security.ssl.treat_unsafe_negotiation_as_broken", true);

// TLS 1.3 0-RTT is not forward secret and allows replay attacks.
// [SOURCE: Both] [NOTE: audited against upstream user.js]
user_pref("security.tls.enable_0rtt_data", false);

// Show expert bad-cert pages immediately when debugging TLS.
// [SOURCE: Both] [NOTE: audited against upstream user.js]
user_pref("browser.xul.error_pages.expert_bad_cert", true);

// Poll Remote Settings (CRLite filters + others) more often so revocation
// data arrives promptly.
user_pref("services.settings.poll_interval", 300);
// -----------------------------------------------------------------------------
// PRIVACY — SEVER ALL BACKGROUND / SPECULATIVE CONNECTIONS
// -----------------------------------------------------------------------------
// No speculative networking of any kind. Every connection is user-initiated.

// [SOURCE: Both] [NOTE: audited against upstream user.js]
user_pref("network.dns.disablePrefetch", true);
// [SOURCE: Both] [NOTE: audited against upstream user.js]
user_pref("network.dns.disablePrefetchFromHTTPS", true);
// [SOURCE: Both] [NOTE: audited against upstream user.js]
user_pref("network.http.speculative-parallel-limit", 0);
// [SOURCE: Both] [NOTE: audited against upstream user.js]
user_pref("network.prefetch-next", false);
// [SOURCE: Arkenfox] [NOTE: audited against upstream user.js]
user_pref("network.predictor.enabled", false);
// [SOURCE: Arkenfox] [NOTE: audited against upstream user.js]
user_pref("network.predictor.enable-prefetch", false);
// [SOURCE: Both] [NOTE: audited against upstream user.js]
user_pref("browser.urlbar.speculativeConnect.enabled", false);
// [SOURCE: Both] [NOTE: audited against upstream user.js]
user_pref("browser.places.speculativeConnect.enabled", false);
