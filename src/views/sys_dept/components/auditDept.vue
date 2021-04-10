<template>
  <div>
    <el-card>
      <el-form ref="auditForm" :model="form" :rules="rules">
        <el-form-item label="所属部门" :label-width="formLabelWidth">
          <el-select v-model="id" placeholder="请选择" disabled>
            <el-option
              v-for="item in data"
              :key="item.sys_dept__dept_id"
              :label="item.sys_dept__dept_name"
              :value="item.sys_dept__dept_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="部门编码" :label-width="formLabelWidth" prop="sys_dept__dept_code">
          <el-input v-model="form.sys_dept__dept_code" maxlength="40" @change="change" />
        </el-form-item>
        <el-form-item label="部门名称" :label-width="formLabelWidth" prop="sys_dept__dept_name">
          <el-input v-model="form.sys_dept__dept_name" @change="change" />
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth" prop="sys_dept__memo">
          <el-input v-model="form.sys_dept__memo" maxlength="100" @change="change" />
        </el-form-item>
        <el-form-item label="是否注销" :label-width="formLabelWidth">
          <el-select v-model="form.sys_dept__is_novalid" placeholder="请选择" @change="change">
            <el-option
              v-for="item in novalid"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      default: ''
    },
    data: {
      type: Array,
      default: () => []
    },
    auditForm: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      novalid: [
        {
          value: '0',
          label: '否'
        }, {
          value: '1',
          label: '是'
        }
      ],
      rules: {
        sys_dept__dept_code: [
          { required: true, message: '请输入部门编码', trigger: 'blur' }
        ],
        sys_dept__dept_name: [
          { required: true, message: '请输入部门名称', trigger: 'blur' }

        ]
      },
      formLabelWidth: '120px',
      form: {}
    }
  },
  created() {
    this.form = JSON.parse(JSON.stringify(this.auditForm))
  },
  methods: {
    change() {
      this.$emit('change', this.form)
    }
  }
}
</script>

<style>

</style>
