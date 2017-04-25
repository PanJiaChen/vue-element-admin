import { fetch } from 'utils/fetch';

export function fetchList(query) {
  return fetch({
    url: '/article_table/list',
    method: 'get',
    params: query
  });
}

export function fetchPv(pv) {
  return fetch({
    url: '/article_table/pv',
    method: 'get',
    params: { pv }
  });
}
