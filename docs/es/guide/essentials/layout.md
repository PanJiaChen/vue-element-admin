# Diseño

El diseño general de la página es la estructura de un producto y a menudo incluye navegación, barras laterales, breadcrumbs y contenido. Para comprender un proyecto de administración, primero comprende su diseño básico.

![](https://adempiere-vue.gitee.io/gitee-cdn/adempiere-vue-site/7066d74f-12c5-47d6-b6ad-f22b43fec917.png)

::: tip Código
[@/layout](https://github.com/adempiere/adempiere-vue/tree/master/src/layout)
:::

`@` es el [alias](https://webpack.js.org/configuration/resolve/#resolve-alias) de webpack. Si no lo entiendes por favor estudíalo por tu cuenta.

<br>

La mayoría de las páginas en `adempiere-vue` se basan en este `layout`, excepto las páginas individuales como: `login`, `404`, `401`, etc., las cuales no utilizan este diseño. También es fácil si se quiere tener varios diseños en un proyecto, simplemente hay que elegir un componente de diseño diferente en el enrutamiento de primer nivel.

```js
// Sin diseño
{
  path: '/401',
  component: () => import('errorPage/401')
}

// Con diseño
{
  path: '/documentation',

  // Puedes elegir diferentes componentes de diseño
  component: Layout,

  // Aquí la ruta se muestra en app-main
  children: [{
    path: 'index',
    component: () => import('documentation/index'),
    name: 'documentation'
  }]
}
```

Esto utiliza vue-router [anidación de enrutamiento](https://router.vuejs.org/guide/essentials/nested-routes.html), por lo que, en general, agregar o modificar una página solo afectará el cuerpo principal de app-main. Otro contenido en el diseño, como: la barra lateral o la barra de navegación no cambiará con tu página principal.

```
/foo                                  /bar
+------------------+                  +-----------------+
| layout           |                  | layout          |
| +--------------+ |                  | +-------------+ |
| | foo.vue      | |  +------------>  | | bar.vue     | |
| |              | |                  | |             | |
| +--------------+ |                  | +-------------+ |
+------------------+                  +-----------------+
```

<br>

## app-main

::: tip Código
[@/layout/components/AppMain](https://github.com/adempiere/adempiere-vue/blob/master/src/layout/components/AppMain.vue)
:::

Aquí hay una capa de `keep-alive`, afuera `app-main` es principalmente para almacenar en caché `<router-view>`, con la navegación de la pestaña `tabs-view` de la página, si no lo necesitas [eliminalo](tags-view.md).

`transition` define la animación de cambio entre páginas, puedes modificar la animación de transición según tus propias necesidades. [Documentación](https://vuejs.org/v2/guide/transitions.html) relacionada.

Se proporcionan dos animaciones de transición de forma predeterminada `fade` y `fade-transform`. Para la implementación específica de CSS, consulta [transition.scss](https://github.com/adempiere/adempiere-vue/blob/master/src/styles/transition.scss). Si necesitas cambiarla, puedes modificar `name` de `transition` en [AppMain.vue](https://github.com/adempiere/adempiere-vue/blob/master/src/layout/components/AppMain.vue).

<br>

## router-view

**Diferente enrutador, el mismo componente vue** En un trabajo real, hay muchas situaciones como:

![](https://adempiere-vue.gitee.io/gitee-cdn/adempiere-vue-site/ac5047c9-cb75-4415-89e3-9386c42f3ef9.jpeg)

El mismo componente se utiliza para crear y editar páginas. Por defecto, cuando se cambien estas dos páginas, no se activarán los hooks creados o montados de vue. [Oficialmente dice](https://router.vuejs.org/guide/advanced/data-fetching.html#data-fetching) que puedes hacer esto a través del cambio de reloj `$route`. A decir verdad, sigue siendo muy problemático. Más tarde descubrí que simplemente podía agregar una clave única a router-view para asegurar que los hooks de enrutamiento se vuelvan a representar cuando se cambia la ruta. Es mucho más simple.

```js
<router-view :key="key"></router-view>

computed: {
  key() {
    // solo asegúrate de que la clave (key) sea única
    return this.$route.fullPath
  }
 }
```

::: tip
**O** Puedes declarar dos vistas diferentes, como `editForm` y `createForm` en este proyecto, pero introducirlo en el mismo componente.

Código: [@/views/example](https://github.com/adempiere/adempiere-vue/tree/master/src/views/example)
:::

```html
<!-- create.vue -->
<template>
  <article-detail :is-edit='false'></article-detail> //crear
</template>
<script>
  import ArticleDetail from './components/ArticleDetail'
</script>

<!-- edit.vue -->
<template>
   <article-detail :is-edit='true'></article-detail> //editar
</template>
<script>
  import ArticleDetail from './components/ArticleDetail'
</script>
```

## Móvil

La posición oficial de `element-ui` es de framework del lado del escritorio, y la mayoría de los proyectos de administración son complejos, es imposible cumplir con las interacciones del lado del escritorio y del lado del móvil a través de una simple adaptación. Por lo tanto, la interacción entre los dos extremos debe ser diferente. Se recomienda volver a hacer un sistema para dispositivos móviles.

En pocas palabras, este proyecto no se adaptará a móvil. Es una respuesta simple y puedes modificarlo tu mismo.
