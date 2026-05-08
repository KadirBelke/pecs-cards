const CACHE_NAME = 'visual-cards-v2.1'
const APP_SHELL = [
  '/',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg',
]

const CACHEABLE_PATH_PREFIXES = ['/icons/', '/screenshots/', '/symbols/']
const CACHEABLE_FILE_NAMES = new Set([
  '/',
  '/manifest.webmanifest',
  '/favicon.svg',
])

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME)

  try {
    const networkResponse = await fetch(request)

    if (networkResponse && networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }

    return networkResponse
  } catch (error) {
    const cachedResponse = await cache.match(request)

    if (cachedResponse) {
      return cachedResponse
    }

    if (request.mode === 'navigate') {
      return cache.match('/')
    }

    throw error
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME)
  const cachedResponse = await cache.match(request)

  if (cachedResponse) {
    return cachedResponse
  }

  const networkResponse = await fetch(request)

  if (networkResponse && networkResponse.ok) {
    cache.put(request, networkResponse.clone())
  }

  return networkResponse
}

function isCacheableStaticAsset(requestUrl) {
  if (CACHEABLE_FILE_NAMES.has(requestUrl.pathname)) {
    return true
  }

  return CACHEABLE_PATH_PREFIXES.some((prefix) =>
    requestUrl.pathname.startsWith(prefix),
  )
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)),
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => caches.delete(cacheName)),
        ),
      )
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

self.addEventListener('fetch', (event) => {
  const { request } = event

  if (request.method !== 'GET') {
    return
  }

  const requestUrl = new URL(request.url)

  if (requestUrl.origin !== self.location.origin) {
    return
  }

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request))
    return
  }

  if (request.destination === 'script' || request.destination === 'style') {
    event.respondWith(networkFirst(request))
    return
  }

  if (isCacheableStaticAsset(requestUrl)) {
    event.respondWith(cacheFirst(request))
  }
})
