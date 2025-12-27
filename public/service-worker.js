/*
  Basic service worker for Vite + React app shell caching.
  - Caches static assets with a cache-first strategy.
  - Leaves updates to be applied on next load (no skipWaiting).
*/

const CACHE_VERSION = 'v1';
const RUNTIME_CACHE = `app-cache-${CACHE_VERSION}`;

// Optionally warm some routes/files
const APP_SHELL = [
  '/',
  '/index.html',
  '/vite.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(RUNTIME_CACHE).then((cache) => cache.addAll(APP_SHELL))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith('app-cache-') && key !== RUNTIME_CACHE)
          .map((key) => caches.delete(key))
      )
    )
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET
  if (request.method !== 'GET') return;

  // Navigation requests: network-first with cache fallback to index.html
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Static assets: cache-first with background update
  const destination = request.destination;
  const isStatic = ['script', 'style', 'image', 'font'].includes(destination);

  if (isStatic) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetchPromise = fetch(request)
          .then((response) => {
            const copy = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
            return response;
          })
          .catch(() => cached);

        return cached || fetchPromise;
      })
    );
  }
});
