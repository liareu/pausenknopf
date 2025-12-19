const CACHE_NAME = 'pausenknopf-v2';
const RUNTIME_CACHE = 'pausenknopf-runtime-v2';

// Critical assets to cache immediately on install
const urlsToCache = [
  '/pausenknopf/',
  '/pausenknopf/index.html',
  '/pausenknopf/manifest.json',
  '/pausenknopf/icon-192.png',
  '/pausenknopf/icon-512.png',
  '/pausenknopf/icon.svg'
];

// Install event - cache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - network first with cache fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip cross-origin requests (except fonts)
  if (url.origin !== location.origin && !url.origin.includes('fonts.googleapis.com') && !url.origin.includes('fonts.gstatic.com')) {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Return cached response if available
        if (cachedResponse) {
          return cachedResponse;
        }

        // Otherwise, fetch from network
        return fetch(request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type === 'error') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Cache runtime assets (JS, CSS, images, fonts)
            if (
              url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|woff|woff2)$/) ||
              url.origin.includes('fonts.googleapis.com') ||
              url.origin.includes('fonts.gstatic.com')
            ) {
              caches.open(RUNTIME_CACHE)
                .then((cache) => cache.put(request, responseToCache));
            }

            return response;
          })
          .catch(() => {
            // Return offline page for navigation requests if available
            if (request.destination === 'document') {
              return caches.match('/pausenknopf/index.html');
            }
          });
      })
  );
});
