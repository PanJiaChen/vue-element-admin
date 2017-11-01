<template>
  <scroll-pane class='tabs-view-container'>
    <router-link class="tabs-view-item" :class="isActive(tag)?'active':''" v-for="tag in Array.from(visitedViews)" :to="tag.path" :key="tag.path">
      {{tag.title}}
      <span class='el-icon-close' @click='closeViewTabs(tag,$event)'></span>
    </router-link>
  </scroll-pane>
</template>


<script>
import ScrollPane from '@/components/ScrollPane'

export default {
  components: { ScrollPane },
  computed: {
    visitedViews() {
      return this.$store.state.app.visitedViews
    }
  },
  mounted() {
    this.addViewTabs()
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
      if (this.$route.name) {
        return this.$route
      }
      return false
    },
    addViewTabs() {
      const route = this.generateRoute()
      if (!route) {
        return false
      }
      this.$store.dispatch('addVisitedViews', route)
    },
    isActive(route) {
      return route.path === this.$route.path || route.name === this.$route.name
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
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
  .tabs-view-item {
    display: inline-block;
    position: relative;
    height: 26px;
    line-height: 26px;
    border: 1px solid #d8dce5;
    color: #495060;
    background: #fff;
    padding: 0 8px;
    font-size: 12px;
    margin-left: 5px;
    margin-top: 4px;
    &:first-of-type {
      margin-left: 15px;
    }
    &.active {
      background-color: #eef1f6;
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
