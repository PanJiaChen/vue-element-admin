<template>
    <div class="app-container">
        <h1 class="page-heading">
            创建后台用户
        </h1>
        <el-form ref="createForm" :rules="createRules" label-position="left" style='width:80%' :model="form" label-width="100px">
            <el-form-item label="用户邮箱" prop="email">
                <el-input v-model="form.email" placeholder="公司邮箱"></el-input>
            </el-form-item>
            <el-form-item label="权限选择" >
                <el-select style="width: 100%" v-model="form.role" multiple placeholder="请选择">
                    <el-option
                            v-for="item in roleList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :loading="loading" @click.native.prevent="onSubmit">立即创建</el-button>
                <el-button>
                    <router-link class="normal_link" to="/index">
                        取消
                    </router-link>
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import { createNewUser, getRoleList } from 'api/adminUser';
    import { isWscnEmail } from 'utils/validate';

    export default{
      name: 'createUser',
      data() {
        const validateEmail = (rule, value, callback) => {
          if (!isWscnEmail(value)) {
            callback(new Error('邮箱错误'));
          } else {
            callback();
          }
        };
        return {
          roleList: [],
          loading: false,
          form: {
            email: '',
            role: ''
          },
          createRules: {
            email: [
                        { required: true, message: '请输入邮箱', trigger: 'blur' },
                        { validator: validateEmail }
            ]
          }
        };
      },
      methods: {
        onSubmit() {
          this.$refs.createForm.validate(valid => {
            if (valid) {
              this.loading = true;
              const data = {
                email: this.form.email,
                roles: this.form.role
              };
              createNewUser(data).then(() => {
                this.$message.success('创建成功');
              });
            } else {
              this.$message.error('error submit!!');
            }
            this.loading = false;
          });
        }
      },
      created() {
        getRoleList().then(response => {
          const roleMap = response.data.role_map;
          const keyArr = Object.keys(roleMap);
          this.roleList = keyArr.map(v => ({ value: v, label: roleMap[v] }));
        });
      }
    };
</script>
