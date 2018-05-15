## 简介

本项目是基于 `api工厂` 接口 和 `vue-element-admin` 开发的后台管理系统。

[api工厂](https://www.it120.cc/) 是一个 PAAS 提供商，
您可以根据工厂提供的各种api接口，开发出您自己的 SAAS 应用，非常方便。

`vue-element-admin` 是一个后台集成解决方案，它基于 [Vue.js](https://github.com/vuejs/vue) 和 [element](https://github.com/ElemeFE/element)。

欢迎大家一起来参与开发，踊跃提交代码，交流QQ群:315181914

- [后台接口文档](http://user.api.it120.cc/swagger-ui.html)

- [vue-element-admin 演示](http://panjiachen.github.io/vue-element-admin)

- [vue-element-admin 使用文档](https://panjiachen.github.io/vue-element-admin-site/#/zh-cn/README)

- [ICON 文档](http://iconfont.cn/)

- [element-ui 文档](http://element-cn.eleme.io/#/zh-CN/component/installation)

## 开发
```bash
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
  