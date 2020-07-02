<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  watch: {
    '$route.path': {
      handler: function() {
        window._carbonads && window._carbonads.refresh()
      }
    }
  }
}
</script>
