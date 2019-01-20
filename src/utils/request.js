import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import { MessageBox } from 'element-ui'

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 5000, // request timeout
  // mock可能导致此属性生效。mock/index.js文件已修复
  withCredentials: true // 是否允许发送Cookie 如果为true 则服务器的 Access-control-Allow-Credentials 必须为 true 来源为 XMLHttpRequest的withCredentials配置项
})

// request interceptor
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    if (store.getters.token) {
      // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
      config.headers['X-Token'] = getToken()
      config.headers['UID'] = store.state.user.uid
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  // response => response,
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过 xmlhttprequest 来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  response => {
    const res = response.data
    if (!res.code) {
      console.log('mock数据请求...' + response.data)
      return response
    } else if (res.code !== 200) {
      // Message({
      //   message: res.message,
      //   type: 'error',
      //   duration: 5 * 1000
      // })
      // 退出登录
      if (res.code === 50068) {
        store.dispatch('FedLogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      } else if (res.code === 50008 || res.code === 50012 || res.code === 50014) { // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
        // 请自行在引入 MessageBox
        // import { Message, MessageBox } from 'element-ui'
        MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      } else if (res.code === 601) { // 主键冲突
        Message({
          message: res.message,
          type: 'error',
          duration: 5 * 1000
        })
      } else {
        Message({
          message: '其他异常: ' + res.message,
          type: 'error',
          duration: 5 * 1000
        })
      }
      return Promise.reject()
    } else {
      return response
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
