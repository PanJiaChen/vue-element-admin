<template>
  <div
    v-if="isLoaded"
    key="window-loaded"
  >
    <el-container style="height: 86vh;">
      <el-main>
        <split-pane :min-percent="10" :default-percent="defaultPorcentSplitPane" split="vertical">
          <template>
            <!-- this slot is 'paneL' (with 'L' in uppercase) do not change -->
            <div slot="paneL" class="left-container">
              <el-aside v-show="isShowedRecordNavigation" width="100%">
                <div class="small-4 columns">
                  <div class="w">
                    <div class="open-left" />
                    <div class="open-datatable-aside">
                      <el-button
                        v-show="!isPanel"
                        :icon="iconIsShowedRecordNavigation"
                        circle
                        style="margin-left: 10px;"
                        @click="handleChangeShowedRecordNavigation()"
                      />
                      <el-button
                        v-show="!isPanel"
                        :icon="iconIsShowedAside"
                        circle
                        @click="handleChangeShowedPanel()"
                      />
                    </div>
                    <data-table
                      :parent-uuid="windowUuid"
                      :container-uuid="windowMetadata.currentTab.uuid"
                      :table-name="windowMetadata.currentTab.tableName"
                      :is-showed-panel-record="true"
                      :is-parent="true"
                    />
                    <div class="close-datatable">
                      <el-button
                        v-show="isPanel"
                        icon="el-icon-caret-left"
                        circle
                        @click="handleChangeShowedPanel()"
                      />
                    </div>
                  </div>
                </div>
                <i
                  v-if="isMobile"
                  class="el-icon-close"
                  style="position: fixed;padding-top: 15px; color: #000000;font-size: 121%;font-weight: 615!important;padding-left: 9px;"
                  @click="handleChangeShowedRecordNavigation()"
                />
              </el-aside>
            </div>
          </template>
          <template slot="paneR">
            <el-container style="height: 86vh;">
              <Split direction="vertical" @onDrag="onDrag">
                <SplitArea :size="sizeAreaStyle" :style="splitAreaStyle">
                  <el-header style="height: 39px;">
                    <context-menu
                      v-show="!isShowedRecordPanel"
                      :menu-parent-uuid="$route.meta.parentUuid"
                      :parent-uuid="windowUuid"
                      :container-uuid="windowMetadata.currentTabUuid"
                      :panel-type="panelType"
                      :is-insert-record="getterIsInsertRecord"
                    />
                  </el-header>
                  <!-- das -->
                  <el-main :style="styleMainIsShowedTabChildren">
                    <tab-parent
                      :window-uuid="windowUuid"
                      :tabs-list="windowMetadata.tabsListParent"
                      class="tab-window"
                    />
                    <div class="small-4 columns">
                      <div class="wrapper">
                        <div
                          v-show="windowMetadata.tabsListChildren && windowMetadata.tabsListChildren.length"
                          class="open-detail"
                        />
                        <el-button
                          v-if="windowMetadata.tabsListChildren && windowMetadata.tabsListChildren.length &&
                            (isMobile && !isShowedRecordNavigation || !isMobile)"
                          v-show="!isShowedTabChildren"
                          icon="el-icon-caret-top"
                          :class="classIsMobile"
                          circle
                          @click="handleChangeShowedTabChildren()"
                        />
                      </div>
                    </div>
                    <modal-dialog
                      :parent-uuid="windowUuid"
                      :container-uuid="windowMetadata.currentTabUuid"
                    />
                    <div class="small-4 columns">
                      <div class="w">
                        <div class="open-left" />
                        <el-button
                          v-show="!isShowedRecordNavigation"
                          :icon="iconIsShowedRecordNavigation"
                          class="open-navegation"
                          circle
                          @click="handleChangeShowedRecordNavigation()"
                        />
                      </div>
                    </div>
                  </el-main>
                </SplitArea>
                <SplitArea v-show="isShowedTabChildren" :size="50">
                  <el-header
                    v-if="isShowedTabChildren && windowMetadata.tabsListChildren && windowMetadata.tabsListChildren.length"
                    style="height: auto; padding-right: 35px !important;padding-bottom: 33px;"
                  >
                    <div class="w-33">
                      <div class="center">
                        <el-button
                          icon="el-icon-caret-bottom"
                          circle
                          @click="handleChangeShowedTabChildren()"
                        />
                      </div>
                    </div>
                    <tab-children
                      :window-uuid="windowUuid"
                      :tabs-list="windowMetadata.tabsListChildren"
                      :first-tab-uuid="windowMetadata.firstTabUuid"
                      :style="{ 'height': getHeightPanelBottom + 'vh' }"
                    />
                  </el-header>
                </SplitArea>
              </Split>
            </el-container>
          </template>
        </split-pane>
      </el-main>
    </el-container>
  </div>
  <div
    v-else
    key="window-loading"
    v-loading="!isLoaded"
    :element-loading-text="$t('notifications.loading')"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 0.8)"
    class="loading-window"
  />
