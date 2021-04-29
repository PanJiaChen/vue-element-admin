# New Page

If you are familiar with the `vue-router` then it will be very simple.

First add the route to the `@/router/index.js`.

**Such as: add an excel page**

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
It just creates a blank route based on 'layout', and you also need to add a route to the 'children' below it.
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

**This sidebar will appear the menu-item**

![](https://adempiere-vue.gitee.io/gitee-cdn/adempiere-vue-site/2ab6921d-f9bb-4fbb-a151-0e6027e23a6e.png)

<br/>

:::tip
Since `children` only declares one route below, there will be no expansion arrow. If the number of routes under `children` is greater than 1, there will be an expansion arrow, as shown below.

If you want to ignore this automatic decision, you can use `alwaysShow: true`, so that it will ignore the previously defined rule and display the root route. See the [Router and Nav](router-and-nav.md) for details.

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
    { path: 'export-excel', component:()=>import('excel/exportExcel'), name: 'exportExcel', meta: { title: 'exportExcel' }},
    { path: 'export-selected-excel', component:()=>import('excel/selectExcel'), name: 'selectExcel', meta: { title: 'selectExcel' }},
    { path: 'upload-excel', component:()=>import('excel/uploadExcel'), name: 'uploadExcel', meta: { title: 'uploadExcel' }}
  ]
}
```

![](https://adempiere-vue.gitee.io/gitee-cdn/adempiere-vue-site/89d6a0b8-5cf7-4a19-9afd-7267ec454066.png)

**The sidebar will appear the `submenu`.**

<br/>

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

## Create View

After adding the route, create a view under the `@/views`. As usual, a router correspond
a view.

Suggestion if a component or utils function only used in this view, just create a component folder under this view, lt is more convenient for each module to maintain its own `utils` or `components`.

![](https://adempiere-vue.gitee.io/gitee-cdn/adempiere-vue-site/8ca55a30-c22c-4143-aa8d-2a0d3e04fc33.png)

<br/>

## Create Api

Finally, under the [@/api](https://github.com/adempiere/adempiere-vue/tree/master/src/api) folder, create the corresponding api service for this module.

## Create Component

Personally write vue project habits, the global `@/components` will only write some global components, such as rich text, various search components, packaged date components, etc. can be shared components. Each page or module-specific business component is written under the current views. Such as: `@/views/article/components/xxx.vue`. This split greatly reduces maintenance costs.

**Remember that the biggest benefit of splitting components is not shared code but maintainability! **

## Create Style

The page's style and components are the same. The global `@/style` writes a global common style. The style of each page is written under the current `views`. Please remember to add `scoped` or namespace to avoid Causes global style pollution.

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
