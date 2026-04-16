// Service Worker - NO cache, mindig hálózatról
const VERSION = 'v15';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Minden kérést hálózatról tölt, nincs cache
self.addEventListener('fetch', e => {
  e.respondWith(fetch(e.request));
});
