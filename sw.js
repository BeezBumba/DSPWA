const CACHE_NAME = "ds-anywhere-cache-v1";

const ASSETS = [
  "/",                           // root
  "/index.html",

  // Assets from your HTML
  "/assets/index-CTXUo8vA.js",
  "/assets/index-CqXIiIDh.css",

  // Static scripts
  "/static/wasmemulator.js",
  "/static/wasmemulator.wasm"
  "/static/webmelon.js",

  // Add sw.js itself (optional but recommended)
  "/sw.js"
];

// Install: cache everything
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: remove old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: network first, fallback to cache
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Save fresh copy to cache
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, clone);
        });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
