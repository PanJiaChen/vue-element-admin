<template>
  <div class="app-container">
    <div class="filter-container" style="margin-top:-10px;">
      <el-input v-model="listQuery.name" placeholder="姓名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.sex" placeholder="性别" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button v-if="$store.state.user.admin && !classId" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
      <el-popover
        v-model="courseData.visiblePopover"
        placement="top"
        width="300"
        trigger="click">
        <el-form ref="popoverForm" :rules="rules" :model="courseData" label-position="right" label-width="120px">
          <el-form-item label="课程" prop="name">
            <el-select v-model="courseData.course" value-key="id" filterable class="filter-item" style="width: 100%;">
              <el-option v-for="item in courseList" :key="item.id" :label="item.name" :value="item"/>
            </el-select>
          </el-form-item>
          <el-form-item label="教师名称" prop="name">
            <el-select v-model="courseData.teacher" value-key="uid" filterable class="filter-item" style="width: 100%;">
              <el-option v-for="item in allList" :key="item.uid" :label="item.name" :value="item"/>
            </el-select>
          </el-form-item>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="courseData.visiblePopover = false">取消</el-button>
            <el-button type="primary" size="mini" @click="updateCourse()">确定</el-button>
          </div>
        </el-form>
        <el-button v-if="classId" slot="reference" class="filter-item" icon="el-icon-edit" style="margin-left: 10px;" type="primary" @click="addCourseForTeacher()">添加任课老师</el-button>
      </el-popover>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      :height="tableHeight"
      :row-key="getRowKeys"
      border
      fit
      highlight-current-row
      style="width: 100%;min-height:300px;margin-top:-10px;"
      @selection-change="handleSelectionChange">
      <el-table-column
        :reserve-selection="true"
        type="selection"
        width="35"/>
      <el-table-column :label="$t('table.id')" align="center" width="60">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="160px" align="left">
        <template slot-scope="scope">
          <span class="link-type" style="text-overflow:ellipsis;" @click="handleUpdate(scope.row, true)">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="编号" width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="!classId" label="入职时间" width="160px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.enrollmentDate }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="!classId" label="性别" align="center" width="70">
        <template slot-scope="scope">
          <span>{{ scope.row.sex == 0 ? "男" : "女" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电话号码" width="150px" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.tel }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="false" :label="$t('table.status')" class-name="status-col" width="80">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.teacherStatus==1"> 在职</el-tag>
          <el-tag v-if="scope.row.teacherStatus==2" type="warning">离职</el-tag>
          <el-tag v-if="scope.row.teacherStatus==3" type="info"> 退休</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="执教班级" min-width="250" align="center">
        <template slot-scope="scope">
          <div v-for="(item,index) in scope.row.classMap" v-if="index%2 != 1" :gutter="1" :key="item.id" class="link-type row-bg" style="text-overflow:ellipsis;" type="flex" justify="left" @click="handleUpdate(scope.row, false)">
            <el-tag v-if="index%2 != 1" style="float:left;margin:2px;" >{{ item.className }}({{ item.courseName }})</el-tag>
            <el-tag v-if="scope.row.classMap[index+1] != null" style="float:left;margin:2px;">{{ scope.row.classMap[index+1].className }}({{ scope.row.classMap[index+1].courseName }})</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="70" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-dropdown trigger="click">
            <!-- <svg-icon icon-class="action" style="width: 1.2em;height: 1.2em;cursor:pointer"/> -->
            <el-button style="cursor:pointer" class="el-icon-caret-bottom"/>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="$store.state.user.admin">
                <span style="display:block;" @click="handleUpdate(scope.row, false)">{{ $t('edit') }}</span>
              </el-dropdown-item>
              <el-dropdown-item v-if="$store.state.user.admin" divided>
                <span style="display:block;" @click="handleModifyStatus(scope.row,scope.$index)">{{ $t('delete') }}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogFormVisible" :title="textMap[dialogStatus]" append-to-body width="40%">
      <el-form ref="dataForm" :disabled="disabled" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="编号" prop="code">
          <el-input v-model="temp.code"/>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="temp.name"/>
        </el-form-item>
        <el-form-item label="登录名" prop="username">
          <el-input v-model="temp.username" placeholder="默认为姓名"/>
        </el-form-item>
        <el-form-item label="手机号码" prop="tel">
          <el-input v-model="temp.tel"/>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="temp.sex" class="filter-item" placeholder="Please select">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item label="执教课程">
          <el-row v-for="(item,index) in temp.classMap" :gutter="10" :key="item.id" type="flex" class="row-bg" justify="left" style="margin-top:5px;">
            <el-col :span="12">
              <el-popover
                :disabled="disabled"
                v-model="temp.classMap[index].visiblePopover"
                placement="top"
                width="300"
                trigger="click">
                <el-form :model="formLabelAlign" label-position="left" label-width="60px">
                  <el-form-item label="班级">
                    <el-cascader
                      v-model="formLabelAlign.classId"
                      :options="gradeList"
                      :props="props"
                      clearable
                      expand-trigger="hover"
                      style="width: 100%;"
                      @change="handleChange"/>
                  </el-form-item>
                  <el-form-item label="课程">
                    <el-select v-model="formLabelAlign.course" value-key="id" filterable class="filter-item" style="width: 100%;">
                      <el-option v-for="item in courseList" :key="item.id" :label="item.name" :value="item"/>
                    </el-select>
                  </el-form-item>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="temp.classMap[index].visiblePopover = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="updateParent(index)">确定</el-button>
                  </div>
                </el-form>
                <div slot="reference">
                  <span class="el-tag el-tag--info el-tag--small" style="float:left;">
                    <span class="link-type" @click="editParent(item)">{{ item.className }} ({{ item.courseName }})</span>
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
            <el-form ref="popoverForm" :model="formLabelAlign" label-position="right" label-width="60px">
              <el-form-item label="班级">
                <el-cascader
                  v-model="formLabelAlign.classId"
                  :options="gradeList"
                  :props="props"
                  clearable
                  expand-trigger="hover"
                  style="width: 100%;"
                  @change="handleChange"/>
              </el-form-item>
              <el-form-item label="课程">
                <el-select v-model="formLabelAlign.course" value-key="id" filterable class="filter-item" style="width: 100%;">
                  <el-option v-for="item in courseList" :key="item.id" :label="item.name" :value="item"/>
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
        <el-form-item :label="$t('table.date')">
          <el-date-picker v-model="temp.enrollmentDate" type="date"/>
        </el-form-item>
        <el-form-item :label="$t('table.status')">
          <el-select v-model="temp.teacherStatus" class="filter-item">
            <el-option v-for="item in statusOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button v-if="dialogStatus=='create' && !disabled" type="primary" @click="createData">{{ $t('table.confirm') }}</el-button>
        <el-button v-else-if="!disabled" type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchTeacherList, fetchPv, updateTeacher, deleteTeacher, fetchGradeList, fetchCourseList, addCourseClass } from '@/api/user'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'

const calendarTypeOptions = [
  { key: 0, display_name: '男' },
  { key: 1, display_name: '女' }
]

const statusOptions = [
  { key: 1, display_name: '在职' },
  { key: 2, display_name: '离职' },
  { key: 3, display_name: '退休' }
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
      default: window.innerHeight - 160 + 'px'
    },
    classId: {
      type: Number,
      default: undefined
    },
    className: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      allList: [],
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        courseId: undefined,
        gradeId: undefined,
        classId: this.classId,
        fid: this.$store.state.user.fid,
        sex: undefined,
        name: undefined,
        type: undefined,
        sort: '+id'
      },
      gradeQuery: {
        page: 1,
        fid: this.$store.state.user.fid
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      statusOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      showReviewer: false,
      formLabelAlign: {
        class: {},
        classId: [],
        course: {}
      },
      courseData: {
        class: {},
        classId: [],
        course: {}
      },
      props: {
        label: 'name',
        value: 'id',
        children: 'clazzList'
      },
      classList: [],
      courseList: [],
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        enrollmentDate: '',
        title: '',
        sex: 0,
        classMap: [],
        loginName: undefined,
        type: ''

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
        code: [{ required: true, message: '教师编号必填', trigger: 'blur' }],
        name: [{ required: true, message: '教师姓名必填', trigger: 'blur' }]
      },
      downloadLoading: false,
      multipleSelection: [],
      gradeList: [],
      userList: [],
      disabled: true
    }
  },
  created() {
    this.getList()
    if (this.classId) {
      var tempQuery = {
        fid: this.$store.state.user.fid
      }
      fetchTeacherList(tempQuery).then(response => {
        this.allList = response.data.result.list
      }
      )
    }
    this.fetchGradeList()
    this.fetchCourseList()
  },
  methods: {
    deleteParent(index) {
      this.temp.classMap.splice(index, 1)
    },
    editParent(item) {
      this.formLabelAlign = JSON.parse(JSON.stringify(item))
      this.formLabelAlign.classId = [item.gradeId, item.classId]
      this.formLabelAlign.course = {}
      this.formLabelAlign.course.name = this.formLabelAlign.courseName
      this.formLabelAlign.course.id = this.formLabelAlign.courseId
      item.visiblePopover = !this.disabled
    },
    updateParent(index) {
      if (index > -1) {
        this.formLabelAlign.visiblePopover = false
        const courseMap = {}
        for (const index in this.gradeList) {
          const grade = this.gradeList[index]
          if (grade.id === this.formLabelAlign.classId[0]) {
            const classList = grade.clazzList
            for (const i in classList) {
              const clazz = classList[i]
              if (clazz.id === this.formLabelAlign.classId[1]) {
                courseMap.className = clazz.name
                courseMap.classId = clazz.id
                break
              }
            }
            break
          }
        }
        courseMap.courseName = this.formLabelAlign.course.name
        courseMap.courseId = this.formLabelAlign.course.id
        this.temp.classMap.splice(index, 1, courseMap)
      } else {
        this.formLabelAlign.visiblePopover = false
        const courseMap = {}
        for (const index in this.gradeList) {
          var grade = this.gradeList[index]
          if (grade.id === this.formLabelAlign.classId[0]) {
            var classList = grade.clazzList
            for (var i in classList) {
              var clazz = classList[i]
              if (clazz.id === this.formLabelAlign.classId[1]) {
                courseMap.className = clazz.name
                courseMap.classId = clazz.id
                break
              }
            }
            break
          }
        }
        courseMap.courseName = this.formLabelAlign.course.name
        courseMap.courseId = this.formLabelAlign.course.id
        this.temp.classMap.push(courseMap)
      }
    },
    updateCourse() {
      const courseMap = {}
      courseMap.courseName = this.courseData.course.name
      courseMap.className = this.className
      courseMap.courseId = this.courseData.course.id
      courseMap.classId = this.classId
      this.temp = this.courseData.teacher
      this.temp.classMap = []
      this.temp.classMap.push(courseMap)
      this.updateCourseData()
    },
    resetParent() {
      this.formLabelAlign = {
        class: {},
        classId: undefined,
        course: {},
        visiblePopover: true
      }
    },
    createParent() {
      this.resetParent()
    },
    addCourseForTeacher() {
      this.courseData = {
        class: {},
        classId: [],
        course: {},
        visiblePopover: true
      }
    },
    handleChange(value) {
      if (this.formLabelAlign.class == null) {
        this.formLabelAlign.class = {}
      }
      if (value != null && value.length > 1) {
        this.formLabelAlign.class.id = value[1]
      } else {
        this.formLabelAlign.class.id = null
      }
    },
    getSelectUser() {
      return this.userList
    },
    updateClass() {
      for (const index in this.gradeList) {
        const grade = this.gradeList[index]
        if (grade.id === this.listQuery.gradeId) {
          this.classList = grade.clazzList
        }
      }
    },
    fetchGradeList() {
      fetchGradeList(this.gradeQuery).then(response => {
        this.gradeList = response.data.result.list
      })
    },
    fetchCourseList() {
      fetchCourseList(this.gradeQuery).then(response => {
        this.courseList = response.data.result
      })
    },
    handleSelectionChange(val) {
      this.userList = val
    },
    getRowKeys(row) {
      return row.uid
    },
    getList() {
      this.multipleSelection = []
      this.listLoading = true
      fetchTeacherList(this.listQuery).then(response => {
        this.list = response.data.result.list
        this.total = response.data.result.total
        this.listLoading = false
      }
      )
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
    handleModifyStatus(row, index) {
      deleteTeacher({ id: row.teacherId }).then(() => {
        fetchTeacherList(this.listQuery).then(response => {
          this.list = response.data.result.list
          this.total = response.data.result.total
        })
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      }).catch(function(error) {
        console.log(error)
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        enrollmentDate: '',
        title: '',
        fid: this.$store.state.user.fid,
        teacherStatus: 1,
        uid: undefined,
        classMap: [],
        sex: 0,
        loginName: undefined
      }
    },
    handleCreate() {
      this.resetTemp()
      this.disabled = false
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.updateTeacherData()
        }
      })
    },
    updateTeacherData() {
      const tempData = Object.assign({}, this.temp)
      tempData.enrollmentDate = parseTime(tempData.enrollmentDate, '{y}-{m}-{d}')
      this.temp.enrollmentDate = tempData.enrollmentDate
      if (!this.temp.username) {
        this.temp.username = this.temp.name
      }
      updateTeacher(this.temp).then(response => {
        this.list.unshift(response.data.result)
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        })
      }
      )
    },
    updateCourseData() {
      const tempData = Object.assign({}, this.temp)
      tempData.enrollmentDate = parseTime(tempData.enrollmentDate, '{y}-{m}-{d}')
      this.temp.enrollmentDate = tempData.enrollmentDate
      if (!this.temp.username) {
        this.temp.username = this.temp.name
      }
      addCourseClass(this.temp).then(response => {
        if (this.classId) {
          this.getList()
          this.courseData.visiblePopover = false
        }
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        })
      }
      )
    },
    handleUpdate(row, disabled) {
      this.disabled = disabled
      this.temp = Object.assign({}, row) // copy obj
      // 避免数组浅拷贝，修改之前数据。
      this.temp.classMap = JSON.parse(JSON.stringify(this.temp.classMap))
      if (this.temp.enrollmentDate != null) {
        this.temp.enrollmentDate = new Date(this.temp.enrollmentDate)
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.temp.enrollmentDate != null) {
            this.temp.enrollmentDate = new Date(this.temp.enrollmentDate)
          }
          if (!this.temp.username) {
            this.temp.username = this.temp.name
          }
          const tempData = Object.assign({}, this.temp)
          tempData.enrollmentDate = parseTime(tempData.enrollmentDate, '{y}-{m}-{d}')
          this.temp.enrollmentDate = tempData.enrollmentDate
          updateTeacher(tempData).then(response => {
            if (response.data.code === 200) {
              if (this.classId) {
                this.getList()
              } else {
                for (const v of this.list) {
                  if (v.id === this.temp.id) {
                    const index = this.list.indexOf(v)
                    this.list.splice(index, 1, this.temp)
                    break
                  }
                }
              }
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
          }).catch(function(error) {
            console.log(error)
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
