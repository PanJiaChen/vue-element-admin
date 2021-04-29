# Pagination <Badge text="v3.9.2+"/>

Pagination component is mainly based on Element 'el-pagination' for the secondary packaging, and expanded the function of auto-scroll.

## Basic Usage

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
      // Fetch data
    }
  }
}
</script>
```

## Attributes

|  Attribute  | Description                                                 |   Type    |     Default     |
| :---------: | :---------------------------------------------------------- | :-------: | :-------------: |
|    total    | total item count                                            |  Number   |        /        |
|    page     | current page number, supports the .sync modifier            |  Number   |        1        |
|    limit    | item count of each page, supports the .sync modifier        |  Number   |       20        |
| page-sizes  | options of item count per page                              | Number [] | 10, 20, 30, 50] |
|   hidden    | whether to hide                                             |  Boolean  |      false      |
| auto-scroll | whether to automatically scroll to the top after pagination |  Boolean  |      true       |

Other attributes of the element's `el-pagination` support are also supported. See [Documentation](http://element.eleme.io/#/zh-CN/component/pagination) for details.

## Events

| Event Name | Description                              | Parameters   |
| ---------- | ---------------------------------------- | ------------ |
| pagination | Triggered when the limit or page changes | {page,limit} |

## Source Code && Demo

- [Source Code](https://github.com/adempiere/adempiere-vue/blob/master/src/components/Pagination/index.vue)

- [Online Demo](https://adempiere.github.io/adempiere-vue/#/table/complex-table)
