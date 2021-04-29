# Enrutador y Navegación

El enrutador y la navegación son el esqueleto clave para organizar un sistema de gestión.

El enrutador de este proyecto y la navegación están unidos, por lo que solo debes configurar la ruta en `@/router/index.js` y la navegación de la barra lateral se generará de manera dinámica automáticamente. Esto reduce en gran medida la carga de trabajo al no editar manualmente la barra lateral de navegación. Por supuesto, debes seguir muchos convenios al configurar la ruta.

## Configuración

En primer lugar, vamos a conocer la configuración que se le proporciona a una ruta.

```js
// si es true, no aparecerá en la barra lateral de navegación.
// p.ej. inicio de sesión, página 401 o como algunas de edición /edit/1 (Predeterminado: false)
hidden: true

// No se puede hacer clic en esta ruta en breadcrumb cuando se establece noRedirect
redirect: noRedirect

// cuando agregas más de un hijo a un elemento ruta, automáticamente se
// convierte en modo anidado, cuando solo hay un hijo se muestra como ruta
// raíz de forma predeterminada, pero si deseas mostrarla en modo anidado,
// aunque solo sea una puedes establecer:
// alwaysShow: true
// para que ignore las reglas definidas previamente y siempre se muestre
// en modo anidado
alwaysShow: true

// establece el nombre del enrutador. Debe configurarse para evitar problemas con <keep-alive>.
name: 'router-name'

meta: {
  // roles requeridos para navegar a esta ruta. Admite múltiples permisos de apilamiento.
  // si no se establece significa que no necesita ningún permiso.
  roles: ['admin', 'editor']

  // El título de la ruta para mostrar en varios componentes (por ejemplo, barra lateral, breadcrumbs).
  title: 'title'

  // clase de icono SVG
  icon: 'svg-name' // or el-icon-x

  // si es true, la ruta no será almacenada en caché por <keep-alive> (Predeterminado: false)
  noCache: true

  // si es false, el elemento estará oculto en el breadcrumb (Predeterminado: true)
  breadcrumb: false

  // if set to true, it can be fixed in tags-view (default false)
  affix: true // this is very useful in some scenarios, // click on the article to enter the article details page,

  // When you set, the related item in the sidebar will be highlighted
  // for example: a list page route of an article is: /article/list
  // at this time the route is /article/1, but you want to highlight the route of the article list in the sidebar,
  // you can set the following
  activeMenu: '/article/list'
}
```

<br/>

**Ejemplo**

```js
{
  path: '/permission',
  component: Layout,
  redirect: '/permission/index',
  hidden: true,
  alwaysShow: true,
  meta: { roles: ['admin','editor'] }, // puedes establecer roles en la navegación raíz
  children: [{
    path: 'index',
    component: _import('permission/index'),
    name: 'permission',
    meta: {
      title: 'permission',
      icon: 'lock',
      roles: ['admin','editor'], // o puedes establecer roles solamente en la subnavegación
      noCache: true
    }
  }]
}
```

## Enrutador

Hay dos tipos de rutas aquí, `constantRoutes` y `asyncRoutes`.

**constantRoutes:** representa rutas que no requieren acceso dinámico, como la página de inicio de sesión, 404, página general, etc.

**asyncRoutes:** representa las páginas que requieren permisos de juicio dinámico y se agregan dinámicamente a través de `addRouters`. Los detalles se introducirán en [Permisos](permission.md).

::: tip
Todas las páginas de enrutamiento aquí usan la `carga diferida del enrutador`, como se describe en el [documento](/guide/advanced/lazy-loading.md).

Si deseas saber más sobre browserHistory y hashHistory, consulta [Compilar y Desplegar](deploy.md).
:::

