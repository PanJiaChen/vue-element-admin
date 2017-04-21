import { tpFetch } from 'utils/fetch';

export function getList() {
  return tpFetch({
    url: '/article/list',
    method: 'get'
  });
}
