#!/usr/bin/env python3
"""Check YuzuFox prefs and enterprise policies against a Firefox release.

What it verifies, using the Firefox release sources (no browser build needed):

  1. prefs   - every pref in user.js / yuzu.js either exists in the target
               release's default-pref sources or is listed in
               scripts/firefox_pref_allowlist.json (prefs whose default lives in
               C++/JS modules and therefore is not in those files).
  2. renames - prefs that existed in the previous release but are gone from the
               target one (this is how Firefox 157 renamed
               browser.search.separatePrivateDefault.ui.enabled).
  3. policies- policies.json validates against the target's policies schema and
               every policy/property we set is actually implemented in the
               target's Policies.sys.mjs.
  4. drift   - with --require-current-version, fails when a newer Firefox
               release exists than the newest version tag in this repo.

Sources: hg.mozilla.org (mozilla-release, FIREFOX_<ver>_RELEASE tags) and
product-details.mozilla.org. Requires network access.
"""

import argparse
import json
import re
import subprocess
import sys
import urllib.error
import urllib.request
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
HG = "https://hg.mozilla.org/releases/mozilla-release/raw-file/{tag}/{path}"
PRODUCT_DETAILS = "https://product-details.mozilla.org/1.0/firefox_history_major_releases.json"
PRODUCT_VERSIONS = "https://product-details.mozilla.org/1.0/firefox_versions.json"

SOURCES = {
    "all.js": "modules/libpref/init/all.js",
    "firefox.js": "browser/app/profile/firefox.js",
    "StaticPrefList.yaml": "modules/libpref/init/StaticPrefList.yaml",
    "policies-schema.json": "browser/components/enterprisepolicies/schemas/policies-schema.json",
    "Policies.sys.mjs": "browser/components/enterprisepolicies/Policies.sys.mjs",
}

MAX_BYTES = 8 * 1024 * 1024
NIGHTLY_GUARDS = ("NIGHTLY_BUILD", "EARLY_BETA_OR_EARLIER")

SPL_TYPE = {
    "bool": "bool", "AtomicBool": "bool", "RelaxedAtomicBool": "bool",
    "int32_t": "int", "uint32_t": "int", "int64_t": "int", "uint64_t": "int",
    "AtomicInt32": "int", "AtomicUint32": "int", "AtomicInt64": "int", "AtomicUint64": "int",
    "RelaxedAtomicInt32": "int", "RelaxedAtomicUint32": "int", "RelaxedAtomicUint64": "int",
    "float": "float", "AtomicFloat": "float", "RelaxedAtomicFloat": "float",
    "String": "string", "nsCString": "string", "nsString": "string",
    "DataMutexString": "string", "StringEnum": "string",
}

ERRORS = []
WARNINGS = []


def err(msg):
    ERRORS.append(msg)


def warn(msg):
    WARNINGS.append(msg)


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "yuzufox-check"})
    with urllib.request.urlopen(req, timeout=90) as resp:
        data = resp.read(MAX_BYTES + 1)
    if len(data) > MAX_BYTES:
        raise RuntimeError("response too large: %s" % url)
    return data.decode("utf-8", "replace")


def tag_candidates(version):
    parts = version.split(".")
    cands = ["FIREFOX_%s_RELEASE" % "_".join(parts)]
    if len(parts) > 2:
        cands.append("FIREFOX_%s_%s_RELEASE" % (parts[0], parts[1]))
    if len(parts) > 1 and parts[1] != "0":
        cands.append("FIREFOX_%s_0_RELEASE" % parts[0])
    return cands


def fetch_sources(version):
    """Return (tag, {filename: text}) for a Firefox release version."""
    last_error = None
    for tag in tag_candidates(version):
        try:
            return tag, {name: fetch(HG.format(tag=tag, path=path)) for name, path in SOURCES.items()}
        except urllib.error.HTTPError as exc:
            last_error = "%s: HTTP %s" % (tag, exc.code)
        except Exception as exc:  # noqa: BLE001 - network/parse errors are all fatal here
            last_error = "%s: %s" % (tag, exc)
    raise RuntimeError("cannot fetch Firefox %s sources (%s)" % (version, last_error))


def parse_js_prefs(text):
    """pref("name", value) from an all.js/firefox.js style default-pref file."""
    out = {}
    guard = []
    for raw in text.splitlines():
        line = raw.strip()
        if re.match(r"^#\s*(if|ifdef|ifndef)\b", line):
            guard.append(line)
            continue
        if re.match(r"^#\s*endif\b", line):
            if guard:
                guard.pop()
            continue
        if line.startswith("#else"):
            continue
        m = re.match(r'^pref\(\s*"([^"]+)"\s*,\s*(.+?)\s*(?:,\s*(?:locked|sticky)'
                     r'(?:\s*,\s*(?:locked|sticky))?)?\s*\)\s*;', line)
        if m:
            nightly = any(g for g in guard if any(n in g for n in NIGHTLY_GUARDS))
            out.setdefault(m.group(1), {"guard": bool([g for g in guard if not any(n in g for n in NIGHTLY_GUARDS)]),
                                        "nightly": bool(nightly)})
    return out


