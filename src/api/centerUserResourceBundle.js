import request from '@/utils/request'

export function fetchDataList(page, pageSize) {
  return request({
    url: '/user/centerUserResourceBundle/list',
    method: 'post',
    data:{
      page,
      pageSize
    }
  })
}

export function buyResource(key) {
  return request({
    url: '/user/centerUserResourceBundle/buy/pc',
    method: 'get',
    params: { key }
  })
}

export function delResource(id) {
  return request({
    url: '/user/centerUserResourceBundle/del',
    method: 'post',
    data: { id }
  })
}
