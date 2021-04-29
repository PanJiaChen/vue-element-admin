# 快捷导航(标签栏导航)

本功能是响应大家需求，后期加上的，其实本人在公司项目或者个人项目中是不太使用该功能的。以前那些传统后台框架往往会包含此功能，由于以前的后台项目大部分都是多页面的形式，所以标签栏导航功能还是具有一定意义的基本，大部分都是基于 iframe 的方式实现的。

但随着时代的发展，现在的后台项目几乎都是 spa(single page web application 单页面开发)，再使用以前的方案来实现标签导航显然是不合适的。

所以目前的方案大致为：
运用 `keep-alive` 和 `router-view` 的结合。

代码: `@/layout/components/AppMain.vue`

```html
<keep-alive :include="cachedViews">
  <router-view></router-view>
</keep-alive>
```

顶部标签栏导航实际作用相当于 nav 的另一种展现形式，其实说白了都是一个个 router-link，点击跳转到相应的页面。然后我们在来监听路由 `$route` 的变化，来判断当前页面是否需要重新加载或者已被缓存。

## visitedViews && cachedViews

目前 tags-view 维护了两个数组。

- visitedViews : 用户访问过的页面 就是标签栏导航显示的一个个 tag 数组集合
- cachedViews : 实际 keep-alive 的路由。可以在配置路由的时候通过 `meta.noCache` 来设置是否需要缓存这个路由 默认都缓存。[配置文档](router-and-nav.md)

## 注意事项

由于目前 `keep-alive` 和 `router-view` 是强耦合的，而且查看文档和源码不难发现 `keep-alive` 的 [include](https://cn.vuejs.org/v2/api/#keep-alive) 默认是优先匹配组件的 **name** ，所以在编写路由 router 和路由对应的 view component 的时候一定要确保 两者的 name 是完全一致的。(切记 name 命名时候尽量保证唯一性 切记不要和某些组件的命名重复了，不然会递归引用最后内存溢出等问题)

**DEMO:**

```js
//router 路由声明
{
  path: 'create-form',
  component: ()=>import('@/views/form/create'),
  name: 'createForm',
  meta: { title: 'createForm', icon: 'table' }
}
```

```js
//路由对应的view  form/create
export default {
  name: 'createForm'
}
```

一定要保证两者的名字相同，切记写重或者写错。默认如果不写 name 就不会被缓存，详情见[issue](https://github.com/vuejs/vue/issues/6938#issuecomment-345728620)。

## 缓存不适合场景

目前缓存的方案对于某些业务是不适合的，比如文章详情页这种 `/article/1` `/article/2`，他们的路由不同但对应的组件却是一样的，所以他们的组件 name 就是一样的，就如前面提到的，`keep-alive`的 include 只能根据组件名来进行缓存，所以这样就出问题了。目前有两种解决方案：

- 不使用 keep-alive 的 include 功能 ，直接是用 keep-alive 缓存所有组件，这样子是支持前面所说的业务情况的。
  前往[@/layout/components/AppMain.vue](https://github.com/adempiere/adempiere-vue/blob/master/src/layout/components/AppMain.vue)文件下，移除`include`相关代码即可。当然直接使用 keep-alive 也是有弊端的，他并不能动态的删除缓存，你最多只能帮它设置一个最大缓存实例的个数 limit。[相关 issue](https://github.com/vuejs/vue/issues/6509)

- 使用 localStorage 等浏览器缓存方案，自己进行缓存处理

## Affix 固钉 <Badge text="v3.10.0+"/>

当在声明路由是 添加了 Affix 属性，则当前`tag`会被固定在 `tags-view`中（不可被删除）。

![](https://user-images.githubusercontent.com/8121621/52840303-cd5c9280-3133-11e9-928f-e2825eaab51b.png)

```js {14}
 {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: {
          title: 'dashboard',
          icon: 'dashboard',
          noCache: true,
          affix: true
        }
      }
    ]
  }
```

## 移除

其实 keep-alive [源码](https://github.com/vuejs/vue/blob/dev/src/core/components/keep-alive.js)不复杂，但逻辑还是蛮绕的，之前尤大自己修复一个 bug 的时候也不小心搞错了，连发两个版本来修复，所以如果没有标签导航栏需求的用户，建议移除此功能。

首先找到 `@/layout/components/AppMain.vue` 然后移除 `keep-alive`

```html
<template>
  <section class="app-main" style="min-height: 100%">
    <transition name="fade-transform" mode="out-in">
      <router-view></router-view>
    </transition>
  </section>
</template>
```

然后移除整个 `@/layout/components/TagsView.vue` 文件，并在`@/layout/components/index` 和 `@/layout/Layout.vue` 移除相应的依赖。最后把 `@/store/modules/tagsView` 相关的代码删除即可。
