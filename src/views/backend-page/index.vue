<template>
  <div class="app-container">
    <el-card shadow="never">
      <div slot="header">
        <span>{{ title }}</span>
      </div>
      <p>当前菜单已接入现有后端动态菜单。</p>
      <p>路由：{{ $route.path }}</p>
      <p>组件映射：{{ componentKey }}</p>
      <p>该页面可继续替换为对应业务页面实现。</p>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'BackendPage',
  computed: {
    title() {
      return this.$route.meta && this.$route.meta.title ? this.$route.meta.title : '管理后台'
    },
    componentKey() {
      return this.$route.meta && this.$route.meta.componentKey ? this.$route.meta.componentKey : 'backend-placeholder'
    }
  }
}
</script>
