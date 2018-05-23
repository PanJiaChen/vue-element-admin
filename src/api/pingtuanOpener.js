import request from '@/utils/request'

export function fetchDataList(page, pageSize, data) {
  return request({
    url: '/user/pingtuanOpener/list',
    method: 'post',
    data: {
      page,
      pageSize,
      ...data
    }
  })
}

export function saveStatus(id, status) {
  return request({
    url: '/user/pingtuanOpener/status',
    method: 'post',
    data: { id, status }
  })
}
