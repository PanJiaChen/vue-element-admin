<template>
  <el-row class="item-wrapper">
    <el-col :span="3" :style="iconMargin">
      <i v-if="icon.includes('el-icon')" class="icon sub-el-icon" />
      <svg-icon v-else :icon-class="icon" />
    </el-col>
    <el-col :span="21">
      <p class="item-title">{{ title }}</p>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'MenuItem',
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    addMargin: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    iconMargin() {
      if (this.addMargin) {
        return 'margin-left: -20px;'
      }
      return ''
    }
  }
}
</script>

<style scoped>
  .sub-el-icon {
    width: 1em;
    height: 1em;
  }

  .item-wrapper {
    white-space: break-spaces;
    line-height: 20px;
    height: auto;
    padding: 18px 23px 18px 0;
  }

  .item-title {
    margin: 0 0 0 7px;
  }
</style>

<style>
  .el-row::before {
    display: block;
    height: 0;
  }

  .el-row::after {
    display: block;
    height: 0;
  }
</style>
