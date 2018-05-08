<template>
  <div class="app-container">

    <el-tag style="margin-bottom:20px;">
      <a href="https://github.com/PanJiaChen/vue-element-admin/tree/master/src/components/TreeTable" target="_blank">Documentation</a>
    </el-tag>

    <tree-table :data="data" :evalFunc="func" :evalArgs="args" :expandAll="expandAll" border>
      <el-table-column label="事件">
        <template slot-scope="scope">
          <span style="color:sandybrown">{{scope.row.event}}</span>
          <el-tag>{{scope.row.timeLine+'ms'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="时间线">
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="scope.row.timeLine+'ms'" placement="left">
            <div class="processContainer">
              <div class="process" :style="{ width:scope.row._width * 500+'px',
              background:scope.row._width>0.5?'rgba(233,0,0,.5)':'rgba(0,0,233,0.5)',
              marginLeft:scope.row._marginLeft * 500+'px' }">
                <span style="display:inline-block"></span>
              </div>
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="text" @click="message(scope.row)">点击</el-button>
        </template>
      </el-table-column>
    </tree-table>
  </div>
</template>

<script>
/**
  Auth: Lei.j1ang
  Created: 2018/1/19-14:54
*/
import treeTable from '@/components/TreeTable'
import treeToArray from './customEval'

export default {
  name: 'customTreeTableDemo',
  components: { treeTable },
  data() {
    return {
      func: treeToArray,
      expandAll: false,
      data:
        {
          id: 1,
          event: '事件1',
          timeLine: 100,
          comment: '无',
          children: [
            {
              id: 2,
              event: '事件2',
              timeLine: 10,
              comment: '无'
            },
            {
              id: 3,
              event: '事件3',
              timeLine: 90,
              comment: '无',
              children: [
                {
                  id: 4,
                  event: '事件4',
                  timeLine: 5,
                  comment: '无'
                },
                {
                  id: 5,
                  event: '事件5',
                  timeLine: 10,
                  comment: '无'
                },
                {
                  id: 6,
                  event: '事件6',
                  timeLine: 75,
                  comment: '无',
                  children: [
                    {
                      id: 7,
                      event: '事件7',
                      timeLine: 50,
                      comment: '无',
                      children: [
                        {
                          id: 71,
                          event: '事件71',
                          timeLine: 25,
                          comment: 'xx'
                        },
                        {
                          id: 72,
                          event: '事件72',
                          timeLine: 5,
                          comment: 'xx'
                        },
                        {
                          id: 73,
                          event: '事件73',
                          timeLine: 20,
                          comment: 'xx'
                        }
                      ]
                    },
                    {
                      id: 8,
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
      args: [null, null, 'timeLine']
    }
  },
  methods: {
    message(row) {
      this.$message.info(row.event)
    }
  }
}
</script>
