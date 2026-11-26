/**
 * SonarX DebrisGuard - High-Performance Service Worker (v5 High-Perf Engine)
 * Team SonarX | Bennett University
 * Instant resume after minimize, zero-lag asset serving, and resilient offline cache.
 */

const CACHE_NAME = 'sonarx-debrisguard-v5-highperf';
const CORE_ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/audio_fx.js',
  './js/sonar_renderer.js',
  './js/satellite_tracker.js',
  './js/map_module.js',
  './js/telemetry.js',
  './js/inspector.js',
  './js/oceanai_bot.js',
  './js/ml_analytics.js',
  './js/app.js',
  './manifest.json',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/qrcode.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        CORE_ASSETS.map((asset) =>
          cache.add(asset).catch((err) => {
            console.warn('[SonarX SW] Precache note for:', asset, err);
          })
        )
      );
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SonarX SW] Purged outdated cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Network first for dynamic API calls with offline fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request).then((cached) => {
          if (cached) return cached;
          return new Response(JSON.stringify({ status: 'offline', message: 'Local cache active' }), {
            headers: { 'Content-Type': 'application/json' }
          });
        });
      })
    );
    return;
  }

  // Stale-while-revalidate for static assets (instant load + background refresh)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return networkResponse;
      }).catch(() => {
        // Fallback for navigation requests
        if (event.request.headers.get('accept')?.includes('text/html')) {
          return caches.match('./index.html');
        }
      });

      return cachedResponse || fetchPromise;
    })
  );
});
