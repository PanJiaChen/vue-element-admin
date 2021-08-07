<p align="center">
  <img width="320" src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Adempiere-logo.png">
</p>

<p align="center">
  <a href="https://github.com/vuejs/vue">
    <img src="https://img.shields.io/badge/vue-2.6.10-brightgreen.svg" alt="vue version">
  </a>
  <a href="https://github.com/ElemeFE/element">
    <img src="https://img.shields.io/badge/element--ui-2.15.3-brightgreen.svg" alt="element-ui">
  </a>
  <a href="https://hub.docker.com/r/erpya/adempiere-vue/">
    <img src="https://img.shields.io/docker/pulls/erpya/adempiere-vue.svg" alt="Docker Pulls">
  </a>
  <a href="https://github.com/adempiere/adempiere-vue/actions/workflows/publish.yml">
    <img src="https://github.com/adempiere/adempiere-vue/actions/workflows/publish.yml/badge.svg" alt="Publish GH Action">
  </a>
  <a href="https://github.com/adempiere/adempiere-vue/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/license-GNU/GPL%20(v3)-blue" alt="license">
  </a>
  <a href="https://github.com/adempiere/adempiere-vue/releases/latest">
    <img src="https://img.shields.io/github/release/adempiere/adempiere-vue.svg" alt="GitHub release">
  </a>
  <a href="https://gitter.im/adempiere/adempiere-vue">
    <img src="https://badges.gitter.im/Join%20Chat.svg" alt="Gitter">
  </a>
</p>


English | [Spanish](./README.es.md)

## Introduction

