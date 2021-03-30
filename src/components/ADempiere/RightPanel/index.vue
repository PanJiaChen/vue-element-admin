<template>
  <div
    ref="rightMenu"
    :class="{ show: isShowRightPanel }"
    class="rightMenu-container"
  >
    <div class="setting">
      <div class="showme">
        <!-- <div class="rightMenu-background" /> -->
        <div class="rightMenu">
          <div
            class="handle-button"
            :style="{ 'top': buttonTop+'%' }"
            @click="isShowRightPanel=!isShowRightPanel"
          >
            <i :class="icon" style="color: gray;" />
          </div>

          <div class="rightMenu-items">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { addClass, removeClass } from '@/utils'

export default {
  name: 'RightPanel',
  props: {
    clickNotClose: {
      default: false,
      type: Boolean
    },
    buttonTop: {
      default: 16,
      type: Number
    }
  },
  data() {
    return {
      show: false
    }
  },
  computed: {
    isShowRightPanel: {
      get() {
        return this.$store.state.contextMenu.isShowRightPanel
      },
      set() {
        this.$store.commit('changeShowRigthPanel')
      }
    },
    icon() {
      if (this.isShowRightPanel) {
        return 'el-icon-close'
      }
      return 'el-icon-more'
    },
    theme() {
      return this.$store.state.settings.theme
    }
  },
  watch: {
    show(value) {
      if (value && !this.clickNotClose) {
        this.addEventClick()
      }
      if (value) {
        addClass(document.body, 'showrightMenu')
      } else {
        removeClass(document.body, 'showrightMenu')
      }
    }
  },
  mounted() {
    this.insertToBody()
  },
  beforeDestroy() {
    const elx = this.$refs.rightMenu
    elx.remove()
  },
  methods: {
    addEventClick() {
      window.addEventListener('click', this.closeSidebar)
    },
    closeSidebar(evt) {
      const parent = evt.target.closest('.rightMenu')
      if (!parent) {
        this.show = false
        window.removeEventListener('click', this.closeSidebar)
      }
    },
    insertToBody() {
      const elx = this.$refs.rightMenu
      const body = document.querySelector('body')
      body.insertBefore(elx, body.firstChild)
    }
  }
}
</script>

<style>
.setting {
  z-index: 3;
  width: 2.5%;
  height: 10%;
  right: 0%;
  position: absolute;
  top: 250px;
}
.showme {
  display: block;
}

.setting:hover .showme {
  display: block;
}
.showrightMenu {
  overflow: visible;
  position: relative;
  width: calc(100% - 15px);
}
</style>

<style lang="scss" scoped>
.rightMenu-background {
  opacity: 0;
  transition: opacity .3s cubic-bezier(.7, .3, .1, 1);
  background: rgba(0, 0, 0, .2);
  width: 0;
  height: 0;
  top: 0;
  left: 0;
  position: fixed;
  z-index: -1;
}

.rightMenu {
  background: #fff;
  z-index: 3000;
  position: fixed;
  height: 100vh;
  width: 100%;
  max-width: 260px;
  top: 0px;
  left: 0px;
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, .05);
  transition: all .25s cubic-bezier(.7, .3, .1, 1);
  transform: translate(100%);
  z-index: 40000;
  left: auto;
  right: 0px;
}

.show {
  transition: all .3s cubic-bezier(.7, .3, .1, 1);

  .rightMenu-background {
    z-index: 20000;
    opacity: 1;
    width: 100%;
    height: 100%;
  }

  .rightMenu {
    transform: translate(0);
  }
}

.handle-button {
  position: absolute;
  border: 1px solid #d9d9d9;
  background: white;
  left: -34px;
  border-radius: 6px 0 0 6px !important;
  width: 35px;
  height: 35px;
  pointer-events: auto;
  z-index: 0;
  cursor: pointer;
  pointer-events: auto;
  font-size: 0px;
  text-align: center;
  color: #fff;
  line-height: 48px;

  i {
    font-size: 17px;
    line-height: 17px;
  }
}
</style>
