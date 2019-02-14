import request from '@/utils/request'
/**
  *根据角色获得可见菜单
  */
export function getMenuByRole(query) {
  return request({
    url: '/menus/role',
    method: 'get',
    params: query
  })
}
