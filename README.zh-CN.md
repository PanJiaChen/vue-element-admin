<p align="center">
  <img width="320" src="https://wpimg.wallstcn.com/ecc53a42-d79b-42e2-8852-5126b810a4c8.svg">
</p>

<p align="center">
  <a href="https://github.com/vuejs/vue">
    <img src="https://img.shields.io/badge/vue-2.5.10-brightgreen.svg" alt="vue">
  </a>
  <a href="https://github.com/ElemeFE/element">
    <img src="https://img.shields.io/badge/element--ui-2.3.0-brightgreen.svg" alt="element-ui">
  </a>
  <a href="https://travis-ci.org/PanJiaChen/vue-element-admin" rel="nofollow">
    <img src="https://travis-ci.org/PanJiaChen/vue-element-admin.svg?branch=master" alt="Build Status">
  </a>
  <a href="https://github.com/PanJiaChen/vue-element-admin/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/mashape/apistatus.svg" alt="license">
  </a>
  <a href="https://github.com/PanJiaChen/vue-element-admin/releases">
    <img src="https://img.shields.io/github/release/PanJiaChen/vue-element-admin.svg" alt="GitHub release">
  </a>
</p>

简体中文 | [English](./README.md)

## 简介

`vue-element-admin` 是一个后台集成解决方案，它基于 [Vue.js](https://github.com/vuejs/vue) 和 [element](https://github.com/ElemeFE/element)。它使用了最新的前端技术栈，内置了i18国际化解决方案，动态路由，权限验证等很多功能特性，相信不管你的需求是什么，本项目都能帮助到你。

- [在线访问](http://panjiachen.github.io/vue-element-admin)

- [使用文档](https://panjiachen.github.io/vue-element-admin-site/#/zh-cn/)

- [Wiki](https://github.com/PanJiaChen/vue-element-admin/wiki)

- [Donate](https://panjiachen.github.io/vue-element-admin-site/#/zh-cn/donate)

**本项目的定位是后台集成方案，不适合当基础模板来开发。**
 - 模板建议使用: [vueAdmin-template](https://github.com/PanJiaChen/vueAdmin-template)  
 - 桌面端: [electron-vue-admin](https://github.com/PanJiaChen/electron-vue-admin)

**注意：该项目使用 element-ui@2.3.0+ 版本，所以最低兼容 vue@2.5.0+**

## 前序准备

你的本地环境需要安装 [node](http://nodejs.org/) 和 [git](https://git-scm.com/)。我们的技术栈基于 [ES2015+](http://es6.ruanyifeng.com/)、[vue](https://cn.vuejs.org/index.html)、[vuex](https://vuex.vuejs.org/zh-cn/)、[vue-router](https://router.vuejs.org/zh-cn/) and [element-ui](https://github.com/ElemeFE/element)，所有的请求数据都使用[Mock.js](https://github.com/nuysoft/Mock)模拟，提前了解和学习这些知识会对使用本项目有很大的帮助。

同时配套一个系列的教程文章，如何从零构建后一个完整的后台项目，建议大家先看完这些文章再来实践本项目
 - [手摸手，带你用 vue 撸后台 系列一(基础篇)](https://juejin.im/post/59097cd7a22b9d0065fb61d2)
 - [手摸手，带你用 vue 撸后台 系列二(登录权限篇)](https://juejin.im/post/591aa14f570c35006961acac)
 - [手摸手，带你用 vue 撸后台 系列三 (实战篇)](https://juejin.im/post/593121aa0ce4630057f70d35)
 - [手摸手，带你用 vue 撸后台 系列四(vueAdmin 一个极简的后台基础模板)](https://juejin.im/post/595b4d776fb9a06bbe7dba56)
 - [手摸手，带你封装一个 vue component](https://segmentfault.com/a/1190000009090836)
 - [手摸手，带你优雅的使用 icon](https://juejin.im/post/59bb864b5188257e7a427c09)


 或者加入该群主 **[圈子](https://jianshiapp.com/circles/1209)** 楼主会经常分享一些技术相关的东西

 **如有问题请先看上述使用文档和文章，若不能满足，欢迎 issue 和 pr**

 **本项目并不是一个脚手架，更倾向于是一个集成解决方案**

 **该项目不支持低版本浏览器(如ie)，有需求请自行添加polyfill [详情](https://github.com/PanJiaChen/vue-element-admin/wiki#babel-polyfill)**

 <p align="center">
  <img width="900" src="https://wpimg.wallstcn.com/a5894c1b-f6af-456e-82df-1151da0839bf.png">
</p>

## 功能
```
- 登录/注销
- 权限验证
- 多环境发布
- 动态侧边栏（支持多级路由）
- 动态面包屑
- 国际化多语言
- 多种动态换肤
- 快捷导航(标签页)
- 富文本编辑器
- Markdown编辑器
- JSON编辑器
- Screenfull全屏
- 列表拖拽
- Svg Sprite 图标
- Dashboard
- 本地mock数据
- Echarts 图表
- Clipboard(剪贴复制)
- 401/404错误页面
- 错误日志
- 导出excel
- 导出zip
- 前端可视化excel
- 树形table
- Table example
- 动态table example
- 拖拽table example
- 内联编辑table example
- Form example
- 二步登录
- SplitPane
- 拖拽 Dialog
- Dropzone
- Sticky
- CountTo
- Markdown2html
```

## 开发
```bash
# 克隆项目
git clone https://github.com/PanJiaChen/vue-element-admin.git

# 安装依赖
npm install
   
# 建议不要用cnpm安装 会有各种诡异的bug 可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```
浏览器访问 http://localhost:9527

## 发布
```bash
# 构建测试环境
npm run build:sit

# 构建生成环境
npm run build:prod
```

## 其它
```bash
# --report to build with bundle size analytics
npm run build:prod --report

# --preview to start a server in local to preview
npm run build:prod --preview

# lint code
npm run lint

# auto fix
npm run lint -- --fix
```

更多信息请参考 [使用文档](https://panjiachen.github.io/vue-element-admin-site/#/zh-cn/deploy)

## Changelog
Detailed changes for each release are documented in the [release notes](https://github.com/PanJiaChen/vue-element-admin/releases).

## Online Demo
[在线 Demo](http://panjiachen.github.io/vue-element-admin)

## Donate
如果你觉得这个项目帮助到了你，你可以帮作者买一杯果汁表示鼓励 :tropical_drink:
![donate](https://panjiachen.github.io/donate/donation.png)

[Paypal Me](https://www.paypal.me/panfree23)

## License

[MIT](https://github.com/PanJiaChen/vue-element-admin/blob/master/LICENSE)

Copyright (c) 2017-present PanJiaChen
