# Etiquetas View

Esta característica es para responder a las necesidades de las personas. De hecho, no utilizo esta característica en proyectos de la empresa o proyectos personales. En el pasado, esos frameworks tradicionales de back-end a menudo incluían esta característica. Dado que la mayoría de los proyectos de back-end anteriores tenían varias páginas, la característica de navegación Etiquetas View todavía tiene un significado básico. La mayoría de ellos se basan en el iframe.

Sin embargo, con el paso del tiempo, los proyectos en back-end son casi todos spa (desarrollo de una aplicación web de una sola página), y obviamente no es apropiado usar la forma anterior para implementar la navegación con etiquetas.

Entonces el plan actual es:

Usar una combinación de `keep-alive` y `router-view`.

Código: `@/layout/components/AppMain.vue`

```html
<keep-alive :include="cachedViews">
  <router-view></router-view>
</keep-alive>
```

La acción real de las etiquetas de navegación view es equivalente a otro modo de visualización de navegación. De hecho, es un router-link, y al hacer clic salta a la página correspondiente. Luego estamos escuchando los cambios en la ruta `$route` para determinar si la página actual necesita ser recargada o almacenada en caché.

## visitedViews && cachedViews

La etiqueta view actual mantiene dos matrices.

- visitedViews : La página que el usuario ha visitado es una colección de matrices de etiquetas que se muestran en la barra de navegación de etiquetas.
- cachedViews : La ruta actual keep-alive. Puedes establecer si deseas o no almacenar en caché la ruta, configurandola con `meta.noCache`. [Documento de configuración](router-and-nav.md)

## Precauciones

Debido a que keep-alive y router-view están fuertemente acoplados, y no es difícil encontrar que keep-alive incluye el nombre predeterminado del componente, es necesario mirar el documento y el código fuente al escribir el componente de enrutamiento correspondiente al enrutador y la ruta de enrutamiento.

Asegúrate de que el nombre de ambos sea exactamente el mismo. (Ten en cuenta que el nombre debe ser tan único como sea posible. Recuerda no duplicar el nombre de algunos componentes o hacer referencia al último problema de desbordamiento de memoria de forma recursiva).

**DEMO:**

```js
//Definir rutas
{
  path: 'create-form',
  component: ()=>import('@/views/form/create'),
  name: 'createForm',
  meta: { title: 'createForm', icon: 'table' }
}
```

```js
//La vista correspondiente de la ruta. tales como: form/create
export default {
  name: 'createForm'
}
```

Asegúrate de que los dos nombres sean iguales. Recuerda no escribir duplicados o errores. De forma predeterminada, si no escribes el nombre, no se almacenará en caché.

Para más detalles, ver [issue](https://github.com/vuejs/vue/issues/6938#issuecomment-345728620).

## Cuando la caché no es adecuada para la situación

Las soluciones actualmente en caché no son adecuadas para ciertos servicios, como la página de detalles del artículo, por ejemplo `/article/1`, `/article/2`, sus rutas son diferentes pero los componentes correspondientes son los mismos, por lo que el nombre de su componente es igual, como se mencionó anteriormente, con la inclusión de `keep-alive` solo se puede almacenar en caché basándose en el nombre del componente, por lo que esto es un problema. Actualmente hay dos soluciones:

- En lugar de utilizar la inclusión de keep-alive, este almacenará directamente todos los componentes en caché. De esta manera, se ayudara a la situación antes mencionada.
  En [@/layout/components/AppMain.vue](https://github.com/adempiere/adempiere-vue/blob/master/src/layout/components/AppMain.vue) elimina el código relacionado con `include`. Por supuesto, usar keep-alive directamente también tiene desventajas. No puedes eliminar dinámicamente la caché. Solo puedes ayudar estableciendo un límite máximo de instancia de caché.
  [issue](https://github.com/vuejs/vue/issues/6509)

- Utiliza un esquema de caché del navegador como localStorage, para controlar la caché.

## Affix <Badge text="v3.10.0+"/>

Si el atributo Affix se agrega a la ruta, `tag` quedará fija en `tags-view` (no se podrá quitar).

![](https://user-images.githubusercontent.com/8121621/52840303-cd5c9280-3133-11e9-928f-e2825eaab51b.png)

```js {14}
 {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: {
          title: 'dashboard',
          icon: 'dashboard',
          noCache: true,
          affix: true
        }
      }
    ]
  }
```

## Eliminar

De hecho, el [código fuente](<(https://github.com/vuejs/vue/blob/dev/src/core/components/keep-alive.js)>) de keep-alive no es complicado, y la lógica sigue siendo bastante clara. Antes de que el autor de `vue` corrigiera un error, no tuvo cuidado e hizo dos versiones para solucionarlo, por lo que si no hay ningún usuario que necesite la barra de navegación, se recomienda Eliminar esta función.

Primero encuentra
`@/layout/components/AppMain.vue` y elimina `keep-alive`

```html
<template>
  <section class="app-main" style="min-height: 100%">
    <transition name="fade-transform" mode="out-in">
      <router-view></router-view> <!-- o también <router-view :key="key"/> -->
    </transition>
  </section>
</template>
```

Elimina el archivo `@/layout/components/TagsView.vue`. Luego, elimina la referencia a `TagsView` en los archivos `@/layout/components/index` y `@/layout/Layout.vue`. Finalmente, elimina el archivo `@/store/modules/tagsView`.
