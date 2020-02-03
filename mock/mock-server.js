const chokidar = require('chokidar')
const bodyParser = require('body-parser')
const chalk = require('chalk')
const path = require('path')

const mockDir = path.join(process.cwd(), 'mock')

const Mock = require('mockjs')

/**
 * 修订说明：把mock文件夹下面的文件功能进行梳理
 *
 * 1. /mock/index.js输出mockXHR()函数，使用改写
 * XMLHttpRequest对象的方式，在浏览器中拦截请求，返回响应
 *
 * 2. /mock/mock-server.js引用/mock/index.js中导出的
 * mocks数据（未经responseFake转换），自行加工后作为
 * devServer启动的express应用的路由，从而实现真正的后台
 * api服务
 */
function registerRoutes(app) {
  let mockLastIndex
  const { default: mocks } = require('./index.js')
  const mocksForServer = mocks.map(route => {
    return responseFake(route.url, route.type, route.response)
  })
  for (const mock of mocksForServer) {
    app[mock.type](mock.url, mock.response)
    mockLastIndex = app._router.stack.length
  }
  const mockRoutesLength = Object.keys(mocksForServer).length
  return {
    mockRoutesLength: mockRoutesLength,
    mockStartIndex: mockLastIndex - mockRoutesLength
  }
}

function unregisterRoutes() {
  Object.keys(require.cache).forEach(i => {
    if (i.includes(mockDir)) {
      delete require.cache[require.resolve(i)]
    }
  })
}

// for mock server
const responseFake = (url, type, respond) => {
  /** Mock-Server的Context */
  const MOCK_SERVER_CONTEXT = '^' + process.env.VUE_APP_MOCK_SERVER_CONTEXT

  return {
    url: new RegExp(`${MOCK_SERVER_CONTEXT}${url}`),
    type: type || 'get',
    response(req, res) {
      console.log('request invoke:' + req.path)
      res.json(Mock.mock(respond instanceof Function ? respond(req, res) : respond))
    }
  }
}
module.exports = app => {
  // es6 polyfill
  require('@babel/register')

  // parse app.body
  // https://expressjs.com/en/4x/api.html#req.body
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({
    extended: true
  }))

  const mockRoutes = registerRoutes(app)
  var mockRoutesLength = mockRoutes.mockRoutesLength
  var mockStartIndex = mockRoutes.mockStartIndex

  // watch files, hot reload mock server
  chokidar.watch(mockDir, {
    ignored: /mock-server/,
    ignoreInitial: true
  }).on('all', (event, path) => {
    if (event === 'change' || event === 'add') {
      try {
        // remove mock routes stack
        app._router.stack.splice(mockStartIndex, mockRoutesLength)

        // clear routes cache
        unregisterRoutes()

        const mockRoutes = registerRoutes(app)
        mockRoutesLength = mockRoutes.mockRoutesLength
        mockStartIndex = mockRoutes.mockStartIndex

        console.log(chalk.magentaBright(`\n > Mock Server hot reload success! changed  ${path}`))
      } catch (error) {
        console.log(chalk.redBright(error))
      }
    }
  })
}
