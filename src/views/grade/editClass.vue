<template>
  <el-dialog :visible.sync="dialogFormVisible" title="班级信息" width="60%" >
    <el-tabs type="border-card" style="height: 600px;">
      <el-tab-pane label="班级学生">
        <studentComplexTable v-if="hackReset" :table-height="420 + 'px'" :class-id="classId" :type="false" style="margin-top:-20px;"/>
      </el-tab-pane>
      <el-tab-pane label="任课老师">
        <teacherComplexTable v-if="hackReset" :table-height="500 + 'px'" :class-id="classId" :class-name="className" :type="false" style="margin-top:-20px;"/>
      </el-tab-pane>
      <el-tab-pane label="课程表">
        <scheduleTab v-if="hackReset" :class-id="classId" :type="false" style="margin-top:-20px;"/>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">确认</el-button>
    </div>
</el-dialog></template>

<script>
import waves from '@/directive/waves' // 水波纹指令
import teacherComplexTable from '@/views/teacher/complexTable'
import studentComplexTable from '@/views/student/complexTable'
import scheduleTab from '@/views/grade/scheduleTab'

export default {
  name: 'ComplexTable',
  directives: {
    waves
  },
  components: {
    teacherComplexTable,
    studentComplexTable,
    scheduleTab
  },
  data() {
    return {
      hackReset: false,
      classId: undefined,
      className: undefined,
      dialogFormVisible: false
    }
  },
  created() {
  },
  methods: {
    handleModifyStatus(clazz) {
      this.classId = clazz.id
      this.className = clazz.name
      this.dialogFormVisible = true
      this.hackReset = false
      this.$nextTick(() => {
        this.hackReset = true
      })
    }
  }
}
</script>
