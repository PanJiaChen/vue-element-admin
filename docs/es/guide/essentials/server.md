# Trabajar con el Servidor

## Flujo de solicitudes de front-end

En `adempiere-vue`, una interfaz de usuario completa interactúa con el flujo de procesamiento del lado del servidor de la siguiente manera:

1.  Interacción de componentes UI;
2.  Llamar a la función de solicitud de servicio API de gestión unificada;
3.  Enviar solicitudes utilizando request.js;
4.  Obtener respuesta del servidor;
5.  Actualizar datos;

Como puedes ver en el flujo anterior, para facilitar la administración y el mantenimiento, el procesamiento de solicitudes unificadas se coloca en la carpeta `src/api` y los archivos generalmente se dividen de acuerdo con la latitud del modelo, como:

```
api/
  login.js
  article.js
  remoteSearch.js
  ...
```

## request.js

`@/utils/request.js` se basa en [axios](https://github.com/axios/axios), para facilitar el manejo uniforme de POST, GET y otros parámetros de solicitud, encabezados de solicitud y mensajes de error. Para ver mas específico vea [request.js](https://github.com/adempiere/adempiere-vue/blob/master/src/utils/request.js).

Encapsula el 'interceptor de solicitud' global, el 'interceptor de respuesta', el 'manejo unificado de errores', el 'tiempo de espera unificado, la configuración de baseURL, etc.'

## Un ejemplo de solicitud de una lista de artículos:

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

## Establecer múltiples baseURLs

Podemos solicitar múltiples direcciones api configurando múltiples `baseURL`s a través de [variables de entorno](/guide/essentials/deploy.html).

```bash
# .env.development
VUE_APP_BASE_API = '/dev-api' #Inyecta la ruta raíz de la api
VUE_APP_BASE_API2 = '/dev-api2' #Inyecta la ruta raíz de la api
```

Luego crea una instancia `axios` basada en la variable de entorno, dándole una `baseURL` [@/utils/request.js](https://github.com/adempiere/adempiere-vue/blob/master/src/utils/request.js) diferente.

```js
// crear una instancia de axios
const service = axios.create({
  baseURL: process.env.BASE_API, // api base_url
  timeout: 5000 //  tiempo de espera agotado
})

const service2 = axios.create({
  baseURL: process.env.BASE_API2, // api base_url
  timeout: 5000 // tiempo de espera agotado
})
```

O

```js
export function fetchList(query) {
  return request({
    url: '/article/list',
    method: 'get',
    params: query,
    baseURL: 'xxxx' // cobertura directa
  })
}
```

## Cambiar de Mock directamente a la solicitud del servidor

Ver [Mock Data](mock-api.md)
