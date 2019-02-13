<template>
  <div class="app-container">

    <el-tag style="margin-bottom:20px;">
      <a href="https://github.com/PanJiaChen/vue-element-admin/tree/master/src/components/TreeTable" target="_blank">Documentation</a>
    </el-tag>

    <tree-table :data="data" :columns="columns" :eval-args="args" border>
      <template slot="__checkbox" slot-scope="{scope}">
        <!--  默认leaval 为 0 的时候，提供全选操作 -->
        <el-checkbox v-if="scope.row[children]&&scope.row[children].length>0" :style="{'padding-left':+scope.row.__leavel*50 + 'px'} " :indeterminate="scope.row.__select" v-model="scope.row.__select" @change="handleCheckAllChange(scope.row)">全</el-checkbox>
        <el-checkbox v-else :style="{'padding-left':+scope.row.__leavel*50 + 'px'} " v-model="scope.row.__select" @change="handleCheckAllChange(scope.row)">选</el-checkbox>
      </template>
    </tree-table>
  </div>
</template>

<script>

import treeTable from '@/components/TreeTable'

export default {
  name: 'CustomTreeTableDemo',
  components: { treeTable },
  data() {
    return {
      columns: [
        {
          label: '操作',
          key: '__checkbox',
          width: 400
        },
        {
          label: '',
          key: '__sperad',
          width: 400
        },
        {
          label: 'ID',
          key: 'id'
        },
        {
          label: '事件',
          key: 'event',
          width: 200
        },
        {
          label: '时间线',
          key: 'timeLine'
        },
        {
          label: '备注',
          key: 'comment'
        }
      ],
      data:
        {
          id: 1,
          event: '事件1',
          timeLine: 100,
          comment: '无',
          son: [
            {
              id: 1.1,
              event: '事件2',
              timeLine: 10,
              comment: '无'
            },
            {
              id: 1.2,
              event: '事件3',
              timeLine: 90,
              comment: '无',
              son: [
                {
                  id: '1.2.1',
                  event: '事件4',
                  timeLine: 5,
                  comment: '无'
                },
                {
                  id: '1.2.2',
                  event: '事件5',
                  timeLine: 10,
                  comment: '无'
                },
                {
                  id: '1.2.3',
                  event: '事件6',
                  timeLine: 75,
                  comment: '无',
                  son: [
                    {
                      id: '1.2.3.1',
                      event: '事件7',
                      timeLine: 50,
                      comment: '无',
                      son: [
                        {
                          id: '1.2.3.1.1',
                          event: '事件71',
                          timeLine: 25,
                          comment: 'xx'
                        },
                        {
                          id: '1.2.3.1.2',
                          event: '事件72',
                          timeLine: 5,
                          comment: 'xx'
                        },
                        {
                          id: '1.2.3.1.3',
                          event: '事件73',
                          timeLine: 20,
                          comment: 'xx'
                        }
                      ]
                    },
                    {
                      id: '1.2.3.2',
                      event: '事件8',
                      timeLine: 25,
                      comment: '无'
                    }
                  ]
                }
              ]
            }
          ]
        },
      args: { children: 'son' },
      isIndeterminate: false
    }
  },
  computed: {
    children() {
      return this.args && this.args.children || 'children'
    }
  },
  methods: {
    handleCheckAllChange(row) {
      this.selcetRecursion(row, row.__select, this.children)
      this.isIndeterminate = row.__select
    },
    selcetRecursion(row, select, children = 'children') {
      if (select) {
        this.$set(row, '__expand', true)
        this.$set(row, '__show', true)
      }
      const sub_item = row[children]
      if (sub_item && sub_item.length > 0) {
        sub_item.map(child => {
          child.__select = select
          this.selcetRecursion(child, select, children)
        })
      }
    }
  }
}
</script>
