<template>
  <div class='tabs-view-container'>
    <router-link class="tabs-view" v-for="tag in Array.from(visitedViews)" :to="tag.path" :key="tag.path">
      <el-tag :closable="true" @close='closeViewTabs(tag,$event)'>
        {{tag.name}}
      </el-tag>
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
      methods: {
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
          this.addViewTabs()
        }
      }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .tabs-view-container{
    display: inline-block;
    vertical-align: top;
    margin-left: 10px;
    .tabs-view{
      margin-left: 10px;
    }
  }

</style>
