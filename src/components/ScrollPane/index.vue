<template>
  <div ref="scrollContainer" class="scroll-container" @wheel.prevent="handleScroll">
    <div ref="scrollWrapper" :style="{left: left + 'px'}" class="scroll-wrapper">
      <slot />
    </div>
  </div>
</template>

<script>

import createDetectElementResize from '@/vendor/detectElementResize'

const padding = 15 // tag's padding
const scrollPanelLeft = 30

export default {
  name: 'ScrollPane',
  data() {
    return {
      left: scrollPanelLeft
    }
  },
  mounted() {
    this.detectElementResize = createDetectElementResize()
    this.detectElementResize.addResizeListener(this.$refs.scrollContainer, () => {
      const $container = this.$refs.scrollContainer
      const $containerWidth = $container.offsetWidth
      const $wrapper = this.$refs.scrollWrapper
      const $wrapperWidth = $wrapper.offsetWidth
      if ($containerWidth - padding > $wrapperWidth) {
        this.left = scrollPanelLeft
      }
    })
  },
  methods: {
    scrollLeft() {
      this.left = Math.min(scrollPanelLeft, this.left + 300)
    },
    scrollRight() {
      const $container = this.$refs.scrollContainer
      const $containerWidth = $container.offsetWidth
      const $wrapper = this.$refs.scrollWrapper
      const $wrapperWidth = $wrapper.offsetWidth
      if ($containerWidth - padding < $wrapperWidth) {
        this.left = Math.max(this.left - 300, $containerWidth - $wrapperWidth - padding - scrollPanelLeft)
      }
    },
    handleScroll(e) {
      const eventDelta = e.wheelDelta || -e.deltaY * 3
      const $container = this.$refs.scrollContainer
      const $containerWidth = $container.offsetWidth
      const $wrapper = this.$refs.scrollWrapper
      const $wrapperWidth = $wrapper.offsetWidth

      if (eventDelta > 0) {
        this.left = Math.min(scrollPanelLeft, this.left + eventDelta)
      } else {
        if ($containerWidth - padding < $wrapperWidth) {
          if (this.left < -($wrapperWidth - $containerWidth + padding)) {
            this.left = this.left
          } else {
            this.left = Math.max(this.left + eventDelta, $containerWidth - $wrapperWidth - padding - scrollPanelLeft)
          }
        } else {
          this.left = scrollPanelLeft
        }
      }
    },
    moveToTarget($target) {
      const $container = this.$refs.scrollContainer
      const $containerWidth = $container.offsetWidth
      const $targetLeft = $target.offsetLeft
      const $targetWidth = $target.offsetWidth

      if ($targetLeft < -this.left) {
        // tag in the left
        this.left = -$targetLeft + padding
      } else if ($targetLeft + padding > -this.left && $targetLeft + $targetWidth < -this.left + $containerWidth - padding) {
        // tag in the current view
        // eslint-disable-line
      } else {
        // tag in the right
        this.left = -($targetLeft - ($containerWidth - $targetWidth) + padding)
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .scroll-container {
    white-space: nowrap;
    position: relative;
    overflow: hidden;
    width: 100%;
    .scroll-wrapper {
      position: absolute;
    }
  }
</style>
