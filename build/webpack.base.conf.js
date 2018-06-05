'use strict'
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')

const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [utils.resolve('src'), utils.resolve('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
})

module.exports = {
  context: utils.resolve(''),
  entry: {
    app: utils.resolve('src/main.js')
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    modules: [utils.resolve('node_modules')],
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': utils.resolve('node_modules/vue/dist/vue.esm.js'),

      'vue-count-to': utils.resolve('node_modules/vue-count-to/dist/vue-count-to.min.js'),
      'vue-hot-reload-api': utils.resolve('node_modules/vue-hot-reload-api/dist/index.js'),
      'vue-i18n': utils.resolve('node_modules/vue-i18n/dist/vue-i18n.esm.js'),
      'vue-loader': utils.resolve('node_modules/vue-loader/index.js'),
      'vue-router': utils.resolve('node_modules/vue-router/dist/vue-router.esm.js'),
      'vue-splitpane': utils.resolve('node_modules/vue-splitpane/dist/vue-split-pane.min.js'),
      'vue-style-loader': utils.resolve('node_modules/vue-style-loader/index.js'),
      'vue-template-compiler': utils.resolve('node_modules/vue-template-compiler/index.js'),
      'vue-template-es2015-compiler': utils.resolve('node_modules/vue-template-es2015-compiler/index.js'),
      'vuex': utils.resolve('node_modules/vuex/dist/vuex.esm.js'),
      'xlsx': utils.resolve('node_modules/xlsx/xlsx.js'),
      'screenfull': utils.resolve('node_modules/screenfull/dist/screenfull.js'),
      'mockjs': utils.resolve('node_modules/mockjs/dist/mock-min.js'),
      'jszip': utils.resolve('node_modules/jszip/dist/jszip.min.js'),
      'js-cookie': utils.resolve('node_modules/js-cookie/src/js.cookie.js'),
      'axios': utils.resolve('node_modules/axios/dist/axios.min.js'),

      '@': utils.resolve('src'),
    }
  },
  module: {
    rules: [
      ...(config.dev.useEslint ? [createLintingRule()] : []),
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader?cacheDirectory',
        include: [utils.resolve('src'), utils.resolve('test'), utils.resolve('node_modules/webpack-dev-server/client')],
        exclude: [utils.resolve('node_modules'), utils.resolve('src/vendor')],
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        include: [utils.resolve('src/icons')],
        options: {
          symbolId: 'icon-[name]'
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        exclude: [utils.resolve('src/icons')],
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
