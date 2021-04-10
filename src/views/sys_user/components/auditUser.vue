<template>
  <div>
    <el-card>
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <el-row>
          <el-col :span="8">
            <el-form-item label="姓名" prop="sys_user__user_name">
              <el-input v-model="form.sys_user__user_name" clearable @change="change" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="工号" prop="sys_user__user_code">
              <el-input v-model="form.sys_user__user_code" clearable @change="change" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item ref="sys_dept__dept_name" label="部门名称" prop="sys_dept__dept_name">
              <el-input v-model="form.sys_dept__dept_name" placeholder="请选择部门" class="input-with-select" clearable>
                <el-button slot="append" icon="el-icon-search" @click="selDeptVisible = !selDeptVisible" />
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="部门负责人？">
              <el-select v-model="form.sys_user__is_leader" placeholder="请选择" clearable @change="change">
                <el-option
                  v-for="item in yesno"
                  :key="item.funall_control__value_data"
                  :label="item.funall_control__display_data"
                  :value="item.funall_control__value_data"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="职务">
              <el-input v-model="form.sys_user__duty" clearable @change="change" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="固定电话">
              <el-input v-model="form.sys_user__phone_code" clearable @change="change" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="手机号码">
              <el-input v-model="form.sys_user__mob_code" clearable @change="change" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="性别">
              <el-select v-model="form.sys_user__sex" placeholder="请选择" clearable @change="change">
                <el-option
                  v-for="item in usersex"
                  :key="item.funall_control__value_data"
                  :label="item.funall_control__display_data"
                  :value="item.funall_control__value_data"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="邮箱">
              <el-input v-model="form.sys_user__email" clearable @change="change" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="是否注销">
              <el-select v-model="form.sys_user__is_novalid" placeholder="请选择" clearable @change="change">
                <el-option
                  v-for="item in yesno"
                  :key="item.funall_control__value_data"
                  :label="item.funall_control__display_data"
                  :value="item.funall_control__value_data"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="备注">
              <el-input v-model="form.sys_user__memo" maxlength="100" @change="change" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-dialog
      v-if="selDeptVisible"
      class="selDept"
      title="选择部门"
      :visible.sync="selDeptVisible"
      width="60%"
      :modal="false"
    >
      <SelDept ref="seLDept" selective="single" @updateDept="updateDept" @updateDepts="updateDepts" />
      <span>
        <el-button @click="reformDeptVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '../api'
import SelDept from '@/components/selDept'
export default {
  components: {
    SelDept
  },
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
        sys_user__user_code: [
          { required: true, message: '请输入工号', trigger: 'blur' }
        ],
        sys_user__user_name: [
          { required: true, message: '请输入用户名称', trigger: 'blur' }
        ],
        sys_dept__dept_name: [
          { required: true, message: '请选择部门名称', trigger: 'blur' }

        ]
      },
      formLabelWidth: '120px',
      form: {},
      yesno: [],
      usersex: [],
      selDeptVisible: false
    }
  },
  watch: {
    'form.sys_dept__dept_name': {
      handler(val, oldVal) {
        this.$refs['sys_dept__dept_name'].clearValidate()
      },
      deep: true
    }
  },
  async created() {
    await this.getYesNo()
    await this.getSex()
    await this.init()
  },
  methods: {
    init() {
      this.form = JSON.parse(JSON.stringify(this.auditForm))
    },
    change() {
      console.log(this.form, 'this.form')
      this.$emit('change', this.form)
    },
    getYesNo() {
      api.getSelect('yesno').then(data => {
        if (data.success) {
          this.yesno = data.data.root
        } else {
          this.$message.error(data.message)
        }
      })
    },
    getSex() {
      api.getSelect('usersex').then(data => {
        if (data.success) {
          this.usersex = data.data.root
        } else {
          this.$message.error(data.message)
        }
      })
    },
    updateDept(data) {
      this.form.sys_dept__dept_name = data.sys_dept__dept_name
      this.form.sys_user__dept_id = data.sys_dept__dept_id
      this.selDeptVisible = false
      this.change()
    },
    updateDepts(data) {
      this.form.sys_dept__dept_name = data.map(d => { return d.sys_dept__dept_name }).join(';')
      this.form.sys_user__dept_id = data.map(d => { return d.sys_dept__dept_id }).join(';')
      this.change()
      this.selDeptVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.selDept{
  margin-top: -10vh;
}
</style>
