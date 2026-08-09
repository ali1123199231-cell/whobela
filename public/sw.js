/*
 * Service worker for the installed app.
 *
 * Deliberately does no caching. A date page's content is edited live and its
 * responses are the whole point of opening the app, so serving a stale copy
 * would be worse than showing the browser's own offline page. The fetch
 * handler exists because an installable PWA must have one; it passes
 * everything straight through.
 */

self.addEventListener("install", () => {
  // Don't sit in "waiting" behind an older worker — there's no cached state to
  // migrate, so a new version may as well take over at once.
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", () => {
  // Intentionally empty: no respondWith, so the network handles it.
});

self.addEventListener("push", (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    // A push with a body we can't parse is still worth surfacing.
  }

  const title = payload.title || "Someone answered your invitation 💌";
  const options = {
    body: payload.body || "Open Whobela to see what they said.",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    tag: payload.tag || "whobela-response",
    data: { url: payload.url || "/dashboard/inbox" },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || "/dashboard/inbox";

  // Reuse an open tab if there is one, so tapping the notification doesn't
  // pile up duplicate windows.
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (new URL(client.url).origin === self.location.origin && "focus" in client) {
          client.navigate(target);
          return client.focus();
        }
      }
      return self.clients.openWindow(target);
    })
  );
});
