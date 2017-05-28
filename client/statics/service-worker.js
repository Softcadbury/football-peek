'use strict';

var cacheVersion = 'v1';

this.addEventListener('activate', function (event) {
    event.waitUntil(
        // Delete old cache
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (cacheVersion.indexOf(key) === -1) {
                    return caches.delete(key);
                }
            }));
        })
    );
});

this.addEventListener('fetch', function (event) {
    var originalResponse;

    event.respondWith(
        fetch(event.request.clone())
            .then(function (response) {
                // Check that the status is OK
                if (/^0|([123]\d\d)|(40[14567])|410$/.test(response.status)) {
                    if (event.request.method === 'GET') {
                        caches.open(cacheVersion).then(function (cache) {
                            cache.put(event.request.clone(), response.clone());
                        });
                    }

                    return response.clone();
                }

                originalResponse = response;
                throw new Error('Bad response');
            })
            .catch(function (error) {
                return caches.match(event.request).then(function (response) {
                    if (response) {
                        return response;
                    }

                    if (originalResponse) {
                        return originalResponse;
                    }

                    throw error;
                });
            })
    );
});