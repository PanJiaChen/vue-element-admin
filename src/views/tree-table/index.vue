<template>
  <div class="app-container">

    <div style="margin-bottom:20px;">

      <el-button type="primary" class="option-item">
        <a href="https://github.com/PanJiaChen/vue-element-admin/tree/master/src/components/TreeTable" target="_blank">Documentation</a>
      </el-button>

      <div class="option-item">
        <el-tag>Expand All</el-tag>
        <el-switch
          v-model="defaultExpandAll"
          active-color="#13ce66"
          inactive-color="#ff4949"
          @change="reset"/>
      </div>

      <div class="option-item">
        <el-tag>Show Checkbox</el-tag>
        <el-switch
          v-model="showCheckbox"
          active-color="#13ce66"
          inactive-color="#ff4949"
        />
      </div>

    </div>

    <tree-table :key="key" :default-expand-all="defaultExpandAll" :data="data" :columns="columns" border>
      <template slot="scope" slot-scope="{scope}">
        <el-tag>level: {{ scope.row._level }}</el-tag>
        <el-tag>expand: {{ scope.row._expand }}</el-tag>
        <el-tag>select: {{ scope.row._select }}</el-tag>
      </template>
      <template slot="operation" slot-scope="{scope}">
        <el-button type="primary" size="" @click="click(scope)">Click</el-button>
      </template>
    </tree-table>

  </div>
</template>

<script>

import treeTable from '@/components/TreeTable'

export default {
  name: 'TreeTableDemo',
  components: { treeTable },
  data() {
    return {
      defaultExpandAll: false,
      showCheckbox: true,
      key: 1,
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
          label: 'Scope',
          key: 'scope'
        },
        {
          label: 'Operation',
          key: 'operation'
        }
      ],
      data: [
        {
          id: 0,
          event: 'Event-0',
          timeLine: 50
        },
        {
          id: 1,
          event: 'Event-1',
          timeLine: 100,
          children: [
            {
              id: 2,
              event: 'Event-2',
              timeLine: 10

            },
            {
              id: 3,
              event: 'Event-3',
              timeLine: 90,
              children: [
                {
                  id: 4,
                  event: 'Event-4',
                  timeLine: 5

                },
                {
                  id: 5,
                  event: 'Event-5',
                  timeLine: 10

                },
                {
                  id: 6,
                  event: 'Event-6',
                  timeLine: 75,

                  children: [
                    {
                      id: 7,
                      event: 'Event-7',
                      timeLine: 50,

                      children: [
                        {
                          id: 71,
                          event: 'Event-7-1',
                          timeLine: 25

                        },
                        {
                          id: 72,
                          event: 'Event-7-2',
                          timeLine: 5

                        },
                        {
                          id: 73,
                          event: 'Event-7-3',
                          timeLine: 20
                        }
                      ]
                    },
                    {
                      id: 8,
                      event: 'Event-8',
                      timeLine: 25
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  },
  watch: {
    showCheckbox(val) {
      if (val) {
        this.columns.unshift({
          label: 'Checkbox',
          checkbox: true
        })
      } else {
        this.columns.shift()
      }
      this.reset()
    }
  },
  methods: {
    reset() {
      ++this.key
    },
    click(scope) {
      console.log(scope)
    }
  }
}
</script>

<style scoped>
.option-item{
  display: inline-block;
  margin-right: 15px;
}
</style>
