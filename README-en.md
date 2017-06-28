## Intro

> In the past half year, I have been building a backend for management dashboard using Vue. Though the backend has contained greater than 70 pages and over 10 permissions, it still takes insignificant effort to maintain the project. So I decide to make it open source so as to share my development experience and progress on backend. The tech stack is mainly [Vue.js](https://github.com/vuejs/vue)+[Element](https://github.com/ElemeFE/element)+[axios](https://github.com/mzabriskie/axios). Since it's a personal project, all data requests are simulated with [Mock.js](https://github.com/nuysoft/Mock). **Note:** if anyone wants to modify or develop based on this project, please remove the mock files.

**Live demo:** http://panjiachen.github.io/vue-element-admin

**Note: element-ui@1.3.3 is used in the project, so vue 2.3.0+ is required.**

More tutorials incoming. Including articles on:

- How to build structure of a backend dashboard project from scratch
- How to make a complete user system (e.g. permission authentication, two-factor authentication)
- How to package components (e.g. rich text)
- How to integrate with [Qiniu](https://www.qiniu.com/)
- Other development experience on backend

Join the group on QQ 591724180.

**Tutorials:**

- [Wiki](https://github.com/PanJiaChen/vue-element-admin/wiki)
- [Step by step instructions on playing with backend using Vue Part 1 - Fundamentals](https://juejin.im/post/59097cd7a22b9d0065fb61d2)
- [Step by step instructions on playing with backend using Vue Part 2 - Login permission](https://juejin.im/post/591aa14f570c35006961acac)
- [Step by step instructions on packaging a Vue component](https://segmentfault.com/a/1190000009090836)

**Please read the Wiki and articles above before creating any issue. Feel free to contribute by making a pull request.**

## Features

- Login/Logout
- Permission authentication
- Sidebar
- Breadcrumb
- Rich text editor
- Markdown editor
- JSON editor
- Drag & drop list
- SplitPane
- Dropzone
- Sticky
- CountTo
- ECharts
- 401, 404 error page
- Error log
- Exporting to Excel
- Table example
- Interactive table example
- Drag & drop table example
- Form example
- Multi-environments distribution
- Dashboard
- Two-factor authentication
- Collapsing sidebar (support nested routes)
- Mock data
- cache tabs example
- screenfull
- markdown2html
- views-tab

## Development

```bash
# Clone project
git clone https://github.com/PanJiaChen/vue-element-admin.git

# Install dependencies
npm install

# Or (not recommended for cnpm due to unknown bugs, use taobao mirror instead)
npm install --registry=https://registry.npm.taobao.org

# Run local dev server
npm run dev
```

Visit in browser: http://localhost:9527

## Distribution

```bash
# Build staged environment with webpack-bundle-analyzer
npm run build:sit-preview

# Build production environment
npm run build:prod
```

## Directory structure

```
├── build                      // build 
├── config                     // config
├── src                        // source code
│   ├── api                    // all requests
│   ├── assets                 // static resource like themes, fonts
│   ├── components             // global public components
│   ├── directive              // global directive
│   ├── filters                // global filters
│   ├── mock                   // mock data
│   ├── router                 // router
│   ├── store                  // global status management
│   ├── styles                 // global styles
│   ├── utils                  // global public functions
│   ├── view                   // view
│   ├── App.vue                // entry view
│   └── main.js                // entry for loading components, initialization
├── static                     // third-party libraries not packed with Webpack
│   ├── jquery
│   └── Tinymce                // rich text
├── .babelrc                   // babel-loader config
├── eslintrc.js                // eslint config
├── .gitignore                 // gitignore
├── favicon.ico                // favicon
├── index.html                 // html template
└── package.json               // package.json
```

## Changelog
Detailed changes for each release are documented in the [release notes](https://github.com/PanJiaChen/vue-element-admin/releases).

## State Management

Only status of user and app configuration is managed by Vuex. Other data are managed by their own business pages.

## Demo

#### Two-factor authentication, supporting WeChat and QQ

![](https://github.com/PanJiaChen/vue-element-admin/blob/master/gifs/2login.gif)

#### Realtime switching themes

![](https://github.com/PanJiaChen/vue-element-admin/blob/master/gifs/theme.gif)

#### tabs

![tabs](https://github.com/PanJiaChen/vue-element-admin/blob/master/gifs/tabs.gif)<br />

#### Collapsing sidebar

![](https://github.com/PanJiaChen/vue-element-admin/blob/master/gifs/leftmenu.gif)

#### Drag & drop table

![](https://github.com/PanJiaChen/vue-element-admin/blob/master/gifs/order.gif)

#### Interactive table

![](https://github.com/PanJiaChen/vue-element-admin/blob/master/gifs/dynamictable.gif)

#### Uploading cropped avatar

![](https://github.com/PanJiaChen/vue-element-admin/blob/master/gifs/uploadAvatar.gif)

#### Error log

![](https://github.com/PanJiaChen/vue-element-admin/blob/master/gifs/errorlog.gif)

#### Rich text (integrated with Qiniu, watermark and customization)

![](https://github.com/PanJiaChen/vue-element-admin/blob/master/gifs/editor.gif)

#### Packaging table component

![](https://github.com/PanJiaChen/vue-element-admin/blob/master/gifs/table.gif)

#### Charts

![](https://github.com/PanJiaChen/vue-element-admin/blob/master/gifs/echarts.gif)

#### Exporting to Excel

![](https://github.com/PanJiaChen/vue-element-admin/blob/master/gifs/excel.png)

#### More

http://panjiachen.github.io/vue-element-admin
