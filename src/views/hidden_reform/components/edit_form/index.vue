<template>
  <div>
    <el-card>
      <div class="buttons">
        <el-button type="primary" @click="audit">提交</el-button>
        <el-button type="primary" @click="unaudit">反提交</el-button>
        <el-button type="primary" @click="upload">图文附件</el-button>
        <el-button type="primary" @click="back">返回列表</el-button>
      </div>
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <div class="classify">
          <div class="classify-title">|  <span>隐患排查</span></div>
        </div>
        <el-row>
          <el-col :span="8">
            <el-form-item label="隐患编号">
              <el-input v-model="form.hidden_danger__hidden_code" :disabled="!disabled" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="巡检状态">
              <el-select v-model="form.hidden_danger__hidden_state" placeholder="请选择" :disabled="!disabled">
                <el-option
                  v-for="item in hiddenState"
                  :key="item.funall_control__value_data"
                  :label="item.funall_control__display_data"
                  :value="item.funall_control__value_data"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="检查人">
              <el-input v-model="form.hidden_danger__check_man" placeholder="请选择检查人" class="input-with-select" clearable :disabled="!disabled">
                <el-button slot="append" icon="el-icon-search" @click="checkManVisible = !checkManVisible" />
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="检查部门">
              <el-input v-model="form.hidden_danger__check_dept" placeholder="请选择检查部门" class="input-with-select" clearable :disabled="!disabled">
                <el-button slot="append" icon="el-icon-search" @click="checkDeptVisible = !checkDeptVisible" />
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="检查时间">
              <el-date-picker
                v-model="form.hidden_danger__check_date"
                type="date"
                placeholder="选择日期"
                style="width: 100%;"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                :disabled="!disabled"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="检查地点">
              <el-input v-model="form.hidden_danger__check_location" :disabled="!disabled" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="检查内容">
              <el-input v-model="form.hidden_danger__check_content" type="textarea" :disabled="!disabled" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="隐患描述" prop="hidden_danger__check_problem">
              <el-input v-model="form.hidden_danger__check_problem" type="textarea" :disabled="!disabled" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="整改人">
              <el-input v-model="form.hidden_danger__reform_man" placeholder="请选择整改人" class="input-with-select" clearable :disabled="!disabled">
                <el-button slot="append" icon="el-icon-search" @click="reformManVisible = !reformManVisible" />
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="整改部门">
              <el-input v-model="form.hidden_danger__reform_dept" placeholder="请选择检查部门" class="input-with-select" clearable :disabled="!disabled">
                <el-button slot="append" icon="el-icon-search" @click="reformDeptVisible = !reformDeptVisible" />
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="整改期限">
              <el-date-picker
                v-model="form.hidden_danger__reform_limit"
                type="date"
                placeholder="选择日期"
                style="width: 100%;"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                :disabled="!disabled"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <div class="classify">
          <div class="classify-title">
            | <span>隐患整改</span>
          </div>
        </div>
        <el-row>
          <el-col :span="8">
            <el-form-item label="整改时间" prop="hidden_danger__reform_date">
              <el-date-picker
                v-model="form.hidden_danger__reform_date"
                type="date"
                placeholder="选择日期"
                style="width: 100%;"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="投入费用">
              <el-input v-model="form.hidden_danger__reform_money" placeholder="请输入安全投入费用" class="input-with-select" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="整改情况">
              <el-input v-model="form.hidden_danger__reform_desc" placeholder="请输入整改情况" class="input-with-select" type="textarea" clearable maxlength="500" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-row>
      <el-col class="img" :span="12">
        <ShowImages :data-id="id" table-name="hidden_danger" fun-id="hidden_check" title="隐患排查图片" />
      </el-col>
      <el-col class="img" :span="12">
        <ShowImages :data-id="id" table-name="hidden_danger" fun-id="hidden_reform" title="隐患整改图片" />
      </el-col>
    </el-row>
    <el-dialog
      v-if="checkManVisible"
      title="选择人员"
      :visible.sync="checkManVisible"
      width="60%"
    >
      <SelUser ref="CheckMan" @updateUser="getCheckMan" />
      <span>
        <el-button @click="checkManVisible = false">取 消</el-button>
        <el-button type="primary" @click="selCheckMan">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-if="reformManVisible"
      title="选择人员"
      :visible.sync="reformManVisible"
      width="60%"
    >
      <SelUser ref="ReformMan" @updateUser="getReformMan" />
      <span>
        <el-button @click="reformManVisible = false">取 消</el-button>
        <el-button type="primary" @click="selReformMan">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-if="checkDeptVisible"
      class="selDept"
      title="选择部门"
      :visible.sync="checkDeptVisible"
      width="60%"
      :modal="false"
    >
      <SelDept ref="CheckDept" @updateDept="getCheckDept" />
      <span>
        <el-button @click="checkDeptVisible = false">取 消</el-button>
        <el-button type="primary" @click="selCheckDept">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      v-if="reformDeptVisible"
      class="selDept"
      title="选择部门"
      :visible.sync="reformDeptVisible"
      width="60%"
      :modal="false"
    >
      <SelDept ref="ReformDept" @updateDept="getReformDept" />
      <span>
        <el-button @click="reformDeptVisible = false">取 消</el-button>
        <el-button type="primary" @click="selReformDept">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog v-if="dialogUploadVisible" title="附件" :visible.sync="dialogUploadVisible" width="35%" @close="closeUploadDialog">
      <Attach ref="attach" :data-id="[id]" table-name="hidden_danger" fun-id="hidden_check" />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogUploadVisible = false">返回</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '../../api'
