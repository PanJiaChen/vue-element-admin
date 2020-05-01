<template>
  <el-color-picker
    v-model="theme"
    :predefine="['#409EFF', '#1890ff', '#304156','#212121','#11a983', '#13c2c2', '#6959CD', '#f5222d', ]"
    class="theme-picker"
    popper-class="theme-picker-dropdown"
  />
</template>

<script>
// const version = require('element-ui/package.json').version // element-ui version from node_modules
// const ORIGINAL_THEME = '#409EFF' // default color
import client from 'webpack-theme-color-replacer/client'
import forElementUI from 'webpack-theme-color-replacer/forElementUI'

export default {
  data() {
    return {
      theme: this.$store.state.settings.theme
    }
  },
  watch: {
    theme(val) {
      const $message = this.$message({
        message: '  Compiling the theme',
        customClass: 'theme-message',
        type: 'success',
        duration: 0,
        iconClass: 'el-icon-loading'
      })
      const options = {
        newColors: forElementUI.getElementUISeries(val)
      }
      client.changer.changeColor(options, Promise).finally(() => $message.close())
    }
  }
}
</script>

<style>
  .theme-message,
  .theme-picker-dropdown {
    z-index: 99999 !important;
  }

  .theme-picker .el-color-picker__trigger {
    height: 26px !important;
    width: 26px !important;
    padding: 2px;
  }

  .theme-picker-dropdown .el-color-dropdown__link-btn {
    display: none;
  }
</style>
