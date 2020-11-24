<template>
  <div>
    <svg-icon :icon-class="isFullscreen?'exit-fullscreen':'fullscreen'" @click="click" />
  </div>
</template>

<script>

export default {
  name: 'Screenfull',
  data() {
    return {
      elem: document.documentElement,
      isFullscreen: false
    }
  },
  methods: {
    click() {
      if (this.isFullscreen) {
        this.closeFullscreen()
        this.isFullscreen = true
        return this.isFullscreen
      }
      this.openFullscreen()
      this.isFullscreen = false
      return this.isFullscreen
    },
    openFullscreen() {
      if (this.elem.requestFullscreen) {
        this.elem.requestFullscreen()
      } else if (this.elem.webkitRequestFullscreen) { /* Safari */
        this.elem.webkitRequestFullscreen()
      } else if (this.elem.msRequestFullscreen) { /* IE11 */
        this.elem.msRequestFullscreen()
      }
    },
    closeFullscreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen()
      } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen()
      }
    }
  }
}
</script>

<style scoped>
.screenfull-svg {
  display: inline-block;
  cursor: pointer;
  fill: #5a5e66;;
  width: 20px;
  height: 20px;
  vertical-align: 10px;
}
</style>
