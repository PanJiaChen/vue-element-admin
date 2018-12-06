<template>
  <div ref="rightPanel" :class="{show:show}" class="rightPanel-container">
    <div class="rightPanel-background"/>
    <div :class="[`rightPanel-${color}`]" class="rightPanel">
      <div class="handle-button" type="primary" circle @click="show=!show">
        <i :class="show?'el-icon-close':'el-icon-setting'" />
      </div>
      <div class="rightPanel-items">
        <slot/>
      </div>
    </div>
  </div>
</template>

<script>
import { addClass, removeClass } from '@/utils'

export default {
  name: 'RightPanel',
  props: {
    value: {
      default: false,
      type: Boolean
    },
    color: {
      default: 'primary',
      type: String
    },
    clickNotClose: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      show: false
    }
  },
  watch: {
    show(value) {
      if (value && !this.clickNotClose) {
        this.addEventClick()
      }
      if (value) {
        addClass(document.body, 'showRightPanel')
      } else {
        removeClass(document.body, 'showRightPanel')
      }
    }
  },
  mounted() {
    this.insertToBody()
  },
  methods: {
    addEventClick() {
      window.addEventListener('click', this.closeSidebar)
    },
    closeSidebar(evt) {
      const parent = evt.target.closest('.rightPanel')
      if (!parent) {
        this.show = false
        window.removeEventListener('click', this.closeSidebar)
      }
    },
    insertToBody() {
      const elx = this.$refs.rightPanel
      const body = document.querySelector('body')
      body.insertBefore(elx, body.firstChild)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
body {
  overflow: hidden;
  position: relative;
  width: calc(100% - 15px);
}

.rightPanel-background {
  opacity: 0;
  transition: opacity .3s ease;
  background: rgba(0, 0, 0, .2);
  width: 0;
  height: 0;
  position: fixed;
  z-index: -1;
}

.rightPanel {
  background: rgb(255, 255, 255);
  z-index: 3000;
  position: fixed;
  height: 100vh;
  width: 100%;
  max-width: 260px;
  top: 0px;
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, .05);
  left: 0px;
  transition: all .25s ease;
  transform: translate(100%);
  z-index: 40000;
  left: auto;
  right: 0px;
}

.show {
  // transition: all .25s ease;
  .rightPanel-background {
    z-index: 20000;
    opacity: 1;
    width: 100%;
    height: 100%;
  }

  .rightPanel {
    transform: translate(0);
  }
}

.handle-button {
  position: absolute;
  left: -48px;
  border-radius: 4px 0 0 4px !important;
  top: 240px;
  width: 48px;
  height: 48px;
  background: #1890ff;
  cursor: pointer;
  pointer-events: auto;
  z-index: 0;
  text-align: center;
  color: #fff;
  line-height: 48px;
  i {
    font-size: 24px;
    line-height: 48px;
  }
}
</style>
