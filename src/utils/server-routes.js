/** Map a server's JSON route tree to locally bundled components. */
export function mapServerRoutes(routes, resolveComponent) {
  if (!Array.isArray(routes)) {
    throw new Error('Server routes must be an array')
  }

  return routes.map(route => {
    if (!route || typeof route.path !== 'string') {
      throw new Error('Server routes must have a string path')
    }
    const result = { ...route }
    if (route.meta) result.meta = { ...route.meta }
    if (route.component !== undefined) {
      if (typeof route.component !== 'string') {
        throw new Error('Server route components must be local component names')
      }
      const component = resolveComponent(route.component)
      if (!component) {
        throw new Error(`Unknown server route component: ${route.component}`)
      }
      result.component = component
    }
    if (route.children !== undefined) {
      result.children = mapServerRoutes(route.children, resolveComponent)
    }
    return result
  })
}
