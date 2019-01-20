<template>
  <el-dialog :visible.sync="dialogFormVisible" title="请假" width="40%">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" style="magin-top:-100px;" label-width="100px" class="demo-ruleForm">
      <el-form-item label="请假类型">
        <el-select v-model="ruleForm.type" class="filter-item" style="width:90%;">
          <el-option v-for="item in leaveTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
        </el-select>
      </el-form-item>
      <el-form-item label="开始时间" required>
        <el-col style="width:60%;">
          <el-form-item prop="date1">
            <el-date-picker v-model="ruleForm.date1" type="date" placeholder="选择日期" style="width: 100%;"/>
          </el-form-item>
        </el-col>
        <el-col style="width:30%;">
          <el-form-item>
            <el-select v-model="ruleForm.region" placeholder="请选择活动区域" style="magin-left:20px;">
              <el-option label="上午" value="0"/>
              <el-option label="下午" value="1/"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="结束时间" required>
        <el-col style="width:60%;">
          <el-form-item prop="date1">
            <el-date-picker v-model="ruleForm.date1" type="date" placeholder="选择日期" style="width: 100%;"/>
          </el-form-item>
        </el-col>
        <el-col style="width:30%;">
          <el-form-item>
            <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
              <el-option label="上午" value="0"/>
              <el-option label="下午" value="1/"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="时长" prop="name">
        <el-input v-model="ruleForm.name" style="width:90%;"/>
      </el-form-item>
      <el-form-item label="请假事由" prop="desc">
        <el-input v-model="ruleForm.desc" type="textarea" style="width:90%;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </div>
  </el-dialog>
</template>

<script>
import waves from '@/directive/waves' // 水波纹指令

const leaveTypeOptions = [
  { key: 0, display_name: '事假' },
  { key: 1, display_name: '年假' },
  { key: 2, display_name: '病假' },
  { key: 3, display_name: '产假' },
  { key: 4, display_name: '陪产假' },
  { key: 5, display_name: '婚假' },
  { key: 6, display_name: '丧假' }
]

export default {
  name: 'ComplexTable',
  directives: {
    waves
  },
  data() {
    return {
      dialogFormVisible: false,
      leaveTypeOptions,
      ruleForm: {
        name: '',
        region: '0',
        date1: '',
        date2: '',
        delivery: false,
        type: 0,
        resource: '',
        desc: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        date1: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        date2: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        type: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    showEditDialog() {
      this.dialogFormVisible = true
    }
  }
}
</script>
