#!/usr/bin/env python3
"""Push Whobela's Play store listings via the Android Publisher API.

    python3 check.py                       # always run this first
    python3 publish.py --dry-run           # show what would change
    python3 publish.py                     # push every locale in this folder
    python3 publish.py --locales de-DE,pl-PL

One JSON file per locale, named for the Play language code. Note those codes
are not uniformly xx-YY — pl-PL and es-419 are qualified, while some languages
Play knows (et, lv, uk) are bare. Name the file exactly what Play calls it.

ACCESS — this will 403 until someone grants it:
  The service account is currently authorised on com.ocroon.app ONLY. For this
  script to work, in Play Console → Users and permissions → Invite new user,
  add the service-account email with "Manage store presence" on com.whobela.app.
  The old Setup → API access page is retired and redirects to the app list;
  "Linked services" is Ads/Firebase/Analytics and is NOT this.

Graphics are not uploaded. Play falls back to the default language's
screenshots and feature graphic, which is what we want.
"""
import argparse
import json
import os
import pathlib
import time
import urllib.error
import urllib.parse
import urllib.request

SA_PATH = os.environ.get("PLAY_SA_JSON", "/home/x/.secrets/ocroon-fcm-service-account.json")
PACKAGE = "com.whobela.app"
API = "https://androidpublisher.googleapis.com/androidpublisher/v3"
HERE = pathlib.Path(__file__).parent
LIMITS = {"title": 30, "shortDescription": 80, "fullDescription": 4000}


def utf16len(text: str) -> int:
    """Play counts UTF-16 code units, not code points."""
    return len(text.encode("utf-16-le")) // 2


def access_token() -> str:
    # PyJWT + cryptography directly: google-auth and gcloud are both absent
    # from this machine and adding them for one signed assertion is not worth it.
    import jwt

    sa = json.loads(pathlib.Path(SA_PATH).read_text())
    now = int(time.time())
    assertion = jwt.encode(
        {
            "iss": sa["client_email"],
            "scope": "https://www.googleapis.com/auth/androidpublisher",
            "aud": "https://oauth2.googleapis.com/token",
            "iat": now,
            "exp": now + 3600,
        },
        sa["private_key"],
        algorithm="RS256",
        headers={"kid": sa["private_key_id"]},
    )
    body = urllib.parse.urlencode(
        {"grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer", "assertion": assertion}
    ).encode()
    request = urllib.request.Request("https://oauth2.googleapis.com/token", data=body)
    return json.load(urllib.request.urlopen(request, timeout=30))["access_token"]


def call(token: str, method: str, path: str, payload=None):
    request = urllib.request.Request(
        API + path,
        data=None if payload is None else json.dumps(payload).encode(),
        method=method,
        headers={"Authorization": "Bearer " + token, "Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            raw = response.read()
            return json.loads(raw) if raw else {}
    except urllib.error.HTTPError as failure:
        detail = failure.read().decode()
        try:
            message = json.loads(detail)["error"]["message"]
        except Exception:
            message = detail[:600]
        if failure.code in (401, 403):
            message += (
                "\n\n  The service account is authorised on com.ocroon.app only."
                "\n  Play Console → Users and permissions → Invite new user →"
                f"\n  {json.loads(pathlib.Path(SA_PATH).read_text())['client_email']}"
                "\n  with 'Manage store presence' on com.whobela.app."
            )
        raise SystemExit(f"\n{method} {path}\n  HTTP {failure.code}: {message}\n")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--locales", help="comma-separated subset, e.g. de-DE,pl-PL")
    args = parser.parse_args()

    wanted = set(args.locales.split(",")) if args.locales else None
    todo = {}
    for path in sorted(HERE.glob("*.json")):
        locale = path.stem
        if wanted and locale not in wanted:
            continue
        listing = json.loads(path.read_text(encoding="utf-8"))
        for field, limit in LIMITS.items():
            length = utf16len(listing[field])
            if length > limit:
                raise SystemExit(f"{locale}: {field} is {length}, limit {limit} — run check.py")
        todo[locale] = listing

    if not todo:
        raise SystemExit("no listings matched")

    print(f"{'would push' if args.dry_run else 'push'} {len(todo)} locale(s)")
    for locale, listing in todo.items():
        print(f"  {locale:8} {listing['title']!r}")
    if args.dry_run:
        return

    token = access_token()
    edit_id = call(token, "POST", f"/applications/{PACKAGE}/edits", {})["id"]
    print(f"edit {edit_id} opened")
    try:
        for locale, listing in todo.items():
            call(
                token,
                "PUT",
                f"/applications/{PACKAGE}/edits/{edit_id}/listings/{locale}",
                {
                    "language": locale,
                    "title": listing["title"],
                    "shortDescription": listing["shortDescription"],
                    "fullDescription": listing["fullDescription"],
                },
            )
            print(f"  staged {locale}")
        call(token, "POST", f"/applications/{PACKAGE}/edits/{edit_id}:validate")
        print("validated")
        call(token, "POST", f"/applications/{PACKAGE}/edits/{edit_id}:commit")
        print(f"committed — {len(todo)} listing(s) live on {PACKAGE}")
    except SystemExit:
        # An abandoned edit blocks the next release, so always try to clean up.
        try:
            call(token, "DELETE", f"/applications/{PACKAGE}/edits/{edit_id}")
            print(f"edit {edit_id} rolled back")
        except SystemExit:
            print(f"edit {edit_id} left open — delete it in the Console if it blocks a release")
        raise


if __name__ == "__main__":
    main()
