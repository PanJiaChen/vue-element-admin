<template>
  <div>
    <el-card>
      <div class="buttons">
        <buttons funid="safe_insp" style="margin-bottom:20px" @save="save" />
        <el-button type="primary" @click="back">返回列表</el-button>
      </div>
      <el-form ref="form" :model="form" label-width="80px">
        <el-row>
          <el-col :span="7">
            <el-form-item label="巡检单编号">
              <el-input v-model="form.safe_insp__insp_code" />
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
            <el-form-item label="巡检名称">
              <el-input v-model="form.safe_insp__insp_name" maxlength="250" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <el-form-item label="巡检日期">
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
            <el-form-item label="巡检人员">
              <el-input v-model="form.safe_insp__insp_man" placeholder="请输入内容" class="input-with-select" clearable>
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
            <el-form-item label="巡检频率">
              <el-input v-model="form.safe_insp__insp_times" />
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
    <InspDet :id="id" />
    <el-dialog
      v-if="selUserVisible"
      title="选择人员"
      :visible.sync="selUserVisible"
      width="60%"
    >
      <SelUser @updateUsers="updateUsers" @updateUser="updateUser" />
      <span>
        <el-button @click="selUserVisible = false">取 消</el-button>
        <el-button type="primary" @click="selUserVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '../../api'
import publicApi from '@/api/public'
import buttons from '@/components/formBtn'
import InspDet from '../insp_det'
import SelUser from '@/components/selUser'
export default {
  name: 'EditForm',
  components: {
    buttons,
    SelUser,
    InspDet
  },
  // props: {
  //   id: { type: String, default: () => '' }
  // },
  data() {
    return {
      form: {},
      id: this.$route.params.id,
      disabled: false,
      options: [],
      selUserVisible: false
    }
  },
  created() {
    console.log(this.id)
    this.getList()
    this.getTypeSel()
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
    async getTypeSel() {
      await publicApi.getTypeSel('insptimes').then(data => {
        if (data.success) {
          this.options = data.data.root
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
    updateUsers(data) {
      this.form.safe_insp__insp_man = data.map(d => { return d.sys_user__user_name }).join(';')
      this.form.safe_insp__insp_man_id = data.map(d => { return d.sys_user__user_id }).join(';')
    },
    save() {
      api.Save(this.form).then(data => {
        if (data.success) {
          this.$message.success('保存成功！')
        } else {
          this.$message.error(data.message)
        }
      })
    },
    back() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push('/hidden_danger/hidden_check')
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
  .el-button--primary {
    margin-left: 10px;
    height: 26.8px;
  }
}
</style>
