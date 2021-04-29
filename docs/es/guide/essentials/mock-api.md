# Datos simulados

Los datos simulados son una parte integral del desarrollo front-end, el enlace clave para separar el desarrollo front-end y el back-end. Como acordamos anteriormente, la interfaz del lado del servidor, los datos de solicitud analógica e incluso la lógica pueden hacer que el desarrollo front-end sea independiente, no será bloqueado por el desarrollo del servidor.

## Swagger

En el proyecto de mi empresa, el backend simula los datos mediante [swagger](https://swagger.io/).

**swagger** es una herramienta de generación de documentos API REST que genera automáticamente documentación a partir de comentarios en el código. Puede ser multiplataforma, de código abierto, admite la mayoría de los idiomas, la comunidad es buena, en resumen, muy buena y recomendable.

[Demo en línea](http://petstore.swagger.io/?_ga=2.222649619.983598878.1509960455-2044209180.1509960455#/pet/addPet)

## Easy-mock

[vue-admin-template](https://github.com/adempiere/vue-admin-template) anteriormente utilizó [easy-mock](https://easy-mock.com/login) para simular datos.
Es una visualización pura de front-end y puede generar rápidamente servicios de persistencia para datos analógicos. Muy fácil de usar y también se puede combinar con `swagger`, tiene soporte para cross-domain, ya sea un equipo o un proyecto personal, vale la pena intentarlo.

[Demo en línea](https://easy-mock.com/)

::: warning
La versión en línea de `vue-admin-template` ya no usa `easy-mock`. Debido a que el servicio gratuito en línea es muy inestable, se colgará de vez en cuando. Si lo necesitas, puede crear tu propio servicio de acuerdo con su tutorial.
:::

## Mockjs

Como [adempiere-vue](https://github.com/adempiere/adempiere-vue) es un proyecto personal de front-end puro, todos los datos de simulación son generados por [mockjs](https://github.com/Nuysoft/Mock). Su principio es: interceptar todas las solicitudes y proxy al local, y luego simular datos, por lo que descubrirás que no se emiten solicitudes en `red`.

Pero su mayor problema es el mecanismo de implementación. Sobrescribe el objeto `XMLHttpRequest` del navegador para interceptar todas las solicitudes y el proxy al local. En la mayoría de los casos es bastante conveniente de usar, pero debido a que reescribe el objeto `XMLHttpRequest`, por ejemplo, el método `progress` o algunas bibliotecas de terceros que dependen de `XMLHttpRequest` serán incompatibles. Mirando los [issues](https://github.com/adempiere/adempiere-vue/issues?utf8=%E2%9C%93&q=mock) de mi proyecto, sabrás cuántas personas tienen problemas.

También tiene un problema porque son datos que se simulan localmente y en realidad no realizan ninguna solicitud de red. Por lo tanto, la depuración local es muy problemática y solo se puede depurar mediante `console.log`. Toma el ejemplo de `adempiere-vue`. Si deseas averiguar qué datos devuelve la api `getInfo()`, solo puedes saberlo mirando el código fuente o manualmente `Debug`.

## Nueva manera <Badge text="v4.0.0+"/>

Después de la versión `v4.0`, se lanzará un `mock-server` localmente para simular los datos, y el entorno en línea continuará utilizando `mockjs` para la simulación. (Debido a que este proyecto es un proyecto front-end puro, también puedes construir un servidor en línea para proporcionar datos).

La ventaja de esta manera es resolver los puntos críticos anteriores mientras se conservan las ventajas de 'mockjs'. Dado que nuestro simulacro se implementa completamente basado en `webpack-dev-serve`, `mock-server` se iniciará automáticamente junto con el proyecto, y también pasará [chokidar](https://github.com/paulmillr/chokidar) para observar los cambios en el contenido de la carpeta `mock`. Cuando se produce un cambio, la interfaz `mock-api` registrada previamente se borra y la nueva interfaz se vuelve a montar dinámicamente para admitir actualizaciones. Si estás interesado, puedes mirar el código [mock-server.js](https://github.com/adempiere/adempiere-vue/blob/master/mock/mock-server.js). Dado que es un verdadero "servidor", puedes conocer claramente la estructura de datos devuelta por la interfaz a través de la sección "red" de Chrome. Al mismo tiempo, resuelves el problema de que los `mockjs` anteriores rescriben el objeto`XMLHttpRequest`, lo que hace que muchas bibliotecas de terceros fallen.

Todas las solicitudes para este proyecto se envían a través del paquete [request.js](https://github.com/adempiere/adempiere-vue/blob/master/src/utils/request.js), mediante la lectura del código fuente puedes encontrar que todas las solicitudes están configuradas en `baseURL`, y este se configura dinámicamente al leer la variable de entorno `process.env.VUE_APP_BASE_API`, para que podamos usar diferentes entornos.

## Eliminar

Si no deseas usar `mock-server`, solo el middleware `after` de `webpack-dev-server` desde [vue.config.js](https://github.com/adempiere/adempiere-vue/blob/master/vue.config.js).

Por defecto, las solicitudes locales son proxy para `http://localhost:${port}/mock`, y puedes modificar 'proxy' si deseas ajustar a tu propia dirección simulada.

```js
proxy: {
  // cambiar xxx-api/login => mock/login
  // detalles: https://cli.vuejs.org/config/#devserver-proxy
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

**Tenga en cuenta: esta operación requiere un reinicio del servidor.**

## Agregar

Si deseas agregar datos simulados, solo busca el archivo `mock` en la carpeta raíz, agrega la ruta correspondiente, intercepta y simula los datos.

Por ejemplo, necesito agregar una API para obtener la cantidad de comentarios debajo de un artículo en [src/api/article](https://github.com/adempiere/adempiere-vue/blob/master/src/api/article.js) a través de `fetchComments`. Primero crea una nueva api:

```js
export function fetchComments(id) {
  return request({
    url: `/article/${id}/comments`,
    method: 'get'
  })
}
```

Después de declarar la API, necesitamos encontrar la carpeta simulada correspondiente [mock/article.js](https://github.com/adempiere/adempiere-vue/blob/master/mock/article.js), debajo Creamos una API simulada que intercepte las rutas.

**Ten en cuenta que la intercepción simulada se basa en el enrutamiento. Asegúrate de que la ruta de datos simulados coincida con tu ruta de la API (soporte regular)**

```js
// fetchComments mock
{
  // url debe coincidir con la ruta de tu api
  // Por ejemplo, la ruta de fetchComments puede ser /article/1/comments or /article/2/comments
  // Por lo que necesitas que coincida con regularidad
  url: '/article/[A-Za-z0-9]/comments',
  type: 'get', // Debe ser del mismo tipo que tu interfaz define
  response: (req, res) => {
    // return result
    // req y res ver detalles
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

## Cambiar

La operación más común es: has simulado algunos datos localmente, y una vez que el backend completa la API, reemplaza gradualmente la API del simulacro original.

Tomemos como ejemplo la API `getRoles` en [src/api/role.js](https://github.com/adempiere/adempiere-vue/blob/master/src/api/role.js). Originalmente se simuló de [mock/role/index.js](https://github.com/adempiere/adempiere-vue/blob/master/mock/role/index.js). Ahora necesitamos cambiarlo a datos reales de back-end, siempre que esté en [mock/role/index.js](https://github.com/adempiere/adempiere-vue/blob/master/mock/role/index.js). Encuentra la ruta correspondiente y luego elimínala. En este momento puedes ver los datos reales en `network`.

```js
// Lo declarado en la api
export function getRoles() {
  return request({
    url: '/roles',
    method: 'get'
  })
}

// Encuentra la ruta correspondiente y elimina
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

## Servidores múltiples

Actualmente, el proyecto solo inicia un `mock-server`, por supuesto, también puedes tener tu propia interfaz `mock-server` o proxy. Algunas API pueden soportar este servicio, otras pueden soportar otros. Simplemente configúralos en un `baseURL` diferente. [@/utils/request.js](https://github.com/adempiere/adempiere-vue/blob/master/src/utils/request.js)

A continuación, configura múltiples `proxy` de acuerdo con las reglas de url establecidas en [vue.config.js](https://github.com/adempiere/adempiere-vue/blob/master/vue.config.js).

[Documentos relacionados](https://webpack.docschina.org/configuration/dev-server/#devserver-proxy)

## Habilitar simulación de front end puro

Ahora en [mock/index.js](https://github.com/adempiere/adempiere-vue/blob/master/mock/index.js#L19) también se encapsula un método simulado de front-end puro, solo necesita estar en [src/main.js](https://github.com/adempiere/adempiere-vue/tree/master/src):

```js
import { mockXHR } from '../mock'
mockXHR()
```

Esto se convertirá en pura información simulada de front-end y al igual que la versión anterior a la `v4.0`, el principio es el anterior. La [demo](https://adempiere.github.io/adempiere-vue) en línea que estás viendo actualmente es así.

## Cambiar datos simulados locales y en línea

En muchas ocasiones, encontramos un uso local de datos simulados, entornos en línea que utilizan datos reales o entornos diferentes que utilizan datos diferentes.

- **Easy-Mock**

Debes asegurarte de que tu API simulada local sea coherente con todas las demás direcciones, excepto la ruta raíz. como:

```
https://api-dev/login   // Solicitud local

https://api-prod/login  // Solicitud en línea
```

Podemos usar las [variables de entorno](/guide/essentials/deploy.html#environmental-variables) para hacer diferentes entornos y solicitar diferentes rutas base de la API.

```bash
# .env.development
VUE_APP_BASE_API = '/dev-api' #Inyecta la ruta raíz de la API local
```

```bash
# .env.production
VUE_APP_BASE_API = '/prod-api' #Inyecta la ruta raíz de la API de producción
```

Luego crea una instancia de `axios` basada en la variable de entorno para tener una `baseURL` diferente.
[@/utils/request.js](https://github.com/adempiere/adempiere-vue/blob/master/src/utils/request.js)

```js
// crear una instancia de axios
const service = axios.create({
  baseURL: process.env.BASE_API, // base_url de la API
  timeout: 5000 // tiempo de espera de la solicitud
})
```

De esta manera, podemos cambiar automáticamente las APIs locales y en línea en función de las variables de entorno.

- **Mock.js**

Cuando usamos `Mock.js` para simular datos localmente, el método de la API del mundo real se usa en línea. Esto es similar al método de easy-mock anterior. Principalmente damos por hecho que cuando se trata de un entorno en línea, usamos la API del mundo real. Solo importamos `Mock.js` localmente.

```js
// main.js
// se requiere usar variables de entorno para determinarlo
if (process.env.NODE_ENV === 'development') {
  require('./mock') // datos de simulación
}
```

Los datos simulados solo se importan en el entorno local.
