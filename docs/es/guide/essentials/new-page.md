# Nueva Página

Si estás familiarizado con `vue-router`, entonces será muy simple.

Primero agrega la ruta a `@/router/index.js`.

**Por ejemplo: agregar una página de Excel**

```js
{
  path: '/excel',
  component: Layout,
  redirect: '/excel/export-excel',
  name: 'excel',
  meta: {
    title: 'excel',
    icon: 'excel'
  }
}
```

::: tip
Simplemente crea una ruta en blanco basada en 'layout', y agrega una ruta debajo de 'children'.
:::

```js
{
  path: '/excel',
  component: Layout,
  redirect: '/excel/export-excel',
  name: 'excel',
  meta: {
    title: 'excel',
    icon: 'excel'
  },
  children: [
    {
      path: 'export-excel',
      component: ()=>import('excel/exportExcel'),
      name: 'exportExcel',
      meta: { title: 'exportExcel' }
    }
  ]
}
```

**En esta barra lateral aparecerá el menu-item**

![](https://adempiere-vue.gitee.io/gitee-cdn/adempiere-vue-site/2ab6921d-f9bb-4fbb-a151-0e6027e23a6e.png)

<br/>

:::tip
Cuando en `children` se declare solo una ruta, no habrá flecha de expansión. Si el número de rutas en `children` es mayor que 1, habrá una flecha de expansión, como se muestra a continuación.

Si deseas ignorar esta decisión automática, puedes usar `alwaysShow: true`, para que ignore la regla previamente definida y muestre la ruta raíz. Consulta [Enrutador y Navegación](router-and-nav.md) para más detalles..

:::

```js
{
  path: '/excel',
  component: Layout,
  redirect: '/excel/export-excel',
  name: 'excel',
  meta: {
    title: 'excel',
    icon: 'excel'
  },
  children: [
    { path: 'export-excel', component:()=>import('excel/exportExcel'), name: 'exportExcel', meta: { title: 'exportExcel' }},
    { path: 'export-selected-excel', component:()=>import('excel/selectExcel'), name: 'selectExcel', meta: { title: 'selectExcel' }},
    { path: 'upload-excel', component:()=>import('excel/uploadExcel'), name: 'uploadExcel', meta: { title: 'uploadExcel' }}
  ]
}
```

![](https://adempiere-vue.gitee.io/gitee-cdn/adempiere-vue-site/89d6a0b8-5cf7-4a19-9afd-7267ec454066.png)

**En la barra lateral aparecerá el `submenu`.**

<br/>

## Rutas anidadas

Si tienes una Ruta anidada, como [@/views/nested](https://github.com/adempiere/adempiere-vue/tree/master/src/views/nested),
**no olvides agregar manualmente `< router-view >` al archivo raíz del directorio secundario**.

```html
 <!-- parent view  -->
<template>
  <div>
    <!-- xxx html dom  -->
    <router-view />
  </div>
</template>
```

Por ejemplo: [@/views/nested/menu1/index.vue](https://github.com/adempiere/adempiere-vue/blob/master/src/views/nested/menu1/index.vue).

**NOTA:** Agrega tantos `<ruter-view>` como nivel de rutas anidadas.

![](https://adempiere-vue.gitee.io/gitee-cdn/adempiere-vue-site/9459de62-64d0-4819-9730-daf3f9889018.png)

<br/>

## Crear vista

Después de agregar la ruta, crea una vista debajo de `@/views`. Como de costumbre, un enrutador corresponde a una vista.

Sugerencia: si un componente o una función de utilidades solo se usa en esta vista, simplemente crea una carpeta de componentes en esta vista, es más conveniente para cada módulo mantener sus propios `utils` o `components`.

![](https://adempiere-vue.gitee.io/gitee-cdn/adempiere-vue-site/8ca55a30-c22c-4143-aa8d-2a0d3e04fc33.png)

<br/>

## Crear API

Finalmente, bajo la carpeta [@/api](https://github.com/adempiere/adempiere-vue/tree/master/src/api) crea el servicio api correspondiente para este módulo.

## Crear componente

Escribe personalmente hábitos de proyecto vue, el `@/components` global solo escribirá algunos componentes globales, como texto enriquecido, varios componentes de búsqueda, componentes de fecha empaquetada, etc., pueden ser componentes compartidos. Cada página o componente comercial específico del módulo se escribe bajo las vistas actuales. Por ejemplo: `@/views/article/components/xxx.vue`. Esta división reduce en gran medida los costos de mantenimiento.

** ¡Recuerda que el mayor beneficio de dividir componentes no es el código compartido sino la mantenibilidad! **

## Crear estilo

El estilo y los componentes de la página son los mismos. `@/style` global escribe un estilo común global. El estilo de cada página está escrito bajo el `views` actual. Recuerda agregar `scoped` o espacio de nombres para evitar Causas de contaminación de estilo global.

```css
<style>
/* estilos globales */
</style>

<style scoped>
/* estilos locales */
.xxx-container{
  /* name scoped */
  xxx
}
</style>
```
