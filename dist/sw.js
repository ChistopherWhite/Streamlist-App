/*
  StreamList service worker.

  Strategy:
  - App shell (the HTML page, manifest, icons) is pre-cached on install
    so the app can still open when there's no network connection.
  - Other same-origin GET requests (the built JS/CSS bundles, fonts,
    etc.) use a cache-first strategy: serve from cache instantly if
    present, and store a copy of anything fetched from the network for
    next time.
  - Requests to TMDB (api.themoviedb.org / image.tmdb.org) are never
    cached here — search results and poster art should always reflect
    what TMDB currently has, not a stale snapshot.
  - Bumping CACHE_VERSION invalidates every previously cached file the
    next time the service worker activates.
*/

const CACHE_VERSION = "streamlist-v1";

const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

const NEVER_CACHE_HOSTS = ["api.themoviedb.org", "image.tmdb.org"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_VERSION)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle GET requests — POST/PUT/etc. should always hit the network.
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Never intercept TMDB API/image traffic; let it go straight through.
  if (NEVER_CACHE_HOSTS.includes(url.hostname)) return;

  // Only handle same-origin requests otherwise.
  if (url.origin !== self.location.origin) return;

  // Navigations (loading the page itself): try the network first so
  // users get the latest build when online, falling back to the
  // cached shell when offline.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match("/index.html"))
    );
    return;
  }

  // Everything else same-origin: cache-first, filling the cache with
  // whatever gets fetched so the next load is instant and offline-safe.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});
