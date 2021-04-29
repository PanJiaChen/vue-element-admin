# 新增页面

如果熟悉 `vue-router` 的配置就很简单了。

首先在 `@/router/index.js` 中增加你需要添加的路由。

**如：新增一个 excel 页面**

```js
{
  path: '/excel',
  component: Layout,
  redirect: '/excel/export-excel',
  name: 'excel',
  meta: {
    title: 'excel',
    icon: 'excel'
  }
}
```

::: tip
仅仅这样不会有任何效果的，它只是创建了一个基于`layout`的一级路由，你还需要在它下面的 `children` 中添加子路由。
:::

```js
{
  path: '/excel',
  component: Layout,
  redirect: '/excel/export-excel',
  name: 'excel',
  meta: {
    title: 'excel',
    icon: 'excel'
  },
  children: [
    {
      path: 'export-excel',
      component: ()=>import('excel/exportExcel'),
      name: 'exportExcel',
      meta: { title: 'exportExcel' }
    }
  ]
}
```

**这样侧边栏就会出现如图所示的 `menu-item` 了**

![](https://adempiere-vue.gitee.io/gitee-cdn/adempiere-vue-site/2ab6921d-f9bb-4fbb-a151-0e6027e23a6e.png)

<br/>

::: tip
由于 `children` 下面只声明了一个路由所以不会有展开箭头，如果`children`下面的路由个数大于 1 就会有展开箭头，如下面所示。
如果你想忽视这个自动判断可以使用 `alwaysShow: true`，这样它就会忽略之前定义的规则，一直显示根路由。详情见[路由和侧边栏](/zh/guide/essentials/router-and-nav.html#路由和侧边栏)
:::

```js
{
  path: '/excel',
  component: Layout,
  redirect: '/excel/export-excel',
  name: 'excel',
  meta: {
    title: 'excel',
    icon: 'excel'
  },
  children: [
    { path: 'export-excel', component: ()=>import('excel/exportExcel'), name: 'exportExcel', meta: { title: 'exportExcel' }},
    { path: 'export-selected-excel', component: ()=>import('excel/selectExcel'), name: 'selectExcel', meta: { title: 'selectExcel' }},
    { path: 'upload-excel', component: ()=>import('excel/uploadExcel'), name: 'uploadExcel', meta: { title: 'uploadExcel' }}
  ]
}
```

![](https://adempiere-vue.gitee.io/gitee-cdn/adempiere-vue-site/89d6a0b8-5cf7-4a19-9afd-7267ec454066.png)

**侧边栏就会出现如图所示的 `submenu` 了**

<br/>
<br/>

## 多级目录(嵌套路由)

如果你的路由是多级目录，如本项目 [@/views/nested](https://github.com/adempiere/adempiere-vue/tree/master/src/views/nested) 那样， 有三级路由嵌套的情况下，**不要忘记还要手动在二级目录的根文件下添加一个 `<router-view>`**。

```html
 <!-- 父级路由组件  -->
<template>
  <div>
    <!-- xxx html 内容  -->
    <router-view />
  </div>
</template>
```

如：[@/views/nested/menu1/index.vue](https://github.com/adempiere/adempiere-vue/blob/master/src/views/nested/menu1/index.vue)，原则上有多少级路由嵌套就需要多少个`<router-view>`。

![](https://adempiere-vue.gitee.io/gitee-cdn/adempiere-vue-site/9459de62-64d0-4819-9730-daf3f9889018.png)

<br/>

## 新增 view

新增完路由之后不要忘记在 `@/views` 文件下 创建对应的文件夹，一般性一个路由对应一个文件，该模块下的功能组件或者方法就建议在本文件夹下创建一个`utils`或`components`文件夹，各个功能模块维护自己的`utils`或`components`组件。如：

![](https://adempiere-vue.gitee.io/gitee-cdn/adempiere-vue-site/8ca55a30-c22c-4143-aa8d-2a0d3e04fc33.png)

<br/>
<br/>

## 新增 api

最后在 [@/api](https://github.com/adempiere/adempiere-vue/tree/master/src/api) 文件夹下创建本模块对应的 api 服务。

## 新增组件

个人写 vue 项目的习惯，在全局的 `@/components` 只会写一些全局的组件，如富文本，各种搜索组件，封装的日期组件等等能被公用的组件。每个页面或者模块特定的业务组件则会写在当前 views 下面。如：`@/views/article/components/xxx.vue`。这样拆分大大减轻了维护成本。

**请记住拆分组件最大的好处不是公用而是可维护性！**

## 新增样式

页面的样式和组件是一个道理，全局的 `@/style` 放置一下全局公用的样式，每一个页面的样式就写在当前 `views`下面，请记住加上`scoped` 或者命名空间，避免造成全局的样式污染。

```css
<style>
/* global styles */
</style>

<style scoped>
/* local styles */
.xxx-container{
  /* name scoped */
  xxx
}
</style>
```
