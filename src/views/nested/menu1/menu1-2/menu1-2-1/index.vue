<template>
  <div style="padding:30px;">
    <el-alert :closable="false" title="menu 1-2-1" type="warning">
      <el-input key="Menu121" v-model="input" />
    </el-alert>
  </div>
</template>

<script>
export default {
  name: 'Menu121',
  data() {
    return {
      input: ''
    }
  }
}
</script>
