import { rootRedirectRoute } from '@/router/root-route'

describe('router constants', () => {
  it('redirects the root path to dashboard', () => {
    expect(rootRedirectRoute.path).toBe('/')
    expect(rootRedirectRoute.redirect).toBe('/dashboard')
    expect(rootRedirectRoute.hidden).toBe(true)
  })
})
