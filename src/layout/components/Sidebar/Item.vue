<template>
  <el-row class="item-wrapper">
    <el-col :span="3">
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
  margin: 18px 23px 18px 0;
}

.item-title {
  margin: 0 0 0 7px;
}
</style>
