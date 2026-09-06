/* Weld Academy — offline cache.
   Everything is small and static, so we cache the lot on install and serve
   cache-first. That means the whole app works in a shed with no signal. */

var CACHE = 'weld-academy-v11';

var FILES = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
  './css/styles.css',
  './js/content.js',
  './js/content-mastery.js',
  './js/content-salvage.js',
  './js/reference.js',
  './js/diagrams.js',
  './js/practice.js',
  './js/progress.js',
  './js/profile.js',
  './js/juice.js',
  './js/vision.js',
  './js/script.js',
  './js/narrator.js',
  './js/sources.js',
  './js/dolls.js',
  './js/personal.js',
  './js/sync.js',
  './js/teardown.js',
  './js/tally.js',
  './js/ask.js',
  './js/drive.js',
  './js/market.js',
  './js/app.js'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE)
      .then(function (c) { return c.addAll(FILES); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; })
        .map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;

  // Never cache the AI scan calls — they must always go to the network.
  var url = new URL(e.request.url);
  if (url.origin !== location.origin) return;

  e.respondWith(
    caches.match(e.request).then(function (hit) {
      return hit || fetch(e.request).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
        return res;
      }).catch(function () {
        return caches.match('./index.html');
      });
    })
  );
});
