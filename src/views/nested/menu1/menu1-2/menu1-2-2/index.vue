<template>
  <div style="padding:30px;">
    <el-alert :closable="false" title="menu 1-2-2" type="warning">
      <el-input key="Menu122" v-model="input" />
    </el-alert>
  </div>
</template>

<script>
export default {
  name: 'Menu122',
  data() {
    return {
      input: ''
    }
  }
}
</script>
