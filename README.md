[线上地址](http://panjiachen.github.io/vue-element-admin)

## 前言
> 这半年来一直在用vue写管理后台，目前后台已经有七十多个页面，十几种权限，但维护成本依然很低，所以准备开源分享一下后台开发的经验和成果。目前的技术栈主要的采用vue+element+axios.由于是个人项目，所以数据请求都是用了mockjs代替。

后续会出一系列的教程配套文章，如如何从零构建后台项目框架，如何做完整的用户系统（如权限验证，二次登录等），如何二次开发组件（如富文本），如何整合七牛等等文章，各种后台开发经验等等。莫急~~

## 功能
- 登录/注销
- 权限验证
- 侧边栏
- 面包屑
- 富文本编辑器
- Markdown编辑器
- JSON编辑器
- 列表拖拽
- plitPane
- Dropzone
- Sticky
- CountTo
- echarts图表
- 401，401错误页面
- 错误日志
- 导出excel
- table example
- form example
- 多环境发布
- dashboard
- 二次登录
- 动态侧边栏
- mock数据


## 开发
```bash
    # 克隆项目
    git clone https://github.com/PanJiaChen/vue-element-admin.git

    # 安装依赖
    npm install
    
    # 建议不要用cnpm  安装有各种诡异的bug 可以通过如下操作解决npm速度慢的问题
    npm install --registry=https://registry.npm.taobao.org

    # 本地开发 开启服务
    npm run dev
```
浏览器访问 http://localhost:9527

## 发布
```bash
    # 发布测试环境 带webpack ananalyzer
    npm run build:sit-preview

    # 构建生成环境
    npm run build:prod
```

## 目录结构
```shell
├── build                      // 构建相关  
├── config                     // 配置相关
├── src                        // 源代码
│   ├── api                    // 所以请求
│   ├── assets                 // 主题 字体等静态资源
│   ├── components             // 全局公用组件
│   ├── directive              // 全局指令
│   ├── filtres                // 全局filter
│   ├── mock                   // mock数据
│   ├── router                 // 路由
│   ├── store                  // 全局store管理
│   ├── styles                 // 全局样式
│   ├── utils                  // 全局公用方法
│   ├── view                   // view
│   ├── App.vue                // 入口页面
│   └── main.js                // 入口 加载组件 初始化等
├── static                     // 第三方不打包资源
│   ├── jquery
│   └── Tinymce                // 富文本
├── .babelrc                   // babel-loader 配置
├── eslintrc.js                // eslint 配置项
├── .gitignore                 // git 忽略项
├── favicon.ico                // favicon图标
├── index.html                 // html模板
└── package.json               // package.json

```

## 状态管理
后台只有user和app配置相关状态使用vuex存在全局，其它数据都由每个业务页面自己管理。


## 效果图

#### 两步验证登录 支持微信和qq

![两步验证 here](https://github.com/PanJiaChen/vue-element-admin/blob/master/gifs/2login.gif)

#### 真正的动态换肤

![真正的动态换肤](https://github.com/PanJiaChen/vue-element-admin/blob/master/gifs/theme.gif)<br />



#### 可收起侧边栏

![enter image description here](https://github.com/PanJiaChen/vue-element-admin/blob/master/gifs/leftmenu.gif)

#### 拖拽排序

![enter image description here](https://github.com/PanJiaChen/vue-element-admin/blob/master/gifs/order.gif)



#### 上传裁剪头像

![enter image description here](https://github.com/PanJiaChen/vue-element-admin/blob/master/gifs/uploadAvatar.gif)



#### 错误统计

![enter image description here](https://github.com/PanJiaChen/vue-element-admin/blob/master/gifs/errorlog.gif)

#### 富文本(整合七牛 打水印等个性化功能)

![enter image description here](https://github.com/PanJiaChen/vue-element-admin/blob/master/gifs/editor.gif)

#### 封装table组件

![enter image description here](https://github.com/PanJiaChen/vue-element-admin/blob/master/gifs/table.gif)

#### 图表

![enter image description here](https://github.com/PanJiaChen/vue-element-admin/blob/master/gifs/echarts.gif)

#### 导出excel

![enter image description here](https://github.com/PanJiaChen/vue-element-admin/blob/master/gifs/excel.png)


## [更多demo](http://panjiachen.github.io/vue-element-admin)


###占坑
一系列的配套文章即将来袭~
