const CACHE_NAME = 'lens-v30';
const BASE = '/L.E.N.S.';

const PRECACHE_URLS = [
  BASE + '/',
  BASE + '/index.html',
  BASE + '/manifest.json',
  BASE + '/favicon.ico',
  BASE + '/legacy-v4.html',

  BASE + '/v5/index.html',
  BASE + '/v5/lens-v5.css',
  BASE + '/v5/lens-v5.js',
  BASE + '/v5/lens-v5-runner.css',
  BASE + '/v5/lens-v5-runner.js',
  BASE + '/v5/offline-library.js',
  BASE + '/v5/tether-tinker-bridge.js',
  BASE + '/v5/tether-tinker.html',
  BASE + '/v5/tether-tinker.css',
  BASE + '/v5/tether-tinker.js',
  BASE + '/v5/tether-speed.js',

  BASE + '/assets/banner/LENS_banner_no_theme.webp',
  BASE + '/assets/banner/LENS_banner_no_theme_mobile.webp',
  BASE + '/assets/buttons/01_OTDR_NOTE_MAKER_normal.svg',
  BASE + '/assets/buttons/01_OTDR_NOTE_MAKER_hover.svg',
  BASE + '/assets/buttons/02_RESULTS_CORRECTOR_normal.svg',
  BASE + '/assets/buttons/02_RESULTS_CORRECTOR_hover.svg',
  BASE + '/assets/buttons/03_DISTANCE_CONVERTER_normal.svg',
  BASE + '/assets/buttons/03_DISTANCE_CONVERTER_hover.svg',
  BASE + '/assets/buttons/04_FIBER_RIBBON_FINDER_normal.svg',
  BASE + '/assets/buttons/04_FIBER_RIBBON_FINDER_hover.svg',
  BASE + '/assets/buttons/05_FIBER_LOSS_CALCULATOR_normal.svg',
  BASE + '/assets/buttons/05_FIBER_LOSS_CALCULATOR_hover.svg',
  BASE + '/assets/buttons/06_ACE_FIRE_TOOL_normal.svg',
  BASE + '/assets/buttons/06_ACE_FIRE_TOOL_hover.svg',
  BASE + '/assets/rail/classic-rail-frame.svg',
  BASE + '/assets/rail/mobile-logo.svg',
  BASE + '/assets/icons/home.svg',
  BASE + '/assets/icons/dashboard.svg',
  BASE + '/assets/icons/workspace.svg',
  BASE + '/assets/icons/tools.svg',
  BASE + '/assets/icons/reference.svg',
  BASE + '/assets/icons/documents.svg',
  BASE + '/assets/icons/history.svg',
  BASE + '/assets/icons/settings.svg',
  BASE + '/assets/svg/lens-core-icon-outline.svg',
  BASE + '/assets/svg/lens-core-icon.svg',
  BASE + '/assets/svg/lens-core-icon-maskable.svg',
  BASE + '/assets/png/apple-touch-icon.png',
  BASE + '/assets/png/icon-192x192.png',
  BASE + '/assets/png/icon-512x512.png',
  BASE + '/assets/png/maskable-icon-192x192.png',
  BASE + '/assets/png/maskable-icon-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();

    const windows = await self.clients.matchAll({type:'window', includeUncontrolled:true});
    await Promise.all(windows.map(client => {
      try {
        const url = new URL(client.url);
        const isRoot = url.pathname === BASE + '/' || url.pathname === BASE + '/index.html';
        if(isRoot) return client.navigate(BASE + '/').catch(() => null);
      } catch (_) {}
      return null;
    }));
  })());
});

self.addEventListener('fetch', event => {
  if(event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if(url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        if(response && response.status === 200 && response.type === 'basic'){
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(event.request, {ignoreSearch:true});
        if(cached) return cached;
        if(event.request.mode === 'navigate'){
          return caches.match(BASE + '/index.html');
        }
        return new Response('Offline', {status:503, statusText:'Offline'});
      })
  );
});
