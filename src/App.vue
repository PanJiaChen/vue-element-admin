<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', this.getWindowWidth)
      window.addEventListener('resize', this.getWindowHeight)

      this.getWindowWidth()
      this.getWindowHeight()
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.getWindowWidth)
    window.removeEventListener('resize', this.getWindowHeight)
  },
  methods: {
    getWindowWidth(event) {
      this.$store.dispatch('setWidth', document.documentElement.clientWidth)
    },
    getWindowHeight(event) {
      this.$store.dispatch('setHeight', document.documentElement.clientHeight)
    },
    theAction(event) {
      console.log(event)
      alert('ok', event)
    }
  }
}
</script>
