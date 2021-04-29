# 路由懒加载

当打包构建应用时，Javascript 包会变得非常大，影响页面加载速度。如果我们能把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应组件，这样就更加高效了。

结合 Vue 的[异步组件](https://cn.vuejs.org/v2/guide/components.html#异步组件)和 Webpack 的[代码分割功能](https://www.webpackjs.com/guides/code-splitting/)，轻松实现路由组件的懒加载。如：

```js
const Foo = () => import('./Foo.vue')
```

<br>

**当你觉得你的页面热更新速度慢的时候，才需要往下看 ↓**

## 区分开发与生产环境 [该方案已淘汰]

当你的项目页面越来越多之后，在开发环境之中使用 `lazy-loading` 会变得不太合适，每次更改代码触发热更新都会变得非常的慢。所以建议只在生产环境之中使用路由懒加载功能。

**开发环境：**

```js
module.exports = file => require('@/views/' + file + '.vue').default // vue-loader at least v13.0.0+
```

**这里注意一下该写法只支持 `vue-loader at least v13.0.0+`理由 [adempiere-vue/issues/231](https://github.com/adempiere/adempiere-vue/issues/231)**

**生产环境：**

```js
module.exports = file => () => import('@/views/' + file + '.vue')
```

## 淘汰原因

当然这样写会有一些副作用。由于

> Every module that could potentially be requested on an import() call is included. For example, import(./locale/\${language}.json) will cause every .json file in the ./locale directory to be bundled into the new chunk. At run time, when the variable language has been computed, any file like english.json or german.json will be available for consumption.

`@/views/下的 .vue` 文件都会被打包。不管你是否被依赖。所以这样就产生了一个副作用，就是会多打包一些可能永远都用不到 js 代码。当然这只会增加 dist 文件的大小，但不会对线上代码产生任何的副作用。[相关 issue](https://github.com/adempiere/adempiere-vue/issues/292)

::: tip
用户自己可以根据业务情况来衡量一下是否采用本方案，如果你的项目页面不超过几十个，本地开发热更新速度你还能接受的话，可以直接所有环境下都是用懒加载避免此副作用。
:::

## 新方案

使用`babel` 的 `plugins` [babel-plugin-dynamic-import-node](https://github.com/airbnb/babel-plugin-dynamic-import-node)。它只做一件事就是将所有的`import()`转化为`require()`，这样就可以用这个插件将所有异步组件都用同步的方式引入，并结合 [BABEL_ENV](https://babeljs.io/docs/usage/babelrc/#env-option) 这个`babel`环境变量，让它只作用于开发环境下，在开发环境中将所有`import()`转化为`require()`，这种方案解决了之前重复打包的问题，同时对代码的侵入性也很小，你平时写路由的时候只需要按照官方[文档](https://router.vuejs.org/zh/guide/advanced/lazy-loading.html)路由懒加载的方式就可以了，其它的都交给`babel`来处理，当你不想用这个方案的时候，也只要将它从`babel` 的 `plugins`中移除就可以了。

**具体代码：**

首先在`package.json`中增加`BABEL_ENV`

```json
"dev": "cross-env BABEL_ENV=development webpack-dev-server --inline --progress --config build/webpack.dev.conf.js"
```

接着在`.babelrc`只能加入`babel-plugin-dynamic-import-node`这个`plugins`，并让它只有在`development`模式中才生效。

```json
{
  "env": {
    "development": {
      "plugins": ["dynamic-import-node"]
    }
  }
}
```

之后就大功告成了，路由只要像平时一样写就可以了。

```js
 { path: '/login', component: () => import('@/views/login/index')}
```

[相关代码改动](https://github.com/adempiere/adempiere-vue/pull/727)

## vue-cli@3 [该方案已淘汰]

`adempiere-vue@4` 在新版本中已修改为基于 `vue-cli`来进行构建。所以在新版本中你只要在`.env.development`环境变量配置文件中设置`VUE_CLI_BABEL_TRANSPILE_MODULES:true`就可以了，具体[代码](https://github.com/adempiere/adempiere-vue/blob/master/.env.development)。

它的实现逻辑和原理与之前还是一样的，还是基于`babel-plugin-dynamic-import-node`来实现的。之所以在`vue-cli`中只需要设置一个变量就可以了，是借用了`vue-cli`它的默认配置，它帮你代码都写好了。通过阅读[源码](https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/babel-preset-app/index.js)可知，`vue-cli`会通过`VUE_CLI_BABEL_TRANSPILE_MODULES`这个环境变量来区分是否使用`babel-plugin-dynamic-import-node`，所以我们只要开启它就可以。虽然它的初衷是为了单元测试的，但正好满足了我们的需求。

### 废弃原因

在`vue-cli@3`时代，使用`VUE_CLI_BABEL_TRANSPILE_MODULES`是 ok 的，但其实也是脆弱的，就比如在`vue-cli@4`时，vue-cli 引入`babel-plugin-dynamic-import-node`的逻辑就发生了变化，需要`VUE_CLI_BABEL_TRANSPILE_MODULES`和`VUE_CLI_BABEL_TARGET_NODE`同时为 true 时才会生效，所以只要 vue-cli 的判断逻辑发生了变化，我们都需要做相对应的改动，或非常被动和耦合。所以我们在`vue-cli@4`版本中，不再通过`VUE_CLI_BABEL_TRANSPILE_MODULES:true`来设置，而是通过手动引入`'babel-plugin-dynamic-import-node'`的方式，具体见下一部分。

## vue-cli@4

1. 在 `.env.development`文件中不在需要配置`VUE_CLI_BABEL_TRANSPILE_MODULES = true`，删除即可。

2. 在命令行执行 `npm install babel-plugin-dynamic-import-node -S -D`

3. 在`babel.config.js` 中添加插件

```js
module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  env: {
    development: {
      plugins: ['dynamic-import-node']
    }
  }
}
```

## 改进

`webpack5` 即将发布，大幅提高了打包和编译速度，之后可能完全不需要搞这么复杂了，再多的页面热更新，都能很快，完全就不需要前面提到的解决方案了。
