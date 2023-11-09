const CACHENAME = 'cache-v1'
const resources = ['/']

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHENAME)
      .then(cache => cache.addAll(resources))
  )
})

const MAXAGE = 3600

const fetchAndUpdateCache = (request) => {
  return fetch(request, { cache: 'no-store' }).then(response => {
    if (!response || response.status !== 200 || !response.url.includes('https')) {
      return response;
    }
    const responseToCache = response.clone();
    caches.open(CACHENAME).then(cache => {
      if (['get', 'post', 'put'].includes(request.method.toLowerCase())) {
        if (request.method.toLowerCase() === 'put' && !request.url.includes('user-theme')) return response
        if (request.method.toLowerCase() === 'post' && !request.url.includes('leaderboard/all')) return response
        cache.put(request, responseToCache)
      }
    })
    return response
  })
}

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const request = event.request.clone()
      if (!cachedResponse) {
        return fetchAndUpdateCache(request)
      }
      const lastModified = new Date(cachedResponse.headers.get('last-modified'))
      if (lastModified && Date.now() - lastModified.getTime() > MAXAGE * 1000) {
        return fetchAndUpdateCache(request)
      }
      return cachedResponse
    }).catch((e) => new Response(`Something went wrong: ${e}`))
  )
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => cacheName !== CACHENAME)
          .map(cacheName => caches.delete(cacheName))
      )
    })
  )
})