[adempiere-vue](https://github.com/adempiere/adempiere-vue) is a new UI for [ADempiere ERP, CRM & SCM](https://github.com/adempiere/adempiere)]. It based on [vue](https://github.com/vuejs/vue) and use the UI Toolkit [element-ui](https://github.com/ElemeFE/element).

![POS Image](docs/.vuepress/public/images/forms/point-of-sales/pos-en.png)

It is a great UI for [ADempiere ERP, CRM & SCM](https://github.com/adempiere/adempiere) based on the newest development stack of vue, built-in i18n solution, typical templates for enterprise applications, lots of awesome features. This project was forked from [Vue-Element-Admin](https://github.com/PanJiaChen/vue-element-admin) originally write by [PanJiaChen / 花裤衩](https://github.com/PanJiaChen) over [MIT license](https://github.com/PanJiaChen/vue-element-admin/blob/master/LICENSE) and was changed to [GNU/GPL v3](https://github.com/adempiere/adempiere-vue/blob/master/LICENSE) by [Yamel Senih](https://github.com/yamelsenih) after forked granted by [PanJiaChen / 花裤衩](https://github.com/PanJiaChen) on issue ["Extend as GNU/Gpl v3 License #1434"](https://github.com/PanJiaChen/vue-element-admin/issues/1434).

[adempiere-vue](https://github.com/adempiere/adempiere-vue) use the modern open source high performance RPC framework that can run in any environment [gRPC](https://grpc.io/) as [server](https://github.com/adempiere/adempiere-gRPC-Server).

- [Preview](https://demo-ui.erpya.com/)

  - **User**: demo
  - **Password**: demo


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

## Run docker container:

### Minimal Docker Requirements

To use this Docker image you must have your Docker engine release number greater
than or equal to 3.0.

Build docker image (for development only):
```shell
docker build -t erpya/adempiere-vue:dev -f ./Dockerfile .
```

Download docker image:
```shell
docker pull erpya/adempiere-vue
```

Run container container:
```shell
docker run -it \
	--name adempiere-vue \
	-p 80:80 \
	-e API_URL="https://api.erpya.com" \
	erpya/adempiere-vue
```


### Environment variables for the configuration

 * `API_URL`: It indicates the address of the server to which you will point the service [Proxy-Adempiere-Api](https://github.com/adempiere/proxy-adempiere-api), by default its value is `https://https://api.erpya.com`.

NOTE: If you do not change the values of the environment variables, it is not necessary to indicate them in the `docker run` command, since the default values will be set.


### Run docker container with docker-compose:

Or easy run container using docker-compose with follow command:
```shell
docker-compose up
```

Terminal output:
```shell
Building web-client
Step 1/8 : FROM node:12-alpine
 ---> 057fa4cc38c2
Step 2/8 : LABEL maintainer="EdwinBetanc0urt@outlook.com"       description="ADempiere-Vue"
 ---> Running in d096cf76ce2d
Removing intermediate container d096cf76ce2d
 ---> 46cc05704121
Step 3/8 : ENV RELEASE_VERSION="3.9.3"
 ---> Running in 9048d159aaf9
Removing intermediate container 9048d159aaf9
 ---> a19699234a5d
Step 4/8 : ENV URL_REPO="https://github.com/adempiere/adempiere-vue"    BINARY_NAME="v$RELEASE_VERSION.zip"     VUE_APP_PROXY_ADDRESS="localhost"       VUE_APP_PROXY_PORT="8989"
 ---> Running in c703a3818cbf
Removing intermediate container c703a3818cbf
 ---> 86b0c2b269c6
Step 5/8 : RUN mkdir -p /opt/Apps &&    cd /opt/Apps &&         echo "Install needed packages... $BINARY_NAME $RELEASE_VERSION" &&      apk --no-cache add curl unzip &&        curl --output "$BINARY_NAME" -L "$URL_REPO/archive/$BINARY_NAME" &&     unzip -o "$BINARY_NAME" &&      rm "$BINARY_NAME" &&    mv "adempiere-vue-$RELEASE_VERSION" adempiere-vue &&    cd adempiere-vue &&    npm install &&   npm run build:prod
 ---> Running in 6f3cb21924dd
Install needed packages... v3.9.3.zip 3.9.3
fetch http://dl-cdn.alpinelinux.org/alpine/v3.11/main/x86_64/APKINDEX.tar.gz
fetch http://dl-cdn.alpinelinux.org/alpine/v3.11/community/x86_64/APKINDEX.tar.gz
(1/5) Installing ca-certificates (20191127-r2)
(2/5) Installing nghttp2-libs (1.40.0-r1)
(3/5) Installing libcurl (7.67.0-r0)
(4/5) Installing curl (7.67.0-r0)
(5/5) Installing unzip (6.0-r6)
Executing busybox-1.31.1-r9.trigger
Executing ca-certificates-20191127-r2.trigger
OK: 9 MiB in 21 packages
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   128  100   128    0     0    149      0 --:--:-- --:--:-- --:--:--   149
100  916k    0  916k    0     0   180k      0 --:--:--  0:00:05 --:--:--  254k
Archive:  v3.9.3.zip
1d684b76328e3f6bcd3f75ea011087cce1c13a3c
   creating: adempiere-vue-3.9.3/
  inflating: adempiere-vue-3.9.3/.babelrc
  inflating: adempiere-vue-3.9.3/.editorconfig
adempiere-ui-client |
adempiere-ui-client | > Listening at  http://localhost:9526/

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

Refer to [Documentation](https://adempiere.github.io/adempiere-vue/guide/essentials/deploy.html#build) for more information

## Docker Container

```bash
# requires superuser permissions of the operating system ('su' or 'sudo')
docker-compose up
```

## Changelog

Detailed changes for each release are documented in the [release notes](https://github.com/adempiere/adempiere-vue/releases).

## Online Demo

[Preview](https://demo-ui.erpya.com)

- **User**: demo
- **Password**: demo

## Donate

If you find this project useful, you can help this make a better UI

[Paypal Me](https://www.paypal.me/YamelSenih)

### Some Contributors
Thanks you for any effort to improve this great project. The follows are some companies that paying for help us to  make a best software.

<table>
  <tbody>
    <tr>
      <td align="center" valign="middle">
        <a href="www.vdevsoft.com">
          <img
            src="https://user-images.githubusercontent.com/2333092/110265373-c2cafb00-7f91-11eb-84de-2aba7f2c2024.jpg"
            alt="vDevSoft"
            width="150"
          >
        </a>
      </td>
    </tr>
  </tbody>
</table>

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
