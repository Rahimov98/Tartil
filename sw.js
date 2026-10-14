/* Тартил — service worker для установки как приложения */
var CACHE = "tartil-v1";

self.addEventListener("install", function (e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      return c.addAll(["./", "./tartil.html"]).catch(function () {});
    })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys
          .filter(function (k) {
            return k !== CACHE;
          })
          .map(function (k) {
            return caches.delete(k);
          })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request)
      .then(function (res) {
        return res;
      })
      .catch(function () {
        return caches.match(e.request).then(function (cached) {
          return cached || caches.match("./tartil.html");
        });
      })
  );
});
