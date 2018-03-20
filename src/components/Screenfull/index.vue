<template>
  <div>
    <svg t="1508738709248" @click='click' class="screenfull-svg" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
      p-id="2069" xmlns:xlink="http://www.w3.org/1999/xlink" width="32" height="32">
      <path d="M333.493443 428.647617 428.322206 333.832158 262.572184 168.045297 366.707916 64.444754 64.09683 64.444754 63.853283 366.570793 167.283957 262.460644Z"
        p-id="2070"></path>
      <path d="M854.845439 760.133334 688.61037 593.95864 593.805144 688.764889 759.554142 854.56096 655.44604 958.161503 958.055079 958.161503 958.274066 656.035464Z"
        p-id="2071"></path>
      <path d="M688.535669 428.550403 854.31025 262.801405 957.935352 366.921787 957.935352 64.34754 655.809313 64.081481 759.919463 167.535691 593.70793 333.731874Z"
        p-id="2072"></path>
      <path d="M333.590658 594.033341 167.8171 759.804852 64.218604 655.67219 64.218604 958.270996 366.342596 958.502263 262.234493 855.071589 428.421466 688.86108Z"
        p-id="2073"></path>
    </svg>
  </div>
</template>

<script>
import screenfull from 'screenfull'

export default {
  name: 'screenfull',
  props: {
    width: {
      type: Number,
      default: 22
    },
    height: {
      type: Number,
      default: 22
    },
    fill: {
      type: String,
      default: '#48576a'
    }
  },
  data() {
    return {
      isFullscreen: false
    }
  },
  methods: {
    click() {
      if (!screenfull.enabled) {
        this.$message({
          message: 'you browser can not work',
          type: 'warning'
        })
        return false
      }
      screenfull.toggle()
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
