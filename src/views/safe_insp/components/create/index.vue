<template>
  <div>
    <el-card>
      <div class="buttons">
        <div class="buttons">
          <el-button type="primary" @click="create">新增</el-button>
          <el-button type="primary" @click="del">删除</el-button>
          <el-button type="primary" @click="save">保存</el-button>
          <el-button type="primary" @click="audit">提交</el-button>
          <el-button type="primary" @click="unaudit">反提交</el-button>
          <el-button type="primary" @click="upload">图文附件</el-button>
          <el-button type="primary" @click="back">返回列表</el-button>
        </div>
        <el-button type="primary" @click="back">返回列表</el-button>
      </div>
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <el-row>
          <el-col :span="7">
            <el-form-item label="巡检单编号">
              <el-input v-model="form.safe_insp__insp_code" maxlength="250" />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="巡检状态">
              <el-select v-model="form.safe_insp__insp_state" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.funall_control__value_data"
                  :label="item.funall_control__display_data"
                  :value="item.funall_control__value_data"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item ref="safe_insp__insp_name" label="巡检名称" prop="safe_insp__insp_name">
              <el-input v-model="form.safe_insp__insp_name" placeholder="请选择巡检名称" class="input-with-select" clearable>
                <el-button slot="append" icon="el-icon-search" maxlength="250" @click="inspNameVisible = !inspNameVisible" />
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <el-form-item label="巡检日期" prop="safe_insp__insp_date">
              <el-date-picker
                v-model="form.safe_insp__insp_date"
                type="date"
                placeholder="选择日期"
                style="width: 100%;"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item ref="safe_insp__insp_man" label="巡检人员" prop="safe_insp__insp_man">
              <el-input v-model="form.safe_insp__insp_man" placeholder="请选择巡检人员" class="input-with-select" clearable>
                <el-button slot="append" icon="el-icon-search" @click="selUserVisible = !selUserVisible" />
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="备注">
              <el-input v-model="form.safe_insp__insp_memo" maxlength="500" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <el-form-item ref="safe_insp__insp_times" label="巡检频率" prop="safe_insp__insp_times">
              <el-select v-model="form.safe_insp__insp_times" placeholder="请选择">
                <el-option
                  v-for="item in insptimes"
                  :key="item.funall_control__value_data"
                  :label="item.funall_control__display_data"
                  :value="item.funall_control__value_data"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <el-form-item label="已巡检数量">
              <el-input v-model="form.safe_insp__insp_ed" disabled="disabled" />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="待巡检数量">
              <el-input v-model="form.safe_insp__insp_ing" disabled="disabled" />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="不符合数量">
              <el-input v-model="form.safe_insp__insp_non" disabled="disabled" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <InspDet v-if="id" :id="id" />
    <el-dialog
      v-if="selUserVisible"
      title="选择人员"
      :visible.sync="selUserVisible"
      width="60%"
    >
      <SelUser ref="selUser" @updateUser="updateUser" />
      <span>
        <el-button @click="selUserVisible = false">取 消</el-button>
        <el-button type="primary" @click="selUser">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-if="inspNameVisible"
      title="选择巡检名称"
      :visible.sync="inspNameVisible"
      width="40%"
    >
      <InspName @updateInspName="updateInspName" />
      <!-- <span>
        <el-button type="primary" @click="inspNameVisible = false">取 消</el-button>
        <el-button type="primary" @click="inspNameVisible = false">确 定</el-button>
      </span> -->
    </el-dialog>
  </div>
</template>

