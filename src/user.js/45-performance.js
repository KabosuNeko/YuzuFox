// -----------------------------------------------------------------------------
// PERFORMANCE — RAM-ONLY CACHE (SSD PROTECTION)
// -----------------------------------------------------------------------------
// Every cache lives exclusively in memory. Disk cache is disabled to eliminate
// write wear on the SSD and keep all I/O as fast as RAM permits.

// [SOURCE: Betterfox] [NOTE: RAM-only cache and JIT/GC tuning for responsiveness]
user_pref("browser.cache.disk.enable", false);
user_pref("browser.cache.memory.capacity", 1048576);
// [SOURCE: Both] [NOTE: audited against upstream user.js]
user_pref("browser.privatebrowsing.forceMediaMemoryCache", true);
user_pref("media.memory_cache_max_size", 1048576);
user_pref("media.memory_caches_combined_limit_kb", 3145728);

// Cap video read-ahead so a single long-running video cannot monopolise RAM.
// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("media.cache_readahead_limit", 3600);
// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("media.cache_resume_threshold", 1800);

// Decoded image cache: 10 MB pool with 32 KB decode chunks.
user_pref("image.cache.size", 10485760);
// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("image.mem.decode_bytes_at_a_time", 32768);
user_pref("image.mem.shared.unmap.min_expiration_ms", 120000);

// Network buffers and TLS token cache.
// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("network.buffer.cache.size", 65535);
// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("network.buffer.cache.count", 48);
user_pref("network.ssl_tokens_cache_capacity", 32768);

// Unload inactive tabs under memory pressure.
user_pref("browser.tabs.unloadOnLowMemory", true);
// -----------------------------------------------------------------------------
// PERFORMANCE — RENDERING, JAVASCRIPT JIT & GC
// -----------------------------------------------------------------------------

// Canvas2D acceleration cache tuning (Figma, Observable etc.).
user_pref("gfx.canvas.accelerated.cache-items", 32768);
// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("gfx.canvas.accelerated.cache-size", 512);
// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("gfx.content.skia-font-cache-size", 20);

// Lower Baseline JIT threshold (100 -> 50): warm functions compile sooner.
// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("javascript.options.baselinejit.threshold", 50);

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
user_pref("network.http.pacing.requests.enabled", false);
// [SOURCE: Betterfox] [NOTE: audited against upstream user.js]
user_pref("network.http.request.max-start-delay", 5);
