<p align="center">
  <img width="320" src="https://wpimg.wallstcn.com/ecc53a42-d79b-42e2-8852-5126b810a4c8.svg">
</p>

<p align="center">
  <a href="https://github.com/vuejs/vue">
    <img src="https://img.shields.io/badge/vue-2.5.10-brightgreen.svg" alt="vue">
  </a>
  <a href="https://github.com/ElemeFE/element">
    <img src="https://img.shields.io/badge/element--ui-2.3.2-brightgreen.svg" alt="element-ui">
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

[vue-element-admin](http://panjiachen.github.io/vue-element-admin) 是一个后台集成解决方案，它基于 [vue](https://github.com/vuejs/vue) 和 [element](https://github.com/ElemeFE/element)。它使用了最新的前端技术栈，内置了 i18 国际化解决方案，动态路由，权限验证，提炼了典型的业务模型，提供了丰富的功能组件，它可以帮助你快速搭建企业级中后台产品原型。相信不管你的需求是什么，本项目都能帮助到你。

- [在线访问](http://panjiachen.github.io/vue-element-admin)

- [使用文档](https://panjiachen.github.io/vue-element-admin-site/zh/)

- [Gitter 讨论组](https://gitter.im/vue-element-admin/discuss)

- [Wiki](https://github.com/PanJiaChen/vue-element-admin/wiki)

- [Donate](https://panjiachen.github.io/vue-element-admin-site/zh/donate/)

- [Gitee](https://panjiachen.gitee.io/vue-element-admin/) 国内用户可访问该地址在线预览

- [国内访问文档](https://panjiachen.gitee.io/vue-element-admin-site/zh/) 方便没翻墙的用户查看文档

**本项目的定位是后台集成方案，不适合当基础模板来开发。**

- 模板建议使用: [vue-admin-template](https://github.com/PanJiaChen/vue-admin-template)
- 桌面端: [electron-vue-admin](https://github.com/PanJiaChen/electron-vue-admin)

群主 **[圈子](https://jianshiapp.com/circles/1209)** 楼主会经常分享一些技术相关的东西，或者加入[qq 群](https://github.com/PanJiaChen/vue-element-admin/issues/602)

**注意：该项目使用 element-ui@2.3.0+ 版本，所以最低兼容 vue@2.5.0+**

**从`v3.8.0`开始使用`webpack4`。所以若还想使用`webpack3`开发，请使用该分支[webpack3](https://github.com/PanJiaChen/vue-element-admin/tree/webpack3)**

**该项目不支持低版本浏览器(如 ie)，有需求请自行添加 polyfill [详情](https://github.com/PanJiaChen/vue-element-admin/wiki#babel-polyfill)**

## 前序准备

你需要在本地安装 [node](http://nodejs.org/) 和 [git](https://git-scm.com/)。本项目技术栈基于 [ES2015+](http://es6.ruanyifeng.com/)、[vue](https://cn.vuejs.org/index.html)、[vuex](https://vuex.vuejs.org/zh-cn/)、[vue-router](https://router.vuejs.org/zh-cn/) 、[axios](https://github.com/axios/axios) 和 [element-ui](https://github.com/ElemeFE/element)，所有的请求数据都使用[Mock.js](https://github.com/nuysoft/Mock)模拟，提前了解和学习这些知识会对使用本项目有很大的帮助。

同时配套一个系列的教程文章，如何从零构建后一个完整的后台项目，建议大家先看完这些文章再来实践本项目

- [手摸手，带你用 vue 撸后台 系列一(基础篇)](https://juejin.im/post/59097cd7a22b9d0065fb61d2)
- [手摸手，带你用 vue 撸后台 系列二(登录权限篇)](https://juejin.im/post/591aa14f570c35006961acac)
- [手摸手，带你用 vue 撸后台 系列三 (实战篇)](https://juejin.im/post/593121aa0ce4630057f70d35)
- [手摸手，带你用 vue 撸后台 系列四(vueAdmin 一个极简的后台基础模板)](https://juejin.im/post/595b4d776fb9a06bbe7dba56)
- [手摸手，带你封装一个 vue component](https://segmentfault.com/a/1190000009090836)
- [手摸手，带你优雅的使用 icon](https://juejin.im/post/59bb864b5188257e7a427c09)
- [手摸手，带你用合理的姿势使用 webpack4（上）](https://juejin.im/post/5b56909a518825195f499806)
- [手摸手，带你用合理的姿势使用 webpack4（下）](https://juejin.im/post/5b5d6d6f6fb9a04fea58aabc)

**如有问题请先看上述使用文档和文章，若不能满足，欢迎 issue 和 pr**

 <p align="center">
  <img width="900" src="https://wpimg.wallstcn.com/a5894c1b-f6af-456e-82df-1151da0839bf.png">
</p>

## 功能

```
- 登录 / 注销

- 权限验证
  - 页面权限
  - 指令权限
  - 二步登录

- 多环境发布
  - dev sit stage prod

- 全局功能
  - 国际化多语言
  - 多种动态换肤
  - 动态侧边栏（支持多级路由嵌套）
  - 动态面包屑
  - 快捷导航(标签页)
  - Svg Sprite 图标
  - 本地mock数据
  - Screenfull全屏
  - 自适应收缩侧边栏

- 编辑器
  - 富文本
  - Markdown
  - JSON 等多格式

- Excel
  - 导出excel
  - 导出zip
  - 导入excel
  - 前端可视化excel

- 表格
  - 动态表格
  - 拖拽表格
  - 树形表格
  - 内联编辑

- 错误页面
  - 401
  - 404

- 組件
  - 头像上传
  - 返回顶部
  - 拖拽Dialog
  - 拖拽看板
  - 列表拖拽
  - SplitPane
  - Dropzone
  - Sticky
  - CountTo

- 综合实例
- 错误日志
- Dashboard
- 引导页
- Echarts 图表
- Clipboard(剪贴复制)
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

# 构建生产环境
npm run build:prod
```

## 其它

```bash
# --report to build with bundle size analytics
npm run build:prod

# --generate a bundle size analytics. default: bundle-report.html
npm run build:prod --generate_report

# --preview to start a server in local to preview
npm run build:prod --preview

# lint code
npm run lint

# auto fix
npm run lint -- --fix
```

更多信息请参考 [使用文档](https://panjiachen.github.io/vue-element-admin-site/zh/)

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
