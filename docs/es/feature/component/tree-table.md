# Tabla de Árbol

## Resumen

Este componente solo proporciona una solución para crear `TreeTable`. Se basa en el componente de tabla `element-ui`. Utiliza el método `row-style` de `el-table` para determinar si el elemento debe ocultarse o mostrarse.

Y este componente hace uso completo de las características (slot) de `vue` para que sea fácil de usar.

En `evel.js`, el método `addAttrs` agrega varias propiedades a los datos, y `treeTotable` aplana la matriz. Ninguna de estas operaciones destruirá los datos de origen, solo agregará propiedades.

## Propiedades

|     Atributo     | Descripción                                                      |  Tipo   | Predeterminado |
| :--------------: | :--------------------------------------------------------------- | :-----: | :------------: |
|       data       | datos de visualización originales                                |  Array  |       []       |
|     columns      | atributo de columna                                              |  Array  |       []       |
| defaultExpandAll | si expandir todos los nodos por defecto                          | Boolean |     false      |
| defaultChildren  | Especifique qué objeto de nodo se utiliza como subárbol del nodo | String  |    children    |
|      indent      | Indentación horizontal de nodos en niveles adyacentes en píxeles | Number  |       50       |

> Se admite cualquiera de las propiedades de `el-table`, como `border`, `fit`, `size` o `@select`, `@cell-click`. Consulta la documentación de ʻel-table` para más detalles.

---

### Ejemplo

```html
  <tree-table :data="data" :columns="columns" border>
```

#### data(**Requerido**)

```js
  const data = [
    {
      name:'1'
      children: [
        {
          name: '1-1'
        },
        {
          name: '1-2'
        }
      ]
    },
    {
      name: `2`
    }
  ]
```

#### columns(**Requerido**)

- label: texto que se muestra en el encabezado
- key: data.key se mostrará en la columna
- expand: `true` o `false`
- checkbox: `true` o `false`
- width: ancho de columna, por ejemplo `200`
- align: alineación `left/center/right`
- header-align: alineación del encabezado de la tabla `left/center/right`

```javascript
const columns = [
  {
    label: 'Checkbox',
    checkbox: true
  },
  {
    label: '',
    key: 'id',
    expand: true
  },
  {
    label: 'Event',
    key: 'event',
    width: 200,
    align: 'left'
  },
  {
    label: 'Scope',
    key: 'scope'
  }
]
```

> El componente de la tabla de árbol generará un slot con nombre basado en la propiedad key de las columnas. Si necesitas personalizar los datos de la columna, puedes hacerlo a través del slot.

```html
  <template slot="your key" slot-scope="{scope}">
    <el-tag>nivel: {{ scope.row._level }}</el-tag>
    <el-tag>expandir: {{ scope.row._expand }}</el-tag>
    <el-tag>seleccionar: {{ scope.row._select }}</el-tag>
  </template>
```

## Eventos

Actualmente hay varios métodos disponibles, pero solo la versión `beta`, que probablemente se modifique más adelante.

```js
this.$refs.TreeTable.addChild(row, data) //Agregar elementos secundarios
this.$refs.TreeTable.addBrother(row, data) //Agregar un elemento hermano
this.$refs.TreeTable.delete(row) //Eliminar el elemento
```

## Otro

Si tienes otros requisitos, consulta la api [el-table](http://element-cn.eleme.io/#/en-US/component/table) para modificar el index.vue
