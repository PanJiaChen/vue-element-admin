'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || 'vue Element Admin' // page title

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following method:
// port = 9527 npm run dev OR npm run dev --port = 9527
const port = process.env.port || process.env.npm_config_port || 9527 // dev port

/** mock-server开关,该环境变量定义在文件`.env.development`中*/
const enableMockServer = process.env.VUE_APP_MOCK === 'Mock_Server'
const mockServerContext = process.env.VUE_APP_MOCK_SERVER_CONTEXT
const mockProxy = {
  /**
   * dev-api/login => mock/login
   * 本对象是express的代理插件http-proxy-middlewaredre
   * (https://github.com/chimurai/http-proxy-middleware)
   * 当方法是POST时，数据无法从原始请求传到代理请求，见下帖
   * https://github.com/chimurai/http-proxy-middleware/issues/40
   * 解决办法是在它的onProxyReq事件中，手动把请求的body数据搬运到代理请求中
   *
   * target是指匹配该路径的主机。见https://webpack.js.org/configuration/dev-server/#devserverproxy
   */
  [process.env.VUE_APP_BASE_API]: {
    target: `http://localhost:${port}`,
    changeOrigin: true,
    ws: true, // proxy websockets
    pathRewrite: { ['^' + process.env.VUE_APP_BASE_API]: mockServerContext },
    /** 在POST方法下，直接把body数据以JSON形式搬运到代理请求对象proxyRequest中去 */
    onProxyReq: (proxyRequest, request, response, options) => {
      if (request.method === 'POST' && request.body) {
        const bodyData = JSON.stringify(request.body)
        proxyRequest.setHeader('Content-Type', 'application/json')
        proxyRequest.setHeader('Content-Length', Buffer.byteLength(bodyData))
        proxyRequest.write(bodyData)
      }
    }
  }}

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = () => {
  return {
    /**
     * You will need to set publicPath if you plan to deploy your site under a sub path,
     * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
     * then publicPath should be set to "/bar/".
     * In most cases please use '/' !!!
     * Detail: https://cli.vuejs.org/config/#publicpath
     */
    publicPath: '/',
    outputDir: 'dist',
    assetsDir: 'static',
    lintOnSave: process.env.NODE_ENV === 'development',
    productionSourceMap: false,
    devServer: {
      port: port,
      open: true,
      overlay: {
        warnings: false,
        errors: true
      },

      proxy: enableMockServer ? mockProxy : undefined,
      /** 启动mock服务器 */
      /** @link https://webpack.js.org/configuration/dev-server/#devserverbefore*/
      /** before定义为function (app)。其中app指的是express的app */
      before: enableMockServer ? require('./mock/mock-server.js').default : undefined
    },
    configureWebpack: {
      // provide the app's title in webpack's name field, so that
      // it can be accessed in index.html to inject the correct title.
      name: name,
      resolve: {
        alias: {
          '@': resolve('src')
        }
      }
    },
    chainWebpack(config) {
      config.plugins.delete('preload') // TODO: need test
      config.plugins.delete('prefetch') // TODO: need test

      // set svg-sprite-loader
      config.module
        .rule('svg')
        .exclude.add(resolve('src/icons'))
        .end()
      config.module
        .rule('icons')
        .test(/\.svg$/)
        .include.add(resolve('src/icons'))
        .end()
        .use('svg-sprite-loader')
        .loader('svg-sprite-loader')
        .options({
          symbolId: 'icon-[name]'
        })
        .end()

      // set preserveWhitespace
      config.module
        .rule('vue')
        .use('vue-loader')
        .loader('vue-loader')
        .tap(options => {
          options.compilerOptions.preserveWhitespace = true
          return options
        })
        .end()

      config
        // https://webpack.js.org/configuration/devtool/#development
        .when(process.env.NODE_ENV === 'development',
          config => config.devtool('cheap-source-map')
        )

      config
        .when(process.env.NODE_ENV !== 'development',
          config => {
            config
              .plugin('ScriptExtHtmlWebpackPlugin')
              .after('html')
              .use('script-ext-html-webpack-plugin', [{
                // `runtime` must same as runtimeChunk name. default is `runtime`
                inline: /runtime\..*\.js$/
              }])
              .end()
            config
              .optimization.splitChunks({
                chunks: 'all',
                cacheGroups: {
                  libs: {
                    name: 'chunk-libs',
                    test: /[\\/]node_modules[\\/]/,
                    priority: 10,
                    chunks: 'initial' // only package third parties that are initially dependent
                  },
                  elementUI: {
                    name: 'chunk-elementUI', // split elementUI into a single package
                    priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                    test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                  },
                  commons: {
                    name: 'chunk-commons',
                    test: resolve('src/components'), // can customize your rules
                    minChunks: 3, //  minimum common number
                    priority: 5,
                    reuseExistingChunk: true
                  }
                }
              })
            config.optimization.runtimeChunk('single')
          }
        )
    }
  }
}
