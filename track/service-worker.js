// Install event: Cache necessary files
self.addEventListener('install', function(event) {
  event.waitUntil(
      caches.open('spending-tracker-v1').then(function(cache) {
          return cache.addAll([
              '/',
              '/index.html',
              '/styles.css',
              '/script.js',
              '/col.png' // Ensure this path is correct
          ]).catch(function(error) {
              console.error('Failed to cache during install:', error);
          });
      })
  );
});

// Fetch event: Serve cached content when offline
self.addEventListener('fetch', function(event) {
  event.respondWith(
      caches.match(event.request).then(function(response) {
          if (response) {
              console.log('Serving from cache:', event.request.url);
              return response;
          }
          console.log('Fetching from network:', event.request.url);
          return fetch(event.request).then(function(networkResponse) {
              // Optionally update the cache with the new response
              return caches.open('spending-tracker-v1').then(function(cache) {
                  cache.put(event.request, networkResponse.clone());
                  return networkResponse;
              });
          });
      }).catch(function(error) {
          console.error('Failed to fetch:', error);
          // Optionally return a fallback page or content here
      })
  );
});
