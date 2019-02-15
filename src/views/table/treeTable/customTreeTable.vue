<template>
  <div class="app-container">

    <el-tag style="margin-bottom:20px;">
      <a href="https://github.com/PanJiaChen/vue-element-admin/tree/master/src/components/TreeTable" target="_blank">Documentation</a>
    </el-tag>

    <tree-table :data="data" :columns="columns" :default-expand-all="true" border style="width: 100%" default-children="son" >
      <template slot="__selection" >
        <el-table-column
          type="selection"
          width="55"/>
      </template>

      <template slot="__expand">
        <el-table-column
          type="expand"
          width="55">
          <template slot-scope="props">
            <el-button size="mini" type="danger" @click="handleExpandClick(props)">点我</el-button>
          </template>
        </el-table-column>
      </template>
      <template slot="__opt" slot-scope="{scope}">
        <el-button size="mini" type="primary" @click="handleClick(scope)">点我</el-button>
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
          label: '操作',
          key: '__opt'
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
      isIndeterminate: false,
      children: 'son'
    }
  },
  methods: {
    handleClick(scope) {
      this.$message.success(scope.row.event)
    }
  }
}
</script>
