<template>
  <div class="login-container">
    <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
      <h3 class="title">api工厂独立后台(beta)</h3>
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="手机号码" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"></svg-icon>
        </span>
        <el-input name="password" :type="pwdType" v-model="loginForm.password" autoComplete="on"
          placeholder="登录密码"></el-input>
          <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span>
      </el-form-item>
      <el-form-item prop="imgcode" style='position:relative;'>
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="picture" />
        </span>
        <el-input name="imgcode" type="text" @keyup.enter.native="handleLogin" autoComplete="on" placeholder="验证码" v-model="loginForm.imgcode" />
        <img class='random' style='position:absolute;right:10px; top:5px;width:80px;height:40px' @click='changeRandom' />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
          登录
        </el-button>
      </el-form-item>
      <div class="tips">
        <span style="margin-right:20px;">
          <router-link to="/register">开通新后台</router-link>
        </span>
        <span>
          <router-link to="/resetpwd">忘记密码?</router-link>
        </span>
      </div>
    </el-form>
  </div>
</template>

<script>

import { login_mobile, logout, getInfo } from '@/api/login'
import { Message, MessageBox } from 'element-ui'
import { setToken } from '@/utils/auth'

export default {
  name: 'login',
  data() {

    const validateImgCode = (rule, value, callback) => {
      if (1*value != value) {
        callback(new Error('请正确输入验证码'))
        return;
      } else if (value.length != 4) {
        callback(new Error('验证码长度为4位'))
        return;
      } else {
        callback()
        return;
      }
    }

    return {
      loginForm: {
        username: '',
        password: '',
        picKey:'',
        imgcode:''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message:'不能为空' }],
        password: [{ required: true, trigger: 'blur', message:'不能为空' }],
        imgcode: [{ required: true, trigger: 'blur', validator:validateImgCode, message:'不能为空' }],
      },
      loading: false,
      pwdType: 'password'
    }
  },
  mounted() {
    this.changeRandom()
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          login_mobile(this.loginForm.username, this.loginForm.password, '', this.loginForm.imgcode, this.loginForm.picKey).then((res) => {
            this.loading = false
            if (res.code == 300) {
              this.changeRandom()
              Message({
                message: '验证码错误',
                type: 'error',
                duration: 3 * 1000
              })
              return;
            }
            if (res.code == 10000) {
              this.changeRandom()
              Message({
                message: '请输入正确的手机号码',
                type: 'error',
                duration: 3 * 1000
              })
              return;
            }
            if (res.code == 100) {
              this.changeRandom()
              Message({
                message: '密码次数过多，该账号已被锁定',
                type: 'error',
                duration: 3 * 1000
              })
              return;
            }
            if (res.code == 404) {
              this.changeRandom()
              Message({
                message: '手机号码或密码错误',
                type: 'error',
                duration: 3 * 1000
              })
              return;
            }
            if (res.code == 20000) {
              this.changeRandom()
              Message({
                message: '当前用户状态有误',
                type: 'error',
                duration: 3 * 1000
              })
              return;
            }
            Message({
              message: '登录成功',
              type: 'success',
              duration: 1 * 1000,
              onClose: () => {
                setToken(res.data);
                this.$router.push({ path: '/' })
              }
            })
          }).catch((err) => {
            console.log(err);
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    changeRandom() {
      this.loginForm.picKey = Math.random();
      (document.getElementsByClassName('random'))[0].setAttribute('src', process.env.BASE_API + '/code?k=' + this.loginForm.picKey)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;

/* reset element-ui css */
.login-container {
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
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
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
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
