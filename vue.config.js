'use strict'
require('@babel/register')
const path = require('path')
const bodyParser = require('body-parser')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  devServer: {
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080/mock',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },
    after(app) {
      // parse app.body
      // http://expressjs.com/en/4x/api.html#req.body
      app.use(bodyParser.json())
      app.use(bodyParser.urlencoded({ extended: true }))

      // import ES2015 module from common.js module
      const { default: mocks } = require('./mock')
      for (const mock of mocks) {
        app.all(mock.route, mock.response)
      }
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '$@': resolve('src/components')
      }
    },
    module: {
      rules: [
        {
          test: /\.svg$/,
          loader: 'svg-sprite-loader',
          include: [resolve('src/icons')],
          options: {
            symbolId: 'icon-[name]'
          }
        }
      ]
    }
  },
  chainWebpack(config) {
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
  }
}
