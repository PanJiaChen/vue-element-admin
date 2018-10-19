'use strict'
require('@babel/register')
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  devServer: {
    open: true
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
