<template>
  <div v-if="verifyToken()" class="login-container">
    <el-form ref="changePasswordForm" :rules="passwordResetRules" :model="changePasswordForm" class="login-form" auto-complete="off" label-position="left">
      <el-row>
        <el-col :span="3">
          <img src="https://avatars1.githubusercontent.com/u/1263359?s=200&v=4" class="image">
        </el-col>
        <el-col :span="20">
          <div class="title-container">
            <h3 class="title">
              {{ $t(`login.${formName}`) }}
            </h3>
            <lang-select class="set-language" />
          </div>
        </el-col>
      </el-row>

      <el-tooltip v-model="capsTooltip" :content="$t('login.capsLock')" placement="right" auto-complete="off" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="changePasswordForm.password"
            :type="passwordType"
            :placeholder="$t('login.passwordNew')"
            tabindex="1"
            auto-complete="off"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>

      <el-tooltip v-model="capsTooltipNew" :content="$t('login.capsLock')" placement="right" manual>
        <el-form-item prop="passwordConfirm">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordConfirmType + 'New'"
            ref="passwordConfirm"
            v-model="changePasswordForm.passwordConfirm"
            :type="passwordConfirmType"
            :placeholder="$t('login.passwordConfirmNew')"
            tabindex="2"
            auto-complete="off"
            @keyup.native="checkCapslockNew"
            @blur="capsTooltipNew = false"
            @keyup.enter.native="handleSubmit"
          />
          <span class="show-pwd" @click="showPasswordConfirm">
            <svg-icon :icon-class="passwordConfirmType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>

      <el-button
        :disabled="isDisabled"
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
import { resetPasswordFromToken } from '@/api/ADempiere/enrollment'
import { showMessage } from '@/utils/ADempiere/notification'
import language from '@/lang'
import router from '@/router'
export default {
  name: 'ChangePassword',
  mixins: [loginMixin],
  data() {
    const validatePass = (rule, value, callback) => {
      if (this.isEmptyValue(value)) {
        callback(new Error(this.$t('notifications.fieldMandatory')))
      } else {
        callback()
      }
    }
    const validateNewPass = (rule, value, callback) => {
      if (this.isEmptyValue(value)) {
        callback(new Error(this.$t('notifications.fieldMandatory')))
      } else if (value !== this.changePasswordForm.password) {
        callback(new Error(this.$t('login.passwordAndConfirmNotMatch')))
      } else {
        callback()
      }
    }
    return {
      changePasswordForm: {
        password: '',
        passwordConfirm: ''
      },
      passwordResetRules: {
        password: [{ validator: validatePass, trigger: 'blur' }],
        passwordConfirm: [{ validator: validateNewPass, trigger: 'blur' }]
      },
      loading: false,
      passwordType: 'password',
      passwordConfirmType: 'password',
      capsTooltip: false,
      capsTooltipNew: false
    }
  },
  computed: {
    formName() {
      return this.$route.name
    },
    isDisabled() {
      if (this.isEmptyValue(this.changePasswordForm.password)) {
        return true
      }
      if (this.changePasswordForm.password !== this.changePasswordForm.passwordConfirm) {
        return true
      }
      return false
    }
  },
  methods: {
    checkCapslock({ shiftKey, key } = {}, isNew = false) {
      let capsLock = false
      if (key && key.length === 1) {
        if (shiftKey && (key >= 'a' && key <= 'z') || !shiftKey && (key >= 'A' && key <= 'Z')) {
          capsLock = true
        } else {
          capsLock = false
        }
      }
      if (key === 'CapsLock' && capsLock === true) {
        capsLock = false
      }
      if (isNew) {
        this.capsTooltipNew = capsLock
      } else {
        this.capsTooltip = capsLock
      }
    },
    checkCapslockNew({ shiftKey, key } = {}, isNew = true) {
      this.checkCapslock({ shiftKey, key }, true)
    },
    showPasswordConfirm() {
      if (this.passwordConfirmType === 'password') {
        this.passwordConfirmType = ''
      } else {
        this.passwordConfirmType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.passwordConfirm.focus()
      })
    },
    handleSubmit() {
      if (!this.isEmptyValue(this.changePasswordForm.password) && !this.isEmptyValue(this.changePasswordForm.passwordConfirm)) {
        this.loading = true
        this.createPasswordFromToken({
          token: this.$route.query.token,
          password: this.changePasswordForm.password
        })
      }
    },
    createPasswordFromToken({
      token,
      password
    }) {
      resetPasswordFromToken({
        token: token,
        password: password
      })
        .then(createPasswordResponse => {
          if (createPasswordResponse.responseTypeStatus === 'OK') {
            showMessage({
              message: language.t('login.createPasswordSuccessful'),
              type: 'success'
            })
          } else {
            showMessage({
              message: language.t('login.unexpectedError'),
              type: 'error'
            })
          }
          router.push({
            path: 'login'
          })
        })
        .catch(error => {
          showMessage({
            message: language.t('login.unexpectedError'),
            type: 'error'
          })
          console.warn(`Create Password - Error ${error.code}: ${error.message}`)
        })
        .finally(this.loading = false)
    },
    verifyToken() {
      if (this.$route.query && this.$route.query.token && !this.isEmptyValue(this.$route.query.token)) {
        return true
      }
      this.$message.error(this.$t('login.invalidToken'))
      this.$router.push({
        path: 'login'
      })
      return false
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
