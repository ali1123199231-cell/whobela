# Whobela for Android

The native app. Replaces the Bubblewrap TWA in place — same package
(`com.whobela.app`), same Play listing, `versionCode` 2.

## What is native and what is not

Native: sign-in, the answers inbox, contacting whoever said yes, adding the date
to a calendar, settings, notifications.

Not native, on purpose: **the invitation editor** is the existing web UI in a
WebView, and **the public invitation page** is never in the app at all —
recipients don't install anything, which is the whole product. Keeping the
editor on the web means changes to it reach every install immediately, without
a Play review.

## Before this can build

Two credentials are needed and neither is in the repo.

### 1. `google-services.json`

`app.json` points at `./google-services.json`, and **prebuild fails without
it**. Get it by adding an Android app to the existing Firebase project:

1. Firebase console → project **ocroon** → Add app → Android
2. Package name: `com.whobela.app`
3. Download `google-services.json` into this directory

It's gitignored. It carries the FCM sender id and an Android API key — not
secrets in the password sense, but project identifiers that don't belong in a
public repo.

### 2. The server's FCM credentials

The web app sends notifications through FCM's HTTP v1 API and needs a service
account:

1. Firebase console → Project settings → Service accounts → Generate new private key
2. Paste the whole JSON into the `system_config` table under the key
   `FCM_SERVICE_ACCOUNT_JSON`

Until that row exists, `isFcmConfigured()` returns false and notifications
simply don't send — nothing errors, and web push carries on unaffected.

## Development

```sh
npm start              # Metro only
npx expo run:android   # build and install a dev client on a connected device
```

The API base is worked out at runtime: release builds always talk to
whobela.com, development builds derive the LAN address from the Metro
connection, so no IP needs updating when the network changes. Run the Next app
with `npm run dev` in the repo root and it will be found automatically.

`adb` is not on PATH; it lives at
`~/.bubblewrap/android_sdk/platform-tools/adb`.

## Releasing

`android/` is generated from `app.json` by prebuild and is gitignored — edit
`app.json`, never the generated files, or the change disappears on the next
build.

The upload keystore is the one the TWA already uses:
`../android/keystore/upload-keystore.jks`. **Reuse it.** A different key makes
the build unpublishable under this package, and losing it orphans the listing.

Builds go through EAS rather than Gradle here: this machine has ~21 GB free and
7.5 GB of RAM, which local React Native builds do not survive comfortably.

## The update lever

`GET /api/app/config` returns `minVersionCode`. Raise
`APP_MIN_VERSION_CODE` in `system_config` and every older install shows an
update wall on next launch. It is the only way to retire a bad release — a web
deploy is fixed in minutes, an APK sits on phones until someone updates it.
