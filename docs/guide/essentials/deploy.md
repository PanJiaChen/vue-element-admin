# Build & Deploy

## Build

When projects are completed, you can build your application only run one command:

```bash
# build for production environment
npm run build:prod

# build for stage environment
npm run build:stage
```

After the build package is successful, the `dist` folder will be generated in the root directory, which is to build a packaged file, usually static files such as `***.js`, `***.css`, `index.html`, etc. .

If you need a custom build, such as specifying the dist directory, you need to configure it through `outputDir` in [config](https://github.com/adempiere/adempiere-vue/blob/master/vue.config.js).

### Environmental variables

The configuration of all test environments or formal environment variables is in the `.env.xxxx` file such as [.env.development](https://github.com/adempiere/adempiere-vue/blob/master/.env.development).

They all inject into the global context via the `webpack.DefinePlugin` plug-ins.

::: tip note! ! !
Environment variables must start with `VUE_APP_`. Such as: `VUE_APP_API`, `VUE_APP_TITLE`

You can access them in your application code:

```js
console.log(process.env.VUE_APP_xxxx)
```

### Analyze the build file size

If your build file is large, you can optimize your code by building and analyzing the size distribution of dependent modules using the `webpack-bundle-analyzer`.

```bash
npm run preview -- --report
```

After running you can see the specific size distribution at [http://localhost:9526/report.html](http://localhost:9526/report.html)

![](https://adempiere-vue.gitee.io/gitee-cdn/adempiere-vue-site/3fddf034-2b38-4299-b0d2-b748fb2abef0.jpg)

::: tip
It is recommended to use gzip, after using the volume will be only the original 1/3 or so. You can also use lazy loading or Code Splitting.
:::

## Publish

For publishing, you only have to publish the resulting static file after build, which is usually the static file in the `dist` folder, to your cdn or static server. Note that the `index.html` usually will be an entry page for your backend service. You may need to change the page's import path after determining static for JS and css.

::: tip
In deployment may find that the resource path is wrong, just modify the `@/config/index.js` file resource path.
:::

```js
// changes configure depending on your own path
publicPath: './'
```

### Router & Server

In adempiere-vue, the front-end routing uses `vue-router`, so you have two options:`browserHistory` and `hashHistory`.

Simply speaking, the difference between them is the deal with routing. `hashHistory` is processed by the path following `#`, front-end routing management through [HTML 5 History](https://developer.mozilla.org/en-US/docs/Web/API/History_API), and `browserHistory` is similar to our usual page access path, and with not `#`, but must through the server's configuration.

This project uses `hashHistory` by default, so if you have`#`in your url and you want to get rid of it, you need to switch to`browserHistory`.

Modify `src/router/index.js` mode。

```js
export default new Router({
  // mode: 'history' // Need backend support
})
```

::: tip
Detail see [vue-router document](https://router.vuejs.org/zh-cn/essentials/history-mode.html)
:::

## Deploy All Ecosystem

### For all enviroment you should run the follow images:

- [ADempiere gRPC](https://hub.docker.com/r/erpya/adempiere-grpc-all-in-one)

```shell
docker pull erpya/adempiere-grpc-all-in-one
```

- [Proxy ADempiere API](https://hub.docker.com/r/erpya/proxy-adempiere-api)

```shell
docker pull erpya/proxy-adempiere-api
```

- [ADempiere Vue](https://hub.docker.com/r/erpya/adempiere-vue)

```shell
docker pull erpya/adempiere-vue
```

- [ADempiere eCommerce](https://hub.docker.com/r/erpya/adempiere-ecommerce)

```shell
docker pull erpya/adempiere-ecommerce
```

### Run Docker Stack

```yaml
# docker-compose.yaml
version: '3.7'

services:
  grpc-backend:
    image: erpya/adempiere-grpc-all-in-one
    container_name: adempiere-backend
    stdin_open: true
    tty: true
    environment:
      - SERVER_PORT=50059
      - SERVICES_ENABLED=access; business; core; dashboarding; dictionary; enrollment; log; ui; workflow; store; pos; updater;
      - SERVER_LOG_LEVEL=WARNING
      - DB_HOST=postgres_host
      - DB_PORT=5432
      - DB_NAME=adempiere
      - DB_USER=adempiere
      - DB_PASSWORD=adempiere
      - DB_TYPE=PostgreSQL
    ports:
      - 50059:50059

  redis:
    image: redis:4-alpine
    container_name: adempiere-redis
    stdin_open: true
    tty: true
    ports:
      - '6379:6379'

  es7:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.3.2
    container_name: adempiere-eslastic-search
    ulimits:
      memlock:
        soft: -1
        hard: -1
    volumes:
      - ./elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml:ro
    ports:
      - '9200:9200'
      - '9300:9300'
    environment:
      - discovery.type=single-node
      - cluster.name=docker-cluster
      - bootstrap.memory_lock=true
      - ES_JAVA_OPTS=-Xmx512m -Xms512m

  api-rest:
    image: erpya/proxy-adempiere-api
    container_name: adempiere-proxy
    depends_on:
      - es7
      - redis
    stdin_open: true
    tty: true
    environment:
      - SERVER_PORT=8085
      - AD_DEFAULT_HOST=adempiere-backend
      - AD_DEFAULT_PORT=50059
      - ES_HOST=adempiere-eslastic-search
      - ES_PORT=9200
      - VS_ENV=dev
      - INDEX=vue_storefront_catalog
      - RESTORE_DB=N
    ports:
      - 8085:8085

  vue-app:
    image: erpya/adempiere-vue
    container_name: adempiere-frontend
    stdin_open: true
    tty: true
    environment:
      - API_URL=http://adempiere-proxy:8085
    ports:
      - 9526:80

  e-commerce:
    image: erpya/adempiere-ecommerce
    container_name: adempiere-ecommerce
    stdin_open: true
    tty: true
    environment:
      - SERVER_PORT=3000
      - API_URL=http://adempiere-proxy:8085
      - STORE_INDEX=vue_storefront_catalog
      - VS_ENV=dev
    ports:
      - 3000:3000
```

Note: Eslastic Search container requires a config file `elasticsearch.yaml`.

```shell
# requires superuser permissions of the operating system ('su' or 'sudo')
docker-compose up
```

Containers Running:

- adempiere-backend
- adempiere-redis
- adempiere-eslastic-search
- adempiere-proxy
- adempiere-frontend
- adempiere-ecommerce
