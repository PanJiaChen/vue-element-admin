<template>
  <div v-if="showDetail">
    <div class="container">
      <!-- down button -->
      <div class="show">
        <el-button
          v-if="!showPanel && !this.$store.state.app.sidebar.opened "
          class="el-icon-arrow-up button-up btn"
          :circle="true"
          @click="handleChange()"
        />
        <el-button
          v-if="!showPanel && this.$store.state.app.sidebar.opened "
          class="el-icon-arrow-up button-up2 btn"
          :circle="true"
          @click="handleChange()"
        />
      </div>
      <!-- panel show -->
      <div :class="classContainer()">
        <el-collapse-transition>
          <div v-show="showPanel">
            <el-button
              class="el-icon-arrow-down button-bottom btn"
              :circle="true"
              @click="handleChange()"
            />

            <slot />

          </div>
        </el-collapse-transition>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PanelDetail',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    showDetail: {
      type: Boolean,
      default: true
    },
    panelType: {
      type: String,
      default: 'window'
    },
    containerUuid: {
      type: String,
      default: undefined
    },
    isShowedDetail: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      showPanel: this.isShowedDetail
    }
  },
  methods: {
    classContainer() {
      if (this.$store.state.app.device === 'mobile') {
        return 'container-panel-mobile'
      } else if (this.$store.state.app.sidebar.opened) {
        return 'container-panel-open'
      } else if (!this.$store.state.app.sidebar.opened) {
        return 'container-panel-close'
      }
      return 'container-panel'
    },
    classButtom() {
      if (this.$store.state.app.device === 'mobile') {
        return 'container-panel-mobile'
      } else if (this.$store.state.app.sidebar.opened) {
        return 'el-icon-arrow-down button-bottom btn'
      } else if (!this.$store.state.app.sidebar.opened) {
        return 'el-icon-arrow-down button-bottom2 btn'
      }
    },
    handleChange() {
      this.showPanel = !this.showPanel
      this.$store.dispatch('changeShowedDetail', {
        panelType: this.panelType,
        containerUuid: this.containerUuid,
        isShowedDetail: this.showPanel
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/variables.scss";

  .container {
    bottom: 0;
    right: 0;
    z-index: 0;
    width: calc(111% - 200px);
    transition: width 0.28s;
    position: fixed;
    height: 20px;
    display: flex;
    color: #424242;
  }
  .show {
    position: absolute;
    bottom: 0;
    color: #FFF;
    width: 100%;
    height: 300px;
    transition: all 0.5s ease-in;
    display: flex;
  }
  .container-open {
    bottom: 0;
    right: 0;
    z-index: 0;
    width: 100%;
    transition: width 0.28s;
    position: fixed;
    height: 20px;
    display: flex;
    color: #424242;
  }
  .show-open {
    position: absolute;
    bottom: 0;
    color: #FFF;
    width: 100%;
    height: 300px;
    transition: all 0.5s ease-in;
    display: flex;
  }
  .container:hover .show {
    height: 30px;
  }
  .btn {
    animation-name: btn;
    position: relative;
    transition-delay: 0.6s;
    visibility: hidden;
    /* right: 50%; */
  }
  .container:hover .btn {
    visibility: visible;
  }
  .el-tabs__content {
    overflow: hidden;
    position: relative;
    padding-top: 0px;
    padding-left: 15px;
    padding-right: 15px;
}
  .btn-base :hover {
    box-shadow: 5px #5a5a5a;
  }
  .tab-window {
    z-index: 9;
  }
  .container-panel {
    position: fixed;
    bottom: 0;
    right: 0;
    z-index: 0;
    width: calc(100% - 54px);
    /* height: 40%; */
    transition: width 0.28s;
  }
  .container-panel-movil {
    position: fixed;
    bottom: 0;
    right: 0;
    z-index: 0;
    width: 100%;
    height: 60%;
    transition: width 0.28s;
  }
  .container-panel-mobile {
    position: fixed;
    bottom: 0;
    right: 0;
    z-index: 0;
    width: 100%;
    transition: width 0.28s;
  }
  .container-panel-open {
    position: fixed;
    bottom: 0;
    right: 0;
    z-index: 0;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }
  .container-panel-close {
    position: fixed;
    bottom: 0;
    right: 0;
    z-index: 0;
    width: calc(100% - 2em);
    transition: width 0.28s;
  }
  .container-up {
    right: 50%;
  }
  .show {
    position: absolute;
    bottom: 0;
    color: #FFF;
    width: 100%;
    height: 0px;
    transition: all 0.5s ease-in;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .button-bottom {
    bottom: 50%;
    z-index: 2;
    position: relative;
    margin: 0 auto;
    left: 45%;
  }
  .button-bottom2 {
    bottom: 50%;
    z-index: 2;
    position: relative;
    margin: 0 auto;
    left: 45%;
  }
  .button-up {
    bottom: 0;
    position: fixed;
    left: 48%;
    margin: 0 auto;
  }
  .button-up2 {
    bottom: 0;
    position: fixed;
    left: 57%;
    margin: 0 auto;
  }
  .btn-base {
    width: 100%;
    position: fixed;
    background: #ffffff;
    color: #606266;
    -webkit-appearance: none;
    text-align: center;
    outline: 0;
    font-size: 14px;
  }
  .btn-base :hover {
    box-shadow: 5px #5a5a5a;
  }
  .el-row {
    margin-bottom: 20px;
  }
  .el-col {
    border-radius: 4px;
    left: 10px;
  }
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    width: 100%;
  }
</style>
