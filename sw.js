const CACHE = 'planner-v13';

// Telepítéskor csak az ikonokat és manifest-et mentjük
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll([
      './icon-192.png',
      './icon-512.png',
      './manifest.json'
    ]))
  );
  // Azonnal átveszi az irányítást, nem vár a régi SW leállására
  self.skipWaiting();
});

// Aktiváláskor töröl MINDEN régi cache-t
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => {
        console.log('[SW] Cache törölve:', k);
        return caches.delete(k);
      }))
    ).then(() => self.clients.claim())
  );
});

// Fetch: index.html mindig hálózatról, minden más cache-ből vagy hálózatról
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  
  // index.html: mindig hálózat, cache csak ha offline
  if (url.pathname.endsWith('index.html') || url.pathname.endsWith('/')) {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }
  
  // Minden más: cache first
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      });
    })
  );
});