<script>
import api from '../../api'
import publicApi from '@/api/public'
import InspDet from '../insp_det'
import SelUser from '@/components/selUser'
import InspName from '../inspName'
export default {
  name: 'AuditForm',
  components: {
    SelUser,
    InspDet,
    InspName
  },
  // props: {
  //   id: { type: String, default: () => '' }
  // },
  data() {
    return {
      form: {
        safe_insp__insp_code: '',
        safe_insp__insp_name: '',
        safe_insp__insp_state: '',
        safe_insp__insp_date: '',
        safe_insp__insp_man: '',
        safe_insp__insp_times: '',
        safe_insp__insp_memo: '',
        safe_insp__insp_ed: '',
        safe_insp__insp_ing: '',
        safe_insp__insp_non: '',
        safe_insp__insp_name_id: '',
        safe_insp__org_id: '',
        safe_insp__safe_insp_id: '',
        safe_insp__dept_id: '',
        safe_insp__insp_man_id: ''
      },
      rules: {
        safe_insp__insp_name: [
          { required: true, message: '请选择巡检名称', trigger: 'blur' }
        ],
        safe_insp__insp_man: [
          { required: true, message: '请选择巡检人员', trigger: 'blur' }
        ],
        safe_insp__insp_date: [
          { required: true, message: '请选择巡检日期', trigger: 'blur' }
        ],
        safe_insp__insp_times: [
          { required: true, message: '请选择巡检频率', trigger: 'blur' }
        ]
      },
      inspName: [],
      disabled: false,
      options: [],
      insptimes: [],
      selUserVisible: false,
      inspNameVisible: false,
      id: ''
    }
  },
  watch: {
    'form.safe_insp__insp_name': {
      handler(val, oldVal) {
        this.$refs['safe_insp__insp_name'].clearValidate()
      },
      deep: true
    },
    'form.safe_insp__insp_man': {
      handler(val, oldVal) {
        this.$refs['safe_insp__insp_man'].clearValidate()
      },
      deep: true
    },
    'form.safe_insp__insp_times': {
      handler(val, oldVal) {
        this.$refs['safe_insp__insp_times'].clearValidate()
      },
      deep: true
    }
  },
  created() {
    this.getTypeSel()
    this.getInsptimes()
  },
  methods: {
    getList() {
      api.getFormDate().then(data => {
        if (data.success) {
          this.form = data.data.root[0]
        } else {
          this.$message.error(data.message)
        }
      })
    },
    async getTypeSel() {
      await publicApi.getTypeSel('inspstate').then(data => {
        if (data.success) {
          this.options = data.data.root
        } else {
          this.$message.error(data.message)
        }
      })
    },
    async getInsptimes() {
      await publicApi.getTypeSel('insptimes').then(data => {
        if (data.success) {
          this.insptimes = data.data.root
        } else {
          this.$message.error(data.message)
        }
      })
    },
    onSubmit() {},
    updateUser(data) {
      this.form.safe_insp__insp_man = data.sys_user__user_name
      this.form.safe_insp__insp_man_id = data.sys_user__user_id
      this.selUserVisible = false
    },
    selUser() {
      this.updateUsers(this.$refs.selUser.Users)
      this.selUserVisible = false
    },
    updateUsers(data) {
      this.form.safe_insp__insp_man = data.map(d => { return d.sys_user__user_name }).join(';')
      this.form.safe_insp__insp_man_id = data.map(d => { return d.sys_user__user_id }).join(';')
      this.selUserVisible = false
    },
    updateInspName(data) {
      this.form.safe_insp__insp_name = data.insp_name__insp_name
      this.form.safe_insp__insp_name_id = data.insp_name__insp_name_id
      this.inspNameVisible = false
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          api.Crerte(this.form).then(data => {
            if (data.success) {
              this.$message.success('保存成功！')
              const param = `/insp/edit_form/audit/${data.data.keyid}`
              this.$router.push(param)
            } else {
              this.$message.error(data.message)
            }
          })
        }
      })
    },
    back() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push('/insp/safe_insp')
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
    padding: 10px 20px !important;
  }
::v-deep .el-form-item__label {
    text-align: right;
    /* vertical-align: middle; */
    float: left;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 6px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}
.el-col{
  margin-left: 2%;
}
.buttons {
  display: flex;
  margin-bottom:20px;
  .el-button--primary {
    margin-left: 10px;
    height: 26.8px;
  }
}
</style>
