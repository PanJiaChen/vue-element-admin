# CDN

你可以通过执行`npm run preview -- --report`来分析`webpack`打包之后的结果，观察各个静态资源的大小。你可以发现占用空间最多的是第三方依赖。如`vue`、`element-ui`、 `ECharts`等。

你可以使用 `CDN` 外链的方式引入这些第三方库，这样能大大增加构建的速度(通过 CDN 引入的资源不会经 webpack 打包)。如果你的项目没有自己的`CDN`服务的话，使用一些第三方的`CDN`服务，如[unpkg](https://unpkg.com/)等是一个很好的选择，它提供过了免费的资源加速，同时提供了缓存优化，由于你的第三方资源是在`html`中通过`script`引入的，它的缓存更新策略都是你自己手动来控制的，省去了你需要优化缓存策略功夫。

::: tip
很多文章说使用 `CDN` 引入的方式能大大减小代码的体积，这是不可能的。虽然打包完的 `bundle`小了，但那部分代码只是被你拆出去，用`CDN`的方式引入罢了。你想减小体积，最高效的方案是启用`GZIP`。
:::

## 我个人暂时不使用`CDN`引入第三方依赖的原因：

暂时构建速度还没有遇到什么瓶颈，所有没有必要单独剥离部分第三方依赖。使用`CDN`引入的方式等于一些第三方依赖的版本你是通过`package.json`来控制的，一些依赖则需要手动维护，增加了一些维护成本。目前基于 webpack 的`optimization.splitChunks`已经做了资源的缓存优化，静态资源的缓存已经做得很好了。并且目前所有的静态资源都会上传到自己的`CDN`服务，没有必要使用第三方的`CDN`服务。

**当然所有的优化都是需要结合自己的具体业务来调整的！** 之后可能会采用这种引入方式，或者使用`webpack dll`的方式进行优化。如果你觉得`CDN`引入对于的项目有益处，你可以遵循如下方法进行修改：

## 使用方式

先找到 `vue.config.js`， 添加 `externals` 让 `webpack` 不打包 `vue` 和 `element`

```js
externals: {
  vue: 'Vue',
  'element-ui':'ELEMENT'
}
```

然后配置那些第三方资源的`CDN`，请注意先后顺序。

```js
const cdn = {
  css: [
    // element-ui css
    'https://unpkg.com/element-ui/lib/theme-chalk/index.css'
  ],
  js: [
    // vue must at first!
    'https://unpkg.com/vue/dist/vue.js',
    // element-ui js
    'https://unpkg.com/element-ui/lib/index.js'
  ]
}
```

之后通过 `html-webpack-plugin`注入到 `index.html`之中:

```js
config.plugin('html').tap(args => {
  args[0].cdn = cdn
  return args
})
```

找到 `public/index.html`。通过你配置的`CND Config` 依次注入 css 和 js。

```html
<head>
  <!-- 引入样式 -->
  <% for(var css of htmlWebpackPlugin.options.cdn.css) { %>
    <link rel="stylesheet" href="<%=css%>">
  <% } %>
</head>

<!-- 引入JS -->
<% for(var js of htmlWebpackPlugin.options.cdn.js) { %>
  <script src="<%=js%>"></script>
<% } %>
```

之后还有一个小细节是如果你用了全局对象方式引入 vue，就不需要 手动 Vue.use(Vuex） ，它会自动挂载，具体见 [issue](https://github.com/vuejs/vuex/issues/731)

完整的[代码修改](https://github.com/adempiere/vue-admin-template/commit/eaaa3c1ddadd114451a1a83e042f1fc56a9809a1)

最终你可以使用 `npm run preview -- --report` 查看效果 如图：

![](https://camo.githubusercontent.com/0c5bdc47aeaecc340b9a5a88325b49885538bf90/68747470733a2f2f70616e6a69616368656e2e6769746875622e696f2f696d616765732f656c656d656e742d63646e2e706e67)

::: tip
同理，其它第三方依赖都可以使用相同的方式处理（比如`vuex`、`vue-router`等）。当然你也可以选择使用 [DLLPlugin](https://webpack.docschina.org/plugins/dll-plugin/)的方式来处理第三方依赖，从而来优化构建。
:::
