<template>
  <div>
    <div class="app-container">

      <el-button type="primary" size="small" style="margin:0 0 20px 0;">
        <a href="https://github.com/PanJiaChen/vue-element-admin/tree/master/src/components/TreeTable" target="_blank">Documentation</a>
      </el-button>

      <tree-table
        ref="TreeTable"
        :data="tableData"
        :default-expand-all="true"
        :columns="columns"
        border
        default-children="children"
        @selection-change="selectChange"
      >

        <template slot="selection">
          <el-table-column type="selection" align="center" width="55" />
        </template>

        <template slot="pre-column">
          <el-table-column type="expand" width="55">
            <template>
              <el-tag type="info">
                Here is just a placeholder slot, you can display anything.
              </el-tag>
            </template>
          </el-table-column>
        </template>

        <template slot="timeline" slot-scope="{scope}">

          <el-tooltip :content="scope.row.timeLine+'ms'" effect="dark" placement="left">
            <div class="processContainer">
              <div
                :style="{ width:(scope.row.timeLine||0) * 3+'px',
                          background:scope.row.timeLine>50?'rgba(233,0,0,.5)':'rgba(0,0,233,0.5)',
                          marginLeft:scope.row._level * 50+'px' }"
                class="process"
              >
                <span style="display:inline-block" />
              </div>
            </div>
          </el-tooltip>

        </template>

        <template slot="append" slot-scope="{scope}">
          <el-button
            size="mini"
            type="primary"
            @click="addMenuItem(scope.row,'brother')"
          >Append Brother
          </el-button>
          <el-button
            size="mini"
            type="primary"
            @click="addMenuItem(scope.row,'children')"
          >Append Child
          </el-button>
        </template>
        <template slot="operation" slot-scope="{scope}">
          <el-button size="mini" type="success" @click="editItem(scope.row)">Edit</el-button>
          <el-button size="mini" type="danger" @click="deleteItem(scope.row)">Delete</el-button>
        </template>
      </tree-table>
    </div>

    <el-dialog :visible.sync="dialogFormVisible" title="Edit">
      <el-form :model="tempItem" label-width="100px" style="width:600px">
        <el-form-item label="Name">
          <el-input v-model.trim="tempItem.name" placeholder="Name" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="updateItem">Confirm</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import TreeTable from '@/components/TreeTable'
import data from './data.js'

export default {
  components: { TreeTable },
  data() {
    return {
      tableData: [],
      tempItem: {},
      dialogFormVisible: false,
      columns: [
        {
          label: 'Name',
          key: 'name',
          expand: true
        },
        {
          label: 'Timeline',
          key: 'timeline'
        },
        {
          label: 'Append',
          key: 'append',
          width: 300
        },
        {
          label: 'Operation',
          key: 'operation',
          width: 160
        }
      ]
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.tableData = data
    },
    editItem(row) {
      this.tempItem = Object.assign({}, row)
      this.dialogFormVisible = true
    },
    async updateItem() {
      await this.$refs.TreeTable.updateTreeNode(this.tempItem)
      this.dialogFormVisible = false
    },
    addMenuItem(row, type) {
      if (type === 'children') {
        this.$refs.TreeTable.addChild(row, { name: 'child', timeLine: this.randomNum() })
      }

      if (type === 'brother') {
        this.$refs.TreeTable.addBrother(row, { name: 'brother', timeLine: this.randomNum() })
      }
    },
    deleteItem(row) {
      this.$refs.TreeTable.delete(row)
    },
    selectChange(val) {
      console.log(val)
    },
    randomNum() {
      // return 1~100
      const max = 100
      const min = 1
      return Math.floor(Math.random() * (max - min + 1) + min)
    }
  }
}
</script>
