import fetch, { tpFetch } from 'utils/fetch';

export function getToken() {
  return fetch({
    url: '/qiniu/upload/token',
    method: 'get'
  });
}
export function upload(data) {
  return tpFetch({
    url: 'https://upload.qbox.me',
    method: 'post',
    data
  });
}


/* 外部uri转七牛uri*/
export function netUpload(token, net_url) {
  const imgData = {
    net_url
  };
  return fetch({
    url: '/qiniu/upload/net/async',
    method: 'post',
    data: imgData
  });
}
