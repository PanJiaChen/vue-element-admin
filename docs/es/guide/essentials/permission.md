# Permisos

Se ha introducido en detalle en este artículo--[手摸手，带你用 vue 撸后台 系列二(登录权限篇)](https://juejin.im/post/591aa14f570c35006961acac).

La implementación de permisos de este proyecto es: comparar la tabla de enrutamiento obteniendo con el permiso del usuario actual, generar la tabla de enrutamiento accesible por el usuario, y montarla dinámicamente en `router` a través de `router.addRoutes`.

Pero, en realidad, la lógica empresarial de muchas organizaciones puede no ser el caso. Por ejemplo, el requisito de muchas empresas es que los permisos de cada página se configuren dinámicamente, a diferencia de la configuración predeterminada en este proyecto. Pero, de hecho, el principio es el mismo. Por ejemplo, puedes configurar dinámicamente los permisos para cada página a través de un control de árbol u otra representación, y luego almacenar esta tabla de enrutamiento en el back-end. Cuando el usuario inicia sesión para obtener 'roles', el front-end solicita la tabla de enrutamiento accesible al back-end de acuerdo con 'roles', de modo que las páginas accesibles se generan dinámicamente. Después de eso, router.addRoutes se monta dinámicamente en el enrutador. Encontrarás lo mismo, nunca cambian su caso.

Solo un paso más para mapear la tabla de enrutamiento de retorno del back-end con los componentes locales. [issue](https://github.com/adempiere/adempiere-vue/issues/293)

```js
const map={
 login:require('login/index').default // síncrono
 login:()=>import('login/index')      // asíncrono
}
// El mapa en el que tienes un servidor es similar a
const serviceMap=[
 { path: '/login', component: 'login', hidden: true }
]
// Después de recorrer este mapa, genera dinámicamente asyncRoutes
// y reemplaza el componente con map[component]
```

Ps: No descartes que este proyecto aumente el panel de control para admitir permisos de configuración dinámica real.

## Modificación lógica

El código de control del nivel de enrutamiento ahora está en `@/permission.js`. Si deseas cambiar la lógica, puedes utilizar el hook `next()` directamente en la lógica de juicio apropiada.

## Directiva de permiso

Escribe una directiva de permisos, y podrás implementar fácil y rápidamente el juicio de permisos a nivel de botón. [v-permission](https://github.com/adempiere/adempiere-vue/tree/master/src/directive/permission)

**Uso**

```html
<template>
  <!-- Admin puede ver esto -->
  <el-tag v-permission="['admin']">admin</el-tag>

  <!-- Editor puede ver esto -->
  <el-tag v-permission="['editor']">editor</el-tag>

  <!-- Editor puede ver esto -->
  <el-tag v-permission="['admin','editor']">Tanto admin como editor pueden ver esto</el-tag>
</template>

<script>
// Por supuesto, también puedes registrarlo por conveniencia.
import permission from '@/directive/permission/index.js'
export default{
  directives: { permission }
}
</script>
```

**Limitaciones**

En algunos casos, no es adecuado usar v-permission, como en el componente de element 'Tab', que solo se puede lograr configurando manualmente v-if.

Puedes usar la función de juicio de permiso global. El uso es similar a la instrucción `v-permission`.

```html
<template>
  <el-tab-pane v-if="checkPermission(['admin'])" label="Admin">Admin puede ver esto</el-tab-pane>
  <el-tab-pane v-if="checkPermission(['editor'])" label="Editor">Editor puede ver esto</el-tab-pane>
  <el-tab-pane v-if="checkPermission(['admin','editor'])" label="Admin-OR-Editor">Tanto admin como editor pueden ver esto</el-tab-pane>
</template>

<script>
import checkPermission from '@/utils/permission'

export default{
   methods: {
    checkPermission
   }
}
</script>
```
