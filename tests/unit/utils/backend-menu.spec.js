import { buildBackendRouteTree } from '@/utils/backend-menu'

describe('backend menu utils', () => {
  it('maps a root backend menu into a layout route with index child', () => {
    const routes = buildBackendRouteTree([
      {
        id: 1,
        menuName: 'Dashboard',
        routePath: '/dashboard',
        component: 'views/dashboard/index',
        icon: 'dashboard',
        children: []
      }
    ])

    expect(routes).toHaveLength(1)
    expect(routes[0]).toMatchObject({
      path: '/dashboard',
      componentKey: 'Layout',
      redirect: '/dashboard'
    })
    expect(routes[0].children[0]).toMatchObject({
      path: '',
      componentKey: 'views/dashboard/index',
      meta: {
        title: 'Dashboard',
        icon: 'dashboard'
      }
    })
  })

  it('maps nested backend menus into relative child routes', () => {
    const routes = buildBackendRouteTree([
      {
        id: 2,
        menuName: 'Contest',
        routePath: '/contest',
        component: 'layout/router-view',
        icon: 'trophy',
        children: [
          {
            id: 3,
            menuName: 'List',
            routePath: '/contest/list',
            component: 'views/contest/list',
            icon: 'list',
            children: []
          }
        ]
      }
    ])

    expect(routes[0]).toMatchObject({
      path: '/contest',
      redirect: '/contest/list',
      alwaysShow: true
    })
    expect(routes[0].children[0]).toMatchObject({
      path: 'list',
      componentKey: 'views/contest/list'
    })
  })
})
