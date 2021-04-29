# 常见问题

::: tip
提问之前，请先查阅下面的常见问题。
:::

## adempiere-vue 和 vue-admin-template 有什么区别？

adempiere-vue 是一个后台的集成方案，它囊括了很多的功能和组件，并不适合作为基础模板来进行二次开发。
vue-admin-template 则是一个后台的基础模板脚手架，适合在它的基础上进行二次开发。

<br/>

## 首先有任何报错，最简单的方法是把报错信息复制到浏览器里面搜索一下！！！

[google 点我](http://lmgtfy.com/?q=%E6%90%9C%E4%B8%80%E6%90%9C)

[百度点我](http://www.baidu-x.com/?q=%E6%90%9C%E4%B8%80%E6%90%9C)

<br/>

## 代码下载慢？

npm 或者 github 有时候因为中国墙的原因，网速会不稳定。有如下三种解决方案：

- 使用淘宝源

  npm install --registry=https://registry.npm.taobao.org

- Yarn

  - [yarn 介绍](https://github.com/yarnpkg/yarn)
  - [安装](https://yarn.bootcss.com/docs/install/#mac-stable)

  `yarn install`

- 自己科学上网

## vendor 过大问题?

建议使用 gzip，使用之后体积会只有原先 1/3 左右。还可以使用懒加载或者 Code Splitting 建议参考[这篇文章](https://zhuanlan.zhihu.com/p/26710831)。打出来的 app.js 过大，查看一下是不是 Uglify 配置不正确或者 sourceMap 没弄对。
优化相关请看该[文章](https://zhuanlan.zhihu.com/p/27710902)。

或者查看手摸手系列教程：

- [手摸手，带你用合理的姿势使用 webpack4（上）](https://juejin.im/post/5b56909a518825195f499806)
- [手摸手，带你用合理的姿势使用 webpack4（下）](https://juejin.im/post/5b5d6d6f6fb9a04fea58aabc)
- [webpack 4 和单页应用入门](https://github.com/wallstreetcn/webpack-and-spa-guide)

<br/>

## 我的 url 里怎么有 # 号？要如何去掉？

请参考文档 [前端路由与服务端的结合](../essentials/deploy.md#前端路由与服务端的结合) 主要由于 `browserHistory` 和 `hashHistory` 两种不同模式导致的。

<br/>

## npm install 总是失败？

由于中国墙的的原因，安装一些依赖时很容易出现超时问题，国内用户推荐使用淘宝源的安装方式

```bash
npm install --registry=https://registry.npm.taobao.org
```

<br/>

## node-sass 安装失败？

请查看下面相关 issue：

[issues/25](https://github.com/adempiere/adempiere-vue/issues/25)

[issues/24](https://github.com/adempiere/adempiere-vue/issues/24)

<br/>

## mock 问题

请参考文档 [Mock 和联调](../essentials/mock-api.md)

<br/>

## 动态配置路由配置

将路由表配置存储在后端方案

相关 issue：[issues/293](https://github.com/adempiere/adempiere-vue/issues/293)
<br/>

## 浏览器兼容性问题

本项目暂时没有兼容性需求，如有兼容性需求可自行使用 babel-polyfill。

```shell
// 下载依赖
npm install --save babel-polyfill
```

在入口文件中引入

```js
import 'babel-polyfill'
// 或者
require('babel-polyfill') //es6
```

在 webpack.config.js 中加入 babel-polyfill 到你的入口数组：

```js
module.exports = {
  entry: ['babel-polyfill', './app/js']
}
```

具体可参考 [link](https://babeljs.io/docs/en/babel-polyfill/)

或者更简单暴力 [polyfill.io](https://cdn.polyfill.io/v3/) 使用它给的一个 cdn 地址，引入这段 js 之后它会自动判断游览器，加载缺少的那部分 polyfill,但国内速度肯能不行，大家可以自己搭 cdn。

[更多相关内容](https://segmentfault.com/a/1190000010106158)

## 跨域问题 如：为什么发了一个 options 请求? Access-Control-Allow-Origin 报错等?

请参考文档 [跨域问题](../advanced/cors.md)

<br/>

## 图片 background url() 引用问题？

https://github.com/vuejs/vue-loader/issues/481

https://github.com/vuejs/vue-cli/issues/112

<br/>

## @ 或者如为什么他的项目可以`src/xxx/` 这样写，而我的却报路径错误？

这种情况很有可能人家在配置了 webpack 的 alias

`@` 是 webpack 的 [alias](https://webpack.js.org/configuration/resolve/#resolve-alias) 不懂得请自行研究。

<br/>

## can't not find 'xxModule' - 找不到某些依赖或者模块

这种情况一般报错信息可以看到是哪个包抛出的信息.
一般卸载这个模块,安装重新安装下即可.

<br/>

## 我用了 axios , 为什么 IE 浏览器不识别(IE9+)

IE 不支持 promise，所有需要单独引入 polyfill

```js
npm install es6-promise

// 在 main.js 首行引入即可
require("es6-promise").polyfill();
```

<br/>

## 其它任何关于 vue 的问题 ？

请你首先仔细阅读 vue [官方文档](https://cn.vuejs.org/index.html),但部分问题其实看报错就能知道原因了！

<br/>

## 辅助文章

[Vue 脱坑记 - 查漏补缺(汇总下群里高频询问的 xxx 及给出不靠谱的解决方案)](https://juejin.im/post/59fa9257f265da43062a1b0e)