import publicApi from '@/api/public'
import SelUser from '@/components/selUser'
import SelDept from '@/components/selDept'
import ShowImages from '@/components/show_images'
import Attach from '@/components/sys_attach'
export default {
  name: 'HiddenReformAuditForm',
  components: {
    SelUser,
    SelDept,
    ShowImages,
    Attach
  },
  // props: {
  //   id: { type: String, default: () => '' }
  // },
  data() {
    return {
      id: this.$route.params.id,
      form: {
        hidden_danger__hidden_code: '',
        hidden_danger__hidden_state: '',
        hidden_danger__check_man: '',
        hidden_danger__check_dept: '',
        hidden_danger__check_date: '',
        hidden_danger__check_location: '',
        hidden_danger__check_content: '',
        hidden_danger__check_problem: '',
        hidden_danger__reform_man: '',
        hidden_danger__reform_dept: '',
        hidden_danger__reform_limit: '',
        hidden_danger__check_photo: '',
        hidden_danger__more_flag: '',
        hidden_danger__reform_date: '',
        hidden_danger__reform_money: '',
        hidden_danger__reform_desc: '',
        hidden_danger__reform_photo: '',
        hidden_danger__safe_insp_id: '',
        hidden_danger__reform_man_id: '',
        hidden_danger__org_id: '',
        hidden_danger__reform_dept_id: '',
        hidden_danger__insp_det_id: '',
        hidden_danger__hidden_danger_id: '',
        hidden_danger__dept_id: '',
        hidden_danger__check_man_id: '',
        hidden_danger__check_dept_id: ''
      },
      rules: {
        hidden_danger__reform_date: [
          { required: true, message: '请选择整改时间', trigger: 'blur' }
        ]
      },
      inspName: [],
      disabled: false,
      options: [],
      checkManVisible: false,
      reformManVisible: false,
      checkDeptVisible: false,
      reformDeptVisible: false,
      dialogUploadVisible: false,
      hiddenState: []
    }
  },
  created() {
    this.getList()
    this.getHiddenState()
  },
  methods: {
    getList() {
      api.getFormDate(this.id).then(data => {
        if (data.success) {
          this.form = data.data.root[0]
        } else {
          this.$message.error(data.message)
        }
      })
    },
    async getHiddenState() {
      await publicApi.getTypeSel('hiddenstate').then(data => {
        if (data.success) {
          this.hiddenState = data.data.root
        } else {
          this.$message.error(data.message)
        }
      })
    },
    audit() {},
    unaudit() {},
    upload() {
      this.dialogUploadVisible = true
    },
    closeUploadDialog() {
      this.dialogUploadVisible = false
    },
    onSubmit() {},
    getCheckMan(data) {
      this.form.hidden_danger__check_man = data.sys_user__user_name
      this.form.hidden_danger__check_man_id = data.sys_user__user_id
      this.form.hidden_danger__check_dept = data.sys_dept__dept_name
      this.form.hidden_danger__check_dept_id = data.sys_user__dept_id
      this.checkManVisible = false
    },
    selCheckMan() {
      this.getCheckMans(this.$refs.CheckMan.Users)
      this.checkManVisible = false
    },
    getCheckMans(data) {
      this.form.hidden_danger__check_man = data.map(d => { return d.sys_user__user_name }).join(';')
      this.form.hidden_danger__check_man_id = data.map(d => { return d.sys_user__user_id }).join(';')
      this.form.hidden_danger__check_dept = data.map(d => { return d.sys_dept__dept_name }).join(';')
      this.form.hidden_danger__check_dept_id = data.map(d => { return d.sys_user__dept_id }).join(';')
      this.checkManVisible = false
    },
    getReformMan(data) {
      this.form.hidden_danger__reform_man = data.sys_user__user_name
      this.form.hidden_danger__reform_man_id = data.sys_user__user_id
      this.form.hidden_danger__reform_dept = data.sys_dept__dept_name
      this.form.hidden_danger__reform_dept_id = data.sys_user__dept_id
      this.reformManVisible = false
    },
    selReformMan() {
      this.getReformMans(this.$refs.ReformMan.Users)
      this.reformManVisible = false
    },
    getReformMans(data) {
      this.form.hidden_danger__reform_man = data.map(d => { return d.sys_user__user_name }).join(';')
      this.form.hidden_danger__reform_man_id = data.map(d => { return d.sys_user__user_id }).join(';')
      this.form.hidden_danger__reform_dept = data.map(d => { return d.sys_dept__dept_name }).join(';')
      this.form.hidden_danger__reform_dept_id = data.map(d => { return d.sys_user__dept_id }).join(';')
      this.reformManVisible = false
    },
    getCheckDept(data) {
      this.form.hidden_danger__check_dept = data.sys_dept__dept_name
      this.form.hidden_danger__check_dept_id = data.sys_dept__dept_id
      this.checkDeptVisible = false
    },
    selCheckDept() {
      this.CheckDepts(this.$refs.CheckDept.Dpets)
    },
    CheckDepts(data) {
      this.form.hidden_danger__check_dept = data.map(d => { return d.sys_dept__dept_name }).join(';')
      this.form.hidden_danger__check_dept_id = data.map(d => { return d.sys_dept__dept_id }).join(';')
      this.checkDeptVisible = false
    },
    getReformDept(data) {
      this.form.hidden_danger__reform_dept = data.sys_dept__dept_name
      this.form.hidden_danger__reform_dept_id = data.sys_dept__dept_id
      this.reformDeptVisible = false
    },
    selReformDept() {
      this.ReformDepts(this.$refs.ReformDept.Dpets)
    },
    ReformDepts(data) {
      this.form.hidden_danger__reform_dept = data.map(d => { return d.sys_dept__dept_name }).join(';')
      this.form.hidden_danger__reform_dept_id = data.map(d => { return d.sys_dept__dept_id }).join(';')
      this.reformDeptVisible = false
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          api.Save(this.form).then(data => {
            if (data.success) {
              this.$message.success('保存成功！')
              // const param = `/insp/edit_form/audit/${data.data.keyid}`
              // this.$router__push(param)
            } else {
              this.$message.error(data.message)
            }
          })
        }
      })
    },
    back() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push('/hidden_danger/hidden_reform')
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
.buttons {
  display: flex;
  margin-bottom: 20px;
  .el-button--primary {
    margin-left: 10px;
    height: 26.8px;
  }
}
.classify{
  width: 100%;
  // display: inline-block;
  padding: 10px 0;
  font-weight: bold;
  color: #1890ff;
  span{
    color: #000;
  }
}
</style>
