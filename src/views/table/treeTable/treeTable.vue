<template>
  <div class="app-container">

    <el-tag style="margin-bottom:20px;">
      <a href="https://github.com/PanJiaChen/vue-element-admin/tree/master/src/components/TreeTable" target="_blank">Documentation</a>
    </el-tag>

    <tree-table :data="data" :columns="columns" border/>

  </div>
</template>

<script>

import treeTable from '@/components/TreeTable'

export default {
  name: 'TreeTableDemo',
  components: { treeTable },
  data() {
    return {
      columns: [
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
          label: '时间线',
          key: 'timeLine'
        },
        {
          label: '备注',
          key: 'comment'
        }
      ],
      data: [
        {
          id: 0,
          event: 'Event-0',
          timeLine: 50,
          comment: '无'
        },
        {
          id: 1,
          event: 'Event-1',
          timeLine: 100,
          comment: '无',
          children: [
            {
              id: 2,
              event: 'Event-2',
              timeLine: 10,
              comment: '无'
            },
            {
              id: 3,
              event: 'Event-3',
              timeLine: 90,
              comment: '无',
              children: [
                {
                  id: 4,
                  event: 'Event-4',
                  timeLine: 5,
                  comment: '无'
                },
                {
                  id: 5,
                  event: 'Event-5',
                  timeLine: 10,
                  comment: '无'
                },
                {
                  id: 6,
                  event: 'Event-6',
                  timeLine: 75,
                  comment: '无',
                  children: [
                    {
                      id: 7,
                      event: 'Event-7',
                      timeLine: 50,
                      comment: '无',
                      children: [
                        {
                          id: 71,
                          event: 'Event-7-1',
                          timeLine: 25,
                          comment: 'xx'
                        },
                        {
                          id: 72,
                          event: 'Event-7-2',
                          timeLine: 5,
                          comment: 'xx'
                        },
                        {
                          id: 73,
                          event: 'Event-7-3',
                          timeLine: 20,
                          comment: 'xx'
                        }
                      ]
                    },
                    {
                      id: 8,
                      event: 'Event-8',
                      timeLine: 25,
                      comment: '无'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  }
}
</script>
