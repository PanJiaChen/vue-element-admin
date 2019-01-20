import request from '@/utils/request'

// 获取组List信息
export function fetchGroupList(query) {
  return request({
    url: '/group/list',
    method: 'get',
    params: query
  })
}

export function fetchMemberList(id) {
  return request({
    url: '/group/getMembers',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/article/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/group/addGroup',
    method: 'post',
    data
  })
}

export function deleteGroup(id) {
  return request({
    url: '/group/delete',
    method: 'get',
    params: { id }
  })
}
