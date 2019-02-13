## 写在前面

此组件仅提供一个创建 TreeTable 的解决思路

## prop 说明

- data(**必填**)

原始数据,要求是一个数组或者对象

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

列属性,要求是一个数组

1. label: 显示在表头的文字
2. key: 对应 data 的 key。treeTable 将显示相应的 value
3. width: 每列的宽度，为一个数字(可选)

树表组件将会根据 columns 的 key 属性生成具名插槽，如果你需要对列数据进行自定义，通过插槽即可实现

```javascript
const columns = [
  // 建议第一列做展开收缩操作
  { label: '', key: '__spread', width: '200' },
  {
    value: string,
    text: string,
    width: number
  },
  {
    value: string,
    text: string,
    width: number
  }
]
```

#### evalFunc

解析函数，function，非必须

如果不提供，将使用默认的[evalFunc](./eval.js)

如果提供了 evalFunc,那么会用提供的 evalFunc 去解析 data，并返回 treeTable 渲染所需要的值。

#### evalArgs

解析函数的参数，是一个对象，

-  parent = null

树的顶层节点默认为 null

- leavel = 0

默认第一层级为0，然后依次递增

- expand = false

如果需要展开所有的数据，那么就传入`{expand:true}`

- children = 'children' 

如果后台返回的数据不都是带有children字段，那么修改一下即可



## 其他

如果有其他的需求，请参考[el-table](http://element-cn.eleme.io/#/en-US/component/table)的 api 自行修改 index.vue
