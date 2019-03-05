<template>
  <div>
    <div class="app-container">
      <el-tag style="margin-bottom:20px;">
        <a
          href="https://github.com/PanJiaChen/vue-element-admin/tree/master/src/components/TreeTable"
          target="_blank"
        >Documentation</a>
      </el-tag>

      <tree-table
        ref="TreeTable"
        :data="tableData"
        :default-expand-all="true"
        :columns="columns"
        border
        default-children="children"
        @selection-change	="selectChange"
      >

        <template slot="selection">
          <el-table-column type="selection" align="center" width="55"/>
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

        <!-- <template slot="name" slot-scope="{scope}">
          <span :style="{'padding-left':+scope.row.__level*50 + 'px'} ">
            <a
              v-if="scope.row.type === 'view'"
              :href="scope.row.url"
              class="link-type"
            >{{ scope.row.name }}</a>
            <span v-else>{{ scope.row.name }}</span>
          </span>
        </template> -->
        <template slot="append" slot-scope="{scope}">
          <el-button
            size="mini"
            type="primary"
            @click="addMenuItem(scope.row,'brother',scope)"
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
          <el-input v-model.trim="tempItem.name" placeholder="Name"/>
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
import { data } from './data.js'

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
          label: 'type',
          key: 'type'
        },
        {
          label: 'appid',
          key: 'appid'
        },
        {
          label: 'key',
          key: 'key'
        },
        {
          label: 'Append',
          key: 'append'
        },
        {
          label: 'Operation',
          key: 'operation',
          width: '160px'
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
    updateItem() {
      const data = this.$refs.TreeTable.getData()
      const { _id } = this.tempItem

      let index
      for (let i = 0; i < data.length; i++) {
        if (data[i]._id === _id) {
          index = i
          break
        }
      }

      data.splice(index, 1, Object.assign({}, this.tempItem))
      this.dialogFormVisible = false
    },
    addMenuItem(row, type, a) {
      if (type === 'children') {
        this.$refs.TreeTable.addChild(row, { name: 'child' })
      }

      if (type === 'brother') {
        this.$refs.TreeTable.addBrother(row, { name: 'brother' })
      }
    },
    deleteItem(row) {
      this.$refs.TreeTable.delete(row)
    },
    selectChange(val) {
      console.log(val)
    }
  }
}
</script>
