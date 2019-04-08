const chokidar = require('chokidar')
const bodyParser = require('body-parser')
const chalk = require('chalk')

function registerRoutes(app) {
  const { default: mocks } = require('./index.js')
  for (const mock of mocks) {
    app[mock.type](mock.url, mock.response)
  }
  return {
    mockRoutesLength: Object.keys(mocks).length
  }
}

function unregisterRoutes() {
  Object.keys(require.cache).forEach(i => {
    if (i.includes('/mock')) {
      delete require.cache[require.resolve(i)]
    }
  })
}

function getPath(path) {
  var match = path.toString()
    .replace('\\/?', '')
    .replace('(?=\\/|$)', '$')
    .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//)
  return match
    ? match[1].replace(/\\(.)/g, '$1').split('/')
    : path.toString()
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
  // es6 polyfill
  require('@babel/register')

  // parse app.body
  // http://expressjs.com/en/4x/api.html#req.body
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({
    extended: true
  }))

  const { mockRoutesLength } = registerRoutes(app)

  // watch files, hot reload mock server
  chokidar.watch(('./mock'), {
    ignored: 'mock/mock-server.js',
    persistent: true,
    ignoreInitial: true
  }).on('all', (event, path) => {
    if (event === 'change' || event === 'add') {
      // find mock routes stack index
      const index = getMockRoutesIndex(app)

      // remove mock routes stack
      app._router.stack.splice(index, mockRoutesLength)

      // clear routes cache
      unregisterRoutes()

      registerRoutes(app)

      console.log(chalk.magentaBright(`\n > Mock Server hot reload success! changed  ${path}`))
    }
  })
}
