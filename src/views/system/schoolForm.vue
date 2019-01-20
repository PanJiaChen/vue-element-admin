<template>
  <div class="app-container">
    <div style="z-index: 1; height: 50px;">
      <div class="draft" style="top: 0px; z-index: 1;height: 45px;margin-top:-5px;">
        <el-button class="filter-item" style="margin-right: 10px;float:right;" @click="cancelSchoolData()">取消</el-button>
        <el-button v-if="!disabled" type="primary" class="filter-item  el-button--mini" style="margin-right: 10px;float:right;" icon="el-icon-edit" @click="updateSchoolData()">{{ $t('save') }}</el-button>
        <el-button v-if="disabled" class="filter-item  el-button--mini el-button--success" style="margin-right: 10px;float:right;" icon="el-icon-edit" @click="disabled = false">{{ $t('edit') }}</el-button>
      </div>
    </div>
    <el-form ref="form" :model="form" :disabled="disabled" :rules="rules" label-width="150px">
      <el-form-item label="学校名称" prop="schoolName">
        <el-input v-model="form.schoolName"/>
      </el-form-item>
      <el-form-item label="地区编号" prop="areaCode">
        <el-input v-model="form.areaCode"/>
      </el-form-item>
      <el-form-item label="学校代码" prop="schoolCode">
        <el-input v-model="form.schoolCode"/>
      </el-form-item>
      <el-form-item label="微信公众号应用ID">
        <el-input v-model="form.appid"/>
      </el-form-item>
      <el-form-item label="微信公众号应用密钥">
        <el-input v-model="form.appsecret"/>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { fetchSchool, updateSchool } from '@/api/user'

export default {
  data() {
    return {
      disabled: true,
      listQuery: {
        fid: this.$store.state.user.fid
      },
      data: null,
      form: {
        schoolName: '',
        areaCode: '',
        schoolCode: '',
        appid: '',
        appsecret: ''
      },
      rules: {
        schoolName: [{ required: true, message: '学校名称必填', trigger: 'change' }],
        areaCode: [{ required: true, message: '学校地区编号必填', trigger: 'blur' }],
        schoolCode: [{ required: true, message: '学校代码必填', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getSchoolData()
  },
  methods: {
    getSchoolData() {
      fetchSchool(this.listQuery).then(response => {
        this.data = response.data.result
        this.form = JSON.parse(JSON.stringify(this.data))
      })
    },
    updateSchoolData() {
      updateSchool(this.form).then(response => {
        this.data = response.data.result
        this.disabled = true
        this.form = JSON.parse(JSON.stringify(this.data))
      })
    },
    cancelSchoolData() {
      this.form = JSON.parse(JSON.stringify(this.data))
      this.disabled = true
    },
    onSubmit() {
      console.log('submit!')
    }
  }
}
</script>
