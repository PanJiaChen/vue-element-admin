<template>
  <div style="padding:30px;">
    <el-alert :closable="false" title="menu 1-2" type="success">
      <el-input v-model="input" placeholder="placeholder" />
      <router-view />
    </el-alert>
  </div>
</template>

<script>
export default {
  /* eslint-disable-next-line */
  name: 'Menu1-2',
  data() {
    return {
      input: 'Menu1-2'
    }
  }
}
</script>
