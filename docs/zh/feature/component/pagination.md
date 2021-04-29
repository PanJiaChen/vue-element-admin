# Pagination 分页 <Badge text="v3.9.2+"/>

Pagination 组件主要是基于 Element 的 `el-pagination`进行了二次封装，并拓展了自动滚动的功能。

## 使用方式

```html
<template>
  <pagination
    :total="total"
    :page.sync="listQuery.page"
    :limit.sync="listQuery.limit"
    @pagination="getList" />
</template>

<script>
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  data() {
    return {
      total: 0,
      listQuery: {
        page: 1,
        limit: 20
      }
    }
  },
  methods: {
    getList() {
      // 获取数据
    }
  }
}
</script>
```

## Attributes

|    参数     | 说明                                |   类型    |     默认值      |
| :---------: | :---------------------------------- | :-------: | :-------------: |
|    total    | 总条目数                            |  Number   |        /        |
|    page     | 当前页数   支持 .sync 修饰符        |  Number   |        1        |
|    limit    | 每页显示条目个数，支持 .sync 修饰符 |  Number   |       20        |
| page-sizes  | 每页显示个数选择器的选项设置        | Number [] | 10, 20, 30, 50] |  |
|   hidden    | 是否隐藏                            |  Boolean  |      false      |
| auto-scroll | 分页之后是否自动滚动到顶部          |  Boolean  |      true       |

其它 Element 的 `el-pagination`支持的属性，它也都支持。详情见[文档](http://element.eleme.io/#/zh-CN/component/pagination)

## Events

| 事件名称   | 说明                                | 回调参数     |
| ---------- | ----------------------------------- | ------------ |
| pagination | 当 limit 或者 page 发生改变时会触发 | {page,limit} |

## 源码 && Demo

- [在线源码](https://github.com/adempiere/adempiere-vue/blob/master/src/components/Pagination/index.vue)

- [在线 Demo](https://adempiere.github.io/adempiere-vue/#/table/complex-table)
