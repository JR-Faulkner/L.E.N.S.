const CACHE_NAME = 'lens-v6';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/banner/LENS_banner_no_theme.webp',
  '/assets/banner/LENS_banner_no_theme_mobile.webp',
  '/assets/buttons/01_OTDR_NOTE_MAKER_normal.svg',
  '/assets/buttons/01_OTDR_NOTE_MAKER_hover.svg',
  '/assets/buttons/02_RESULTS_CORRECTOR_normal.svg',
  '/assets/buttons/02_RESULTS_CORRECTOR_hover.svg',
  '/assets/buttons/03_DISTANCE_CONVERTER_normal.svg',
  '/assets/buttons/03_DISTANCE_CONVERTER_hover.svg',
  '/assets/buttons/04_FIBER_RIBBON_FINDER_normal.svg',
  '/assets/buttons/04_FIBER_RIBBON_FINDER_hover.svg',
  '/assets/buttons/05_FIBER_LOSS_CALCULATOR_normal.svg',
  '/assets/buttons/05_FIBER_LOSS_CALCULATOR_hover.svg',
  '/assets/buttons/06_ACE_FIRE_TOOL_normal.svg',
  '/assets/buttons/06_ACE_FIRE_TOOL_hover.svg',
  '/assets/rail/classic-rail-frame.svg',
  '/assets/rail/mobile-logo.svg',
  '/assets/icons/home.svg',
  '/assets/icons/dashboard.svg',
  '/assets/icons/workspace.svg',
  '/assets/icons/tools.svg',
  '/assets/icons/reference.svg',
  '/assets/icons/documents.svg',
  '/assets/icons/history.svg',
  '/assets/icons/settings.svg'
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
