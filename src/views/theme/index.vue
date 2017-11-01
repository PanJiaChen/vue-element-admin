<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header">
        <span style="line-height: 36px;">偏好设置</span>
        <a class='link-type link-title' target="_blank" href='https://segmentfault.com/a/1190000009762198#articleHeader2'>动态换肤的教程</a>
      </div>
      <div class="box-item">
        <span class="field-label">换肤:</span>
        <el-switch v-model="theme"></el-switch>
      </div>
    </el-card>

    <div class="block">
      <span class="demonstration">Button: </span>
      <span class="wrapper">
        <el-button type="success">成功按钮</el-button>
        <el-button type="warning">警告按钮</el-button>
        <el-button type="danger">危险按钮</el-button>
        <el-button type="info">信息按钮</el-button>
      </span>
    </div>

    <div class="block">
      <el-tag class='tag-item' v-for="tag in tags" :type="tag.type" :key='tag.type'>
        {{tag.name}}
      </el-tag>
    </div>

    <div class="block">
      <el-alert class='alert-item' title="成功提示的文案" type="success">
      </el-alert>
      <el-alert class='alert-item' title="消息提示的文案" type="info">
      </el-alert>
      <el-alert class='alert-item' title="警告提示的文案" type="warning">
      </el-alert>
      <el-alert class='alert-item' title="错误提示的文案" type="error">
      </el-alert>
    </div>

  </div>
</template>

<script>
import { toggleClass } from '@/utils'
// import '@/assets/custom-theme/index.css' // 换肤版本element-ui css

export default {
  name: 'theme',
  data() {
    return {
      theme: false,
      tags: [
        { name: 'Tag One', type: '' },
        { name: 'Tag Two', type: 'info' },
        { name: 'Tag Three', type: 'success' },
        { name: 'Tag Four', type: 'warning' },
        { name: 'Tag Five', type: 'danger' }
      ]
    }
  },
  watch: {
    theme() {
      toggleClass(document.body, 'custom-theme')
    }
  }
}
</script>

<style scoped>
  .box-card{
    width: 400px;
    margin: 20px auto;
  }
  .block{
    padding: 30px 24px;
  }
  .alert-item{
    margin-bottom: 10px;
  }
  .tag-item{
    margin-right: 15px;
  }
  .link-title{
    margin-left:35px;
  }
</style>
