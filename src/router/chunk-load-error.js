const chunkLoadErrorReloadKey = 'vue-element-admin:chunk-load-error-reload'
const chunkLoadErrorRetryWindow = 10 * 1000

export function isChunkLoadError(error) {
  if (!error) {
    return false
  }

  const name = error.name || ''
  const message = error.message || String(error)

  return name === 'ChunkLoadError' ||
    /Loading (CSS )?chunk [\w-]+ failed/i.test(message) ||
    /ChunkLoadError/i.test(message)
}

export function shouldReloadForChunkLoadError({
  href = window.location.href,
  storage,
  now = Date.now()
} = {}) {
  let storedReload

  try {
    if (typeof storage === 'undefined') {
      storage = window.sessionStorage
    }
    if (!storage) {
      return false
    }
    storedReload = storage.getItem(chunkLoadErrorReloadKey)
  } catch (error) {
    return false
  }

  let previousReload

  try {
    previousReload = JSON.parse(storedReload || 'null')
  } catch (error) {
    previousReload = null
  }

  if (
    previousReload &&
    previousReload.href === href &&
    now - previousReload.time < chunkLoadErrorRetryWindow
  ) {
    return false
  }

  try {
    const marker = JSON.stringify({ href, time: now })
    storage.setItem(chunkLoadErrorReloadKey, marker)
    return storage.getItem(chunkLoadErrorReloadKey) === marker
  } catch (error) {
    // Without a retained marker, automatic reloads could repeat indefinitely.
    return false
  }
}

export function handleChunkLoadError(error, {
  href = window.location.href,
  storage,
  reload = window.location.replace.bind(window.location),
  now = Date.now()
} = {}) {
  if (!isChunkLoadError(error)) {
    return false
  }

  if (shouldReloadForChunkLoadError({ href, storage, now })) {
    reload(href)
  }

  return true
}
