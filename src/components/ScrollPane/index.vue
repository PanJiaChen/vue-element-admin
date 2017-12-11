<template>
  <div class="scroll-container" ref="scrollContainer" @mousewheel="handleScroll">
    <div class="scroll-wrapper" ref="scrollWrapper" :style="{left: left + 'px'}">
      <slot></slot>
    </div>
    <div class="bar-container" v-show="isOverflow" ref="scrollbarContainer">
      <div class="scrollbar" ref="scrollbar">
      </div>
    </div>
  </div>
</template>

<script>
  const padding = 30 // tag's padding

  export default {
    name: 'scrollPane',
    data() {
      return {
        left: 0,
        isOverflow: false,
        container: undefined,
        containerWidth: undefined,
        wrapper: undefined,
        wrapperWidth: undefined,
        scrollbarContainer: undefined,
        scrollbarContainerWidth: undefined,
        scrollbar: undefined,
        scrollbarWidth: undefined
      }
    },
    mounted() {
      this.container = this.$refs.scrollContainer
      this.wrapper = this.$refs.scrollWrapper
      this.scrollbarContainer = this.$refs.scrollbarContainer
      this.scrollbar = this.$refs.scrollbar
      this.calcSize()
      window.addEventListener('resize', () => {
        this.$forceUpdate()
        this.calcSize()
      }, false)
    },
    methods: {
      calcPos() {
        if (this.isOverflow) {
          this.scrollbar.style.left = -(this.scrollbarContainerWidth - this.scrollbarWidth) * this.left / (this.wrapperWidth - this.containerWidth + padding) + 'px'
        }
      },
      calcSize() {
        // 计算滚动条的长度
        this.containerWidth = parseFloat(this.container.offsetWidth, 10)
        this.wrapperWidth = parseFloat(this.wrapper.offsetWidth, 10)
        this.scrollbarContainerWidth = parseFloat(this.scrollbarContainer.offsetWidth, 10)
        this.isOverflow = this.wrapperWidth + padding > this.containerWidth
        if (!this.isOverflow) return false
        this.scrollbarWidth = this.scrollbarContainerWidth * this.containerWidth / (this.wrapperWidth + padding)
        this.scrollbar.style.width = this.scrollbarWidth + 'px'
        this.calcPos()
      },
      handleScroll(e) {
        e.preventDefault()
        if (e.wheelDelta > 0) {
          // when whell up
          this.left = Math.min(0, this.left + e.wheelDelta)
        } else {
          // when wheel down
          // this.left∈[-(this.wrapperWidth-this.containerWidth+100),0]
          if (this.left >= -(this.wrapperWidth - this.containerWidth + padding)) {
            this.left = Math.max(this.left + e.wheelDelta, this.containerWidth - this.wrapperWidth - padding)
          }
        }
        this.calcPos()
      },
      moveToTarget($target) {
        const $targetLeft = $target.offsetLeft
        const $targetWidth = $target.offsetWidth

        if ($targetLeft < -this.left) {
          // tag in the left
          this.left = -$targetLeft + padding
        } else if ($targetLeft + padding > -this.left && $targetLeft + $targetWidth < -this.left + this.containerWidth - padding) {
          // tag in the current view
          // eslint-disable-line
        } else {
          // tag in the right
          this.left = -($targetLeft - (this.containerWidth - $targetWidth) + padding)
        }
        this.calcSize()
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .scroll-container {
    white-space: nowrap;
    position: relative;
    overflow: hidden;
    .scroll-wrapper {
      position: absolute;
    }
    .bar-container{
      position: absolute;
      bottom: 0;
      width:100%;
      height: 3px;
      .scrollbar{
        position: absolute;
        top: 0;
        height: 100%;
        background: rgba(0,0,0,.8);
        border-radius: 1.5px;
      }
    }
  }
</style>
