import type { MetadataRoute } from "next";

// start_url is the editor, not the dashboard. This manifest is also what the
// Play Store build (a Trusted Web Activity wrapping this site) launches into,
// so the first screen after install belongs to someone who has never signed in:
// /create lets them build a real invitation immediately and asks for an account
// only when they want to keep it. /create bounces anyone already signed in
// straight to their own page, so returning users lose nothing by it.
//
// The ?source=twa marker is what the site reads to tell an app launch from a
// browser visit — it's how the Play badge knows to hide itself inside the app.
export default function manifest(): MetadataRoute.Manifest {
  return {
    // Stable identity for the installed app, independent of start_url. Without
    // it the browser derives the id from start_url, and changing that path
    // would orphan every existing install as a "different" app.
    id: "/",
    name: "Whobela — ask someone out",
    short_name: "Whobela",
    description:
      "Create a personalized date invitation, share the link, and hear back the moment they answer.",
    start_url: "/create?source=twa",
    scope: "/",
    display: "standalone",
    background_color: "#fff1f2",
    theme_color: "#e11d48",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      // Android crops this one to the launcher's shape, so it carries the
      // padding the others don't.
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    // Long-pressing the launcher icon offers these. They're the two things
    // anyone opens this app to do, and they give the Android build genuine app
    // affordances rather than a single web view — which is also what Play's
    // minimum-functionality policy looks for in a site-backed app.
    shortcuts: [
      {
        name: "New invitation",
        short_name: "New",
        description: "Start a date invitation page",
        url: "/create?source=shortcut",
        icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "Who answered",
        short_name: "Inbox",
        description: "See who has replied to your invitation",
        url: "/dashboard/inbox?source=shortcut",
        icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
    ],
  };
}
