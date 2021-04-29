# Permission

It has been introduced in detail in this article--[手摸手，带你用 vue 撸后台 系列二(登录权限篇)](https://juejin.im/post/591aa14f570c35006961acac).

The implementation of this project's permission is: compare the routing table by obtaining the current user's permission, and generate the routing table accessible by the current user with the permission, and dynamically mount it to `router` through `router.addRoutes`.

But in fact, the business logic of many companies may not be the case. For example, the requirement of many companies is that the permissions of each page are dynamically configured, unlike the default settings in this project. But in fact the principle is the same. For example, you can dynamically configure permissions for each page through a tree control or other presentation, and then store this routing table to the back end. When the user logs in to get `roles`, the front end requests the accessible routing table to the backend according to `roles`, so that the accessible pages are dynamically generated. After that, the router.addRoutes is dynamically mounted to the router. You will find the same. , never change their case.

Just one more step to map the back-end return routing table with the local components. [issue](https://github.com/adempiere/adempiere-vue/issues/293)

```js
const map={
 login:require('login/index').default // sync
 login:()=>import('login/index')      // async
}
// The map on which you have a server is similar with
const serviceMap=[
 { path: '/login', component: 'login', hidden: true }
]
// After traversing this map, dynamically generate asyncRoutes
And replace component with map[component]
```

Ps: Do not rule out this project will increase the permissions control panel to support true dynamic configuration permissions.

## Logical modification

The control code of the routing level right now is in `@/permission.js`. If you want to change the logic, you can release the hook `next()` directly in the appropriate judgment logic.

## Permission directive

Write a permission directive, and can easily and quickly implement button-level permission judgment. [v-permission](https://github.com/adempiere/adempiere-vue/tree/master/src/directive/permission)

**Use**

```html
<template>
  <!-- Admin can see this -->
  <el-tag v-permission="['admin']">admin</el-tag>

  <!-- Editor can see this -->
  <el-tag v-permission="['editor']">editor</el-tag>

  <!-- Editor can see this -->
  <el-tag v-permission="['admin','editor']">Both admin or editor can see this</el-tag>
</template>

<script>
// Of course you can also register it for the sake of convenience.
import permission from '@/directive/permission/index.js'
export default{
  directives: { permission }
}
</script>
```

**Limitations**

In some cases it is not suitable to use v-permission, such as element Tab component which can only be achieved by manually setting the v-if.

You can use the global permission judgment function. The usage is similar to the instruction `v-permission`.

```html
<template>
  <el-tab-pane v-if="checkPermission(['admin'])" label="Admin">Admin can see this</el-tab-pane>
  <el-tab-pane v-if="checkPermission(['editor'])" label="Editor">Editor can see this</el-tab-pane>
  <el-tab-pane v-if="checkPermission(['admin','editor'])" label="Admin-OR-Editor">Both admin or editor can see this</el-tab-pane>
</template>

<script>
import checkPermission from '@/utils/permission'

export default{
   methods: {
    checkPermission
   }
}
</script>
```
