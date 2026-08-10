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
// Every certificate the app can legitimately be signed with has to be listed,
// because Play does not ship what we upload: it re-signs each release. Miss one
// and the app still runs, it just quietly grows an address bar.
export const dynamic = "force-static";

const PACKAGE_NAME = "com.whobela.app";

const SHA256_CERT_FINGERPRINTS = [
  // Our upload key (android/keystore/upload-keystore.jks), generated 2026-08-10.
  // Signs what we send to Play and what we sideload onto a test device.
  "C0:46:D1:59:7D:71:2C:5B:27:1A:F9:75:7D:66:40:3C:B1:66:72:41:BF:0C:C3:37:41:93:F8:05:1D:9E:11:4D",

  // Google's, read from Play Console → App signing on 2026-08-10 by downloading
  // the certificates and running `keytool -printcert` over them, rather than
  // copying the strings off the page — these are the values a wrong character
  // in would cost an afternoon to find.
  //
  // deployment_cert: the key Play signs the delivered APK with.
  "69:A4:8C:8F:80:A7:59:40:29:CF:1F:3C:F1:A0:AA:0B:88:D7:19:F6:81:2C:14:EC:02:C8:C8:BE:26:59:CE:68",
  // The app is enrolled in Play's "quantum-ready" signing beta, which can sign
  // with a hybrid pair instead. Both halves are listed so that enrolment (or
  // Google's rollout of it) can't silently break verification.
  "3F:DC:56:84:B7:57:A9:FD:DD:95:36:95:A8:05:E9:2A:85:5C:5A:31:54:16:03:34:F5:EE:18:D6:AD:67:50:10",
  "9A:3F:AB:E3:89:43:D4:3E:BD:A5:C5:CF:BD:FE:D6:9B:46:6C:26:7F:48:AF:D4:E1:73:45:8A:A4:D4:AB:D2:AD",
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
