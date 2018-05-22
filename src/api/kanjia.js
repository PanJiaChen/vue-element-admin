import request from '@/utils/request'

export function fetchDataList(page, pageSize, data) {
  return request({
    url: '/user/kanjiaSet/list',
    method: 'post',
    data: {
      page,
      pageSize,
      ...data
    }
  })
}

export function info(id) {
  return request({
    url: '/user/kanjiaSet/info',
    method: 'get',
    params: { id }
  })
}

export function delData(id) {
  return request({
    url: '/user/kanjiaSet/del',
    method: 'post',
    data: { id }
  })
}

export function saveData(data) {
  return request({
    url: '/user/kanjiaSet/save',
    method: 'post',
    data: { ...data }
  })
}
