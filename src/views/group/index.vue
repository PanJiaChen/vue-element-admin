<template>
  <div class="app-container">
    <div class="filter-container" style="float: right;">
      <el-button v-if="type" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('group.add') }}</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      :height="tableHeight"
      :row-key="getRowKeys"
      max-height="700px"
      border
      fit
      highlight-current-row
      style="width:100%;overflow:auto;"
      @selection-change="handleSelectionChange">
      <el-table-column :label="$t('id')" align="center" width="60px">
        <template slot-scope="scope">
          <span>{{ (listQuery.page-1) * listQuery.limit + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('group.name')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('createDate')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createDate }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('comment')" min-width="30%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.comment }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="80px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button>
            <el-dropdown class="avatar-container right-menu-item" trigger="click">
              <i style="cursor:pointer" class="el-icon-caret-bottom"/>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <span style="display:block;" @click="handleUpdate(scope.row, false)">查 看</span>
                </el-dropdown-item>
                <el-dropdown-item v-if="type" divided>
                  <span style="display:block;" @click="handleUpdate(scope.row, true)">{{ $t('edit') }}</span>
                </el-dropdown-item>
                <el-dropdown-item v-if="type" divided>
                  <span style="display:block;" @click="handleDeleteGroup(scope.row)">{{ $t('delete') }}</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination :current-page="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" append-to-body width="40%">
      <el-form ref="dataForm" :rules="rules" :model="temp" :disabled="disabled" label-position="right">
        <el-form-item label="组名" label-width="60px">
          <el-input v-model="temp.name" :rows="1" :minlength="4" :maxlength="50" type="text" placeholder="请输入标题(少于50字)" style="width:95%;"/>
        </el-form-item>
        <el-form-item :label="$t('comment')" label-width="60px">
          <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="temp.comment" type="textarea" placeholder="描述..." style="width:95%;"/>
        </el-form-item>
      </el-form>
      <el-button v-if="!disabled" type="success" size="mini" @click="selectUser">添加成员</el-button>
      <el-table
        v-loading="listLoading"
        :data="temp.userList"
        :height="300"
        border
        style="width:100%;overflow:auto;">
        <el-table-column :label="$t('id')" align="center" min-width="10%">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名" min-width="30%" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="角色" min-width="30%" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.roles.includes(1)? "教师" : "学生" }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="!disabled" :label="$t('table.actions')" align="center" min-width="30%" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="handleDeleteUser(scope.row)">{{ $t('delete') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

    <showUser v-if="hackReset" ref="showUser" @listenToChildEvent="getSelectUser"/>
  </div>
</template>

<script>
import { fetchGroupList, fetchPv, fetchMemberList, updateArticle, deleteGroup } from '@/api/group'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
import showUser from '@/views/group/showUser'

const calendarTypeOptions = [
  { key: '1', display_name: '老师' },
  { key: '2', display_name: '学生' },
  { key: '3', display_name: '家长' }
]

// arr to obj ,such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { showUser },
  directives: {
    waves
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  props: {
    type: {
      type: Boolean,
      default: true
    },
    tableHeight: {
      type: String,
      default: window.innerHeight - 240 + 'px'
    }
  },
  data() {
    return {
      disabled: true,
      hackReset: false,
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        fid: this.$store.state.user.fid,
        type: undefined,
        sort: '+id'
      },
      userList: null,
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        groupId: undefined,
        name: undefined,
        userList: [],
        fid: this.$store.state.user.fid,
        comment: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: this.$t('edit'),
        create: this.$t('create')
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false,
      groupList: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleSelectionChange(val) {
      this.groupList = val
    },
    getRowKeys(row) {
      return row.groupId
    },
    getSelectGroup() {
      return this.groupList
    },
    selectUser() {
      this.hackReset = false
      if (this.$refs.showUser) {
        this.$refs.showUser.handleModifyStatus()
      }
      this.$nextTick(() => {
        this.hackReset = true
      })
    },
    getSelectUser: function(data) {
      for (const v of data) {
        var flag = true
        for (const userData of this.temp.userList) {
          if (v.uid === userData.uid) {
            flag = false
            break
          }
        }
        if (flag) {
          this.temp.userList.push(v)
        }
      }
    },
    getList() {
      this.listLoading = true
      fetchGroupList(this.listQuery).then(response => {
        if (response.data.code === 200) {
          this.list = response.data.result.list
          this.total = response.data.result.total
          this.dialogFormVisible = false
          this.listLoading = false
        } else {
          this.$notify({
            title: '失败',
            message: response.data.message,
            type: 'error',
            duration: 5000
          })
        }
      })
    },
    getMemberList() {
      this.listLoading = true
      fetchMemberList(this.listQuery).then(response => {
        if (response.data.code === 200) {
          this.memberList.push(response.data.result)
          this.dialogFormVisible = false
          this.listLoading = false
        } else {
          this.$notify({
            title: '失败',
            message: response.data.message,
            type: 'error',
            duration: 5000
          })
        }
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    resetTemp() {
      this.temp = {
        groupId: undefined,
        name: undefined,
        userList: [],
        fid: this.$store.state.user.fid,
        comment: ''
      }
    },
    handleCreate() {
      this.disabled = false
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
        }
      })
    },
    handleUpdate(row, disabled) {
      this.disabled = !disabled
      fetchMemberList(row.groupId).then(response => {
        if (response.data.code === 200) {
          this.temp.userList = response.data.result
        } else {
          this.$notify({
            title: '失败',
            message: response.data.message,
            type: 'error',
            duration: 5000
          })
        }
      })
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      if (!this.disabled) {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
            updateArticle(tempData).then(response => {
              if (tempData.groupId) {
                for (const v of this.list) {
                  if (v.groupId === this.temp.groupId) {
                    const index = this.list.indexOf(v)
                    this.list.splice(index, 1, this.temp)
                    break
                  }
                }
              } else {
                this.list.unshift(response.data.result)
              }
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      } else {
        this.dialogFormVisible = false
      }
    },
    handleDeleteUser(row) {
      var index = this.temp.userList.indexOf(row)
      this.temp.userList.splice(index, 1)
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
    },
    handleDeleteGroup(row) {
      deleteGroup(row.groupId).then(response => {
        this.getList()
      })
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
  .el-table .cell {
      white-space: nowrap !important;
  }
  /** style (注意不要设为scoped) */
/** configurationTable和afterRenderClass都是为了标记仅这个组件内修改 */
.configurationTable .el-table__body-wrapper {
    overflow: auto;
}
.afterRenderClass {
    .el-table__body-wrapper {
        overflow: auto;
    }
}
</style>
