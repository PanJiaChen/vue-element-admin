import Mock from 'mockjs'
import loginAPI from './login'
import articleAPI from './article'
import grade from './grade'
import remoteSearchAPI from './remoteSearch'
import transactionAPI from './transaction'

// * 修复 Mock 情况下，设置 withCredentials = true，且未被拦截的跨域请求丢失 Cookies 的问题。
// 请求中丢失session，导致每次请求sessionId不同
Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send
Mock.XHR.prototype.send = function() {
  if (this.custom.xhr) {
    this.custom.xhr.withCredentials = this.withCredentials || true
  }
  this.proxy_send(...arguments)
}

// Mock.setup({
//   timeout: '350-600'
// })

// 登录相关
// Mock.mock(/\/user\/login/, 'post', loginAPI.loginByUsername)
Mock.mock(/\/login\/logout/, 'post', loginAPI.logout)
// Mock.mock(/\/user\/info\.*/, 'get', loginAPI.getUserInfo)

// 文章相关
Mock.mock(/\/article\/list/, 'get', articleAPI.getList)
Mock.mock(/\/article\/detail/, 'get', articleAPI.getArticle)
Mock.mock(/\/article\/pv/, 'get', articleAPI.getPv)
Mock.mock(/\/article\/create/, 'post', articleAPI.createArticle)
Mock.mock(/\/article\/update/, 'post', articleAPI.updateArticle)

// 搜索相关
Mock.mock(/\/search\/user/, 'get', remoteSearchAPI.searchUser)

// 账单相关
Mock.mock(/\/transaction\/list/, 'get', transactionAPI.getList)

// 根据uid获取对应班级列表。学生有一个班级，老师有多个
// Mock.mock(/\/class\/list/, 'get', grade.classList)
// 根据uid获取班级信息
// Mock.mock(/\/class\/\w*/, 'get', grade.getClassList)
// 根据班级ID，获取学生信息
Mock.mock(/\/stu\/\w*/, 'get', grade.fetchStuList)
export default Mock
