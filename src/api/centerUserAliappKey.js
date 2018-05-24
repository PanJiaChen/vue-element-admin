import request from '@/utils/request'

export function info() {
  return request({
    url: '/user/centerUserAliappKey/info',
    method: 'get'
  })
}

export function delData(id) {
  return request({
    url: '/user/centerUserAliappKey/del',
    method: 'post',
    data: { id }
  })
}

export function saveData(data) {
  return request({
    url: '/user/centerUserAliappKey/save',
    method: 'post',
    data: { ...data }
  })
}
