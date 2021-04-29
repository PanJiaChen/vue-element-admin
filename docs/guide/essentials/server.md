# Work with Server

## Front-end request flow

In `adempiere-vue` , a complete front-end UI interacts to the server-side processing flow as follows:

1.  UI component interaction;
2.  Call unified management API service request function;
3.  Send requests using encapsulated request.js;
4.  Get server return;
5.  Update data;

As you can see from the above flow, in order to facilitate management and maintenance, unified request processing is placed in the `src/api` folder and the files are generally split according to the model latitude,such as:

```
api/
  login.js
  article.js
  remoteSearch.js
  ...
```

## request.js

`@/utils/request.js` is based on the [axios](https://github.com/axios/axios), to facilitate the uniform handling of POST, GET and other request parameters, request headers, and error messages。Specific can see [request.js](https://github.com/adempiere/adempiere-vue/blob/master/src/utils/request.js).

It encapsulates the global `request interceptor`, `response interceptor`,`unified error handling`, `unified timeout, baseURL settings, etc.`

## An example of a request article list:

```js
// api/article.js
import request from '../utils/request';
export function fetchList(query) {
  return request({
    url: '/article/list',
    method: 'get',
    params: query
  })
}

// views/example/list
import { fetchList } from '@/api/article'
export default {
  data() {
    list: null,
    listLoading: true
  },
  methods: {
    fetchData() {
      this.listLoading = true
      fetchList().then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
    }
  }
}
```

## Set multiple baseURLs

We can request multiple api addresses by setting multiple `baseURL`s through [environment variables](/guide/essentials/deploy.html).

```bash
# .env.development
VUE_APP_BASE_API = '/dev-api' #Inject the root path of the api
VUE_APP_BASE_API2 = '/dev-api2' #Inject the root path of the api
```

Then create an `axios` instance based on the environment variable, giving it a different `baseURL` [@/utils/request.js](https://github.com/adempiere/adempiere-vue/blob/master/src/utils/request.js)

```js
// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api base_url
  timeout: 5000 // request timeout
})

const service2 = axios.create({
  baseURL: process.env.BASE_API2, // api base_url
  timeout: 5000 // request timeout
})
```

Or

```js
export function fetchList(query) {
  return request({
    url: '/article/list',
    method: 'get',
    params: query,
    baseURL: 'xxxx' // direct coverage
  })
}
```

## Switch from mock directly to server request

See [Mock Data](mock-api.md)
