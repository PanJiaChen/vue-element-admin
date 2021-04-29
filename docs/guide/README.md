---
pageClass: getting-started
---

# Introduction

**Note: This documentation was forked from original project of [PanJiaChen](https://github.com/PanJiaChen/vue-element-admin-site). The honour is for him because started this big project. Any change after forked is maked from [ADempiere Team](https://github.com/adempiere/adempiere)**

[![vue](https://img.shields.io/badge/vue-2.6.10-brightgreen.svg)](https://github.com/vuejs/vue)
[![element-ui](https://img.shields.io/badge/element--ui-2.7.0-brightgreen.svg)](https://github.com/ElemeFE/element)
[![Build Status](https://travis-ci.org/adempiere/adempiere-vue.svg?branch=master)](https://travis-ci.org/adempiere/adempiere-vue)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/adempiere/adempiere-vue/blob/master/LICENSE)
[![GitHub release](https://img.shields.io/github/release/PanJiaChen/adempiere-vue.svg)](https://github.com/adempiere/adempiere-vue/releases)
[![donate](https://img.shields.io/badge/%24-donate-ff69b4.svg)](https://adempiere-vue.gitee.io/adempiere-vue-site/zh/donate)
[![GitHub stars](https://img.shields.io/github/stars/adempiere/adempiere-vue.svg?style=social&label=Stars)](https://github.com/adempiere/adempiere-vue)

[adempiere-vue](http://adempiere.github.io/adempiere-vue) is a production-ready front-end solution for admin interfaces. It based on [vue](https://github.com/vuejs/vue) and use the UI Toolkit [element-ui](https://github.com/ElemeFE/element).

It is a magical vue admin based on the newest development stack of vue, built-in i18n solution, typical templates for enterprise applications, lots of awesome features. It helps you build a large complex Single-Page Applications. I believe whatever your needs are, this project will help you.

:::tip
This project integrates a lot of features that you may not use, it will cause a lot of code redundancy. If your project does not pay attention to this issue, you can also directly develop it based on it.
Otherwise, you can use [vue-admin-template](https://github.com/adempiere/vue-admin-template).

- Integrated Solution: [adempiere-vue](https://github.com/adempiere/adempiere-vue)
- Basic Template: [vue-admin-template](https://github.com/adempiere/vue-admin-template)
- Desktop: [electron-vue-admin](https://github.com/PanJiaChen/electron-vue-admin)
- Typescript: [vue-typescript-admin-template](https://github.com/Armour/vue-typescript-admin-template) (Credits: [@Armour](https://github.com/Armour))
- Others: [awesome-project](https://github.com/adempiere/adempiere-vue/issues/2312)
  :::

<br/>

## Features

```
- Login / Logout

- Permission Authentication
  - Page permission
  - Directive permission
  - Permission configuration page
  - Two-step login

- Multi-environment build
  - dev sit stage prod

- Global Features
  - I18n
  - Multiple dynamic themes
  - Dynamic sidebar (supports multi-level routing)
  - Dynamic breadcrumb
  - Tags-view (Tab page Support right-click operation)
  - Svg Sprite
  - Mock data
  - Screenfull
  - Responsive Sidebar

- Editor
  - Rich Text Editor
  - Markdown Editor
  - JSON Editor

- Excel
  - Export Excel
  - Upload Excel
  - Visualization Excel
  - Export zip

- Table
  - Dynamic Table
  - Drag And Drop Table
  - Inline Edit Table

- Error Page
  - 401
  - 404

- Components
  - Avatar Upload
  - Back To Top
  - Drag Dialog
  - Drag Select
  - Drag Kanban
  - Drag List
  - SplitPane
  - Dropzone
  - Sticky
  - CountTo

- Advanced Example
- Error Log
- Dashboard
- Guide Page
- ECharts
- Clipboard
- Markdown to html
```

<br/>

## Preparation

You need to install [node](http://nodejs.org/) and [git](https://git-scm.com/) locally. The project is based on [ES2015+](http://es6.ruanyifeng.com/), [vue](https://cn.vuejs.org/index.html), [vuex](https://vuex.vuejs.org/zh-cn/), [vue-router](https://router.vuejs.org/zh-cn/), [vue-cli](https://github.com/vuejs/vue-cli) , [axios](https://github.com/axios/axios) and [element-ui](https://github.com/ElemeFE/element), all request data is simulated using [Mock.js](https://github.com/nuysoft/Mock).
Understanding and learning this knowledge in advance will greatly help the use of this project.

At the same time supporting a series of tutorial articles, how to build a complete background project from zero, suggest that you read these articles and then come to practice this project. But there's no English version yet.

- [手摸手，带你用 vue 撸后台 系列一(基础篇)](https://juejin.im/post/59097cd7a22b9d0065fb61d2)
- [手摸手，带你用 vue 撸后台 系列二(登录权限篇)](https://juejin.im/post/591aa14f570c35006961acac)
- [手摸手，带你用 vue 撸后台 系列三 (实战篇)](https://juejin.im/post/593121aa0ce4630057f70d35)
- [手摸手，带你用 vue 撸后台 系列四(vueAdmin 一个极简的后台基础模板)](https://juejin.im/post/595b4d776fb9a06bbe7dba56)
- [手摸手，带你用 vue 撸后台 系列五(v4.0 新版本)](https://juejin.im/post/5c92ff94f265da6128275a85)
- [手摸手，带你封装一个 vue component](https://segmentfault.com/a/1190000009090836)
- [手摸手，带你优雅的使用 icon](https://juejin.im/post/59bb864b5188257e7a427c09)
- [手摸手，带你用合理的姿势使用 webpack4（上）](https://juejin.im/post/5b56909a518825195f499806)
- [手摸手，带你用合理的姿势使用 webpack4（下）](https://juejin.im/post/5b5d6d6f6fb9a04fea58aabc)

::: tip
**This project does not support low-level browsers (such as ie). If you need to, please add polyfills yourself.**
:::

## Project Structure

This project has built the following templates, and have built a scaffold based on Vue, which should help you prototyping production-ready admin interfaces. It covers almost everything you need.

```bash
├── build                      # build config files
├── mock                       # mock data
├── plop-templates             # basic template
├── public                     # pure static assets (directly copied)
│   │── favicon.ico            # favicon
│   └── index.html             # index.html template
├── src                        # main source code
│   ├── api                    # api service
│   ├── assets                 # module assets like fonts,images (processed by webpack)
│   ├── components             # global components
│   ├── directive              # global directive
│   ├── filters                # global filter
│   ├── icons                  # svg icons
│   ├── lang                   # i18n language
│   ├── layout                 # global layout
│   ├── router                 # router
│   ├── store                  # store
│   ├── styles                 # global css
│   ├── utils                  # global utils
│   ├── vendor                 # vendor
│   ├── views                  # views
│   ├── App.vue                # main app component
│   ├── main.js                # app entry file
│   └── permission.js          # permission authentication
├── tests                      # tests
├── .env.xxx                   # env variable configuration
├── .eslintrc.js               # eslint config
├── .babelrc                   # babel config
├── .travis.yml                # automated CI configuration
├── vue.config.js              # vue-cli config
├── postcss.config.js          # postcss config
└── package.json               # package.json
```

## Getting Started

```bash
# clone the project
git clone https://github.com/adempiere/adempiere-vue.git

# install dependency
yarn

# develop
yarn dev
```

<br/>

This will automatically open [http://localhost:9527](http://localhost:9527).

If you see the following page then you have succeeded.

![](https://adempiere-vue.gitee.io/gitee-cdn/adempiere-vue-site/1bc334a6-32a8-4f29-a037-ac3f5ce32588.png)

We have built-in models, standard components, mock data, hot module reloading, state management, i18n, global router, etc. You can continue exploring other documents for more details on those topics.

<br/>

::: tip
**Suggestion：** You can use `adempiere-vue` as a toolbox or as an integration solution repository, It is recommended to do secondary development on the basis of `vue-admin-template`, if you need any additional feature, you can copy from `adempiere-vue`.
:::

## Contribution

The repository of documentation is [adempiere-vue-site](https://github.com/erpcya/adempiere-vue-site) based on [vuepress](https://github.com/vuejs/vuepress) development.

There may be some spelling or translation errors in the course of writing this document. It is welcome to point out by issue or pr. After all, English is not my mother tongue.

[adempiere-vue](https://github.com/adempiere/adempiere-vue) is also continuing to iterate, summarize and summarize more features, and summarize the best practices of product templates/components/business scenarios in the middle and back office. This project is also very much looking forward to your participation and [feedback](https://github.com/adempiere/adempiere-vue/issues).

## Donate

If you think this project is useful, you can buy a glass of juice for the author :heart:
[Donate](/donate/)

## Browsers Support

Modern browsers and Internet Explorer 10+.

<!-- prettier-ignore -->
| [<img class="no-margin" src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img class="no-margin" src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img class="no-margin" src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img class="no-margin" src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari |
| --------- | --------- | --------- | --------- |
| IE10, IE11, Edge| last 2 versions| last 2 versions| last 2 versions

## Vue Ecosystem

**First understanding the things in these vue ecosystems will help you get started with this project.**

1. [Vue Router](https://router.vuejs.org/) Vue Router is the official router for Vue.js. It deeply integrates with Vue.js core to make building Single Page Applications with Vue.js a breeze.

2. [Vuex](https://vuex.vuejs.org/) Vuex is a state management pattern + library for Vue.js applications. It serves as a centralized store for all the components in an application, with rules ensuring that the state can only be mutated in a predictable fashion.

3. [Vue Loader](https://vue-loader.vuejs.org) Vue-loader is a loader for webpack that allows you to author Vue components in a format called Single-File Components (SFCs). The combination of webpack and vue-loader gives you a modern, flexible and extremely powerful front-end workflow for authoring Vue.js applications.

4. [Vue Server Renderer](https://ssr.vuejs.org/) Vue-server-renderer facilitates building of isomorphic or universal JavaScript applications which runs both on server and client side where majority of the application code is shared and reused.

5. [Vue Test Utils](https://vue-test-utils.vuejs.org/) Vue Test Utils is the official unit testing utility library for Vue.js.

6. [Vue Dev-Tools](https://github.com/vuejs/vue-devtools) Browser devtools extension for debugging Vue.js applications.

7. [Vue CLI](https://cli.vuejs.org/) Vue CLI is a full system for rapid Vue.js development. It aims to be the standard tooling baseline for the Vue ecosystem. It ensures the various build tools work smoothly together with sensible defaults so you can focus on writing your app instead of spending days wrangling with configurations.

8. [Vetur](https://github.com/vuejs/vetur) Vue tooling for VS Code. Write vue essential plugins under VS Code.