</template>

<script>
import TabParent from '@/components/ADempiere/Tab'
import TabChildren from '@/components/ADempiere/Tab/tabChildren'
// When supporting the processes, smart browser and reports,
// the submenu and sticky must be placed in the layout
import ContextMenu from '@/components/ADempiere/ContextMenu'
import ModalDialog from '@/components/ADempiere/Dialog'
import DataTable from '@/components/ADempiere/DataTable'
import splitPane from 'vue-splitpane'

export default {
  name: 'WindowView',
  components: {
    TabParent,
    TabChildren,
    ContextMenu,
    DataTable,
    splitPane,
    ModalDialog
  },
  data() {
    return {
      windowMetadata: {},
      windowUuid: this.$route.meta.uuid,
      panelType: 'window',
      isLoaded: false,
      isPanel: false,
      isLoadingFromServer: false,
      listRecordNavigation: 0,
      isShowedTabChildren: true,
      isShowedRecordPanel: false,
      isShowedRecordNavigation: this.$route.query.action === 'advancedQuery'
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.$store.dispatch('setWindowOldRoute', {
      path: from.path,
      fullPath: from.fullPath,
      query: {
        ...from.query
      }
    })
    next()
  },
  computed: {
    defaultPorcentSplitPane() {
      // isShowedRecordPanel ? (isShowedRecordNavigation ? 100 : 50) : (isShowedRecordNavigation ? 50 : -1)
      if (this.isShowedRecordPanel) {
        if (this.isShowedRecordNavigation) {
          return 100
        }
        return 50
      }
      if (this.isShowedRecordNavigation) {
        return 50
      }
      return -1
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    // convert ternary operator into computed property
    classIsMobile() {
      if (this.isMobile) {
        return 'open-table-detail-mobile'
      } else {
        return 'open-table-detail'
      }
    },
    getterIsShowedRecordNavigation() {
      return this.$store.getters.getIsShowedRecordNavigation(this.windowUuid)
    },
    iconIsShowedRecordNavigation() {
      if (this.isShowedRecordNavigation) {
        return 'el-icon-caret-left'
      } else {
        return 'el-icon-caret-right'
      }
    },
    iconIsShowedAside() {
      if (this.isShowedRecordPanel) {
        return 'el-icon-caret-left'
      } else {
        return 'el-icon-caret-right'
      }
    },
    styleMainIsShowedTabChildren() {
      if (this.isShowedTabChildren) {
        return { height: 'initial', overflow: 'auto' }
      } else {
        return { height: 'initial', overflow: 'hidden' }
      }
    },
    splitAreaStyle() {
      if (this.isShowedTabChildren) {
        return { overflow: 'auto' }
      } else {
        return { overflow: 'hidden' }
      }
    },
    sizeAreaStyle() {
      if (this.isShowedTabChildren) {
        return 50
      } else {
        return 100
      }
    },
    //
    getterWindow() {
      return this.$store.getters.getWindow(this.windowUuid)
    },
    getHeightPanelTop() {
      return this.$store.getters.getSplitHeightTop
    },
    getHeightPanelBottom() {
      return this.$store.getters.getSplitHeight - 11
    },
    getterRecordList() {
      return this.$store.getters.getDataRecordsList(this.windowMetadata.currentTabUuid).length
    },
    getterIsInsertRecord() {
      const tab = this.$store.getters.getCurrentTab(this.windowUuid)
      if (tab) {
        return tab.isInsertRecord
      }
      return false
    }
  },
  watch: {
    'this.$route.params'(newValue, oldValue) {
      if (!this.isEmptyValue(newValue)) {
        this.getIsRecordLocked()
      }
    }
  },
  created() {
    this.getWindow()
  },
  methods: {
    // callback new size
    onDrag(size) {
      var bottomPanel = size[1]
      var topPanel = size[0]
      this.$store.dispatch('setSplitHeightTop', {
        splitHeightTop: topPanel
      })
      this.$store.dispatch('setSplitHeight', {
        splitHeight: bottomPanel
      })
    },
    // get window from vuex store or server
    getWindow() {
      if (this.getterWindow) {
        this.generateWindow()
        this.isLoadingFromServer = true
      } else {
        this.$store.dispatch('getWindowFromServer', {
          windowUuid: this.windowUuid,
          routeToDelete: this.$route
        })
          .then(response => {
            this.generateWindow()
            this.isLoadingFromServer = true
          })
          .finally(() => {
            this.isLoaded = true
          })
      }
    },
    generateWindow() {
      this.windowMetadata = this.getterWindow
      if (this.getterIsShowedRecordNavigation === undefined) {
        this.listRecordNavigation = this.getterRecordList
        if (this.windowMetadata.windowType === 'Q' || this.windowMetadata.windowType === 'M' && this.listRecordNavigation >= 10) {
          this.isShowedRecordNavigation = true
        } else if (this.windowMetadata.windowType === 'T') {
          this.isShowedRecordNavigation = false
        }
      } else {
        this.isShowedRecordNavigation = this.getterIsShowedRecordNavigation
      }

      this.isShowedTabChildren = this.windowMetadata.isShowedDetail
      this.isLoaded = true
      this.changeShowedRecordNavigation()
    },
    handleChangeShowedRecordNavigation(value) {
      this.isShowedRecordNavigation = !this.isShowedRecordNavigation
      this.changeShowedRecordNavigation()
    },
    handleChangeShowedPanel(value) {
      this.isPanel = !this.isPanel
      this.isShowedRecordPanel = !this.isShowedRecordPanel
    },
    changeShowedRecordNavigation() {
      this.$store.dispatch('changeShowedRecordWindow', {
        parentUuid: this.windowUuid,
        containerUuid: this.windowMetadata.currentTab.uuid, // act as parentUuid
        isShowedRecordNavigation: this.isShowedRecordNavigation
      })
    },
    handleChangeShowedTabChildren() {
      this.isShowedTabChildren = !this.isShowedTabChildren
      this.$store.dispatch('changeShowedDetail', {
        panelType: this.panelType,
        containerUuid: this.windowUuid, // act as parentUuid
        isShowedDetail: this.isShowedTabChildren
      })
    },
    getIsRecordLocked() {
      if (this.$store.getters.getRecordPrivateAccess(this.$route.params.tableName, this.$route.params.recordId)) {
        return true
      }
      return false
    }
  }
}
</script>

<style scoped>
  .el-tabs__content {
    overflow: hidden;
    position: relative;
    padding-top: 0px !important;
    padding-right: 15px !important;
    padding-bottom: 0px !important;
    padding-left: 15px !important;
  }
  .el-header {
    background-color: #fff;
    color: #333;
    line-height: 21px;
  }

  .el-aside {
    height: 100%;
    color: #333;
    overflow-y: hidden;
    overflow-x: hidden;
  }
  aside {
    background: #fff;
    padding: 0px;
    margin-bottom: 0px;
    border-radius: 2px;
    display: block;
    line-height: 32px;
    font-size: 16px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
    color: #2c3e50;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .el-main {
    display: block;
    -webkit-box-flex: 1;
    flex: 1;
    flex-basis: auto;
    overflow: hidden;
    height: 90vh;
    box-sizing: border-box;
    padding-top: 0px !important;
    padding-right: 0px !important;
    padding-bottom: 0px !important;
    padding-left: 0px !important;
  }
  .center{
    text-align: center;
  }
  .close{
    text-align: right;
  }
  .w-33 {
    width: 100%;
    background-color: transparent;
  }
  .open-table-detail-mobile {
    position: absolute;
    right: 50%;
    bottom: 4%;
  }
  .open-table-detail {
    position: absolute;
    right: 50%;
    bottom: 4%;
    display: none;
  }
  .open-navegation {
    position: fixed;
    top: 50%;
    display: none;
    z-index: 5;
  }
  .open-datatable-aside {
    position: absolute;
    top: 41%;
    display: none;
    z-index: 5;
    right: 1%!important;
  }
  .close-datatable {
    position: absolute;
    top: 45%;
    display: none;
    z-index: 5;
    right: 0%!important;
  }
  .button {
    display: none;
  }
  .wrapper:hover .open-table-detail {
    display: inline-block;
  }
  .w:hover .open-navegation {
    display: inline-block;
  }
  .w:hover .open-datatable-aside {
    display: grid;
  }
  .w:hover .close-datatable {
    display: inline-block;
  }
  .open-detail {
    width: 100%;
    height: 20px;
    position: absolute;
    bottom: 5%;
  }
  .open-left {
    width: 5%;
    height: 97%;
    position: absolute;
    top: 2%;
    left: 1%;
  }
  .el-button {
    cursor: pointer;
    background: #FFFFFF;
    border: 1px solid #DCDFE6;
    border-color: #DCDFE6;
    color: white;
    background: #008fd3;
  }
.vertical-panes {
  width: 100%;
  height: 85vh;
  border: 1px solid #ccc;
}
.vertical-panes > .pane {
  text-align: left;
  padding: 15px;
  overflow: hidden;
  background: #fff;
}
.vertical-panes > .pane ~ .pane {
  border-left: 1px solid #ccc;
}
.loading-window {
  padding: 100px 100px;
  height: 100%;
}
</style>
<style>
  .el-card__header {
    background: rgba(245, 247, 250, 0.75);
    padding: 18px 20px;
    border-bottom: 1px solid #f5f7fa;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .split {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    overflow-y: hidden;
    overflow-x: hidden;
    height: 102%;
    width: 100%;
  }
  .components-container {
    position: relative;
    height: 100vh;
  }

  .left-container {
    background-color: #ffffff;
    height: 100%;
  }

  .right-container {
    background-color: #ffffff;
    height: 200px;
  }

  .top-container {
    background-color: #ffffff;
    width: 100%;
    height: 100%;
  }

  .bottom-container {
    width: 100%;
    background-color: #95E1D3;
    height: 100%;
  }
  .splitter-pane-resizer.vertical {
    width: 9px !important;
    height: 100%;
    margin-left: -10px;
    border-left: 5px solid hsla(0,0%,100%,0);
    border-right: 5px solid hsla(0,0%,100%,0);
    cursor: col-resize;
}
.splitter-pane.vertical.splitter-paneR {
    position: absolute;
    right: 0;
    height: 100%;
    padding-left: 10px;
}
</style>
<style>
.splitter-pane-resizer.vertical {
    width: 11px;
    height: 100%;
    background: gray!important;
    margin-left: -5px;
    border-left: 5px solid hsla(0,0%,100%,0);
    border-right: 5px solid hsla(0,0%,100%,0);
    cursor: col-resize;
  }
</style>
