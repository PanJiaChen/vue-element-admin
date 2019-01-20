import request from '@/utils/request'

// 获取组List信息
export function fetchList(query) {
  return request({
    url: '/grade/list',
    method: 'get',
    params: query
  })
}

export function getClassList(query) {
  return request({
    url: '/class/list',
    method: 'get',
    params: query
  })
}

export function fetchStuList(listQuery) {
  return request({
    url: '/stu/' + listQuery.type,
    method: 'get'
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
    url: '/article/update',
    method: 'post',
    data
  })
}
