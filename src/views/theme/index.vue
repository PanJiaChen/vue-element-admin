<template>
  <div class="app-container">
    <code>会补动态换肤的教程</code>
    <el-card class="box-card">
      <div slot="header">
        <span style="line-height: 36px;">偏好设置</span>
      </div>

      <div class="box-item">
        <span class="field-label">换肤:</span>
        <el-switch v-model="theme" on-text="" off-text="">
        </el-switch>
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
import { toggleClass } from 'utils';

export default {
  data() {
    return {
      theme: false,
      tags: [
          { name: '标签一', type: '' },
          { name: '标签二', type: 'gray' },
          { name: '标签三', type: 'primary' },
          { name: '标签四', type: 'success' },
          { name: '标签五', type: 'warning' },
          { name: '标签六', type: 'danger' }
      ],
      inputVisible: false,
      inputValue: ''
    }
  },
  watch: {
    theme() {
      toggleClass(document.body, 'custom-theme')
        //   this.$store.dispatch('setTheme', value);
    }
  }
};
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
</style>
