<template>
  <el-breadcrumb class="app-levelbar" separator="/">
    <el-breadcrumb-item v-for="(item,index)  in levelList" :key="item">
      <router-link v-if='item.redirect==="noredirect"||index==levelList.length-1' to="" class="no-redirect">{{item.name}}</router-link>
      <router-link v-else :to="item.path">{{item.name}}</router-link>
    </el-breadcrumb-item>
    <router-link class="view-tabs" v-for="tag in Array.from(visitedViews)" :to="tag.path" :key="tag.path">
      <el-tag :closable="true" @close='closeViewTabs(tag,$event)'>
        {{tag.name}}
      </el-tag>
    </router-link>
  </el-breadcrumb>
</template>

<script>

    export default {
      created() {
        this.getBreadcrumb()
      },
      computed: {
        visitedViews() {
          return this.$store.state.app.visitedViews.slice(-6)
        }
      },
      data() {
        return {
          levelList: null
        }
      },
      methods: {
        getBreadcrumb() {
          let matched = this.$route.matched.filter(item => item.name);
          const first = matched[0];
          if (first && (first.name !== '首页' || first.path !== '')) {
            matched = [{ name: '首页', path: '/' }].concat(matched)
          }
          this.levelList = matched;
        },
        closeViewTabs(view, $event) {
          this.$store.dispatch('delVisitedViews', view)
          $event.preventDefault()
        },
        addViewTabs() {
          this.$store.dispatch('addVisitedViews', this.$route.matched[this.$route.matched.length - 1])
        }
      },
      watch: {
        $route() {
          this.addViewTabs();
          this.getBreadcrumb();
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
        .no-redirect{
          color: #97a8be;
          cursor:text;
        }
    }
    .view-tabs{
      margin-left: 10px;
    }
</style>
