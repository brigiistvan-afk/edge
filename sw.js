const CACHE = 'planner-v3';
const FILES = [
  './edge.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(FILES))
  );
  self.skipWaiting(); // Ez már ott van nálad
});

self.addEventListener('activate', e => {
  // --- EZT ADD HOZZÁ ---
  self.clients.claim(); 
  // ---------------------
  e.waitUntil(
    caches.keys().then(keys => {
      // Itt jön a régi cache törlése...self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open(CACHE).then((cache) => {
      return cache.match(event.request).then((response) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          // Ha sikeres a hálózati kérés, elmentjük az újat a cache-be
          if (networkResponse.ok) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });
        // Visszaadjuk a cache-t ha van, ha nincs, várjuk meg a hálózatot
        return response || fetchPromise;
      });
    })
  );
});
