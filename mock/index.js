import Mock from 'mockjs'
import mocks from './mocks'
import { param2Obj } from '../src/utils'

const MOCK_API_BASE = '/mock'

export function mockXHR() {
  // 修复在使用 MockJS 情况下，设置 withCredentials = true，且未被拦截的跨域请求丢失 Cookies 的问题
  // https://github.com/nuysoft/Mock/issues/300
  Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send
  Mock.XHR.prototype.send = function() {
    if (this.custom.xhr) {
      this.custom.xhr.withCredentials = this.withCredentials || false
    }
    this.proxy_send(...arguments)
  }

  function XHR2ExpressReqWrap(respond) {
    return function(options) {
      let result = null
      if (respond instanceof Function) {
        const { body, type, url } = options
        // https://expressjs.com/en/4x/api.html#req
        result = respond({
          method: type,
          body: JSON.parse(body),
          query: param2Obj(url)
        })
      } else {
        result = respond
      }
      return Mock.mock(result)
    }
  }

  for (const [route, respond] of Object.entries(mocks)) {
    Mock.mock(new RegExp(`${route}`), XHR2ExpressReqWrap(respond))
  }
}

const responseFake = (route, respond) => (
  {
    route: new RegExp(`${MOCK_API_BASE}${route}`),
    response(req, res) {
      res.json(Mock.mock(respond instanceof Function ? respond(req, res) : respond))
    }
  }
)

export default Object.keys(mocks).map(route => responseFake(route, mocks[route]))
