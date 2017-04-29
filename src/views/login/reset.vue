<template>
    <div class="reset-container">
        <el-form autoComplete="on" :model="resetForm" :rules="resetRules" ref="resetForm" label-position="left"
                 label-width="0px"
                 class="card-box reset-form">
            <div>
                <router-link to="/login" class="back-icon">
                    <i class="el-icon-arrow-left"></i>
                </router-link>
                <h3 class="title">重设密码</h3>
            </div>
            <el-form-item prop="email">
                <el-input name="email" type="text" v-model="resetForm.email"
                          placeholder="邮箱"></el-input>
            </el-form-item>
            <el-form-item prop="code">
                <el-input name="code" type="text" v-model="resetForm.code"
                          placeholder="验证码"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input name="password" :type="passwordType" v-model="resetForm.password"
                          placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item prop="checkPass">
                <el-input name="checkPass" :type="passwordType"
                          v-model="resetForm.checkPass"
                          placeholder="确认密码"></el-input>
                <i @click="togglePasswordType" class="el-icon-information"></i>
            </el-form-item>

            <el-form-item style="width:100%;">
                <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="setPWD">
                    修改密码
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import { isWscnEmail } from 'utils/validate';
    // import { restPWD } from 'api/login';

    export default {
      name: 'reset',
      data() {
        const validateEmail = (rule, value, callback) => {
          if (!isWscnEmail(value)) {
            callback(new Error('邮箱错误'));
          } else {
            callback();
          }
        };
        const validaePass = (rule, value, callback) => {
          if (value.length < 6) {
            callback(new Error('密码不能小于6位'));
          } else {
            callback();
          }
        };
        const validatePass2 = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请再次输入密码'));
          } else if (value !== this.resetForm.password) {
            callback(new Error('两次输入密码不一致!'));
          } else {
            callback();
          }
        };
        return {
          resetForm: {
            email: '',
            password: '',
            checkPass: '',
            code: ''
          },
          passwordType: 'password',
          resetRules: {
            email: [
                        { required: true, trigger: 'blur', validator: validateEmail }
            ],
            password: [
                        { required: true, trigger: 'blur', validator: validaePass }
            ],
            checkPass: [
                        { required: true, trigger: 'blur', validator: validatePass2 }
            ],
            code: [
                        { required: true, message: '必填项', trigger: 'blur' }
            ]
          },
          loading: false
        }
      },
      methods: {
        setPWD() {
          // this.loading = true;
          // const _this = this;
          // this.$refs.resetForm.validate(valid => {
          //   if (valid) {
          //     const data = {
          //       email: this.resetForm.email,
          //       code: this.resetForm.code,
          //       new_password: this.resetForm.checkPass
          //     };
          //     restPWD(data).then(() => {
          //       this.$message.success('密码设置成功,五秒后调整到登录页');
          //       setTimeout(() => {
          //         _this.$router.push({ path: '/login' })
          //       }, 5 * 1000)
          //     });
          //   } else {
          //     this.$message.error('error submit!!');
          //   }
          //   this.loading = false;
          // });
        },
        togglePasswordType() {
          if (this.passwordType === 'text') {
            this.passwordType = 'password'
          } else {
            this.passwordType = 'text'
          }
        }
      }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    @import "src/styles/mixin.scss";

    .reset-container {
        input:-webkit-autofill {
            -webkit-box-shadow: 0 0 0px 1000px #293444 inset !important;
            -webkit-text-fill-color: #3E3E3E !important;
         }
        @include relative;
        height: 100vh;
        background-color: #324057;
        .back-icon {
            float: left;
            margin-top: 5px;
        }
        .el-icon-information {
            position: absolute;
            right: -18px;
            top: 10px;
        }
        .reset-form {
            position: absolute;
            left: 0;
            right: 0;
            width: 350px;
            padding: 35px 35px 15px 35px;
            margin: 120px auto;
        }

        .card-box {
            padding: 20px;
            box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);
            -webkit-border-radius: 5px;
            border-radius: 5px;
            -moz-border-radius: 5px;
            background-clip: padding-box;
            margin-bottom: 20px;
            background-color: #F9FAFC;
            width: 400px;
            border: 2px solid #8492A6;
        }

        .title {
            margin: 0px auto 40px auto;
            text-align: center;
            color: #505458;
        }
    }

</style>
