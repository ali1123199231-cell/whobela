#!/usr/bin/env python3
"""Upload an Android App Bundle to Play and put it on a track.

    python3 release.py --aab build.aab --track internal
    python3 release.py --aab build.aab --track production --rollout 0.1
    python3 release.py --promote internal --to production          # no upload

Uses the same service account and self-signed JWT as listings/publish.py, so
there is nothing to install and no eas.json change: `eas submit` would want a
Google service-account key path written into the repo, and the key already
works here.

Needs "Release apps to testing tracks" (internal/alpha/beta) or "Release to
production" on com.whobela.app — separate from the "Manage store presence"
grant the listings use.
"""
import argparse
import json
import pathlib
import sys
import urllib.error
import urllib.request

sys.path.insert(0, str(pathlib.Path(__file__).parent / "listings"))
import importlib.util

_spec = importlib.util.spec_from_file_location(
    "publish", pathlib.Path(__file__).parent / "listings" / "publish.py"
)
_publish = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_publish)

PACKAGE = _publish.PACKAGE
API = _publish.API
UPLOAD = "https://androidpublisher.googleapis.com/upload/androidpublisher/v3"
call = _publish.call


def upload_bundle(token: str, edit_id: str, aab: pathlib.Path) -> int:
    """Resumable-upload the .aab and return its versionCode.

    Not uploadType=media: a bundle is ~65 MB and pushing that as one POST body
    had Google close the connection without a response every time. The
    resumable protocol asks first and transfers second, so the size is agreed
    before any bytes move.
    """
    size = aab.stat().st_size

    # Step 1 — open a session. Empty body; the headers describe what follows.
    start = urllib.request.Request(
        f"{UPLOAD}/applications/{PACKAGE}/edits/{edit_id}/bundles?uploadType=resumable",
        data=b"",
        method="POST",
        headers={
            "Authorization": "Bearer " + token,
            "Content-Length": "0",
            "X-Upload-Content-Type": "application/octet-stream",
            "X-Upload-Content-Length": str(size),
        },
    )
    try:
        with urllib.request.urlopen(start, timeout=120) as response:
            session_uri = response.headers["Location"]
    except urllib.error.HTTPError as failure:
        raise SystemExit(f"could not start upload: HTTP {failure.code}: {failure.read().decode()[:400]}")
    if not session_uri:
        raise SystemExit("upload session opened but returned no Location header")

    # Step 2 — send the bytes in chunks. One 65 MB PUT also had the connection
    # closed on us; chunking keeps each request small enough to survive, and
    # is the case the resumable protocol actually exists for. The chunk size
    # must be a multiple of 256 KB, which is Google's requirement, not ours.
    chunk_size = 8 * 1024 * 1024
    sent = 0
    with aab.open("rb") as handle:
        while sent < size:
            chunk = handle.read(chunk_size)
            last = sent + len(chunk)
            transfer = urllib.request.Request(
                session_uri,
                data=chunk,
                method="PUT",
                headers={
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/octet-stream",
                    "Content-Length": str(len(chunk)),
                    "Content-Range": f"bytes {sent}-{last - 1}/{size}",
                },
            )
            try:
                with urllib.request.urlopen(transfer, timeout=600) as response:
                    # Only the final chunk answers 200 with the bundle JSON.
                    return int(json.loads(response.read())["versionCode"])
            except urllib.error.HTTPError as failure:
                # 308 "Resume Incomplete" is the success case for every chunk
                # but the last, and urllib insists on raising it as an error.
                if failure.code != 308:
                    raise SystemExit(
                        f"upload failed at byte {sent}: HTTP {failure.code}: "
                        f"{failure.read().decode()[:400]}"
                    )
                # Trust the server's own idea of how much it kept.
                confirmed = failure.headers.get("Range")
                sent = int(confirmed.split("-")[1]) + 1 if confirmed else last
                print(f"  {sent / size:.0%}", end="\r", flush=True)

    raise SystemExit("upload finished without Play returning a versionCode")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--aab", type=pathlib.Path, help="bundle to upload")
    parser.add_argument("--track", default="internal", help="track to release on")
    parser.add_argument("--promote", help="take the version already on this track")
    parser.add_argument("--to", help="and put it on this track")
    parser.add_argument("--rollout", type=float, help="staged fraction, e.g. 0.1")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    token = _publish.access_token()
    edit_id = call(token, "POST", f"/applications/{PACKAGE}/edits", {})["id"]
    print(f"edit {edit_id} opened")

    try:
        if args.promote:
            source = call(token, "GET", f"/applications/{PACKAGE}/edits/{edit_id}/tracks/{args.promote}")
            releases = source.get("releases") or []
            if not releases:
                raise SystemExit(f"nothing on the {args.promote} track to promote")
            version_codes = releases[0]["versionCodes"]
            target = args.to or "production"
            print(f"promoting {version_codes} from {args.promote} to {target}")
        else:
            if not args.aab:
                raise SystemExit("give --aab or --promote")
            print(f"uploading {args.aab.name} ({args.aab.stat().st_size / 1e6:.1f} MB)...")
            version_codes = [upload_bundle(token, edit_id, args.aab)]
            print(f"uploaded versionCode {version_codes[0]}")
            target = args.track

        release = {"versionCodes": [str(v) for v in version_codes]}
        if args.rollout is not None and 0 < args.rollout < 1:
            release["status"] = "inProgress"
            release["userFraction"] = args.rollout
        else:
            release["status"] = "completed"

        if args.dry_run:
            print("dry run — rolling the edit back")
            call(token, "DELETE", f"/applications/{PACKAGE}/edits/{edit_id}")
            print(json.dumps({"track": target, "release": release}, indent=2))
            return

        call(token, "PUT", f"/applications/{PACKAGE}/edits/{edit_id}/tracks/{target}",
             {"track": target, "releases": [release]})
        print(f"staged on {target}: {release['status']}"
              + (f" at {release['userFraction']:.0%}" if "userFraction" in release else ""))
        call(token, "POST", f"/applications/{PACKAGE}/edits/{edit_id}:validate")
        print("validated")
        call(token, "POST", f"/applications/{PACKAGE}/edits/{edit_id}:commit")
        print(f"committed — versionCode {version_codes} is on {target}")
    except BaseException:
        # An abandoned edit blocks the next release, so always try to clean up.
        # Deliberately BaseException: a dropped upload raises RemoteDisconnected,
        # not SystemExit, and the first version of this leaked an edit that way.
        try:
            call(token, "DELETE", f"/applications/{PACKAGE}/edits/{edit_id}")
            print(f"edit {edit_id} rolled back")
        except SystemExit:
            print(f"edit {edit_id} left open — delete it in the Console")
        raise


if __name__ == "__main__":
    main()