Las otras configuraciones no son diferentes a las de [vue-router](https://router.vuejs.org/en/) oficial, así que consulta la documentación tú mismo.

::: warning ADVERTENCIA
Hay algo en lo que debes tener cuidado, la página 404 debe ser la última en cargarse, si se declara en constantRoutes. Las páginas declaradas posteriormente se bloquearán en 404, consulta los detalles del problema: [cuando addRoutes tiene una ruta comodín para 404 no funciona](https://github.com/vuejs/vue-router/issues/1176)
:::

## Barra lateral

La barra lateral del proyecto se basa principalmente en `el-menu` de element-ui.

Se introdujo en el front, la barra lateral se genera dinámicamente al leer la ruta y se combina con el juez de permisos, pero también debe soportar la anidación infinita de rutas, por lo que aquí también se usa para los componentes recursivos.

> Código: [@/layout/components/Sidebar](https://github.com/adempiere/adempiere-vue/tree/master/src/layout/components/Sidebar)

Es posible modificar el estilo predeterminado de la barra lateral de `element-ui`. Todo el CSS lo puedes encontrar en [@/styles/sidebar.scss](https://github.com/adempiere/adempiere-vue/blob/master/src/styles/sidebar.scss) y modificarlo para satisfacer tus necesidades.

**Aquí hay que prestar atención**. La barra lateral general tiene dos formas, `submenu` y `el-menu-item`. Uno es un submenú anidado, el otro es un enlace directo. Como se muestra abajo:

![](https://adempiere-vue.gitee.io/gitee-cdn/adempiere-vue-site/e94739d6-d701-45c8-8c6e-0f4bb10c3b46.png)

La barra lateral ya te ha ayudado a hacer un juicio. Cuando agregas más de un hijo a un elemento, automáticamente se convierte en modo anidado. Si la ruta hijo es exactamente igual a 1, esta se muestra como ruta raíz en la barra lateral de forma predeterminada. Si no quieres que esto suceda, puedes desactivar esta función configurando `alwaysShow: true` en la ruta raíz. Como:

```js
// sin submenu, porque children.length === 1
{
  path: '/icon',
  component: Layout,
  children: [{
    path: 'index',
    component: ()=>import('svg-icons/index'),
    name: 'icons',
    meta: { title: 'icons', icon: 'icon'}
  }]
},

// con submenu, porque children.length >= 1
{
  path: '/components',
  component: Layout,
  name: 'component-demo',
  meta: {
    title: 'components',
    icon: 'component'
  },
  children: [
    { path: 'tinymce', component: ()=>import('components-demo/tinymce'), name: 'tinymce-demo', meta: { title: 'tinymce' }},
    { path: 'markdown', component: ()=>import('components-demo/markdown'), name: 'markdown-demo', meta: { title: 'markdown' }},
  ]
}
```

::: tip unique-opened
Puedes configurar `unique-opened` en [Sidebar/index.vue](https://github.com/adempiere/adempiere-vue/blob/master/src/layout/components/Sidebar/index.vue). Para controlar la barra lateral, si deseas mantener solo un submenú expandido.
:::

## Rutas anidadas

Si tienes una ruta anidada, como [@/views/nested](https://github.com/adempiere/adempiere-vue/tree/master/src/views/nested),
**No olvides agregar manualmente `<router-view>` al archivo raíz del directorio secundario**.

```html
 <!-- parent view  -->
<template>
  <div>
    <!-- xxx html dom  -->
    <router-view />
  </div>
</template>
```

Tal como: [@/views/nested/menu1/index.vue](https://github.com/adempiere/adempiere-vue/blob/master/src/views/nested/menu1/index.vue).

**NOTA:** Tantos `<router-view>` como nivel de rutas anidadas.

![](https://adempiere-vue.gitee.io/gitee-cdn/adempiere-vue-site/9459de62-64d0-4819-9730-daf3f9889018.png)

<br/>

## Clic en la barra lateral para actualizar la ruta actual

Antes de utilizar el modelo de desarrollo spa (aplicación de página única), cada vez que el usuario hace clic en la barra lateral solicitará nuevamente esta página, el usuario gradualmente desarrolló el hábito de hacer clic en la ruta actual en la barra lateral para actualizar la vista. Pero ahora en el spa no es lo mismo, el usuario hace clic en la ruta resaltada actualmente y no actualiza la vista, porque el vue-router interceptará tu ruta, determina que la url no cambia, por lo que no activará ningún hook o cambios en la vista. [Problema relacionado](https://github.com/vuejs/vue-router/issues/296), la comunidad también ha discutido sobre el tema.

![](https://adempiere-vue.gitee.io/gitee-cdn/adempiere-vue-site/5d0b0391-ea6a-45f2-943e-aff5dbe74d12.png)

`yyx990803` también dijo que quería agregar una forma de actualizar la vista, y luego cambió de opinión nuevamente /(ㄒ o ㄒ)/~~ Pero la cuestión es la siguiente, ¿qué debemos hacer? Dijo que no activaría nada sin cambiar la URL actual, así que ¿puedo forzar al activador? El truco es simple. Al cambiar la consulta de la URL para activar los cambios de vista: escuchamos el evento clic de cada enlace en la barra lateral, cada clic realizará una consulta diferente en el enrutador para garantizar que la vista se actualice.

```js
clickLink(path) {
  this.$router.push({
    path,
    query: {
      //Asegúrate de que, en cada clic, query no sea el mismo
      //para garantizar que se actualice la vista
      t: +new Date()
    }
  })
}
```

ps: No olvides agregar una `key` única a `router-view`, como `<router-view :key="$route.path"></router-view>`.

También hay un inconveniente con el feo sufijo `query` al final de la URL, como `xxx.com/article/list?t=1496832345025`

Puedes saber del problema anterior que hay muchas otras opciones. En el proyecto de mi empresa, la solución adoptada es determinar si la ruta del menú en la que se hace clic actualmente es coherente con la ruta actual. Sin embargo, cuando sea coherente, saltará a una página de redireccionamiento dedicada, que a su vez Redirigirá la ruta para Ir a la página, esto tendrá un efecto de actualización.

**Ejemplo**

![](https://adempiere-vue.gitee.io/gitee-cdn/adempiere-vue-site/0dd7f78b-0fb5-4c7d-8236-cee78f960984.jpg)

Haz clic en el botón de cambio de tamaño global que se muestra en la imagen y verás que la página `app-main` se ha actualizado. Se utiliza el método de redireccionamiento a la página `Redirect` y luego redirecciona de nuevo a la página original.

Redireccionar la página a `/redirect` al hacer clic

```js
const { fullPath } = this.$route
this.$router.replace({
  path: '/redirect' + fullPath
})
```

La página `redirect` se redirige de nuevo a la página original

```js
// redirect.vue
// https://github.com/adempiere/adempiere-vue/blob/master/src/views/redirect/index.vue
export default {
  beforeCreate() {
    const { params, query } = this.$route
    const { path } = params
    this.$router.replace({ path: '/' + path, query })
  },
  render: function(h) {
    return h() // evitar mensaje de advertencia
  }
}
```

<br>

## Breadcrumb

Este proyecto también incluye una navegación con breadcrumb, que también se genera dinámicamente por el cambio de ruta al observar $route. Es lo mismo con el menú, también puedes configurarlo en el enrutamiento y agregar algunos atributos personalizados a las necesidades de tu negocio en route.meta attr. Por ejemplo, puedes declarar `breadcrumb:false` en la ruta para que no se muestre en la sección breadcrumb.

![](https://adempiere-vue.gitee.io/gitee-cdn/adempiere-vue-site/4c60b3fc-febd-4e22-9150-724dcbd25a8e.gif)

> Código correspondiente: [@/components/Breadcrumb](https://github.com/adempiere/adempiere-vue/blob/master/src/components/Breadcrumb/index.vue)

## Problema de desplazamiento de la barra lateral

Las versiones anteriores de scroll se manejaban con css

```css
overflow-y: scroll;

::-webkit-scrollbar {
  display: none;
}
```

Pero usar algún hack de CSS tiene algunos problemas, en Firefox u otras versiones inferiores del navegador serán menos hermosas.
En segundo lugar, en el caso de colapsos de la barra lateral, limitados al `menu` de `element-ui`, no se pueden manejar de esta manera.

Entonces, la versión actual usa `el-scrollbar` para encargarse del problema de desplazamiento de la barra lateral.

::: tip Código
[@/layout/components/Sidebar](https://github.com/adempiere/adempiere-vue/blob/master/src/layout/components/Sidebar/index.vue)
:::

## Enlace externo en la barra lateral <Badge text="v3.8.2+"/>

También puedes configurar un enlace externo en la barra lateral. Siempre y cuando coloques una dirección URL correcta en `path`, podrás abrir esta página cuando hagas clic en la barra lateral.

P.ej.

```json
{
  "path": "external-link",
  "component": Layout,
  "children": [
    {
      "path": "https://github.com/adempiere/adempiere-vue",
      "meta": { "title": "externalLink", "icon": "link" }
    }
  ]
}
```

## Sidebar expands by default

In some scenarios, users need to expand some of the `sub-menu` in the sidebar by default, as shown below:

<img :src="$withBase('/images/default-openeds.jpg')" alt="default-openeds.jpg" width="250px">

Can be set through `default-openeds`, first find [Sidebar Code](https://github.com/adempiere/adempiere-vue/blob/master/src/layout/components/Sidebar/index.vue)

```html
 <el-menu
        :default-openeds="['/example','/nested']" // Add this line of code
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
```

**Note: default-openeds = "['example', 'nested']" is filled with route-path of submenu**
