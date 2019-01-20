<template>
  <el-dialog :visible.sync="dialogFormVisible" title="编辑">
    <el-form ref="dataForm" :disabled="disabled" :rules="rules" :model="temp" label-position="right" label-width="90px" style="width: 90%; margin-left:10px;">
      <el-form-item label="年级名称" prop="name">
        <el-input v-model="temp.name"/>
      </el-form-item>
      <el-form-item label="年级别名">
        <el-input v-model="temp.showName"/>
      </el-form-item>
      <el-form-item label="状态" prop="graduationStatus">
        <el-select v-model="temp.graduationStatus" filterable class="filter-item" placeholder="Please select" style="width: 100%;">
          <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
        </el-select>
      </el-form-item>
      <el-form-item label="班级">
        <el-row v-for="(item,index) in temp.clazzList" :gutter="10" :key="item.id" type="flex" class="row-bg" justify="left" style="margin-top:5px;">
          <el-col :span="12">
            <el-popover
              v-model="temp.clazzList[index].visiblePopover"
              :disabled="disabled"
              placement="top"
              width="300"
              trigger="click">
              <el-form :rules="rules" :model="formLabelAlign" label-position="right" label-width="80px">
                <el-form-item label="班级名称" prop="name">
                  <el-input v-model="formLabelAlign.name"/>
                </el-form-item>
                <el-form-item label="班主任">
                  <el-select v-model="formLabelAlign.teacher" value-key="uid" filterable class="filter-item" placeholder="Please select" style="width: 100%;">
                    <el-option v-for="item in teacherList" :key="item.uid" :label="item.name" :value="item"/>
                  </el-select>
                </el-form-item>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="temp.clazzList[index].visiblePopover = false">取消</el-button>
                  <el-button type="primary" size="mini" @click="updateParent(index)">确定</el-button>
                </div>
              </el-form>
              <div slot="reference">
                <span class="el-tag el-tag--info el-tag--small" style="float:left;">
                  <span class="link-type" @click="editParent(item)">{{ item.name }} (班主任: {{ item.teacher.name }})</span>
                  <i v-if="!disabled" class="el-tag__close el-icon-close" @click="deleteParent(index)"/>
                </span>
              </div>
            </el-popover>
          </el-col>
        </el-row>
        <el-popover
          v-model="formLabelAlign.visiblePopover"
          placement="top"
          width="300"
          trigger="click">
          <el-form ref="popoverForm" :rules="rules" :model="formLabelAlign" label-position="right" label-width="80px">
            <el-form-item label="班级名称" prop="name">
              <el-input v-model="formLabelAlign.name"/>
            </el-form-item>
            <el-form-item label="班主任">
              <el-select v-model="formLabelAlign.teacher" value-key="uid" filterable class="filter-item" style="width: 100%;">
                <el-option v-for="item in teacherList" :key="item.uid" :label="item.name" :value="item"/>
              </el-select>
            </el-form-item>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="formLabelAlign.visiblePopover = false">取消</el-button>
              <el-button type="primary" size="mini" @click="updateParent(-1)">确定</el-button>
            </div>
          </el-form>
          <el-button slot="reference" icon="el-icon-circle-plus-outline" size="mini" round @click="createParent()">添加</el-button>
        </el-popover>
      </el-form-item>
      <el-form-item label="描述">
        <el-input :autosize="{ minRows: 3, maxRows: 5}" v-model="temp.remark" type="textarea"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
      <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{ $t('table.confirm') }}</el-button>
      <el-button v-else type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { fetchList, fetchPv } from '@/api/article'
import { fetchTeacherList, updateGrade, fetchCourseList } from '@/api/user'
import { isvalidStr } from '@/utils/validate'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'

const calendarTypeOptions = [
  { key: 0, display_name: '在读' },
  { key: 1, display_name: '已毕业' }
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
  data() {
    return {
      disabled: true,
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: undefined,
        fid: this.$store.state.user.fid,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      teacherList: [],
      courseList: [],
      formLabelAlign: {
        name: '',
        teacher: {
          uid: undefined,
          name: undefined
        },
        course: {
          id: undefined,
          name: undefined
        }
      },
      index: undefined,
      calendarTypeOptions,
      temp: {
        id: undefined,
        name: '',
        clazzList: [],
        graduationStatus: 0
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
        name: [{ required: true, message: '名称必填', trigger: 'blur' }],
        teacherName1: [{ required: true, message: '班主任必填', trigger: 'change' }],
        teacherName: [{ validate: isvalidStr, trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    updateParent(index) {
      this.$refs['popoverForm'].validate((valid) => {
        if (valid) {
          if (index > -1) {
            this.formLabelAlign.visiblePopover = false
            this.temp.clazzList.splice(index, 1, this.formLabelAlign)
          } else {
            this.formLabelAlign.visiblePopover = false
            this.temp.clazzList.push(this.formLabelAlign)
          }
        }
      })
    },
    deleteParent(index) {
      this.temp.clazzList.splice(index, 1)
    },
    editParent(item) {
      this.formLabelAlign = JSON.parse(JSON.stringify(item))
      item.visiblePopover = !this.disabled
    },
    resetParent() {
      this.formLabelAlign = {
        name: undefined,
        teacher: {
          uid: undefined,
          name: undefined
        },
        visiblePopover: true
      }
    },
    createParent() {
      this.resetParent()
      this.$nextTick(() => {
        this.$refs['popoverForm'].clearValidate()
      })
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
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
    handleModifyStatus(row, index, disabled) {
      this.resetTemp()
      this.dialogFormVisible = true
      this.index = index
      this.disabled = disabled
      if (row) {
        this.temp = JSON.parse(JSON.stringify(row))
      }
      this.getTeacherList()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    getTeacherList() {
      this.listLoading = true
      fetchTeacherList(this.listQuery).then(response => {
        this.teacherList = response.data.result.list
      })
    },
    getCourseList() {
      this.listLoading = true
      fetchCourseList(this.listQuery).then(response => {
        this.courseList = response.data.result.list
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        clazzList: [],
        fid: this.$store.state.user.fid,
        name: undefined,
        graduationStatus: 0
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
          updateGrade(this.temp).then(response => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateGrade(tempData).then(response => {
            if (response.data.code === 200 && response.data.result) {
              this.$emit('listenToChildEvent', response.data.result, this.index)
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '更新成功',
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
