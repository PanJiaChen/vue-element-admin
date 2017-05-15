import axios from 'axios';
import { Message } from 'element-ui';
import store from '../store';
import router from '../router';


const service = axios.create({
  baseURL: process.env.BASE_API
});

service.interceptors.request.use(config => {
  // Do something before request is sent
  if (store.state.token) {
    config.headers.Token = store.state.token;
  }
  return config;
}, error => {
  // Do something with request error
  console.log(error); // for debug
  Promise.reject(error);
})

service.interceptors.response.use(
  response => response,
  error => {
    console.log('err' + error);// for debug
    const code = error.response.data;
    if (code === 50008 || code === 50014 || code === 50012) {
      Message({
        message: res.message,
        type: 'error',
        duration: 5 * 1000
      });
      // 登出
      store.dispatch('FedLogOut').then(() => {
        router.push({ path: '/login' })
      });
    }
    return Promise.reject(error);
  }
)

export default service;
