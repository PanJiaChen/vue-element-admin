# Compilar y Desplegar

## Compilar

Cuando se completan los proyectos, puedes compilar tu aplicación con solo ejecutar un comando:

```bash
# compilar para el entorno de producción
npm run build:prod

# compilar para el entorno de pruebas
npm run build:stage
```

Después de que el paquete de compilación sea exitoso, la carpeta `dist` se generará en el directorio raíz, que es la construcción de un archivo empaquetado, generalmente archivos estáticos como `***. js`, `***. css`, `index.html`, etc.

Si necesitas una compilación personalizada, como especificar el directorio dist, debes configurarlo a través de `outputDir` en [config](https://github.com/adempiere/adempiere-vue/blob/master/vue.config.js).

### Variables de entorno

La configuración de todos los entornos de prueba o variables de entorno formales se encuentra en el archivo `.env.xxxx` como [.env.development](https://github.com/adempiere/adempiere-vue/blob/master/.env.development).

Todos se inyectan en el contexto global a través de los complementos `webpack.DefinePlugin`.

::: tip ¡NOTA!
Las variables de entorno deben comenzar con `VUE_APP_`. Tales como: `VUE_APP_API`, `VUE_APP_TITLE`

Puedes acceder a ellas en el código de tu aplicación:

```js
console.log(process.env.VUE_APP_xxxx)
```

### Analizar el tamaño del archivo de compilación

Si tu archivo de compilación es grande, puedes optimizar tu código compilando y analizando la distribución del tamaño de los módulos dependientes utilizando `webpack-bundle-analyzer`.

```bash
npm run preview -- --report
```

Después de ejecutar, puedes ver la distribución de tamaño específico en [http://localhost:9526/report.html](http://localhost:9526/report.html)

![](https://adempiere-vue.gitee.io/gitee-cdn/adempiere-vue-site/3fddf034-2b38-4299-b0d2-b748fb2abef0.jpg)

::: tip
Se recomienda utilizar gzip, después de usarlo, el volumen será solo el 1/3 del original más o menos. También puedes usar Lazy Loading o Code Splitting.
:::

## Publicar

Para la publicación, solo tienes que publicar el archivo estático resultante después de la compilación, que generalmente es el archivo estático en la carpeta `dist`, en tu cdn o servidor estático. Ten en cuenta que `index.html` generalmente será una página de entrada para tu servicio de back-end. Es posible que debas cambiar la ruta de importación de la página después de determinar la estática para JS y CSS.

::: tip
En el despliegue puedes encontrar que la ruta del recurso es incorrecta, simplemente modifica la ruta del archivo de recurso `@/config/index.js`.
:::

```js
// los cambios se configuran según tu propia ruta
publicPath: './'
```

### Enrutador y servidor

En adempiere-vue, el enrutamiento front-end usa `vue-router`, por lo que tienes dos opciones: `browserHistory` y `hashHistory`.

Simplemente hablando, la diferencia entre ellos es el trato con el enrutamiento. `hashHistory` es procesado por la ruta que sigue de `#`, la gestión de enrutamiento de front-end a través de [HTML 5 History](https://developer.mozilla.org/en-US/docs/Web/API/History_API), y `browserHistory` es similar a nuestra ruta de acceso de página habitual, y no con `#`, pero debe a través de la configuración del servidor.

Este proyecto utiliza `hashHistory` de forma predeterminada, por lo que, si tienes `#` en tu URL y deseas deshacerte de él, debes cambiar a `browserHistory`.

Modificar el modo en `src/router/index.js`

```js
export default new Router({
  // mode: 'history' // Necesita soporte de backend
})
```

::: tip
Ver detalles [vue-router document](https://router.vuejs.org/guide/essentials/history-mode.html)
:::

## Desplegar todo el Ecosistema

### Para todos los entornos, debe ejecutar las siguientes imágenes:

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

### Ejecutar Docker Stack

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

Nota: El contenedor Elasticsearch requiere un archivo de configuración `elasticsearch.yaml`.

```shell
# requiere permisos de super usuario del sistema operativo ('su' o 'sudo')
docker-compose up
```

Contenedores de salida:

- adempiere-backend
- adempiere-redis
- adempiere-eslastic-search
- adempiere-proxy
- adempiere-frontend
- adempiere-ecommerce
