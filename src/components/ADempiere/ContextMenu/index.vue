<template>
  <component
    :is="templateDevice"
    :menu-parent-uuid="menuParentUuid"
    :parent-uuid="parentUuid"
    :container-uuid="containerUuid"
    :panel-type="panelType"
    :is-report="isReport"
    :last-parameter="lastParameter"
    :report-format="reportFormat"
    :is-insert-record="isInsertRecord"
  />
</template>

<script>
export default {
  name: 'ContextMenu',
  props: {
    menuParentUuid: {
      type: String,
      default: undefined
    },
    // uuid of the component where it is called
    parentUuid: {
      type: String,
      default: undefined
    },
    // uuid of the component where it is called
    containerUuid: {
      type: String,
      required: true
    },
    panelType: {
      type: String,
      default: undefined
    },
    isReport: {
      type: Boolean,
      default: false
    },
    lastParameter: {
      type: String,
      default: undefined
    },
    reportFormat: {
      type: String,
      default: undefined
    },
    // used only window
    isInsertRecord: {
      type: Boolean,
      default: undefined
    }
  },
  computed: {
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    templateDevice() {
      let template = 'contextMenuDesktop'
      if (this.isMobile) {
        template = 'contextMenuMobile'
      }
      return () => import(`@/components/ADempiere/ContextMenu/${template}`)
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-submenu .el-menu-item {
    height: 50px;
    line-height: 50px;
    padding-left: 27px !important;
    padding: 0 45px;
    min-width: 200px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
<style lang="scss">
  // this forces to show the arrow icon when the main menu is hidden
  #app .hideSidebar .el-submenu > .el-submenu__title .el-submenu__icon-arrow {
    display: initial;
  }

  .Run-Report {
    position: absolute;
    right: 102%;
    border: 0;
  }
  .icon-menu {
    position: absolute;
    right: 140%;
    margin-top: -38%;
  }
  .List-Report {
    border: 0;
    background: transparent;
  }
  .container-context-menu {
    z-index: 1;
  }

  .container-submenu-mobile {
    position: absolute;
    height: 39px !important;
    width: 55px !important;
    right: 0;
    top: 0;
  }

  .container-submenu {
    position: absolute;
    height: 39px !important;
    right: 0;
    top: -1px;
  }

  ul.el-menu-demo > .el-menu-item {
    height: 39px !important;
    line-height: 39px !important;
    padding: 0 10px;
  }

  .el-menu-demo > .el-menu-item > .el-submenu__title {
    line-height: 39px;
    height: 39px !important;
    padding: 0;
  }

  .el-menu--horizontal .el-submenu > .el-menu--horizontal {
    left: initial !important;
    right: 150px;
  }

  .el-menu--popup-bottom-start {
    min-width: 150px !important;
  }

  .el-menu--popup-right-start{
    min-width: 150px !important;
  }

  .el-menu--popup-right-start > .el-menu-item {
    min-width: 150px;
  }

  .scroll {
    max-height: 400px;
  }

  .scroll-child {
    max-height: 300px;
  }

  .el-icon-more {
    transform: rotate(90deg);
  }
</style>
