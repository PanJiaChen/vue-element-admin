const { sh } = require('tasksfile')
const rawArgv = process.argv.slice(2)
const args = rawArgv.join(' ')

sh(`vue-cli-service build ${args}`)

if (process.env.npm_config_preview || rawArgv.includes('--preview')) {
  const config = require('../vue.config.js')
  const publicPath = config.publicPath

  const connect = require('connect')
  const serveStatic = require('serve-static')
  const app = connect()

  app.use(
    publicPath,
    serveStatic('./dist', {
      index: ['index.html', '/']
    })
  )

  const port = 9526
  app.listen(port, function() {
    const chalk = require('chalk')
    console.log(chalk.green(`> Preview at  http://localhost:${port}${publicPath}`))

    if (rawArgv.includes('--report')) {
      console.log(chalk.green(`> Report at  http://localhost:${port}${publicPath}report.html`))
    }
  })
}
