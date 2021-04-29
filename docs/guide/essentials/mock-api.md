# Mock Data

Mock data is an integral part of the front-end development, the key link to separate the front and back-end development. By pre-agreed with the server-side interface, analog request data and even logic, can make the front-end development independent, will not be blocked by the development of the server.

## Swagger

In my company project, the data is usually simulated by the backend using [swagger](https://swagger.io/).

**swagger** is a REST APIs document generation tool that automatically generates documentation from code comments. It can be cross-platform, open source, supports most languages, community is good, in short, very good, highly recommended.

[Online Demo](http://petstore.swagger.io/?_ga=2.222649619.983598878.1509960455-2044209180.1509960455#/pet/addPet)

## Easy-mock

[vue-admin-template](https://github.com/adempiere/vue-admin-template) previously used [easy-mock](https://easy-mock.com/login) to simulate data.
It is a pure front-end visualization and can quickly generate persistence services for analog data. Very easy to use and can also be combined with `swagger`, support for cross-domain, whether it is a team or a personal project is worth a try.

[Online Demo](https://easy-mock.com/)

::: warning
The online version of `vue-admin-template` is no longer using `easy-mock`. Because the online free service provided by `easy-mock` is very unstable, it will hang from time to time. If you need it, you can build your own service according to its tutorial.
:::

## Mockjs

Since [adempiere-vue](https://github.com/adempiere/adempiere-vue) is a pure front-end personal project, all data is [mockjs] (https://github.com/ Nuysoft/Mock) Simulation generation. Its principle is: Intercept all requests and proxy to the local, and then mock data, so you will find that no requests are issued in `network`.

But its biggest problem is its implementation mechanism. It overrides the browser's `XMLHttpRequest` object to intercept all requests and proxy to the local. In most cases it is quite convenient to use, but because it rewrites the `XMLHttpRequest` object, so for example, the `progress` method, or some third-party libraries that rely on `XMLHttpRequest` will be incompatible with it. Looking at my project's [issues](https://github.com/adempiere/adempiere-vue/issues?utf8=%E2%9C%93&q=mock), you will know how many people have problems.

It also has a problem because it is data that is simulated locally and does not actually take any network requests. Therefore, local debugging is very troublesome and can only be debugged by `console.log`. Take the example of `adempiere-vue`. If you want to find out what data is returned by the `getInfo()` api, you can only know it by looking at the source code or manually `Debug`.

## New way <Badge text="v4.0.0+"/>

After the `v4.0` version, a `mock-server` will be launched locally to simulate the data, and the online environment will continue to use `mockjs` for simulation.(Because this project is a pure front-end project, you can also build an online server to provide data.)

The advantage of this way is to solve the previous pain points while preserving the advantages of `mockjs`. Since our mock is implemented entirely based on `webpack-dev-serve`, `mock-server` will start automatically when you start the project, and it will also pass [chokidar](https://github.com/paulmillr/chokidar) to observe the changes in the contents of the `mock` folder. When a change occurs, the previously registered `mock-api` interface is cleared and the new interface is dynamically remounted to support hot updates. If you are interested, you can look at the code [mock-server.js](https://github.com/adempiere/adempiere-vue/blob/master/mock/mock-server.js). Since it is a real `server`, you can clearly know the data structure returned by the interface through `network` of Chrome. At the same time, it solves the problem that the previous `mockjs` will rewrite the `XMLHttpRequest` object, which causes many third-party libraries to fail.

All requests for this project are sent via the packaged [request.js](https://github.com/adempiere/adempiere-vue/blob/master/src/utils/request.js) by reading The source code can find that all requests are set to a `baseURL`, and this `baseURL` is dynamically set by reading the `process.env.VUE_APP_BASE_API` environment variable, so that we can use different environments for different environments. Api` address

## Remove

If you don't want to use `mock-server`, just the `after` Middleware of `webpack-dev-server` from [vue.config.js](https://github.com/adempiere/adempiere-vue/blob/master/vue.config.js).

By default, local requests are proxy to `http://localhost:${port}/mock`, and you can modify `proxy` if you want to adjust to your own mock address.

```js
proxy: {
  // change xxx-api/login => mock/login
  // detail: https://cli.vuejs.org/config/#devserver-proxy
  [process.env.VUE_APP_BASE_API]: {
    target: `http://localhost:${port}/mock`,
    changeOrigin: true,
    pathRewrite: {
      ['^' + process.env.VUE_APP_BASE_API]: ''
    }
  }
},
after: require('./mock/mock-server.js')
```

**Please note: this operation requires a restart of the server.**

## Add

If you want to add mock data, just find the `mock` file in the root folder, add the corresponding route, intercept it and simulate the data.

For example, I need to add an api to get the number of comments below an article in [src/api/article](https://github.com/adempiere/adempiere-vue/blob/master/src/api/article.js) through `fetchComments`. First create a new api:

```js
export function fetchComments(id) {
  return request({
    url: `/article/${id}/comments`,
    method: 'get'
  })
}
```

After declaring the api, we need to find the corresponding mock folder [mock/article.js](https://github.com/adempiere/adempiere-vue/blob/master/mock/article.js), below Create a mock api that intercepts routes.

**Please note that the mock interception is based on routing. Please make sure that the mock data path will match your api route path(support regular)**

```js
// fetchComments 的 mock
{
  // uUrl must match your api route
  // For example, the route of fetchComments may be /article/1/comments or /article/2/comments
  // So you need to match by regular
  url: '/article/[A-Za-z0-9]/comments',
  type: 'get', // Must be the same type as your interface defines
  response: (req, res) => {
    // return result
    // req and res detail see
    // https://expressjs.com/zh-cn/api.html#req
    return {
      code: 20000,
      data: {
        status: 'success'
      }
    }
  }
}
```

## Change

The most common operation is: You have simulated some data locally, and after the backend completes the api, it gradually replaces the api of the original mock.

Let's take the `getRoles` api in [src/api/role.js](https://github.com/adempiere/adempiere-vue/blob/master/src/api/role.js) as an example. It was originally mocked in [mock/role/index.js](https://github.com/adempiere/adempiere-vue/blob/master/mock/role/index.js). Now we need to switch it to real backend data, as long as it is in [mock/role/index.js](https://github.com/adempiere/adempiere-vue/blob/master/mock/role/index.js) Find the corresponding route, then delete it. At this time you can view the real data in `network`.

```js
// The declared in the api
export function getRoles() {
  return request({
    url: '/roles',
    method: 'get'
  })
}

// Find the corresponding route and delete
{
    url: '/roles',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: roles
      }
    }
  },
```

## Multiple servers

Currently the project only starts a `mock-server`, of course you can also have your own other `mock-server` or proxy interface. Some api can take this service, others can take another service. Just set them to a different `baseURL`. [@/utils/request.js](https://github.com/adempiere/adempiere-vue/blob/master/src/utils/request.js)

Then configure multiple `proxy` according to the set url rules in [vue.config.js](https://github.com/adempiere/adempiere-vue/blob/master/vue.config.js).

[相关文档](https://webpack.docschina.org/configuration/dev-server/#devserver-proxy)

## Enable pure front end Mock

Now in [mock/index.js](https://github.com/adempiere/adempiere-vue/blob/master/mock/index.js#L19) also encapsulates a pure front-end mock method, you only Need to be in [src/main.js](https://github.com/adempiere/adempiere-vue/tree/master/src):

```js
import { mockXHR } from '../mock'
mockXHR()
```

This will become pure front-end mock data and the same as the mock way before the `v4.0` version, the principle is as above. The online [demo](https://adempiere.github.io/adempiere-vue) that you are currently seeing is just that way.

## Switch local and online Mock data

There are many times when we encounter local use of mock data, online environments that use real data, or different environments that use different data.

- **Easy-Mock**

You need to ensure that your local simulated api is consistent with all other addresses except the root path. such as:

```
https://api-dev/login   // Local request

https://api-prod/login  // Online request
```

We can use the [environment variables](/guide/essentials/deploy.html#environmental-variables) to do different environments and request different api base path.

```bash
# .env.development
VUE_APP_BASE_API = '/dev-api' #Inject the root path of the local api
```

```bash
# .env.production
VUE_APP_BASE_API = '/prod-api' #Inject the root path of the production api
```

Then create an `axios` instance based on the environment variable to have a different `baseURL`.
[@/utils/request.js](https://github.com/adempiere/adempiere-vue/blob/master/src/utils/request.js)

```js
// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // base_url of the API
  timeout: 5000 // request timeout
})
```

In this way we can automatically switched local and online apis based on environment variables.

- **Mock.js**

When we use `Mock.js` to simulate data locally, the real-world api method is used online. This is similar to the easy-mock method above. We mainly judge that when it is an online environment, we use real-world api. We only import `Mock.js` locally.

```js
// main.js
// use environment variables to determine is required
if (process.env.NODE_ENV === 'development') {
  require('./mock') // simulation data
}
```

Mock data is only import in the local environment.
