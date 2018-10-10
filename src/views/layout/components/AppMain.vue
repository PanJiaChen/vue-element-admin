<template>
  <section class="app-main">
    <transition :name="viewsTransition" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key"/>
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    viewsTransition() {
      return this.$store.state.app.viewsTransition
    },
    key() {
      return this.$route.fullPath
    }
  }
}
</script>

<style scoped>
 /* height
  * navbar: 50
  * tags-view: 34
 */
 .hasTagsView .app-main {
   min-height: calc(100vh - 84px);
 }

 .app-main {
   min-height: calc(100vh - 50px);
   width: 100%;
   position: relative;
   overflow: hidden;
 }
</style>

