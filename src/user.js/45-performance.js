// -----------------------------------------------------------------------------
// PERFORMANCE — RAM-ONLY CACHE (SSD PROTECTION)
// -----------------------------------------------------------------------------
// Every cache lives exclusively in memory. Disk cache is disabled to eliminate
// write wear on the SSD and keep all I/O as fast as RAM permits.

// [SOURCE: Betterfox] [NOTE: RAM-only cache and JIT/GC tuning for responsiveness]
user_pref("browser.cache.disk.enable", false);
// [SOURCE: Betterfox + CachyOS] [NOTE: 1 GB memory cache]
user_pref("browser.cache.memory.capacity", 1048576);
// [SOURCE: Arkenfox + Betterfox] [NOTE: audited against upstream user.js]
user_pref("browser.privatebrowsing.forceMediaMemoryCache", true);
// [SOURCE: CachyOS] [NOTE: media cache stays in RAM, not disk]
user_pref("media.memory_cache_max_size", 1048576);
user_pref("media.memory_caches_combined_limit_kb", 3145728);

// Larger video buffers for machines with RAM to spare.
// [SOURCE: CachyOS] [NOTE: double read-ahead and resume threshold]
user_pref("media.cache_readahead_limit", 7200);
user_pref("media.cache_resume_threshold", 3600);

// Block all autoplay (audio + video); saves CPU/bandwidth on multi-tab sessions.
// Per-site allow via URL bar permission icon.
// [SOURCE: CachyOS] [NOTE: 5 = block all, same as upstream cachyos.js]
user_pref("media.autoplay.default", 5);

// Decoded image cache: 10 MB pool with 64 KB decode chunks.
// [SOURCE: CachyOS] [NOTE: image decode cache tuning]
user_pref("image.cache.size", 10485760);
// [SOURCE: CachyOS] [NOTE: 64 KB decode chunks for faster image rendering]
user_pref("image.mem.decode_bytes_at_a_time", 65536);
user_pref("image.mem.shared.unmap.min_expiration_ms", 120000);

// Network buffers and TLS token cache.
// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("network.buffer.cache.size", 65535);
// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("network.buffer.cache.count", 48);
// [SOURCE: Betterfox + CachyOS] [NOTE: TLS session cache]
user_pref("network.ssl_tokens_cache_capacity", 32768);

// Unload inactive tabs under memory pressure.
// [SOURCE: CachyOS] [NOTE: tab unloading under memory pressure]
user_pref("browser.tabs.unloadOnLowMemory", true);
// -----------------------------------------------------------------------------
// PERFORMANCE — RENDERING, JAVASCRIPT JIT & GC
// -----------------------------------------------------------------------------

// Canvas2D acceleration cache tuning (Figma, Observable etc.).
// [SOURCE: CachyOS] [NOTE: canvas cache items + size for GPU acceleration]
user_pref("gfx.canvas.accelerated.cache-items", 32768);
// [SOURCE: CachyOS] [NOTE: 4 MB canvas cache for GPU-accelerated canvas apps]
user_pref("gfx.canvas.accelerated.cache-size", 4096);
// [SOURCE: CachyOS] [NOTE: 80 MB Skia font cache, faster text rendering]
user_pref("gfx.content.skia-font-cache-size", 80);

// Lower Baseline JIT threshold (100 -> 50): warm functions compile sooner.
// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("javascript.options.baselinejit.threshold", 50);

// Lower Ion JIT threshold (~1000 -> 500): JS hot-path compiles twice as fast.
// [SOURCE: CachyOS] [NOTE: IonMonkey aggressive warm-up, safe on modern hardware]
user_pref("javascript.options.ion.threshold", 500);

// Snappier incremental rendering during slow page loads.
// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("content.notify.interval", 100000);
// -----------------------------------------------------------------------------
// PERFORMANCE — NETWORK FEED WELLS
// -----------------------------------------------------------------------------
// Aggressive-but-safe parallel connection tuning. Harmless today.

// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("network.dnsCacheExpiration", 3600);
// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("network.http.max-connections", 1800);
// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("network.http.max-persistent-connections-per-server", 10);
// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("network.http.max-urgent-start-excessive-connections-per-host", 5);
// [SOURCE: CachyOS] [NOTE: disable request pacing for lower latency]
user_pref("network.http.pacing.requests.enabled", false);
// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("network.http.request.max-start-delay", 5);

// Force HTTP/3 (QUIC) for lower-latency connections where supported.
user_pref("network.http.http3.enable", true);

// Cache more back/forward page states for instant history navigation.
user_pref("browser.sessionhistory.max_total_viewers", 10);
