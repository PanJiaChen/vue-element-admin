// Just a mock data
import { asyncRoutes } from '../src/router'

// 将asyncRoutes的componet转换为路径字符串,以便导入数据库
const mapAsyncRoutes = asyncRoutes => {
  return asyncRoutes.map(route => {
    const tmp = { ...route }
    if (tmp.component) {
      if (tmp.component.__file) {
        tmp.component = tmp.component.__file.slice(4)
      } else if (tmp.component instanceof Function) {
        tmp.component = /\/\*\!.*\*\//.exec(String(tmp.component))[0].split(' ')[1].slice(2)
      }
      console.log(tmp.component)
    }
    if (tmp.children && tmp.children.length) {
      tmp.children = mapAsyncRoutes(tmp.children)
    }
    return tmp
  })
}
const mapRouteId = routes => {
  return routes.map(route => {
    const tmp = { ...route }
    tmp.id = Math.random()
    tmp.children && tmp.children.length && (tmp.children = mapRouteId(tmp.children))
    return tmp
  })
}
const asyncRoutesMap = mapAsyncRoutes(asyncRoutes)

export { asyncRoutesMap as routes }
export default [
  // mock get all routes form server
  {
    url: '/routes',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: mapRouteId(asyncRoutesMap)
      }
    }
  },
  {
    url: '/routes',
    type: 'put',
    response: _ => {
      return {
        code: 20000,
        data: {}
      }
    }
  }
]
