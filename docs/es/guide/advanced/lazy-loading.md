# Lazy Loading Routes

When you package an application, the Javascript package becomes very large, affecting the page load. If we can split the components corresponding to different routes into different code blocks and then load the corresponding components when the route is accessed, this will be more efficient.

Combining Vue's [async component feature](https://vuejs.org/v2/guide/components-dynamic-async.html#Async-Components) and webpack's [code splitting feature](https://webpack.js.org/guides/code-splitting/), it's trivially easy to lazy-load route components.

```js
const Foo = () => import('./Foo.vue')
```

<br>

**When you think your page's hot reload is slow, you need to look down ↓**

## Differentiating development and production environments

**[This solution has been eliminated]**

When you have more and more pages in your project, using `lazy-loading` in the development environment becomes less appropriate, and every change of code that triggers a hot update becomes very slow. Therefore, it is recommended to only use the lazy loading function in the build environment.

**Development:**

```js
// vue-loader at least v13.0.0+
module.exports = file => require('@/views/' + file + '.vue').default
```

**Note here that this method only supports `vue-loader at least v13.0.0+`**[adempiere-vue/issues/231](https://github.com/adempiere/adempiere-vue/issues/231)

Production：

```js
module.exports = file => () => import('@/views/' + file + '.vue')
```

## Elimination reason

Of course, there are some side effects of writing this way. due to

> Every module that could potentially be requested on an import() call is included. For example, import(./locale/${language}.json) will cause every .json file in the ./locale directory to be bundled into the new chunk. At run time, when the variable language has been computed, any file like english.json or german.json will be available for consumption.

::: tip
The user can measure whether to adopt this method according to the business situation. If your project is not large and you can also accept the local development hot update speed. You can continue to use lazy loading to avoid this side effect in all environments.
:::

## New Plan

Use `babel plugins` [babel-plugin-dynamic-import-node](https://github.com/airbnb/babel-plugin-dynamic-import-node).
It only does one thing by converting all `import()` to `require()`, so that all asynchronous components can be import synchronously using this plugin. Combined with the babel environment variable [BABEL_ENV](https://babeljs.io/docs/usage/babelrc/#env-option), let it only work in the development environment, in the development environment will convert all import () into require ().

This solution to solve the problem of repeated packaging before, while the invasiveness of the code is also very small, you usually write routing only need to follow the lazy loading method of the [official document](https://router.vuejs.org/guide/advanced/lazy-loading.html) routing on it, the other are handed to the handle of the cable, When you don't want to use this program, just remove it from Babel's plugins.

**Code:**

First add `BABEL_ENV` to `package.json`

```json
"dev": "cross-env BABEL_ENV=development webpack-dev-server --inline --progress --config build/webpack.dev.conf.js"
```

Then `.babelrc` can only include the `babel-plugin-dynamic-import-node` `plugins` and make it work only in the `development` mode.

```json
{
  "env": {
    "development": {
      "plugins": ["dynamic-import-node"]
    }
  }
}
```

After that, you're done. Routing can be written as usual.

```js
 { path: '/login', component: () => import('@/views/login/index')}
```

[Related code changes](https://github.com/adempiere/adempiere-vue/pull/727)

## vue-cli@3 [The plan has been eliminated]

`adempiere-vue@4` has been modified to build based on `vue-cli` in the new version. So in the new version you just need to set `VUE_CLI_BABEL_TRANSPILE_MODULES:true` in the `.env.development` environment variable configuration file, specifically [code](https://github.com/adempiere/adempiere-vue/blob/master/.env.development).

Its implementation logic and principle are the same as before, it based on `babel-plugin-dynamic-import-node`.The only thing you need to set a variable in `vue-cli` is to borrow the default configuration of `vue-cli`. By reading [source code](https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/babel-preset-app/index.js), `vue-cli` will pass `VUE_CLI_BABEL_TRANSPILE_MODULES`,this environment variable to distinguish whether to use `babel-plugin-dynamic-import-node`, so we only need to set it to true. Although its original intention was for unit testing, it just met our needs.

### Elimination reason

In the era of `vue-cli@3`, using `VUE_CLI_BABEL_TRANSPILE_MODULES` is ok, but it is actually fragile, as in `vue-cli@4`, vue-cli introduces `babel-plugin-dynamic-import-node The logic of`has changed, it needs to be `VUE_CLI_BABEL_TRANSPILE_MODULES` and `VUE_CLI_BABEL_TARGET_NODE` to be true at the same time, so as long as the judgment logic of vue-cli changes, we need to make corresponding changes, or be very passive and coupled . So in the `vue-cli@4` version, we no longer set it by `VUE_CLI_BABEL_TRANSPILE_MODULES: true`, but by manually introducing `'babel-plugin-dynamic-import-node'`, see the next section for details.

## vue-cli@4

1. No need to configure `VUE_CLI_BABEL_TRANSPILE_MODULES = true` in the `.env.development` file, just delete it.

2. Run `npm install babel-plugin-dynamic-import-node -S -D`

3. The way to add the dynamic-import-node plugin in `babel.config.js`, see the next section for details.

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

## Improve

`webpack5` is about to be released, greatly improving the speed of packaging and compiling. After that, it may not need to be so complicated at all. More page hot updates can be very fast, and the solution mentioned above is completely unnecessary.
