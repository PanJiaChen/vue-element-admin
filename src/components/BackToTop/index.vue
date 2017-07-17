<template>
  <transition name="fade">
    <div class="back-to-top" @click="backToTop" v-show="visible">
      <el-tooltip class="item" effect="dark" content="返回顶部" placement="top">
        <i class="el-icon-arrow-up"></i>
      </el-tooltip>
    </div>
  </transition>
</template>
<script>
export default {
  name: 'BackToTop',
  props: {
    visibilityHeight: {
      type: Number,
      default: 400
    },
    backPosition: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      visible: false
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      this.visible = window.pageYOffset > this.visibilityHeight;
    },
    backToTop() {
      const start = window.pageYOffset;
      let i = 0;
      const t = setInterval(() => {
        const next = Math.floor(this.easeInOutQuad(10 * i, start, -start, 500));
        if (next <= this.backPosition) {
          window.scrollTo(0, this.backPosition);
          clearInterval(t)
        } else {
          window.scrollTo(0, next);
        }
        i++;
      }, 16.7)
    },
    easeInOutQuad(t, b, c, d) {
      if ((t /= d / 2) < 1) return c / 2 * t * t + b;
      return -c / 2 * (--t * (t - 2) - 1) + b;
    }
  }
}
</script>
<style scoped>
.back-to-top {
  position: fixed;
  right: 50px;
  bottom: 50px;
  display: inline-block;
  height: 40px;
  width: 40px;
  box-shadow: 1px 1px 1px #58B7FF;
  text-align: center;
  cursor: pointer;
  background: #58B7FF;
  color: #fff;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s
}

.fade-enter,
.fade-leave-to {
  opacity: 0
}

.back-to-top i {
  display: inline-block;
  width: 100%;
  height: 100%;
  line-height: 40px;
}
</style>


