#!/usr/bin/env python3
"""
Checks every listing against Play's field limits before anything is pushed.

Play validates the whole request, so one field a single character over the cap
rejects the entire update — and the error names the field but not the locale,
which is unhelpful when seven of them go up at once. Run this first.

    python3 check.py
"""
import json
import pathlib
import sys

# Play's caps. The title's 30 is the one that actually bites.
LIMITS = {"title": 30, "shortDescription": 80, "fullDescription": 4000}


def utf16len(text: str) -> int:
    """How Play counts. An emoji outside the BMP is two units, not one, so
    Python's len() quietly under-reports exactly the characters most likely to
    push a title over the edge."""
    return len(text.encode("utf-16-le")) // 2


def main() -> int:
    here = pathlib.Path(__file__).parent
    failures = 0

    for path in sorted(here.glob("*.json")):
        listing = json.loads(path.read_text(encoding="utf-8"))
        print(f"\n{path.stem}")
        for field, limit in LIMITS.items():
            value = listing.get(field)
            if value is None:
                print(f"  {field:<16} MISSING")
                failures += 1
                continue
            length = utf16len(value)
            over = length > limit
            flag = f"OVER BY {length - limit}" if over else "ok"
            print(f"  {field:<16} {length:>5}/{limit:<5} {flag}")
            failures += over

    print()
    if failures:
        print(f"{failures} problem(s) — fix before publishing.")
        return 1
    print("All listings are within Play's limits.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
