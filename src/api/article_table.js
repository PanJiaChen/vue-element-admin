import { fetch } from 'utils/fetch';
import { param } from 'utils';

// export function calendarsList(query) {
//   return fetch({
//     url: '/finfo/calendars?' + param(query),
//     method: 'get'
//   });
// }

export function fetchList(query) {
  return fetch({
    url: '/article_table/list',
    method: 'get'
  });
}


export function calendarCreate(data) {
  return fetch({
    url: '/finfo/calendar/create',
    method: 'post',
    data
  });
}

export function calendarDelete(id) {
  return fetch({
    url: '/finfo/calendar/delete',
    method: 'post',
    data: { id }
  });
}

export function calendarUpdate(data) {
  return fetch({
    url: '/finfo/calendar/update',
    method: 'post',
    data
  });
}

export function calcountriesList() {
  return fetch({
    url: '/finfo/calcountries',
    method: 'get'
  });
}
