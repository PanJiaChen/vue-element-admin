<template>
  <div style="padding:30px;">
    <el-input v-model="input" placeholder="placeholder" />
    <el-alert :closable="false" title="menu 1-1" type="success">
      <router-view />
    </el-alert>
  </div>
</template>

<script>
export default {
  /* eslint-disable-next-line */
  name: 'Menu1-1',
  data() {
    return {
      input: 'Menu1-1'
    }
  }
}
</script>
