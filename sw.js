const CACHE_NAME = 'lens-v11';
const BASE = '/L.E.N.S.';
const PRECACHE_URLS = [
  BASE + '/',
  BASE + '/index.html',
  BASE + '/manifest.json',
  BASE + '/favicon.ico',
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
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') return response;
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      });
    })
  );
});
