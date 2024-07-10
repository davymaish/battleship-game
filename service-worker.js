var CACHE_NAME = "battleship-shell-v1";
var APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./assets/styles.css",
  "./assets/simple_timer.js",
  "./assets/game-config.js",
  "./assets/game-difficulty.js",
  "./assets/game-validation.js",
  "./assets/game-events.js",
  "./assets/game-history.js",
  "./assets/game-state.js",
  "./assets/game-replay.js",
  "./assets/game-random.js",
  "./assets/game-storage.js",
  "./assets/game-stats.js",
  "./assets/game-results.js",
  "./assets/game-session.js",
  "./assets/game-keyboard.js",
  "./assets/game-theme.js",
  "./assets/game-audio.js",
  "./assets/game-shot-history.js",
  "./assets/game-model.js",
  "./assets/game-view.js",
  "./assets/battleship.js"
];

self.addEventListener("install", function(event) {
  event.waitUntil(caches.open(CACHE_NAME).then(function(cache) {
    return cache.addAll(APP_SHELL);
  }));
});

self.addEventListener("activate", function(event) {
  event.waitUntil(caches.keys().then(function(keys) {
    return Promise.all(keys.filter(function(key) { return key !== CACHE_NAME; }).map(function(key) { return caches.delete(key); }));
  }));
});

self.addEventListener("fetch", function(event) {
  event.respondWith(caches.match(event.request).then(function(cached) {
    return cached || fetch(event.request).then(function(response) {
      var copy = response.clone();
      caches.open(CACHE_NAME).then(function(cache) { cache.put(event.request, copy); });
      return response;
    });
  }));
});
