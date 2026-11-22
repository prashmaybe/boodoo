// Boodoo Offline Service Worker (Cache-first for assets, Network-first for docs)
const CACHE_NAME = 'boodoo-cache-v1.3.4';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/assets/docs.css',
  '/assets/search.js',
  '/dist/css/boodoo.min.css',
  '/dist/js/boodoo.min.js',
  '/assets/brand/boodoo-icon.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      }).catch(() => {
        // Fallback for offline page requests
        if (event.request.headers.get('accept')?.includes('text/html')) {
          return caches.match('/404.html');
        }
      });
    })
  );
});
