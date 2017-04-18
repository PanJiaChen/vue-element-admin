<template>
    <div class="fedUser-info-container">
        <el-button type="success" v-if="hasPermission" style='position: absolute; top: 20px;left: 50%'
                   @click="updateForm">更新
        </el-button>
        <el-form style="margin:0 50px;width: 400px" label-position="left"
                 label-width="100px">
            <el-form-item label="昵称">
                <el-input v-model="form.base_info.display_name"></el-input>
            </el-form-item>

            <el-form-item label="密码">
                <el-input v-model="form.base_info.new_password"></el-input>
            </el-form-item>

            <el-form-item label="邮箱">
                <el-input v-model="form.base_info.email"></el-input>
            </el-form-item>

            <el-form-item label="手机号">
                <el-input v-model="form.base_info.mobile"></el-input>
            </el-form-item>

            <el-form-item label="真实姓名">
                <el-input v-model="form.extented_info.real_name"></el-input>
            </el-form-item>

            <el-form-item label="生日">
                <el-input v-model="form.extented_info.birthday"></el-input>
            </el-form-item>

            <el-form-item label="性别">
                <el-select v-model="form.base_info.gender" placeholder="请选择">
                    <el-option
                            v-for="item in genderOptions"
                            :key="item"
                            :label="item"
                            :value="item">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="教育背景">
                <el-select v-model="form.extented_info.education" placeholder="请选择">
                    <el-option
                            v-for="item in educationOptions"
                            :key="item"
                            :label="item"
                            :value="item">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="收入">
                <el-select v-model="form.extented_info.income" placeholder="请选择">
                    <el-option
                            v-for="item in incomeOptions"
                            :key="item"
                            :label="item"
                            :value="item">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="自我介绍">
                <el-input
                        type="textarea"
                        :autosize="{ minRows: 4}"
                        placeholder="请输入内容"
                        v-model=" form.extented_info.introduction">
                </el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import { updateUserInfo } from 'api/user';
    export default {
      name: 'fedUser-info',
      props: ['info'],

      data() {
        return {
          genderOptions: ['male', 'female', 'other'],
          educationOptions: ['high_school', 'bachelor', 'master', 'Ph.D.', 'other'],
          incomeOptions: ['3000', '5000', '8000', 'other']
        }
      },
      computed: {
        form() {
          return this.info
        },
        hasPermission() {
          return ~this.$store.getters.roles.indexOf('admin')
        }
      },
      methods: {
        updateForm() {
          updateUserInfo(this.form).then(() => {
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success'
            });
          }).catch(err => {
            console.log(err);
          });
        }
      }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .fedUser-detail-container {

    }
</style>
