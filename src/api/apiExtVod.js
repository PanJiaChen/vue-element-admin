import request from '@/utils/request'

export function fetchDataList(page, pageSize, data) {
  return request({
    url: '/user/apiExtVod/list',
    method: 'post',
    data: {
      page,
      pageSize,
      ...data
    }
  })
}

export function authAndAddress(fileName) {
  return request({
    url: '/user/apiExtVod/authAndAddress',
    method: 'post',
    data: { fileName }
  })
}

export function delData(id) {
  return request({
    url: '/user/apiExtVod/del',
    method: 'post',
    data: { id }
  })
}
