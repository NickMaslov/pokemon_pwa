const CAHE_DATA = "offline-data";
const STATIC_RESOURSES = ["index.html", "app.js", "logo.png"];

// Install the SW
self.addEventListener("install", async (e) => {
  console.log("SW istall");

  e.waitUntil(
    (async () => {
      const cache = await caches.open(CAHE_DATA);
      return await cache.addAll(STATIC_RESOURSES);
    })()
  );

  self.skipWaiting();
});

// Listen for fetching request
self.addEventListener("fetch", async (e) => {
  console.log(`SW fetch: ${e.request.url}`);

  e.respondWith(
    (async () => {
      const cache = await caches.open(CAHE_DATA);
      try {
        const networkResponse = await fetch(e.request);
        await cache.put(e.request, networkResponse.clone());
        return networkResponse;
      } catch (error) {
        const cachedResponse = await cache.match(e.request);
        return cachedResponse;
      }
    })()
  );
});

// Activate the SW
self.addEventListener("activate", async (e) => {
  console.log("SW activate");
});
