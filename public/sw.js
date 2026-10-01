const CACHE_NAME = 'afrobreak-v1'
const STATIC_ASSETS = [
  '/',
  '/events',
  '/instructors',
  '/videos',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)).catch(() => {})
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  // Only handle GET requests for same-origin or static assets
  if (event.request.method !== 'GET') return
  const url = new URL(event.request.url)
  // Skip API and auth routes
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/auth/')) return
  // Skip admin routes
  if (url.pathname.startsWith('/admin')) return

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request).then((response) => {
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone)).catch(() => {})
        }
        return response
      }).catch(() => cached)
      // Return cached first for speed, fall back to network
      return cached || networkFetch
    })
  )
})
