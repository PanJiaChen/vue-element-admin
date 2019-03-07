
- [Enlgish](#Brief)

# 中文

## 写在前面

此组件仅提供一个创建 `TreeTable` 的解决思路。它基于`element-ui`的 table 组件实现，通过`el-table`的`row-style`方法，在里面判断元素是否需要隐藏或者显示，从而实现`TreeTable`的展开与收起。

并且本组件充分利用 `vue` 插槽的特性来方便用户自定义。

`evel.js` 里面，`addAttrs` 方法会给数据添加几个属性，`treeTotable` 会对数组扁平化。这些操作都不会破坏源数据，只是会新增属性。

## Props 说明

|    Attribute     | Description                        |  Type   | Default  |
| :--------------: | :--------------------------------- | :-----: | :------: |
|       data       | 原始展示数据                       |  Array  |    []    |
|     columns      | 列属性                             |  Array  |    []    |
| defaultExpandAll | 默认是否全部展开                   | Boolean |  false   |
| defaultChildren  | 指定子树为节点对象的某个属性值     | String  | children |  |
|      indent      | 相邻级节点间的水平缩进，单位为像素 | Number  |    50    |

> 任何 `el-table` 的属性都支持，例如`border`、`fit`、`size`或者`@select`、`@cell-click`等方法。详情属性见`el-table`文档。

---

### 代码示例

```html
<tree-table :data="data" :columns="columns" border>
```

#### data(**必填**)

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

#### columns(**必填**)

- label: 显示在表头的文字
- key: 对应 data 的 key。treeTable 将显示相应的 value
- expand: `true` or `false`。若为 true，则在该列显示展开收起图标
- checkbox: `true` or `false`。若为 true，则在该列显示`checkbox`
- width: 每列的宽度，为一个数字(可选)。例如`200`
- align: 对齐方式 `left/center/right`
- header-align: 表头对齐方式 `left/center/right`

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

> 树表组件将会根据 columns 的 key 属性生成具名插槽，如果你需要对列数据进行自定义，通过插槽即可实现

```html
<template slot="your key" slot-scope="{scope}">
  <el-tag>level: {{ scope.row._level }}</el-tag>
  <el-tag>expand: {{ scope.row._expand }}</el-tag>
  <el-tag>select: {{ scope.row._select }}</el-tag>
</template>
```

## Events

目前提供了几个方法，不过只是`beta`版本，之后很可能会修改。

```js
this.$refs.TreeTable.addChild(row, data) //添加子元素
this.$refs.TreeTable.addBrother(row, data) //添加兄弟元素
this.$refs.TreeTable.delete(row) //删除该元素
```

## 其他

如果有其他的需求，请参考[el-table](http://element-cn.eleme.io/#/en-US/component/table)的 api 自行修改 index.vue

# English

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
| defaultChildren  | specify which node object is used as the node's subtree      | String  | children |  |
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
