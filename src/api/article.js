import { fetch } from 'utils/fetch';

export function getList() {
  return fetch({
    url: '/article/list',
    method: 'get'
  });
}
