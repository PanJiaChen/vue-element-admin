<template>
  <div class="app-container">
    <!--周-->
    <div class="tr_top">
      <div class="td_top_title">{{ getMonth() }}月</div>
      <div v-for="(value, key, index) in ['周一','周二','周三','周四','周五','周六','周日']" :key="index">
        <div :class="{td_top_data_change:setWeeks(value)}" class="td_top_data">{{ value }}({{ time[key] }}日)</div>
      </div>
    </div>
    <!--课程-->
    <div class="content" style="padding-bottom: 20px;">
      <!--节-->
      <div class="tr_week">
        <div class="td_week_title">
          <div class="td_week_title_content">早自习</div>
          <div v-for="n in 8" :key="n" class="td_week_title_content">{{ n }}</div>
          <div class="td_week_title_content">晚自习1</div>
          <div class="td_week_title_content">晚自习2</div>
          <div class="td_week_title_content">晚自习3</div>
        </div>
      </div>
      <!--课程内容-->
      <div v-for="(value, key, index) in schedule" :key="index" class="tr_week">
        <div class="td_week_data">
          <div v-for="(value1, key1, index1) in value" :key="index1">
            <span v-if="value1" @click="updateParent(key, key1, value1)">
              <div class="td_week_data_content" style="justify-content: center;display: flex;align-items: center;font-size: 10px;">
                <span> {{ value1.courseName }}<span v-if="classId"> ({{ value1.teacherName }})</span><br><span v-if="!classId">{{ value1.className }}</span></span>
              </div>
            </span>
            <div v-if="!value1" class="td_week_data_content" @click="updateParent(key, key1, value1)">
              <span v-if="!value1"/>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      :visible.sync="dialogVisible"
      width="20%"
      append-to-body
      center>
      <el-form ref="ruleForm" :model="formLabelAlign" :rules="rules" label-position="right" label-width="60px">
        <el-form-item label="课程" prop="course">
          <el-select v-model="formLabelAlign.course" value-key="id" class="filter-item" style="width: 100%;">
            <el-option v-for="item in courseList" :key="item.id" :label="item.courseName + '(' + item.teacherName + ')'" :value="item"/>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveParent()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { formatMonth, getWeeks, formatDay, getDays } from '@/utils'
import { fetchScheduleList, fetchCourseByClassId, updateSchedule } from '@/api/user'
import waves from '@/directive/waves' // 水波纹指令

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
    },
    classId: {
      type: Number,
      default: undefined
    },
    teacherId: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      disabled: true,
      dialogVisible: false,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        fid: this.$store.state.user.fid,
        year: 2018,
        semester: 2,
        classId: this.classId,
        teacherId: this.teacherId,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: [{ name: '在读', id: 1 }, { name: '转学', id: 0 }],
      showReviewer: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: this.$t('edit'),
        create: this.$t('create')
      },
      gradeList: undefined,
      classList: undefined,
      props: {
        label: 'name',
        value: 'id',
        children: 'clazzList'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        stuNo: [{ required: true, message: '学号不能为空', trigger: 'blur' }],
        course: [{ required: true, message: '必须选择一门课程', trigger: 'change' }]
      },
      downloadLoading: false,
      time: [],
      schedule: [[], [], [], [], [], [], []],
      courseList: [],
      formLabelAlign: {
        class: {},
        classId: [],
        course: {},
        courseName: undefined
      }
    }
  },
  created() {
    this.getTimes()
    if (this.classId) {
      this.fetchCourseByClassId()
    }
    this.get('2018', '2')
  },
  methods: {
    resetParent() {
      this.formLabelAlign = {
        class: {},
        course: undefined,
        fid: this.$store.state.user.fid,
        id: undefined,
        year: 2018,
        semester: 2,
        teacherId: undefined,
        week: undefined,
        courseId: undefined,
        sequence: undefined
      }
    },
    updateParent(week, sequence, item) {
      if (this.classId) {
        this.resetParent()
        if (item) {
          this.formLabelAlign.id = item.id

          this.formLabelAlign.course = item.courseName + '(' + item.teacherName + ')'
        }
        this.formLabelAlign.week = week
        this.formLabelAlign.sequence = sequence
        this.dialogVisible = true
        this.$nextTick(() => {
          this.$refs['ruleForm'].clearValidate()
        })
      }
    },
    saveParent(item) {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.formLabelAlign.courseId = this.formLabelAlign.course.id
          if (this.formLabelAlign.courseId) {
            this.formLabelAlign.teacherId = this.formLabelAlign.course.teacherId
            updateSchedule(this.formLabelAlign).then(response => {
              this.get('2018', '2')
              this.dialogVisible = false
            })
          } else {
            this.dialogVisible = false
          }
        }
      }
      )
    },
    fetchCourseByClassId: function() {
      fetchCourseByClassId(this.classId).then(response => {
        this.courseList = response.data.result
      })
    },
    get: function(year, semester) {
      fetchScheduleList(this.listQuery)
        .then(response => {
          var tempSchedule = [[], [], [], [], [], [], []]
          var result = response.data.result
          tempSchedule[0][11] = undefined
          tempSchedule[1][11] = undefined
          tempSchedule[2][11] = undefined
          tempSchedule[3][11] = undefined
          tempSchedule[4][11] = undefined
          tempSchedule[5][11] = undefined
          tempSchedule[6][11] = undefined
          for (var i = 0; i < result.length; i++) {
            var week = result[i].week
            var sequence = result[i].sequence
            if (week === 0) {
              tempSchedule[0][sequence] = result[i]
            } else if (week === 1) {
              tempSchedule[1][sequence] = result[i]
            } else if (week === 2) {
              tempSchedule[2][sequence] = result[i]
            } else if (week === 3) {
              tempSchedule[3][sequence] = result[i]
            } else if (week === 4) {
              tempSchedule[4][sequence] = result[i]
            }
          }
          this.schedule = tempSchedule
        })
    },
    getDate: function(data) {
      return formatDay(data)
    },
    getTimes: function() {
      // this.time=getDays();
      var day = getDays()
      for (var i = 0; i < 7; i++) {
        this.time[i] = day[i]
      }
    },
    setWeeks: function(data) {
      return getWeeks(data)
    },
    getMonth: function() {
      return formatMonth()
    }
  }
}
</script>