def parse_static_preflist(text):
    """- name: x  (type/value) entries, release branch only."""
    out = {}
    cur = None
    guard = []
    for raw in text.splitlines():
        line = raw.strip()
        if re.match(r"^#\s*(if|ifdef|ifndef)\b", line):
            guard.append(line)
            continue
        if re.match(r"^#\s*endif\b", line):
            if guard:
                guard.pop()
            continue
        if line.startswith("#else"):
            guard.append("#else")
            continue
        m = re.match(r"^-\s*name:\s*([A-Za-z0-9_.\-]+)\s*$", line)
        if m:
            cur = m.group(1)
            out.setdefault(m.group(1), {"guard": False, "nightly": False})
            continue
        if cur is None:
            continue
        if re.match(r"^type:\s*[A-Za-z0-9_]+", line):
            if "type" not in out[cur]:
                out[cur]["type"] = SPL_TYPE.get(line.split(":", 1)[1].strip(), line.split(":", 1)[1].strip())
            continue
        if re.match(r"^value:", line) and "value" not in out[cur]:
            nightly = any(any(n in g for n in NIGHTLY_GUARDS) for g in guard)
            real_guard = [g for g in guard if not any(n in g for n in NIGHTLY_GUARDS) and g != "#else"]
            if not nightly:
                out[cur]["value"] = True
                out[cur]["guard"] = bool(real_guard)
    return out


def pref_universe(sources):
    universe = {}
    for name, key in (("all.js", "all.js"), ("firefox.js", "firefox.js")):
        for pref, meta in parse_js_prefs(sources[key]).items():
            universe.setdefault(pref, meta)
    for pref, meta in parse_static_preflist(sources["StaticPrefList.yaml"]).items():
        universe.setdefault(pref, meta)
    return universe


def repo_prefs():
    """[(pref, layer)] for user.js and yuzu.js."""
    found = []
    for filename, pattern in (("user.js", r'^\s*user_pref\(\s*"([^"]+)"'),
                              ("yuzu.js", r'^\s*pref\(\s*"([^"]+)"')):
        for line in (REPO / filename).read_text(encoding="utf-8").splitlines():
            m = re.match(pattern + r"\s*,", line)
            if m:
                found.append((m.group(1), filename))
    return found


def load_allowlist():
    path = REPO / "scripts" / "firefox_pref_allowlist.json"
    if not path.exists():
        return {}
    return json.loads(path.read_text(encoding="utf-8")).get("prefs", {})


def check_prefs(target, previous, allowlist):
    target_universe = pref_universe(target)
    previous_universe = pref_universe(previous)
    entries = repo_prefs()
    for pref, layer in sorted(entries):
        if pref in target_universe:
            continue
        if pref in allowlist:
            continue
        if pref in previous_universe:
            err("%s: %s no longer exists in Firefox %s (present in %s) - renamed or removed"
                % (layer, pref, target["version"], previous["version"]))
        else:
            err("%s: %s has no default in Firefox %s sources and is not in "
                "scripts/firefox_pref_allowlist.json" % (layer, pref, target["version"]))
    return len(entries)


class SchemaValidator:
    """Minimal JSON Schema (draft-07 subset) validator for policies.json."""

    def __init__(self, root):
        self.root = root

    def deref(self, schema, depth=0):
        while isinstance(schema, dict) and "$ref" in schema and depth < 20:
            node = self.root
            for part in schema["$ref"][2:].split("/"):
                node = node[part.replace("~1", "/").replace("~0", "~")]
            schema = node
            depth += 1
        return schema

    def check(self, instance, schema, path, out):
        schema = self.deref(schema)
        if not isinstance(schema, dict):
            return
        if "const" in schema and instance != schema["const"]:
            out.append("%s: %r != const %r" % (path, instance, schema["const"]))
            return
        if "enum" in schema and instance not in schema["enum"]:
            out.append("%s: %r not in enum %r" % (path, instance, schema["enum"]))
        if isinstance(instance, dict):
            props = schema.get("properties", {})
            pats = schema.get("patternProperties", {})
            for key, value in instance.items():
                if key in props:
                    self.check(value, props[key], "%s.%s" % (path, key), out)
                else:
                    for pattern, sub in pats.items():
                        if re.search(pattern, key):
                            self.check(value, sub, "%s.%s" % (path, key), out)
                            break
                    else:
                        extra = schema.get("additionalProperties", True)
                        if extra is False:
                            out.append("%s.%s: unknown property (allowed: %s)"
                                       % (path, key, ", ".join(sorted(props)) or "none"))
                        elif isinstance(extra, dict):
                            self.check(value, extra, "%s.%s" % (path, key), out)
            for required in schema.get("required", []):
                if required not in instance:
                    out.append("%s: missing required property %r" % (path, required))
        elif isinstance(instance, list) and isinstance(schema.get("items"), dict):
            for index, value in enumerate(instance):
                self.check(value, schema["items"], "%s[%d]" % (path, index), out)
        if "oneOf" in schema:
            hits = sum(1 for sub in schema["oneOf"] if not self._sub(instance, sub, path))
            if hits != 1:
                out.append("%s: matched %d oneOf branches (need exactly 1)" % (path, hits))
        if "anyOf" in schema:
            if not any(not self._sub(instance, sub, path) for sub in schema["anyOf"]):
                out.append("%s: no anyOf branch matched" % path)

    def _sub(self, instance, schema, path):
        collected = []
        self.check(instance, schema, path, collected)
        return collected


