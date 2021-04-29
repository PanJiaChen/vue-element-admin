# Tree-Table

## Brief

This component only provides a solution for creating `TreeTable`. It is based on the `element-ui` table component. It uses the `row-style` method of `el-table` to determine whether the element needs to be hidden or displayed.

And this component makes full use of the features of the `vue` slot to make it user-friendly.

In `evel.js`, the `addAttrs` method adds several properties to the data, and `treeTotable` flattens the array. None of these operations will destroy the source data, just add properties.

## Props

|    Attribute     | Description                                                  |  Type   | Default  |
| :--------------: | :----------------------------------------------------------- | :-----: | :------: |
|       data       | original display data                                        |  Array  |    []    |
|     columns      | column attribute                                             |  Array  |    []    |
| defaultExpandAll | whether to expand all nodes by default                       | Boolean |  false   |
| defaultChildren  | specify which node object is used as the node's subtree      | String  | children |
|      indent      | horizontal indentation of nodes in adjacent levels in pixels | Number  |    50    |

> Any of the `el-table` properties are supported, such as `border`, `fit`, `size` or `@select`, `@cell-click`. See the ʻel-table` documentation for details.

---

### Example

```html
<tree-table :data="data" :columns="columns" border>
```

#### data(**Required**)

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

#### columns(**Required**)

- label: text displayed in the header
- key: data.key will show in column
- expand: `true` or `false`
- checkbox: `true` or `false`
- width: column width 。such as `200`
- align: alignment `left/center/right`
- header-align: alignment of the table header `left/center/right`

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

> The tree table component will generate a named slot based on the key property of columns. If you need to customize the column data, you can do it through the slot.

```html
<template slot="your key" slot-scope="{scope}">
  <el-tag>level: {{ scope.row._level }}</el-tag>
  <el-tag>expand: {{ scope.row._expand }}</el-tag>
  <el-tag>select: {{ scope.row._select }}</el-tag>
</template>
```

## Events

Several methods are currently available, but only the `beta` version, which is likely to be modified later.

```js
this.$refs.TreeTable.addChild(row, data) //Add child elements
this.$refs.TreeTable.addBrother(row, data) //Add a sibling element
this.$refs.TreeTable.delete(row) //Delete the element
```

## Other

If you have other requirements, please refer to the [el-table](http://element-cn.eleme.io/#/en-US/component/table) api to modify the index.vue
