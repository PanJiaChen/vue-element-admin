<p align="center">
  <img width="320" src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Adempiere-logo.png">
</p>

<p align="center">
  <a href="https://github.com/vuejs/vue">
    <img src="https://img.shields.io/badge/vue-2.6.10-brightgreen.svg" alt="vue">
  </a>
  <a href="https://github.com/ElemeFE/element">
    <img src="https://img.shields.io/badge/element--ui-2.7.0-brightgreen.svg" alt="element-ui">
  </a>
  <a href="https://travis-ci.org/adempiere/adempiere-vue" rel="nofollow">
    <img src="https://travis-ci.org/adempiere/adempiere=vue.svg?branch=develop" alt="Build Status">
  </a>
  <a href="https://github.com/adempiere/adempiere-vue/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/license-GNU/GPL%20(v3)-blue" alt="license">
  </a>
  <a href="https://github.com/adempiere/adempiere-vue/releases">
    <img src="https://img.shields.io/github/release/adempiere/adempiere-vue.svg" alt="GitHub release">
  </a>
  <a href="https://gitter.im/adempiere/adempiere-vue">
    <img src="https://badges.gitter.im/Join%20Chat.svg" alt="gitter">
  </a>
</p>


English | [Spanish](./README.es.md)

## Introduction

[adempiere-vue](https://github.com/adempiere/adempiere-vue) is a new UI for [ADempiere ERP, CRM & SCM](https://github.com/adempiere/adempiere)]. It based on [vue](https://github.com/vuejs/vue) and use the UI Toolkit [element-ui](https://github.com/ElemeFE/element).

It is a great UI for [ADempiere ERP, CRM & SCM](https://github.com/adempiere/adempiere) based on the newest development stack of vue, built-in i18n solution, typical templates for enterprise applications, lots of awesome features. This project was forked from [Vue-Element-Admin](https://github.com/PanJiaChen/vue-element-admin) originally write by [PanJiaChen / 花裤衩](https://github.com/PanJiaChen) over [MIT license](https://github.com/PanJiaChen/vue-element-admin/blob/master/LICENSE) and was changed to [GNU/GPL v3](https://github.com/adempiere/adempiere-vue/blob/master/LICENSE) by [Yamel Senih](https://github.com/yamelsenih) after forked granted by [PanJiaChen / 花裤衩](https://github.com/PanJiaChen) on issue ["Extend as GNU/Gpl v3 License #1434"](https://github.com/PanJiaChen/vue-element-admin/issues/1434).

[adempiere-vue](https://github.com/adempiere/adempiere-vue) use the modern open source high performance RPC framework that can run in any environment [gRPC](https://grpc.io/) as [server](https://github.com/adempiere/adempiere-gRPC-Server).

- [Preview](https://demo-ui.erpya.com/)

- [Documentation](https://adempiere.github.io/adempiere-vue-site/)

- [Gitter](https://gitter.im/adempiere/adempiere-vue)

- [Donate](https://www.paypal.me/YamelSenih)

- [Wiki](http://wiki.adempiere.io/ADempiere_ERP)

- [Forked From](https://github.com/PanJiaChen/vue-element-admin)

**The current version is `v1.0+` build on `vue-cli`. If you find a problem, please put [issue](https://github.com/adempiere/adempiere-vue/issues/new).**

**This project does not support low version browsers (e.g. IE). Please add polyfill by yourself.**

## Preparation

You need to install [node](https://nodejs.org/) and [git](https://git-scm.com/) locally. The project is based on [ES2015+](https://es6.ruanyifeng.com/), [vue](https://cn.vuejs.org/index.html), [vuex](https://vuex.vuejs.org/zh-cn/), [vue-router](https://router.vuejs.org/zh-cn/), [vue-cli](https://github.com/vuejs/vue-cli) , [gRPC](https://grpc.io/) and [element-ui](https://github.com/ElemeFE/element).
Understanding and learning this knowledge in advance will greatly help the use of this project.

[![Edit on CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/PanJiaChen/vue-element-admin/tree/CodeSandbox)

<p align="center">
  <img width="900" src="https://wpimg.wallstcn.com/a5894c1b-f6af-456e-82df-1151da0839bf.png">
</p>

### For all enviroment you should run the follow images:
- ADempiere gRPC: https://hub.docker.com/r/erpya/adempiere-grpc-all-in-one
```shell
docker pull erpya/adempiere-grpc-all-in-one
```
- Proxy ADempiere API: https://hub.docker.com/r/erpya/proxy-adempiere-api
```shell
docker pull erpya/proxy-adempiere-api
```
- ADempiere Vue: https://hub.docker.com/r/erpya/adempiere-vue
```shell
docker pull erpya/adempiere-vue
```

## Sponsors

<a href="http://erpya.com/">
  <img alt="ERP Consultores y Asociados" width="250px" src="https://erpya.com/wp-content/uploads/2017/11/ERP-logotipo-H-color.png" />
</a>
<a href="http://westfalia-it.com/">
  <img width="150px" src="https://i2.wp.com/www.westfalia-it.com/wp-content/uploads/sites/30/2017/12/logo_copy.jpg?fit=265%2C357" />
</a>
<a href="http://openupsolutions.com/">
  <img width="250px" src="https://i2.wp.com/openupsolutions.com/wp-content/uploads/sites/32/2017/05/Openup-Solutions-Logo-2017-80x200px.png?fit=243%2C40" />
</a>

Become a sponsor and get your logo on our README on GitHub with a link to your site. [Become a sponsor](https://www.paypal.me/YamelSenih)

## Features

```
- Login / Logout
- Register
- Forgot Password

- Permission Authentication
  - ADempiere backend permission
  - Page permission
  - Directive permission
  - Permission configuration page

- Multi-environment build
  - Develop (dev)
  - sit
  - Stage Test (stage)
  - Production (prod)

- Global Features
  - I18n
  - Multiple dynamic themes
  - Dynamic sidebar (supports multi-level routing)
  - Dynamic breadcrumb
  - Tags-view (Tab page Support right-click operation)
  - Svg Sprite
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

- ADempiere supported
  - Window
  - Process
  - Report
  - Smart Browser
  - Form
  - Workflow

- Advanced Example
- Error Log
- Dashboard
- Guide Page
- ECharts
- Clipboard
- Markdown to html
```

## Getting started

Use [gRPC ADempiere Server](https://github.com/adempiere/adempiere-gRPC-Server) as gRPC provider.

```bash
# clone the project
git clone -b develop git@github.com:adempiere/adempiere-vue-.git

# enter the project directory
cd adempiere-vue

# install dependency
npm install

# develop
npm run dev
```

This will automatically open http://localhost:9527

## Build

```bash
# build for test environment
npm run build:stage

# build for production environment
npm run build:prod
```

## Advanced

```bash
# preview the release environment effect
npm run preview

# preview the release environment effect + static resource analysis
npm run preview -- --report

# code format check
npm run lint

# code format check and auto fix
npm run lint -- --fix
```

Refer to [Documentation](https://adempiere.github.io/adempiere-vue-site/guide/essentials/deploy.html#build) for more information

## Changelog

Detailed changes for each release are documented in the [release notes](https://github.com/adempiere/adempiere-vue/releases).

## Online Demo

[Preview](http://adempiere-ui.erpya.com)

## Donate

If you find this project useful, you can help this make a better UI

[Paypal Me](https://www.paypal.me/YamelSenih)

## Browsers support

Modern browsers and Internet Explorer 10+.

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Safari |
| --------- | --------- | --------- | --------- |
| IE10, IE11, Edge | last 2 versions | last 2 versions | last 2 versions |

## License

[GNU/GPL v3](https://github.com/adempiere/adempiere-vue/blob/master/LICENSE)

## Previous License
[MIT](./PREVIOUS-LICENSE)

## Initial Contributors

- [Yamel Senih](https://github.com/yamelsenih)
- [Raúl Muñoz](https://github.com/Raul-mz)
- [Edwin Betancourt](https://github.com/EdwinBetanc0urt)
- [Leonel Matos](https://github.com/leonel1524)
- [Elsio Sanchez](https://github.com/elsiosanchez)
