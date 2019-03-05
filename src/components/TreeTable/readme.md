## 写在前面

此组件仅提供一个创建 TreeTable 的解决思路，本组件充分利用 vue 插槽的特性，方便用户自定义

evel.js 里面 `addAttrs` 方法会给数据添加几个属性，treeTotable 会对数组扁平化。这些操作都不会破坏源数据，只是会新增属性。

调用 addAttrs 后，因\_\_parent 属性，会造成数据循环引用，使用 JSON.stringify()报错，所以转成 JSON 之前需要清除\_\_parent 属性。

## prop 说明

- data（原始数据，要求是一个数组或者对象）
- columns（列属性,要求是一个数组）
- renderContent（数组扁平化方法（可选））
- defaultExpandAll（默认是否全部展开，默认全部展开）
- defaultChildren（子元素名，默认为 children）
- spreadOffset（扩展符号的偏移量，默认为 50px）
- checkboxOffset（复选框的偏移量，默认为 50px）

---

### 代码示例

- data(**必填**)

原始数据,

```js
const data = [
  {
    key1: value1,
    key2: value2,
    children: [
      {
        key1: value1
      },
      {
        key1: value1
      }
    ]
  },
  {
    key1: value1
  }
]
```

或者

```javascript
   {
     key1: value1,
     key2: value2,
     children: [{
       key1: value1
     },
     {
       key1: value1
     }]
   }
```

- columns

1. label: 显示在表头的文字
2. key: 对应 data 的 key。treeTable 将显示相应的 value
3. width: 每列的宽度，为一个数字(可选)

树表组件将会根据 columns 的 key 属性生成具名插槽，如果你需要对列数据进行自定义，通过插槽即可实现

```javascript
const columns = [
  // 建议第一列做展开收缩操作
  { label: '', key: '__spread', width: '200' },
  // 如果添加复选框
  { label: '', key: '__checkbox', width: '200' },
  {
    label: string,
    key: string,
    width: number
  },
  {
    label: string,
    key: string,
    width: number
  }
]
```

#### renderContent

解析函数，function，非必须

如果不提供，将使用默认的[evalFunc](./eval.js)

如果提供了 evalFunc,那么会用提供的 evalFunc 去解析 data，并返回 treeTable 渲染所需要的值。

## 其他

如果有其他的需求，请参考[el-table](http://element-cn.eleme.io/#/en-US/component/table)的 api 自行修改 index.vue
