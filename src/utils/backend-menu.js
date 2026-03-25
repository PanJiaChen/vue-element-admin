function trimSlashes(value) {
  return String(value || '').replace(/^\/+|\/+$/g, '')
}

function ensureAbsolutePath(value) {
  const normalized = trimSlashes(value)
  return normalized ? `/${normalized}` : '/'
}

function relativePath(fullPath, parentPath) {
  const full = ensureAbsolutePath(fullPath)
  const parent = ensureAbsolutePath(parentPath)

  if (full === parent) {
    return ''
  }

  if (full.startsWith(`${parent}/`)) {
    return trimSlashes(full.slice(parent.length))
  }

  return trimSlashes(full.split('/').pop())
}

function buildRouteName(menu, suffix = '') {
  const base = trimSlashes(menu.routePath).replace(/[^\w]+/g, '_') || `menu_${menu.id}`
  return `${base}${suffix}_${menu.id}`
}

function buildMeta(menu) {
  return {
    title: menu.menuName || 'Untitled',
    icon: menu.icon || 'menu'
  }
}

function buildLeafRoute(menu, parentPath, useIndexPath = false) {
  return {
    path: useIndexPath ? '' : relativePath(menu.routePath, parentPath),
    componentKey: menu.component || 'backend-placeholder',
    name: buildRouteName(menu, '_view'),
    meta: buildMeta(menu)
  }
}

function buildChildRoute(menu, parentPath) {
  const children = Array.isArray(menu.children) ? menu.children : []

  if (!children.length) {
    return buildLeafRoute(menu, parentPath, false)
  }

  return {
    path: relativePath(menu.routePath, parentPath),
    componentKey: 'ParentView',
    name: buildRouteName(menu, '_group'),
    redirect: ensureAbsolutePath(children[0].routePath),
    meta: buildMeta(menu),
    alwaysShow: true,
    children: children.map(child => buildChildRoute(child, menu.routePath))
  }
}

function buildRootRoute(menu) {
  const rootPath = ensureAbsolutePath(menu.routePath)
  const children = Array.isArray(menu.children) ? menu.children : []

  return {
    path: rootPath,
    componentKey: 'Layout',
    name: buildRouteName(menu, '_root'),
    redirect: children.length ? ensureAbsolutePath(children[0].routePath) : rootPath,
    meta: buildMeta(menu),
    alwaysShow: children.length > 0,
    children: children.length
      ? children.map(child => buildChildRoute(child, menu.routePath))
      : [buildLeafRoute(menu, menu.routePath, true)]
  }
}

export function buildBackendRouteTree(menus) {
  return (Array.isArray(menus) ? menus : []).map(buildRootRoute)
}
