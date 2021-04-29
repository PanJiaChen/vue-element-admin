# Router and Nav

Router and Nav are the key skeleton for organizing a management system.

This project router and nav are bound together, so you only have to configure the route under `@/router/index.js` and the sidebar nav will be dynamically generated automatically. This greatly reduces the workload of manually editing the sidebar nav. Of course, so you need to follow many conventions in configuring the route.

## Config

First let us know what configuration items are provided config route.

```js
// if set to true, lt will not appear in sidebar nav.
// e.g. login or 401 page or as some editing pages /edit/1 (Default: false)
hidden: true

// this route cannot be clicked in breadcrumb navigation when noRedirect is set
redirect: noRedirect

// when you route a children below the declaration of more than one route,
// it will automatically become a nested mode - such as the component page
// when there is only one, the child route will be displayed as the root route
// if you want to display your root route
// regardless of the number of children declarations under the route
// you can set alwaysShow: true
// so that it will ignore the previously defined rules and always show the root route
alwaysShow: true

// set router name. It must be set，in order to avoid problems with <keep-alive>.
name: 'router-name'

meta: {
  // required roles to navigate to this route. Support multiple permissions stacking.
  // if not set means it doesn't need any permission.
  roles: ['admin', 'editor']

  // the title of the route to show in various components (e.g. sidebar, breadcrumbs).
  title: 'title'

  // svg icon class
  icon: 'svg-name' // or el-icon-x

  // when set true, the route will not be cached by <keep-alive> (default false)
  noCache: true

  // if false, the item will hidden in breadcrumb(default is true)
  breadcrumb: false

  // if set to true, it can be fixed in tags-view (default false)
  affix: true // this is very useful in some scenarios, // click on the article to enter the article details page,

  // When you set, the related item in the sidebar will be highlighted
  // for example: a list page route of an article is: /article/list
  // at this time the route is /article/1, but you want to highlight the route of the article list in the sidebar,
  // you can set the following
  activeMenu: '/article/list'
}
```

<br/>

**Example：**

```js
{
  path: '/permission',
  component: Layout,
  redirect: '/permission/index',
  hidden: true,
  alwaysShow: true,
  meta: { roles: ['admin','editor'] }, // you can set roles in root nav
  children: [{
    path: 'index',
    component: _import('permission/index'),
    name: 'permission',
    meta: {
      title: 'permission',
      icon: 'lock',
      roles: ['admin','editor'], // or you can only set roles in sub nav
      noCache: true
    }
  }]
}
```

## Router

There are two types of routes here , `constantRoutes` and `asyncRoutes`.

**constantRoutes:** represents routes that do not require dynamic access, such as login page, 404, general page, and so on.

**asyncRoutes:** represents pages that require dynamic judgment permissions and are dynamically added through `addRouters`. The details will be introduced on the [permission](permission.md).

::: tip
All routing pages here use the `router lazy loading`, as described in [document](/guide/advanced/lazy-loading.md)

If you want to know more about browserHistory and hashHistory, please refer to [Build & Deploy](deploy.md).
:::