def handler_names(module_text):
    """Top-level policy handler names in Policies.sys.mjs ('Name: {' at 2-space indent)."""
    pattern = r'^\s{2}(?:"([A-Za-z0-9_]+)"|([A-Za-z0-9_]+)):\s*\{\s*$'
    return {a or b for a, b in re.findall(pattern, module_text, re.M)}


# Policies that are implemented outside the generic Policies.sys.mjs handler table.
POLICY_HANDLER_EXEMPT = {
    "3rdparty": "applied through the WebExtension policy bridge, not a named handler",
    "ExtensionSettings": "applied through the WebExtension policy bridge, not a named handler",
}


def check_policies(target):
    policies = json.loads((REPO / "policies.json").read_text(encoding="utf-8"))["policies"]
    schema = json.loads(target["policies-schema.json"])
    validator = SchemaValidator(schema)
    problems = []
    props = schema.get("properties", {})
    for name, value in policies.items():
        if name not in props:
            problems.append("policies.%s: unknown policy in Firefox %s schema" % (name, target["version"]))
            continue
        validator.check(value, props[name], "policies.%s" % name, problems)
    for problem in problems:
        err(problem)

    module = target["Policies.sys.mjs"]
    names = handler_names(module)
    for name, value in policies.items():
        if name in POLICY_HANDLER_EXEMPT:
            continue
        if name not in names:
            err("policies.json: %s has no handler in Firefox %s Policies.sys.mjs - "
                "deprecated or unimplemented policy" % (name, target["version"]))
            continue
        if isinstance(value, dict):
            for key in value:
                if key == "Locked":
                    continue
                # The property must be mentioned somewhere in the policy module; a
                # property that vanished from the implementation stays in the schema
                # for a while (FirefoxHome.Snippets was one of those).
                if not re.search(r'(?<![A-Za-z0-9_])%s(?![A-Za-z0-9_])' % re.escape(key), module):
                    err("policies.json: %s.%s is not referenced anywhere in the Firefox %s "
                        "policy module - vestigial property" % (name, key, target["version"]))
    return len(policies)


def check_version_drift(latest):
    tags = subprocess.run(["git", "tag", "-l"], cwd=REPO, capture_output=True, text=True).stdout.split()
    versions = []
    for tag in tags:
        if re.fullmatch(r"\d+\.\d+(\.\d+)?", tag):
            versions.append(tuple(int(part) for part in tag.split(".")))
    if not versions:
        warn("no version tags found in the repository")
        return
    newest = max(versions)
    latest_tuple = tuple(int(part) for part in latest.split("."))
    if latest_tuple > newest:
        err("Firefox %s is released but the newest YuzuFox tag is %s - re-check the "
            "configuration and cut a new release" % (latest, ".".join(str(p) for p in newest)))
    else:
        print("version drift: newest tag %s >= latest Firefox %s"
              % (".".join(str(p) for p in newest), latest))


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--version", help="Firefox version to check against (default: latest stable)")
    parser.add_argument("--previous", help="previous release to diff against (default: second newest major)")
    parser.add_argument("--require-current-version", action="store_true",
                        help="fail when a newer Firefox release exists than the newest repo tag")
    args = parser.parse_args()

    history = json.loads(fetch(PRODUCT_DETAILS))
    releases = sorted(history, key=lambda v: tuple(int(p) for p in v.split(".")))
    version = args.version or releases[-1]
    previous = args.previous
    if previous is None:
        majors = [v for v in releases if v.endswith(".0")]
        previous = majors[-2] if len(majors) >= 2 else releases[-2]

    print("checking YuzuFox against Firefox %s (previous release: %s)" % (version, previous))
    target_tag, target = fetch_sources(version)
    previous_tag, previous_sources = fetch_sources(previous)
    print("sources: %s (target), %s (previous)" % (target_tag, previous_tag))
    target["version"] = version

    count = check_prefs(target, dict(previous_sources, version=previous), load_allowlist())
    policies = check_policies(target)

    latest = json.loads(fetch(PRODUCT_VERSIONS))["LATEST_FIREFOX_VERSION"]
    if args.require_current_version:
        check_version_drift(latest)
    elif latest != version:
        warn("latest stable Firefox is %s, this run checked %s" % (latest, version))

    print("prefs checked: %d | policies checked: %d" % (count, policies))
    for warning in WARNINGS:
        print("WARN  %s" % warning)
    for error in ERRORS:
        print("ERROR %s" % error)
    if ERRORS:
        print("\n%d error(s): configuration is out of sync with Firefox %s" % (len(ERRORS), version))
        return 1
    print("\nOK: configuration matches Firefox %s" % version)
    return 0


if __name__ == "__main__":
    sys.exit(main())
