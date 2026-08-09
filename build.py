#!/usr/bin/env python3
"""Merge src/user.js/*.js into user.js and produce user.js.lock."""

import argparse
import difflib
import filecmp
import json
import re
import sys
import tempfile
from datetime import datetime, timezone
from pathlib import Path


USER_PREF_RE = re.compile(r'^\s*user_pref\(\s*"([^"]+)"\s*,\s*(.*)\)\s*;\s*$')
SOURCE_RE = re.compile(r'\[SOURCE:\s*(.*?)\s*\]')
NOTE_RE = re.compile(r'\[NOTE:\s*(.*?)\s*\]')

HEADER = (
    "// AUTO-GENERATED from src/user.js/*.js — do not edit directly.\n"
    "// Run: python3 build.py\n"
    "//\n"
)


def parse_args(argv=None):
    parser = argparse.ArgumentParser(
        description="Merge src/user.js/*.js into user.js and produce user.js.lock.",
    )
    parser.add_argument(
        "--check",
        action="store_true",
        help="Regenerate to temporary files and verify they match the committed outputs.",
    )
    return parser.parse_args(argv)


def discover_sources(repo_root):
    source_dir = repo_root / "src" / "user.js"
    return sorted(source_dir.glob("*.js"))


def parse_value(raw):
    try:
        return json.loads(raw)
    except json.JSONDecodeError as exc:
        raise ValueError(f"Invalid pref value: {raw!r}") from exc


def parse_sources(sources, repo_root):
    prefs = []
    pref_files = {}
    for src in sources:
        rel = src.relative_to(repo_root).as_posix()
        current_source = "YuzuFox"
        current_note = None
        with src.open("r", encoding="utf-8") as fh:
            for line in fh:
                stripped = line.strip()
                if stripped == "":
                    current_source = "YuzuFox"
                    current_note = None
                    continue
                if stripped.startswith("//"):
                    m = SOURCE_RE.search(stripped)
                    if m:
                        current_source = m.group(1)
                    m = NOTE_RE.search(stripped)
                    if m:
                        current_note = m.group(1)
                    continue
                m = USER_PREF_RE.match(stripped)
                if m:
                    name = m.group(1)
                    value = parse_value(m.group(2))
                    prefs.append({
                        "pref": name,
                        "value": value,
                        "files": [rel],
                        "source": current_source,
                        "note": current_note,
                    })
                    pref_files.setdefault(name, set()).add(rel)
                    current_source = "YuzuFox"
                    current_note = None
                    continue
                current_source = "YuzuFox"
                current_note = None
    return prefs, pref_files


def validate_no_cross_file_duplicates(pref_files):
    dupes = {name: files for name, files in pref_files.items() if len(files) > 1}
    if not dupes:
        return
    print("Error: the following prefs appear in more than one source file:", file=sys.stderr)
    for name in sorted(dupes):
        print(f"  {name}: {', '.join(sorted(dupes[name]))}", file=sys.stderr)
    sys.exit(1)


def generate_user_js(repo_root, sources):
    parts = [HEADER]
    for i, src in enumerate(sources):
        content = src.read_text(encoding="utf-8")
        if i > 0 and not parts[-1].endswith("\n"):
            parts.append("\n")
        parts.append(content)
    return "".join(parts)


def generate_lock(repo_root, sources, prefs):
    for p in prefs:
        p["files"] = sorted(set(p["files"]))
    prefs_sorted = sorted(prefs, key=lambda p: (p["pref"], p["files"]))
    data = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "sources": [s.relative_to(repo_root).as_posix() for s in sources],
        "prefs": prefs_sorted,
    }
    return json.dumps(data, indent=2, sort_keys=True, ensure_ascii=False) + "\n"


def write_outputs(repo_root, user_js, lock):
    (repo_root / "user.js").write_text(user_js, encoding="utf-8")
    (repo_root / "user.js.lock").write_text(lock, encoding="utf-8")


def _read_text(path):
    return path.read_text(encoding="utf-8")


def _lock_without_timestamp(lock_path):
    data = json.loads(lock_path.read_text(encoding="utf-8"))
    data.pop("generated_at", None)
    return json.dumps(data, indent=2, sort_keys=True, ensure_ascii=False) + "\n"


def check_outputs(repo_root, user_js, lock):
    existing_user_js = repo_root / "user.js"
    existing_lock = repo_root / "user.js.lock"

    with tempfile.TemporaryDirectory() as tmpdir:
        tmp = Path(tmpdir)
        tmp_user_js = tmp / "user.js"
        tmp_lock = tmp / "user.js.lock"
        tmp_user_js.write_text(user_js, encoding="utf-8")
        tmp_lock.write_text(lock, encoding="utf-8")

        user_js_ok = (
            existing_user_js.exists()
            and filecmp.cmp(tmp_user_js, existing_user_js, shallow=False)
        )
        lock_ok = False
        if existing_lock.exists():
            try:
                existing_lock_norm = _lock_without_timestamp(existing_lock)
                generated_lock_norm = _lock_without_timestamp(tmp_lock)
                lock_ok = existing_lock_norm == generated_lock_norm
            except (json.JSONDecodeError, OSError):
                lock_ok = False

        if user_js_ok and lock_ok:
            return True

    print("Error: generated outputs do not match committed files.", file=sys.stderr)

    if not user_js_ok:
        existing = _read_text(existing_user_js) if existing_user_js.exists() else ""
        print("\nDiff for user.js:", file=sys.stderr)
        for line in difflib.unified_diff(
            existing.splitlines(keepends=True),
            user_js.splitlines(keepends=True),
            fromfile="committed/user.js",
            tofile="generated/user.js",
        ):
            sys.stderr.write(line)
            if not line.endswith("\n"):
                sys.stderr.write("\n")

    if not lock_ok:
        existing = _read_text(existing_lock) if existing_lock.exists() else ""
        print("\nDiff for user.js.lock:", file=sys.stderr)
        for line in difflib.unified_diff(
            existing.splitlines(keepends=True),
            lock.splitlines(keepends=True),
            fromfile="committed/user.js.lock",
            tofile="generated/user.js.lock",
        ):
            sys.stderr.write(line)
            if not line.endswith("\n"):
                sys.stderr.write("\n")

    return False


def main(argv=None):
    args = parse_args(argv)
    repo_root = Path(__file__).resolve().parent
    sources = discover_sources(repo_root)
    prefs, pref_files = parse_sources(sources, repo_root)
    validate_no_cross_file_duplicates(pref_files)
    user_js = generate_user_js(repo_root, sources)
    lock = generate_lock(repo_root, sources, prefs)
    if args.check:
        return 0 if check_outputs(repo_root, user_js, lock) else 1
    write_outputs(repo_root, user_js, lock)
    return 0


if __name__ == "__main__":
    sys.exit(main())
