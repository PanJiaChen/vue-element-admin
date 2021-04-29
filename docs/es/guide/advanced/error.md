# Error Handling

## Page

**404**

Page-level error handling is handled uniformly by the `vue-router`. All pages that do not match the correct route will advance to the `404` page.

```js
{ path: '*', redirect: '/404' }
```

::: warning
One thing that needs special attention here is that the `404` page must be loaded last. If you put `404` in the constantRoutes , then the following page will be blocked to `404`. See the problem for details [addRoutes when you've got a wildcard route for 404s does not work](https://github.com/vuejs/vue-router/issues/1176)
:::

**401**

Permission control is done in `@/permission.js`. All users who do not have permission to access this route will be redirected to the `401` page.

<br/>

## Request

All the requests in the project will go through the axios instance created in `@/utils/request.js`. [code](https://github.com/adempiere/adempiere-vue/blob/master/src/utils/request.js)。

You can use the `service.interceptors.response`, the response interceptor to harmonize different status codes according to your actual business or to perform error handling according to custom code. Such as:

```js
service.interceptors.response.use(
  response => {
    /**
     * The code is non-20000 error-free
     */
    const res = response.data
    if (res.code !== 20000) {
      Message({
        message: res.data,
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: illegal token; 50012: other client logged in; 50014: Token expired;
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

Since all requests return a `promise`, you can also pass a `catch` error for each request, which allows for separate processing.

```js
getInfo()
  .then(res => {})
  .catch(err => {
    xxxx
  })
```

## Coding

This project also does code-level error handling. If you enable `eslint`, you will be prompted for errors when writing code. Such as:
![](https://adempiere-vue.gitee.io/gitee-cdn/adempiere-vue-site/b037f47c-1f7b-487f-bb05-32e7300767d2.png)

Of course there are many errors that cannot be checked by `eslint`, vue also provides global error handling hooks[errorHandler](https://vuejs.org/v2/api/#errorHandler). The project also made a corresponding error collection.
![](https://adempiere-vue.gitee.io/gitee-cdn/adempiere-vue-site/360e4842-4db5-42d0-b078-f9a84a825546.gif)

::: tip
Listening error: [@/errorLog.js](https://github.com/adempiere/adempiere-vue/blob/master/src/errorLog.js)

Error display component: [@/components/ErrorLog](https://github.com/adempiere/adempiere-vue/blob/master/src/components/ErrorLog/index.vue)
:::
