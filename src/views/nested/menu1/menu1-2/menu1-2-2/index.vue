<template>
  <div style="padding:30px;">
    <el-input v-model="input" placeholder="placeholder" />
    <el-alert :closable="false" title="menu 1-2-2" type="warning" />
  </div>
</template>

<script>
export default {
  /* eslint-disable-next-line */
  name: 'Menu1-2-2',
  data() {
    return {
      input: 'Menu1-2-2'
    }
  }
}
</script>
