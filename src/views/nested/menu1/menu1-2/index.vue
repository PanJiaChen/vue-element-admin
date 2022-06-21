<template>
  <div style="padding:30px;">
    <el-alert :closable="false" title="menu 1-2" type="success">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </el-alert>
  </div>
</template>

<script>
export default {
  name: 'Menu12',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    }
  }
}
</script>
