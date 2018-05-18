import request from '@/utils/request'

export function fetchDataList(page, pageSize, data) {
  return request({
    url: '/user/apiExtDfs/list',
    method: 'post',
    data: {
      page,
      pageSize,
      ...data
    }
  })
}

export function statistics() {
  return request({
    url: '/user/apiExtDfs/statistics',
    method: 'get'
  })
}

export function delData(id) {
  return request({
    url: '/user/apiExtDfs/del',
    method: 'post',
    data: { id }
  })
}
