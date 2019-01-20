<template>
  <el-dialog :visible.sync="dialogFormVisible" title="上传信息">
    <el-tabs tab-position="top" style="height: 500px;margin-top:-30px;">
      <el-tab-pane :label="'已上传('+submittedtotal + '人)'">
        <div class="filter-container">
          <el-input v-model="listQuery.name" placeholder="姓名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-download" @click="downloadZip">批量下载</el-button>
        </div>
        <el-table
          v-loading="listLoading"
          :key="tableKey"
          :data="submittedlist"
          :show-overflow-tooltip="true"
          :height="400"
          border
          style="width:100%; 100px;"
          highlight-current-row>
          <el-table-column :label="$t('table.id')" align="center" width="60px">
            <template slot-scope="scope">
              <span>{{ scope.$index+1 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="姓名" width="150px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.userName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="上传时间" width="180px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="附件" min-width="250px">
            <template slot-scope="scope">
              <span>{{ scope.row.attachmentName }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane :label="'未上传('+uncommittedtotal + '人)'">
        <div class="filter-container">
          <el-input v-model="listQuery.name" placeholder="姓名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
        </div>
        <el-table
          v-loading="listLoading"
          :key="tableKey"
          :data="uncommittedlist"
          :show-overflow-tooltip="true"
          :height="400"
          border
          style="width:100%; 100px;"
          highlight-current-row>
          <el-table-column :label="$t('table.id')" align="center" width="60px">
            <template slot-scope="scope">
              <span>{{ scope.$index+1 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="姓名" width="150px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.userName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="上传时间" width="180px" align="center">
            <template slot-scope="scope">
              <span/>
            </template>
          </el-table-column>
          <el-table-column label="附件" min-width="250px">
            <template slot-scope="scope">
              <span/>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogFormVisible = false">{{ $t('table.confirm') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { fetchPv } from '@/api/article'
import { fetchUploadUserList, updateStudent, createStudent, downloadZip } from '@/api/user'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj ,such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
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
      default: '100%'
    },
    classId: {
      type: Number,
      default: undefined
    }
  },
  data() {
    return {
      tableKey: 0,
      submittedlist: [],
      uncommittedlist: [],
      submittedtotal: 0,
      uncommittedtotal: 0,
      fid: this.$store.state.user.fid,
      listLoading: true,
      articleName: undefined,
      listQuery: {
        id: undefined
      },
      formLabelAlign: {
        name: '',
        tel: '',
        role: ''
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: [{ name: '在读', id: 1 }, { name: '转学', id: 0 }],
      showReviewer: true,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        class: undefined,
        name: undefined,
        user: undefined,
        parentStuList: [],
        selectedOptions2: undefined,
        status: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: this.$t('edit'),
        create: this.$t('create')
      },
      gradeList: undefined,
      props: {
        label: 'name',
        value: 'id',
        children: 'clazzList'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        stuNo: [{ required: true, message: '学号不能为空', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  methods: {
    resetParent() {
      this.formLabelAlign = {
        name: undefined,
        role: undefined,
        tel: undefined,
        fid: this.fid,
        visiblePopover: true
      }
    },
    createParent() {
      this.resetParent()
    },
    updateParent(index) {
      this.$refs['popoverForm'].validate((valid) => {
        if (valid) {
          if (index > -1) {
            this.formLabelAlign.visiblePopover = false
            this.temp.parentStuList.splice(index, 1, this.formLabelAlign)
          } else {
            this.formLabelAlign.visiblePopover = false
            this.temp.parentStuList.push(this.formLabelAlign)
          }
        }
      })
    },
    editParent(item) {
      this.formLabelAlign = JSON.parse(JSON.stringify(item))
      item.visiblePopover = true
      this.$nextTick(() => {
        this.$refs['popoverForm'].clearValidate()
      })
    },
    downloadZip() {
      downloadZip(this.submittedlist[0].noticeId, this.articleName)
    },
    getList() {
      this.listLoading = true
      fetchUploadUserList(this.listQuery).then(response => {
        this.submittedlist = []
        this.uncommittedlist = []
        if (response.data.code === 200) {
          var result = response.data.result
          for (var index in response.data.result) {
            if (result[index].attachmentName) {
              this.submittedlist.push(result[index])
            } else {
              this.uncommittedlist.push(result[index])
            }
          }
        }
        this.submittedtotal = this.submittedlist.length
        this.uncommittedtotal = this.uncommittedlist.length
        this.listLoading = false
      })
    },
    deleteParent(index) {
      this.temp.parentStuList.splice(index, 1)
    },
    handleChange(value) {
      if (this.temp.clazz == null) {
        this.temp.clazz = {}
      }
      if (value != null && value.length > 1) {
        this.temp.clazz.id = value[1]
      } else {
        this.temp.clazz.id = null
      }
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
    handleModifyStatus(row) {
      this.listQuery.id = row.id
      this.articleName = row.title
      this.getList()
      this.dialogFormVisible = true
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        graduationStatus: 1,
        enrollmentDate: new Date(),
        user: undefined,
        name: undefined,
        status: 1,
        parentStuList: [],
        address: undefined
      }
    },
    handleCreate() {
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
          if (this.temp.user == null) {
            this.temp.user = {}
          }
          if (this.temp.clazz == null) {
            this.temp.clazz = {}
          }
          this.temp.enrollmentDate = parseTime(this.temp.enrollmentDate, '{y}-{m}-{d}')
          this.temp.user.name = this.temp.name
          this.temp.user.loginName = this.temp.name
          this.temp.user.sex = this.temp.sex
          this.temp.user.fid = this.fid
          this.temp.user.status = 1
          this.temp.user.address = this.temp.address
          this.temp.user.roles = 2
          createStudent(this.temp).then(response => {
            if (response.data.code === 200) {
              this.list.unshift(response.data.result)
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: '失败',
                message: response.data.message,
                type: 'error',
                duration: 5000
              })
            }
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      var clazz = ''
      var grade = ''
      if (this.temp.clazz != null) {
        clazz = this.temp.clazz.id
        if (this.temp.clazz != null) {
          grade = this.temp.clazz.grade.id
        }
      }
      this.temp.selectedOptions2 = [grade, clazz]
      this.temp.enrollmentDate = new Date(this.temp.enrollmentDate)
      // 避免数组浅拷贝，修改之前数据。
      this.temp.parentStuList = JSON.parse(JSON.stringify(this.temp.parentStuList))
      this.temp.user = JSON.parse(JSON.stringify(this.temp.user))
      this.temp.address = this.temp.user.address
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.user.name = this.temp.name
          this.temp.user.address = this.temp.address
          this.temp.enrollmentDate = parseTime(this.temp.enrollmentDate, '{y}-{m}-{d}')
          const tempData = Object.assign({}, this.temp)
          updateStudent(tempData).then(response => {
            if (response.data.code === 200) {
              for (const v of this.list) {
                if (v.id === response.data.result.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, response.data.result)
                  break
                }
              }
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: '失败',
                message: response.data.message,
                type: 'error',
                duration: 5000
              })
            }
          })
        }
      })
    },
    handleDelete(row) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
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
