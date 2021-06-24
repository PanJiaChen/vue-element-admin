<template>
  <div class="login-container">
    <div class="login-main">
      <div class="login-left">
        <!-- <img src="../../assets/login/left.jpg" class="img1"> -->
      </div>
      <div class="login-right">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
          <div class="title-container">
            <p>欢迎登录</p>
            <span>Welcome to login</span>
          </div>

          <el-form-item prop="username">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input
              ref="username"
              v-model="loginForm.username"
              placeholder="请输入用户名"
              name="username"
              type="text"
              tabindex="1"
              auto-complete="on"
            />
          </el-form-item>

          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="请输入用户密码"
              name="password"
              tabindex="2"
              auto-complete="on"
              @keyup.enter.native="handleLogin"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>

          <!-- <el-form-item prop="verification">
            <span class="svg-container">
              <svg-icon icon-class="guide" />
            </span>
            <el-input
              ref="verification"
              v-model="loginForm.verification"
              placeholder="请输入验证码"
              name="verification"
              type="text"
              tabindex="1"
              auto-complete="on"
            />
          </el-form-item> -->

          <div class="password-manage">
            <el-checkbox v-model="checked">记住密码</el-checkbox>
          </div>

          <el-button :loading="loading" type="primary" style="width:100%;margin-top:30px;" @click.native.prevent="handleLogin">登 录</el-button>

        <!-- <div class="tips">
            <span style="margin-right:20px;">username: admin</span>
            <span> password: any</span>
          </div> -->

        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else if (value.length < 3) {
        callback(new Error('密码不能少于3位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      redirect: undefined,
      otherQuery: {},
      checked: false
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
    this.loginForm.username = localStorage.getItem('UserName')
    this.loginForm.password = localStorage.getItem('Password')
    if (this.loginForm.username && this.loginForm.password) {
      this.checked = true
    }
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              if (this.checked) {
                localStorage.setItem('UserName', this.loginForm.username)
                localStorage.setItem('Password', this.loginForm.password)
              } else {
                localStorage.setItem('UserName', '')
                localStorage.setItem('Password', '')
              }
              this.$router.push({ path: '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#F6F6F6;
$light_gray:#fff;
$cursor: #000;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    height: 31px !important;
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  background-color: #F1F7FC !important;
  width:100%;
  height:100%;
  background-size:100% 100%;
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #000;
      height: 47px;
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid #c1c1c1;
    background:#F6F6F6;
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#fff;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container .login-form {
    background-color: #ffffff !important;
  }
.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  // background-image: url('../../assets/login/background.jpg');
  // background-image: url('../../assets/login/wangge.jpg');
  .login-main {
    width: 800px;
    height: 450px;
    display: flex;
    margin: 0 auto;
    transform: translate(-50%,-50%);
    position: absolute;
    top: 50%;
    left: 50%;
    .login-left {
      width: 400px;
      height: 450px;
      border-radius: 10px 0 0 10px;
      background-color: #1890ff;
      background-image: url('../../assets/login/left.png');
      background-size: 100%;
      background-repeat: no-repeat;
      background-position: 100% 80%;
      .img1 {
        width: 400px;
        height: 450px;
        // margin-left: 59px;
        // margin-top: 54px;
      }
    }
    .login-right {
      width: 400px;
      height: 450px;
      border-radius:0 10px  10px 0;
      padding: 20px 35px 20px;
      margin: 0 auto;
      background-color: #ffffff;
    }
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 0px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
    p {
      margin-bottom: 10px;
      font-size: 22px;
      color: #000;
    }
    span{
      font-size: 16px;
      color: #bdc2c7;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .header {
    background: $bg;
    padding: 8px 0;
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.16);
    img {
      width: 125px;
      height: 52px;
      margin-left: 230px;
    }
  }
  .password-manage {
    margin-bottom: 20px;
    transform: translate(0, -2px);
  }
  .el-input--mini {
    font-size: 16px
  }
  .el-button--primary {
    font-size: 18px;
    font-weight: bold;
    padding: 5px 10px;
  }
  .el-form-item {
    margin-bottom: 28px !important;
  }
  ::v-deep .el-form-item__error {
    margin-top: 6px;
  }
  ::v-deep .el-form-item__content {
    height: 38px;
  }
  .el-button--medium {
    border-radius: 10px;
  }
}
</style>
