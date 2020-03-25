<template>
  <div class="login-container">
    <el-form ref="forgotForm" :model="forgotForm" class="login-form" auto-complete="off" label-position="left">
      <el-row>
        <el-col :span="3">
          <img src="https://avatars1.githubusercontent.com/u/1263359?s=200&v=4" class="image">
        </el-col>
        <el-col :span="20">
          <div class="title-container">
            <h3 class="title">
              {{ $t('route.forgotPassword') }}
            </h3>
            <lang-select class="set-language" />
          </div>
        </el-col>
      </el-row>

      <el-form-item prop="userName">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="userName"
          v-model="forgotForm.userName"
          :placeholder="$t('login.userNameOrEmail')"
          type="text"
          tabindex="1"
          auto-complete="off"
          @keyup.enter.native="handleSubmit"
        />
      </el-form-item>

      <el-button
        :disabled="isEmptyValue(forgotForm.userName)"
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleSubmit"
      >
        {{ $t('login.submit') }}
      </el-button>

      <el-button type="text" style="float: left" @click.native.prevent="pathRedirect('login')">
        {{ $t('login.title') }}
      </el-button>
    </el-form>
  </div>
</template>

<script>
import { loginMixin } from '@/views/login/loginMixin'

export default {
  name: 'ForgotPassword',
  mixins: [loginMixin],
  data() {
    return {
      forgotForm: {
        userName: ''
      },
      forgotRules: {
        userName: [{ required: true, trigger: 'blur' }]
      },
      loading: false
    }
  },
  methods: {
    handleSubmit() {
      if (!this.isEmptyValue(this.forgotForm.userName)) {
        this.loading = true
        this.$store.dispatch('forgotPassword', this.forgotForm.userName)
          .finally(() => {
            this.loading = false
          })
      }
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

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
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
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
<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
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
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 10px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
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

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
