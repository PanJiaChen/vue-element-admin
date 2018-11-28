const { run } = require('runjs')
const chalk = require('chalk')
const config = require('../vue.config.js')
const rawArgv = process.argv.slice(2)
const args = rawArgv.join(' ')

if (process.env.npm_config_preview || rawArgv.includes('--preview')) {
  run(`vue-cli-service build ${args}`)

  const port = 9526
  const basePath = config.baseUrl

  var connect = require('connect')
  var serveStatic = require('serve-static')
  const app = connect()

  app.use(
    basePath,
    serveStatic('./dist', {
      index: ['index.html', '/']
    })
  )

  app.listen(port, function() {
    console.log(
      chalk.green(`> Listening at  http://localhost:${port}${basePath}`)
    )
  })
} else {
  run(`vue-cli-service build ${args}`)
}
