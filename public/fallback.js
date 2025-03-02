// This script will be used when we're offline and need to show a fallback

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

const FALLBACK_HTML_URL = "/offline";

self.addEventListener("fetch", (event) => {
  // We only want to provide a fallback for HTML documents
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(FALLBACK_HTML_URL);
      })
    );
  }
});
