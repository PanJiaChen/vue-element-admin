<template>
  <div style="padding:30px;">
    <el-alert :closable="false" title="menu 1">
      <el-input v-model="input" placeholder="placeholder" />
      <router-view />
    </el-alert>
  </div>
</template>

<script>
export default {
  name: 'Menu1',
  data() {
    return {
      input: 'Menu1'
    }
  },
  created() {
    const route = this.$route.matched.find(item => item.name === 'Menu1')
    this.$store.dispatch('tagsView/addCachedView', route)
  }
}
</script>
