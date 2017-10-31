<template>
  <div class='scroll-container' ref='scrollContainer' @mousewheel="handleScroll">
    <div class='scroll-wrapper' ref='scrollWrapper' :style="{left: left + 'px'}">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'scrollPane',
  data() {
    return {
      left: 0
    }
  },
  methods: {
    handleScroll(e) {
      e.preventDefault()
      const $container = this.$refs.scrollContainer
      const $containerWidth = $container.offsetWidth
      const $wrapper = this.$refs.scrollWrapper
      const $wrapperWidth = $wrapper.offsetWidth
      console.log($containerWidth, $wrapperWidth)
      if (e.wheelDelta > 0) {
        this.left = Math.min(0, this.left + e.wheelDelta)
      } else {
        if ($containerWidth - 100 < $wrapperWidth) {
          if (this.left < -($wrapperWidth - $containerWidth + 100)) {
            this.left = this.left
          } else {
            this.left = Math.max(this.left + e.wheelDelta, $containerWidth - $wrapperWidth - 100)
          }
        } else {
          this.left = 0
        }
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.scroll-container {
  white-space: nowrap;
  position: relative;
  .scroll-wrapper {
    position: absolute;
  }
}
</style>
