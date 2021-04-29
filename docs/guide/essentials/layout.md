# Layout

The overall layout of the page is the outermost frame structure of a product and often includes navigation, sidebars, breadcrumbs, and content. To understand a admin project, first understand its basic layout.

![](https://adempiere-vue.gitee.io/gitee-cdn/adempiere-vue-site/7066d74f-12c5-47d6-b6ad-f22b43fec917.png)

::: tip Code
[@/layout](https://github.com/adempiere/adempiere-vue/tree/master/src/layout)
:::

`@` is webpack's [alias](https://webpack.js.org/configuration/resolve/#resolve-alias). If don't understand please study it yourself.

<br>

Most of the pages in `adempiere-vue` are based on this `layout`, except that individual pages such as: `login` , `404`, `401` , etc., do not use this layout. It is also easy if you want to have multiple layouts in a project, as long as you choose different layout component in the first-level routing.

```js
// No layout
{
  path: '/401',
  component: () => import('errorPage/401')
}

// Has layout
{
  path: '/documentation',

  // You can choose different layout components
  component: Layout,

  // Here the route is displayed in app-main
  children: [{
    path: 'index',
    component: () => import('documentation/index'),
    name: 'documentation'
  }]
}
```

This uses vue-router [routing nesting](https://router.vuejs.org/guide/essentials/nested-routes.html), so in general, adding or modifying a page will only affect the main body of app-main. Other content in the layout, such as: the sidebar or navigation bar will not change with your main page.

```
/foo                                  /bar
+------------------+                  +-----------------+
| layout           |                  | layout          |
| +--------------+ |                  | +-------------+ |
| | foo.vue      | |  +------------>  | | bar.vue     | |
| |              | |                  | |             | |
| +--------------+ |                  | +-------------+ |
+------------------+                  +-----------------+
```

<br>

## app-main

::: tip Code
[@/layout/components/AppMain](https://github.com/adempiere/adempiere-vue/blob/master/src/layout/components/AppMain.vue)
:::

Here is a layer of `keep-alive` outside the `app-main` is mainly to cache `<router-view>`, with the `tabs-view` tab navigation of the page, if you do not need to [remove](tags-view.md) it.

The `transition` defines the switching animation between pages, you can modify the transition animation according to your own needs. Related [documentation](https://vuejs.org/v2/guide/transitions.html).
Two transition animations of `fade` and `fade-transform` are provided by default. For specific css implementation, see [transition.scss](https://github.com/adempiere/adempiere-vue/blob/master/src /styles/transition.scss). If you need to adjust, you can adjust the `name` of `transition` in [AppMain.vue](https://github.com/adempiere/adempiere-vue/blob/master/src/layout/components/AppMain.vue).

<br>

## router-view

**Different router the same component vue** In a real work, there are many situations. such as:

![](https://adempiere-vue.gitee.io/gitee-cdn/adempiere-vue-site/ac5047c9-cb75-4415-89e3-9386c42f3ef9.jpeg)

The same component is used to create pages and edit pages. By default, when these two pages are switched, it will not trigger the created or mounted hooks of vue. [Officials say](https://router.vuejs.org/guide/advanced/data-fetching.html#data-fetching) that you can do this through the change of watch `$route`. To tell the truth it's still very troublesome. Later I discovered that I could simply add a unique key to the router-view to ensure that the routing hooks are re-rendered when the route is switched. This is much simpler.

```js
<router-view :key="key"></router-view>

computed: {
  key() {
    // just make sure the key is the unique
    return this.$route.fullPath
  }
 }
```

::: tip
**Or** You can declare two different views like the `editForm` and `createForm` in this project but introduce the same component.

Code: [@/views/example](https://github.com/adempiere/adempiere-vue/tree/master/src/views/example)
:::

```html
<!-- create.vue -->
<template>
  <article-detail :is-edit='false'></article-detail> //create
</template>
<script>
  import ArticleDetail from './components/ArticleDetail'
</script>

<!-- edit.vue -->
<template>
   <article-detail :is-edit='true'></article-detail> //edit
</template>
<script>
  import ArticleDetail from './components/ArticleDetail'
</script>
```

## Mobile

The `element-ui` official position is the desktop-side framework, and most of admin project is complex, it is impossible to meet the desktop-side and mobile-side interactions through simple adaptation. Therefore, the interaction between the two ends must be different. it is recommended to re-do a system for mobile.

So, this project will not adapt to the mobile. It just does a simple response and you can modify it yourself.
