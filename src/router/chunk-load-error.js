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
  storage = window.sessionStorage,
  now = Date.now()
} = {}) {
  if (!storage) {
    return true
  }

  let previousReload

  try {
    previousReload = JSON.parse(storage.getItem(chunkLoadErrorReloadKey) || 'null')
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
    storage.setItem(chunkLoadErrorReloadKey, JSON.stringify({ href, time: now }))
  } catch (error) {
    // Ignore storage failures; a single reload is still the best recovery path.
  }

  return true
}

export function handleChunkLoadError(error, {
  href = window.location.href,
  storage = window.sessionStorage,
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