The other configurations are no different from the [vue-router](https://router.vuejs.org/en/) official, so check the documentation for yourself.

::: warning
There is one thing to be careful about is that the 404 page must be the last to load, if it is declared in constantRoutes. Later declared pages will be blocked to 404, see the details of the problem: [addRoutes when you've got a wildcard route for 404s does not work](https://github.com/vuejs/vue-router/issues/1176)
:::

## Sidebar

The project sidebar is mainly based on the `el-menu` of element-ui.

Also introduced in the front, the sidebar is generated dynamically by reading the route and combined with the permission judge, but also need to support the infinite nesting of routes, so here is also used to the recursive components.

> Code: [@/layout/components/Sidebar](https://github.com/adempiere/adempiere-vue/tree/master/src/layout/components/Sidebar)

This also modify many default sidebar styles of `element-ui`. All css can be found in [@/styles/sidebar.scss](https://github.com/adempiere/adempiere-vue/blob/master/src/styles/sidebar.scss) and can be modified to suit your needs.

**Here need to pay attention**. The general sidebar has two forms, `submenu` and`el-menu-item`. One is a nested submenu, the other is a direct link. As shown below:

![](https://adempiere-vue.gitee.io/gitee-cdn/adempiere-vue-site/e94739d6-d701-45c8-8c6e-0f4bb10c3b46.png)

The sidebar has already helped you to make a judgment. When you route a children below the declaration of more than >1 routes, it will automatically become a nested mode. If the sub-route is exactly equal to one, the sub-route is displayed as a root route in the sidebar by default. If you do not want to, you can disable this feature by setting `alwaysShow: true` in the root route. Such as:

```js
// no submenu, because children.length===1
{
  path: '/icon',
  component: Layout,
  children: [{
    path: 'index',
    component: ()=>import('svg-icons/index'),
    name: 'icons',
    meta: { title: 'icons', icon: 'icon'}
  }]
},

// has submenu, because children.length>=1
{
  path: '/components',
  component: Layout,
  name: 'component-demo',
  meta: {
    title: 'components',
    icon: 'component'
  },
  children: [
    { path: 'tinymce', component: ()=>import('components-demo/tinymce'), name: 'tinymce-demo', meta: { title: 'tinymce' }},
    { path: 'markdown', component: ()=>import('components-demo/markdown'), name: 'markdown-demo', meta: { title: 'markdown' }},
  ]
}
```

::: tip unique-opened
You can set `unique-opened` in [Sidebar/index.vue](https://github.com/adempiere/adempiere-vue/blob/master/src/layout/components/Sidebar/index.vue). To control the sidebar, whether to keep only one submenu expanded.
:::

## Nested Routes

If you have a nested Route, such as [@/views/nested](https://github.com/adempiere/adempiere-vue/tree/master/src/views/nested),
**Don't forget to manually add an `< router-view >` to the root file of the secondary directory**.

```html
 <!-- parent view  -->
<template>
  <div>
    <!-- xxx html dom  -->
    <router-view />
  </div>
</template>
```

Such as: [@/views/nested/menu1/index.vue](https://github.com/adempiere/adempiere-vue/blob/master/src/views/nested/menu1/index.vue).

**Note:** As many `<router-view>` as the level of routes nested.

![](https://adempiere-vue.gitee.io/gitee-cdn/adempiere-vue-site/9459de62-64d0-4819-9730-daf3f9889018.png)

<br/>

## Click the sidebar to refresh the current route

Before using the development model of spa(single page application), each time the user clicks the sidebar will request this page again, the user gradually developed the habit of clicking the current route in the sidebar to refresh the view. But now the spa is not the same, the user clicks the currently highlighted route and does not refresh the view, because the vue-router will intercept your routing, it determines your url does not change, so it will not trigger any hook or view changes.[Related issue](https://github.com/vuejs/vue-router/issues/296), the community has also heated discussions on the issue.

![](https://adempiere-vue.gitee.io/gitee-cdn/adempiere-vue-site/5d0b0391-ea6a-45f2-943e-aff5dbe74d12.png)

`yyx990803`also said that he wanted to add a way to brighten the view, but later he changed his mind again/(ㄒ o ㄒ)/~~ But demand is here, what should we do? He said it would not trigger anything without changing the current URL, so can I force the trigger? The hack is simple. By changing the url query to trigger the view changes。We listen to each link's click event on the sidebar, each click will push a different query for the router to ensure that the view is refreshed.

```js
clickLink(path) {
  this.$router.push({
    path,
    query: {
      //Ensure that each click, query is not the same
      //to ensure that refresh the view
      t: +new Date()
    }
  })
}
```

ps: Don't forget to add a unique `key` to `router-view`, such as `<router-view :key="$route.path"></router-view>`.

But there's also a drawback the ugly `query` suffix behind url, such as `xxx.com/article/list?t=1496832345025`

You can know from the previous issue that there are many other options. In my company project, the solution adopted is to determine whether the currently clicked menu route is consistent with the current route. However, when it is consistent, it will jump to a dedicated Redirect page, which will redirect the route to Go to the page, this will have a refresh effect.

**Example**

![](https://adempiere-vue.gitee.io/gitee-cdn/adempiere-vue-site/0dd7f78b-0fb5-4c7d-8236-cee78f960984.jpg)

Click on the global size switch button shown in the image and you will see that the page of `app-main` has been refreshed. It uses the method of redirecting to the `Redirect` page and then redirecting back to the original page.

Redirect page to `/redirect` when clicking

```js
const { fullPath } = this.$route
this.$router.replace({
  path: '/redirect' + fullPath
})
```

The `redirect` page is redirected back to the original page

```js
// redirect.vue
// https://github.com/adempiere/adempiere-vue/blob/master/src/views/redirect/index.vue
export default {
  beforeCreate() {
    const { params, query } = this.$route
    const { path } = params
    this.$router.replace({ path: '/' + path, query })
  },
  render: function(h) {
    return h() // avoid warning message
  }
}
```

<br>

## Breadcrumb

This project also packages a breadcrumb navigation, which is also dynamically generated by the watch $route change. It is the same with the menu, you can also config it in the routing. You can also add some custom attributes to your business needs in route.meta attr. For example, you can declare `breadcrumb:false` in the route so that it is not displayed in breadcrumb.

![](https://adempiere-vue.gitee.io/gitee-cdn/adempiere-vue-site/4c60b3fc-febd-4e22-9150-724dcbd25a8e.gif)

> Corresponding code: [@/components/Breadcrumb](https://github.com/adempiere/adempiere-vue/blob/master/src/components/Breadcrumb/index.vue)

## Sidebar scroll problem

Previous versions of scroll were handled with css

```css
overflow-y: scroll;

::-webkit-scrollbar {
  display: none;
}
```

But hack by css has some problems, in Firefox or other lower versions of the browser will be less beautiful.
Second, in the case of sidebar collapses, limited to `menu` of`element-ui`, can not be handled in this way.

So the current version uses `el-scrollbar` to handle the sidebar scrolling problem.

::: tip Code
[@/layout/components/Sidebar](https://github.com/adempiere/adempiere-vue/blob/master/src/layout/components/Sidebar/index.vue)
:::

## Sidebar external-link <Badge text="v3.8.2+"/>

You can also configure an external-link in the sidebar. As long as you fill in the legal url path in `path`, you will be able to open this page when you click on the sidebar.

E.g.

```json
{
  "path": "external-link",
  "component": Layout,
  "children": [
    {
      "path": "https://github.com/adempiere/adempiere-vue",
      "meta": { "title": "externalLink", "icon": "link" }
    }
  ]
}
```

## Sidebar expands by default

In some scenarios, users need to expand some of the `sub-menu` in the sidebar by default, as shown below:

<img :src="$withBase('/images/default-openeds.jpg')" alt="default-openeds.jpg" width="250px">

Can be set through `default-openeds`, first find [Sidebar Code](https://github.com/adempiere/adempiere-vue/blob/master/src/layout/components/Sidebar/index.vue)

```html
 <el-menu
        :default-openeds="['/example','/nested']" // Add this line of code
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
```

**Note: default-openeds = "['example', 'nested']" is filled with route-path of submenu**
