// =============================================================================
// YuzuFox — Per-Profile Tuning (installed to <profile>/user.js)
// =============================================================================
// This file is installed as a per-profile preference override via
//   <profile>/user.js
//
// It is deliberately limited to what THIS profile needs:
//   - privacy / security hardening
//   - UI / QoL
//
// Anything that EVERY profile on the machine needs (telemetry removal,
// hardware acceleration + performance tuning, Mozilla bloat removal) lives
// in the system-wide `yuzu.js` (see install.sh, install.ps1).
// Prefs in this file are NOT locked: they follow the profile and stay
// tunable. Do not duplicate a pref here if it also appears in yuzu.js —
// locked wins and the per-profile file would silently lose.
//
// Curated like Betterfox: no RFP, no JIT-off, no DRM-off — nothing that
// breaks sites. Maintained like Arkenfox: a read-only, safe-by-default
// template for a workstation with system DNS + uBlock Origin.
//
// DNS stays with your system resolver — no DoH, browser.trr.* untouched.
// Search engines are set system-wide via policies.json, not here.
// =============================================================================
