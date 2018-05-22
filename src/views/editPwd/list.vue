<template>
  <div class="app-container">
    <el-form ref="form" label-width="120px">
      <el-form-item label="原密码：">
        <el-input v-model="oldPwd" clearable type="password"></el-input>
      </el-form-item>
      <el-form-item label="新密码：">
        <el-input v-model="newPwd" clearable type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">修改密码</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { editPwd } from '@/api/login'
import { Message } from 'element-ui'

export default {
  data() {
    return {
      oldPwd:'',
      newPwd:''
    }
  },
  methods: {
    onSubmit() {
      if (!this.oldPwd) {
        Message({
          message: '请输入原密码',
          type: 'error',
          duration: 3 * 1000
        })
        return;
      }
      if (!this.newPwd) {
        Message({
          message: '请输入新密码',
          type: 'error',
          duration: 3 * 1000
        })
        return;
      }
      editPwd(this.oldPwd, this.newPwd).then(res => {
        if (res.code == 10000) {
          Message({
            message: '原密码输入有误，请重试',
            type: 'error',
            duration: 3 * 1000
          })
          return;
        }
        if (res.code != 0) {
          Message({
            message: res.msg,
            type: 'error',
            duration: 3 * 1000
          })
          return;
        } else {
          Message({
            message: '修改成功',
            type: 'success',
            duration: 1 * 1000,
            onClose: () => {
              this.$router.push({ path: '/' })
            }
          })
        }
      }).catch(e => {
        console.error(e);
      })
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

