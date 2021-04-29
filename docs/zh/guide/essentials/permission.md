# 权限验证

在 [手摸手，带你用 vue 撸后台 系列二(登录权限篇)](https://juejin.im/post/591aa14f570c35006961acac) 这篇文章中其实已经详细介绍过了。

该项目中权限的实现方式是：通过获取当前用户的权限去比对路由表，生成当前用户具的权限可访问的路由表，通过 `router.addRoutes` 动态挂载到 `router` 上。

但其实很多公司的业务逻辑可能不是这样的，举一个例子来说，很多公司的需求是每个页面的权限是动态配置的，不像本项目中是写死预设的。但其实原理是相同的。如：你可以在后台通过一个 tree 控件或者其它展现形式给每一个页面动态配置权限，之后将这份路由表存储到后端。当用户登录后得到 `roles`，前端根据`roles` 去向后端请求可访问的路由表，从而动态生成可访问页面，之后就是 router.addRoutes 动态挂载到 router 上，你会发现原来是相同的，万变不离其宗。

只是多了一步将后端返回路由表和本地的组件映射到一起。相关[issue](https://github.com/adempiere/adempiere-vue/issues/293)

```js
const map={
 login:require('login/index').default // 同步的方式
 login:()=>import('login/index')      // 异步的方式
}
//你存在服务端的map类似于
const serviceMap=[
 { path: '/login', component: 'login', hidden: true }
]
//之后遍历这个map，动态生成asyncRoutes
并将 component 替换为 map[component]
```

Ps:不排除之后本项目会增加权限控制面板支持真正的动态配置权限。

## 逻辑修改

现在路由层面权限的控制代码都在 `@/permission.js` 中，如果想修改逻辑，直接在适当的判断逻辑中 `next()` 释放钩子即可。

## 指令权限

封装了一个指令权限，能简单快速的实现按钮级别的权限判断。 [v-permission](https://github.com/adempiere/adempiere-vue/tree/master/src/directive/permission)

**使用**

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
// 当然你也可以为了方便使用，将它注册到全局
import permission from '@/directive/permission/index.js' // 权限判断指令
export default{
  directives: { permission }
}
</script>
```

**局限**

In some cases it is not suitable to use v-permission, such as element Tab component which can only be achieved by manually setting the v-if.

可以使用全局权限判断函数，用法和指令 `v-permission` 类似。

```html
<template>
  <el-tab-pane v-if="checkPermission(['admin'])" label="Admin">Admin can see this</el-tab-pane>
  <el-tab-pane v-if="checkPermission(['editor'])" label="Editor">Editor can see this</el-tab-pane>
  <el-tab-pane v-if="checkPermission(['admin','editor'])" label="Admin-OR-Editor">Both admin or editor can see this</el-tab-pane>
</template>

<script>
import checkPermission from '@/utils/permission' // 权限判断函数

export default{
   methods: {
    checkPermission
   }
}
</script>
```
