import Layout from '@/layout'
import { mapServerRoutes } from '@/utils/server-routes'

// The server selects components from this build; it never supplies executable code.
const views = require.context('../views', true, /\.vue$/, 'lazy')
const viewKeys = views.keys()

export function resolveServerRoutes(routes) {
  return mapServerRoutes(routes, name => {
    if (name === 'Layout' || name === 'layout/Layout') return Layout
    if (!name.startsWith('views/')) return null
    const path = './' + name.slice('views/'.length)
    const key = [path + '.vue', path + '/index.vue'].find(item => viewKeys.includes(item))
    return key ? () => views(key).then(component => component.default || component) : null
  })
}
