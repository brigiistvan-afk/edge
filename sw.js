// Service Worker - mindig friss verzió
const CACHE = 'planner-v14';

self.addEventListener('install', e => {
  // Azonnal átveszi, nem vár a régi leállására
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  // Töröl MINDEN régi cache-t
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // MINDIG hálózatról tölt, cache csak ha offline
  e.respondWith(
    fetch(e.request, { cache: 'no-store' })
      .then(res => {
        // Csak ikonokat és manifest-et cache-eljük
        const url = e.request.url;
        if (url.includes('icon-') || url.includes('manifest')) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
