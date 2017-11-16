<template>
  <el-breadcrumb class="app-levelbar" separator="/">
   <transition-group name="breadcrumb">
    <el-breadcrumb-item v-for="(item,index)  in levelList" :key="item.path" v-if='item.meta.title'>
      <span v-if='item.redirect==="noredirect"||index==levelList.length-1' class="no-redirect">{{generateTitle(item.meta.title)}}</span>
      <router-link v-else :to="item.redirect||item.path">{{generateTitle(item.meta.title)}}</router-link>
    </el-breadcrumb-item>
     </transition-group>
  </el-breadcrumb>
</template>

<script>
export default {
  created() {
    this.getBreadcrumb()
  },
  data() {
    return {
      levelList: null
    }
  },
  methods: {
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.name)
      if (matched.length === 0) {
        this.levelList = [{ path: '/', meta: { title: '首页' }}]
        return
      }
      const first = matched[0]
      if (first && first.name !== 'dashboard') {
        matched = [{ path: '/', meta: { title: 'dashboard' }}].concat(matched)
      }
      this.levelList = matched
    },
    generateTitle(title) {
      return this.$t('route.' + title)
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .app-levelbar.el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 50px;
    margin-left: 10px;
    .no-redirect {
      color: #97a8be;
      cursor: text;
    }
  }
</style>
