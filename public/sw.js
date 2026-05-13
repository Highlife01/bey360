const CACHE_NAME = 'bey360-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logos/logo_icon.png',
  '/logos/logo_branding.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
