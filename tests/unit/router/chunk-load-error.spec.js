import {
  handleChunkLoadError,
  isChunkLoadError,
  shouldReloadForChunkLoadError
} from '@/router/chunk-load-error'

describe('router chunk-load error handling', () => {
  test('detects Webpack chunk load failures', () => {
    expect(isChunkLoadError(new Error('Loading chunk 12 failed.'))).toBe(true)
    expect(isChunkLoadError(new Error('Loading CSS chunk app failed.'))).toBe(true)
    expect(isChunkLoadError({ name: 'ChunkLoadError', message: 'missing' })).toBe(true)
    expect(isChunkLoadError(new Error('NavigationDuplicated'))).toBe(false)
  })

  test('allows one reload for the same url in the retry window', () => {
    const storage = window.sessionStorage
    const href = 'http://localhost/#/dashboard'

    storage.clear()

    expect(shouldReloadForChunkLoadError({ href, storage, now: 1000 })).toBe(true)
    expect(shouldReloadForChunkLoadError({ href, storage, now: 2000 })).toBe(false)
    expect(shouldReloadForChunkLoadError({ href, storage, now: 12000 })).toBe(true)
  })

  test('reloads the current page for a chunk load failure', () => {
    const reload = jest.fn()
    const storage = window.sessionStorage
    const href = 'http://localhost/#/permission/page'

    storage.clear()

    expect(handleChunkLoadError(new Error('Loading chunk 1 failed.'), {
      href,
      storage,
      reload,
      now: 1000
    })).toBe(true)
    expect(reload).toHaveBeenCalledWith(href)
  })

  test('ignores unrelated router errors', () => {
    const reload = jest.fn()

    expect(handleChunkLoadError(new Error('NavigationDuplicated'), { reload })).toBe(false)
    expect(reload).not.toHaveBeenCalled()
  })
})
