# Variables de Entorno

`adempiere-vue` 4.0+ está construido en `vue-cli`, por lo que todas las variables de entorno se controlan en función de `vue-cli`.

[Documento oficial](https://cli.vuejs.org/guide/mode-and-env.html)

```
.env                # cargado en todos los casos
.env.[mode]         # solo cargado en el modo especificado
```

Un archivo env simplemente contiene pares de variables de entorno key=value:

```
FOO=bar
VUE_APP_SECRET=secret
```

::: tip ¡NOTA!
Las variables de entorno deben comenzar con `VUE_APP_`. Tales como: `VUE_APP_API`, `VUE_APP_TITLE`

Puedes acceder a ellas en el código de tu aplicación:

```js
console.log(process.env.VUE_APP_xxxx)
```

:::

Además de las variables `VUE_APP_*`, también hay dos variables especiales que siempre estarán disponibles en el código de tu aplicación:

- `NODE_ENV` - este será uno de "development, "production" o "test" dependiendo del modo en que se ejecute la aplicación.
- `BASE_URL` - esto corresponde a la opción `publicPath` en `vue.config.js` y es la ruta base en la que se implementa tu aplicación.

## Relacionado con la compilación

Además de algunas variables de entorno escritas en `.env`, hay algunas variables relacionadas con la compilación y la implementación que deben configurarse en `vue.config.js`.

Puedes establecer los diferentes parámetros ejecutando el entorno de juicio con `process.env.NODE_ENV`.

El código específico lo puedes aprender de [vue.config.js](https://github.com/adempiere/adempiere-vue/blob/master/vue.config.js)
