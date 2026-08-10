// Digital Asset Links — the proof that whobela.com and the Android app are the
// same publisher.
//
// The Play build is a Trusted Web Activity: it renders this site inside Chrome
// rather than a WebView. Chrome only drops the URL bar once it has fetched this
// file and found the running app's signing certificate listed here. A missing or
// wrong fingerprint doesn't break the app — it silently degrades it into a
// browser tab with an address bar, which is the single most common way a TWA
// ships looking broken.
//
// Two fingerprints, and both are needed:
//   1. the upload key (android/keystore/upload-keystore.jks), which signs what
//      we send to Play and what we sideload onto a test device;
//   2. the Play App Signing key, which Google re-signs the app with before it
//      reaches real devices. It only exists once the first bundle is uploaded,
//      and is read from Play Console → Test and release → App integrity.
//
// Keeping both means the sideloaded APK and the Play install are each verified.
export const dynamic = "force-static";

const PACKAGE_NAME = "com.whobela.app";

const SHA256_CERT_FINGERPRINTS = [
  // Upload key, generated 2026-08-10. Rotating the keystore means editing this.
  "C0:46:D1:59:7D:71:2C:5B:27:1A:F9:75:7D:66:40:3C:B1:66:72:41:BF:0C:C3:37:41:93:F8:05:1D:9E:11:4D",
];

export function GET() {
  const body = [
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: PACKAGE_NAME,
        sha256_cert_fingerprints: SHA256_CERT_FINGERPRINTS,
      },
    },
  ];

  return new Response(JSON.stringify(body, null, 2), {
    headers: { "Content-Type": "application/json" },
  });
}
