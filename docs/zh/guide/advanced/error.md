# 错误处理

## 页面

**404**

页面级的错误处理由 `vue-router` 统一处理，所有匹配不到正确路由的页面都会进 `404`页面。

```js
{ path: '*', redirect: '/404' }
```

::: warning
**注意事项** 这里有一个需要非常注意的地方就是 `404` 页面一定要最后加载，如果放在 constantRoutes 一同声明了 `404` ，后面的所有页面都会被拦截到`404` ，详细的问题见 [addRoutes when you've got a wildcard route for 404s does not work](https://github.com/vuejs/vue-router/issues/1176)
:::

**401**

在`@/permission.js`做了权限控制，所有没有权限进入该路由的用户都会被重定向到 `401`页面。

<br/>

## 请求

项目里所有的请求都会走`@/utils/request.js`里面创建的的 axios 实例，它统一做了错误处理，[完整代码](https://github.com/adempiere/adempiere-vue/blob/master/src/utils/request.js)。

你可以在`service.interceptors.response` response 拦截器之中根据自己的实际业务统一针对不同的状态码或者根据自定义 code 来做错误处理。如：

```js
service.interceptors.response.use(
  response => {
    /**
     * code为非20000是抛错 可结合自己业务进行修改
     */
    const res = response.data
    if (res.code !== 20000) {
      Message({
        message: res.data,
        type: 'error',
        duration: 5 * 1000
      })

      // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        MessageBox.confirm(
          '你已被登出，可以取消继续留在该页面，或者重新登录',
          '确定登出',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      }
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)
```

因为所有请求返回的是`promise`，所以你也可以对每一个请求通过`catch` 错误，从而进行单独的处理。

```js
getInfo()
  .then(res => {})
  .catch(err => {
    xxxx
  })
```

## 代码

本项目也做了代码层面的错误处理，如果你开启了`eslint`在编写代码的时候就会提示错误。如：
![](https://adempiere-vue.gitee.io/gitee-cdn/adempiere-vue-site/b037f47c-1f7b-487f-bb05-32e7300767d2.png)

当然还有很多不能被`eslint`检查出来的错误，vue 也提供了全局错误处理钩子[errorHandler](https://vuejs.org/v2/api/#errorHandler)，所以本项目也做了相对应的错误收集。
![](https://adempiere-vue.gitee.io/gitee-cdn/adempiere-vue-site/360e4842-4db5-42d0-b078-f9a84a825546.gif)

::: tip
监听错误：[@/errorLog.js](https://github.com/adempiere/adempiere-vue/blob/master/src/errorLog.js)

错误展示组件：[@/components/ErrorLog](https://github.com/adempiere/adempiere-vue/blob/master/src/components/ErrorLog/index.vue)
:::
