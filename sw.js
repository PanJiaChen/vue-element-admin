// configuration
`use strict`

const version = '2.0.0'
const CACHE = version + '::PWAsite'
const offlineURL = '/offline/'
const installFilesEssential = [
  '/',
  './static/tinymce4.7.5/*',
  // './dist/css/*',
  // './dist/fonts/*',
  // './dist/img/*',
  './manifest.json',
  './build/logo.png'
].concat(offlineURL)

// install static assets
function installStaticFiles() {
  return caches.open(CACHE)
    .then(cache => {
      // cache essential files
      return cache.addAll(installFilesEssential)
    })
}

// clear old caches
function clearOldCaches() {
  return caches.keys().then(keylist => {
    return Promise.all(
      keylist
        .filter(key => key !== CACHE)
        .map(key => caches.delete(key))
    )
  })
}

// application installation
self.addEventListener('install', event => {
  console.log('service worker: install')
  // cache core files
  event.waitUntil(
    installStaticFiles().then(() => self.skipWaiting()).catch(() => {
      console.error('service worker:cannot install')
    })
  )
})

// application activated
self.addEventListener('activate', event => {
  console.log('service worker: activate')

  // delete old caches
  event.waitUntil(
    clearOldCaches()
      .then(() => self.clients.claim())
  )
})

// is image URL?
const iExt = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp']
function isImage(url) {
  return iExt.reduce((ret, ext) => ret || url.endsWith(ext), false)
}

// return offline asset
function offlineAsset(url) {
  if (isImage(url)) {
    // return image
    return new Response(
      '<svg role="img" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><title>offline</title><path d="M0 0h400v300H0z" fill="#eee" /><text x="200" y="150" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="50" fill="#ccc">offline</text></svg>',
      { headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-store'
      }}
    )
  } else {
    // return page
    return `<html><body>disconnect to the server</body></html>`
  }
}

// application fetch network data
self.addEventListener('fetch', event => {
  // abandon non-GET requests
  if (event.request.method !== 'GET') return

  const url = event.request.url

  event.respondWith(

    caches.open(CACHE)
      .then(cache => {
        return cache.match(event.request)
          .then(response => {
            if (response) {
              // return cached file
              console.log('cache fetch: ' + url)
              return response
            }

            // make network request
            return fetch(event.request)
              .then(newreq => {
                console.log('network fetch: ' + url)
                if (newreq.ok) cache.put(event.request, newreq.clone())
                return newreq
              })
              // app is offline
              .catch(() => offlineAsset(url))
          })
      })

  )
})
