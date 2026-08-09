import type { MetadataRoute } from "next";

// start_url points at the dashboard rather than the marketing home page: the
// only reason to install this is to manage a page you've already made and to
// hear about responses. Signed-out visitors land on /login from there, which
// is the right destination for them too.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Whobela — ask someone out",
    short_name: "Whobela",
    description:
      "Create a personalized date invitation, share the link, and hear back the moment they answer.",
    start_url: "/dashboard",
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
  };
}
