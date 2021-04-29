# CDN

You can analyze the results of the `webpack` package by executing `npm run preview -- --report` and observe the size of each static resource. You can find that the most occupied space is the dependence of third parties. Such as `vue`, `element-ui`, `ECharts`, etc.

You can use the `CDN` link to introduce these third-party libraries, which can greatly increase the speed of the build (the resources introduced through the CDN are not packaged by webpack). If your project does not have its own `CDN` service, use some third-party `CDN` services, such as [unpkg](https://unpkg.com/), etc. It is a good choice, it has provided free Resource acceleration. At the same time, it provides cache optimization. Since your third-party resources are introduced in `html` through `script`, its cache update strategy is controlled by you manually, eliminating the need to optimize the cache strategy.

::: tip
Many articles say that the use of `CDN` can greatly reduce the size of the code, which is impossible. Although the packaged `bundle` is small. But that part of the code was just removed by you, and it was introduced using the `CDN` method. The most efficient solution you want to reduce the size is to enable `GZIP`.
:::

## I personally do not use `CDN`

There is no problem with the temporary build speed, and there is no need to strip some of the third-party dependencies separately. Using `CDN` equals some third-party dependent versions you control through `package.json`, some dependencies require manual maintenance, adding some maintenance costs. At present, the webpack-based `optimization.splitChunks` has been optimized for the caching of resources, and the caching of static resources has been done very well. And all current static resources will be uploaded to their own `CDN` service, there is no need to use a third-party `CDN` service.

**Of course, all optimizations need to be adjusted in conjunction with their specific business!** If you feel that the use of `CDN` is beneficial for your project, you can follow these steps:

## Way of use

First find `vue.config.js`, add `externals` to make `webpack` not package `vue` and `element`

```js
externals: {
  vue: 'Vue',
  'element-ui':'ELEMENT'
}
```

Then configure the `CDN` of those third-party resources, please pay attention to the order.

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

Then inject it into `index.html` via `html-webpack-plugin`:

```js
config.plugin('html').tap(args => {
  args[0].cdn = cdn
  return args
})
```

Find `public/index.html`. Inject css and js in turn through your configured `CND Config`.

```html
<head>
  <!-- inject css-->
  <% for(var css of htmlWebpackPlugin.options.cdn.css) { %>
    <link rel="stylesheet" href="<%=css%>">
  <% } %>
</head>

<!-- inject js -->
<% for(var js of htmlWebpackPlugin.options.cdn.js) { %>
  <script src="<%=js%>"></script>
<% } %>
```

There is also a small detail. If you use the global object method to introduce vue, you don't need to manually Vue.use(Vuex), it will be mounted automatically. [issue](https://github.com/vuejs/vuex/issues/731)

Complete [code modification](https://github.com/adempiere/vue-admin-template/commit/eaaa3c1ddadd114451a1a83e042f1fc56a9809a1)

Finally you can use `npm run preview -- --report` to see the effect as shown:

![](https://camo.githubusercontent.com/0c5bdc47aeaecc340b9a5a88325b49885538bf90/68747470733a2f2f70616e6a69616368656e2e6769746875622e696f2f696d616765732f656c656d656e742d63646e2e706e67)

::: tip
By the same token, other third-party dependencies can be handled in the same way(such as `vuex`, `vue-router`, etc.). Of course, you can also choose to use [DLLPlugin](https://webpack.docschina.org/plugins/dll-plugin/) to handle third-party dependencies to optimize the build.
:::
