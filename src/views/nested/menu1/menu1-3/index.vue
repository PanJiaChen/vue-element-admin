<template>
  <div style="padding:30px;">
    <el-input v-model="input" placeholder="placeholder" />
    <el-alert :closable="false" title="menu 1-3" type="success" />
  </div>
</template>

<script>
export default {
  /* eslint-disable-next-line */
  name: 'Menu1-3',
  data() {
    return {
      input: 'Menu1-3'
    }
  }
}
</script>
