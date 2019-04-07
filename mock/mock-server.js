
const chokidar = require('chokidar')
const bodyParser = require('body-parser')

function getPath(path) {
  var match = path.toString()
    .replace('\\/?', '')
    .replace('(?=\\/|$)', '$')
    .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//)
  return match
    ? match[1].replace(/\\(.)/g, '$1').split('/')
    : path.toString()
}

function registerRoutes(app) {
  const { default: mocks } = require('./index.js')
  for (const mock of mocks) {
    app[mock.type](mock.url, mock.response)
  }
  return {
    mockRoutesLength: Object.keys(mocks).length,
    caches: require.cache
  }
}

function unregisterRoutes(caches) {
  Object.keys(caches).forEach(i => {
    if (i.includes('/mock')) {
      delete caches[require.resolve(i)]
    }
  })
}

function getMockRoutesIndex(app) {
  for (let index = 0; index <= app._router.stack.length; index++) {
    const r = app._router.stack[index]
    if (r.route && r.route.path) {
      const path = getPath(r.route.path)
      if (path.includes('mock')) {
        return index
      }
    }
  }
}

module.exports = app => {
  require('@babel/register')

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({
    extended: true
  }))

  const { mockRoutesLength, caches } = registerRoutes(app)

  chokidar.watch(('./mock'), { ignored: 'mock/mock-server.js', persistent: true, ignoreInitial: false }).on('all', (event, path) => {
    if (event === 'change' || event === 'add') {
      const index = getMockRoutesIndex(app)

      app._router.stack.splice(index, mockRoutesLength)
      console.log('caches')
      console.log(index)
      // console.log(path)
      unregisterRoutes(caches)
      // console.log(app)
      registerRoutes(app)
    }
  })
}
