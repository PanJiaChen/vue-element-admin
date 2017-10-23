<template>
  <div class='tabs-view-container'>
    <router-link class="tabs-view-item"  :class="isActive(tag.path)?'active':''"  v-for="tag in Array.from(visitedViews)" :to="tag.path" :key="tag.path">
        {{tag.name}}
        <span class='el-icon-close' @click='closeViewTabs(tag,$event)'></span>
    </router-link>
  </div>
</template>

<script>
export default {
  computed: {
    visitedViews() {
      return this.$store.state.app.visitedViews.slice(-6)
    }
  },
  mounted() {
    this.$store.dispatch('addVisitedViews', this.generateRoute())
  },
  methods: {
    closeViewTabs(view, $event) {
      this.$store.dispatch('delVisitedViews', view).then((views) => {
        if (this.isActive(view.path)) {
          const latestView = views.slice(-1)[0]
          if (latestView) {
            this.$router.push(latestView.path)
          } else {
            this.$router.push('/')
          }
        }
      })
      $event.preventDefault()
    },
    generateRoute() {
      if (this.$route.matched[this.$route.matched.length - 1].name) {
        return this.$route.matched[this.$route.matched.length - 1]
      }
      this.$route.matched[0].path = '/'
      return this.$route.matched[0]
    },
    addViewTabs() {
      this.$store.dispatch('addVisitedViews', this.generateRoute())
    },
    isActive(path) {
      return path === this.$route.path
    }
  },
  watch: {
    $route() {
      this.addViewTabs()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.tabs-view-container {
  background: #fff;
  height: 34px;
  line-height: 34px;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
  .tabs-view-item {
    display: inline-block;
    position: relative;
    height: 32px;
    line-height: 32px;
    border: 1px solid #d8dce5;
    color: #495060;
    background: #fff;
    padding: 0 12px;
    font-size: 12px;
    margin-left: 10px;
    &:first-of-type {
      margin-left: 0px;
    }
    &.active {
      border-bottom: 0px;
      &::before {
        content: '';
        background: #20a0ff;
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        position: relative;
        margin-right: 2px;
      }
    }
    &:hover {
      // border-color: #20a0ff;
      //  color: #20a0ff;
    }
  }
}


</style>

<style rel="stylesheet/scss" lang="scss">
.tabs-view-container {
  .tabs-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all .3s cubic-bezier(.645, .045, .355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(.6);
        display: inline-block;
        vertical-align: -3px;
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>
