<template>
  <div
    v-if="isLoaded"
    key="window-loaded"
  >
    <el-container style="height: 86vh;">
      <Split>
        <SplitArea :size="sizePanel" :min-size="100">
          <el-aside width="100%">
            <split-pane :min-percent="10" :default-percent="defaultPorcentSplitPane" split="vertical">
              <template>
                <!-- this slot is 'paneL' (with 'L' in uppercase) do not change -->
                <div slot="paneL" class="left-container">
                  <el-aside v-show="isShowedRecordNavigation" width="100%">
                    <div class="small-4 columns">
                      <div class="w">
                        <div class="open-left" />
                        <div :class="styleTableNavigation">
                          <!-- close record navigation and advanced query panel -->
                          <el-button
                            :icon="iconShowedRecordNavigation"
                            circle
                            style="margin-left: 10px;"
                            class="el-button-window"
                            @click="handleChangeShowedRecordNavigation(false)"
                          />
                          <!-- complete expand record navigation and advanced query panel  -->
                          <el-button
                            v-show="!isMobile"
                            :icon="iconIsShowedAside"
                            circle
                            class="el-button-window"
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
                      </div>
                    </div>
                  </el-aside>
                </div>
              </template>
              <template slot="paneR">
                <el-container id="PanelRight" style="height: 86vh;">
                  <resize-observer @notify="handleResize" />
                  <Split v-shortkey="['f8']" direction="vertical" @onDrag="onDrag" @shortkey.native="handleChangeShowedRecordNavigation(!isShowedRecordNavigation)">
                    <SplitArea :size="sizeAreaStyle" :style="splitAreaStyle">
                      <el-header
                        v-if="showContextMenu"
                        :style="isWorkflowBarStatus ? 'height: 45px; background: #F5F7FA' : 'height: 40px'"
                      >
                        <el-container>
                          <el-aside width="100%" style="width: 78vw; overflow: hidden;">
                            <el-scrollbar>
                              <workflow-status-bar
                                v-if="isWorkflowBarStatus"
                                :style-steps="styleStepsSimple"
                                :container-uuid="windowMetadata.currentTabUuid"
                                :parent-uuid="windowUuid"
                                :panel-type="panelType"
                              />
                            </el-scrollbar>
                          </el-aside>
                          <el-main>
                            <context-menu
                              v-show="!isShowedRecordPanel"
                              :menu-parent-uuid="$route.meta.parentUuid"
                              :parent-uuid="windowUuid"
                              :container-uuid="windowMetadata.currentTabUuid"
                              :table-name="windowMetadata.currentTab.tableName"
                              :panel-type="panelType"
                              :is-insert-record="windowMetadata.currentTab.isInsertRecord"
                            />
                          </el-main>
                        </el-container>
                      </el-header>
                      <el-main :style="styleMainTab">
                        <tab-parent
                          :window-uuid="windowUuid"
                          :window-metadata="windowMetadata"
                          :tabs-list="windowMetadata.tabsListParent"
                          class="tab-window"
                        />
                        <div v-if="isMobile">
                          <el-card class="box-card">
                            <el-tabs v-model="activeInfo" @tab-click="handleClick">
                              <el-tab-pane
                                name="listChatEntries"
                              >
                                <span slot="label">
                                  <i class="el-icon-s-comment" />
                                  {{ $t('window.containerInfo.notes') }}
                                </span>
                                <chat-entries
                                  :table-name="getTableName"
                                  :record-id="recordId"
                                />
                              </el-tab-pane>

                              <el-tab-pane
                                name="listRecordLogs"
                              >
                                <span slot="label">
                                  <svg-icon icon-class="tree-table" />
                                  {{ $t('window.containerInfo.changeLog') }}
                                </span>
                                <div
                                  key="change-log-loaded"
                                >
                                  <record-logs />
                                </div>
                              </el-tab-pane>

                              <el-tab-pane
                                v-if="getIsWorkflowLog"
                                name="listWorkflowLogs"
                              >
                                <span slot="label">
                                  <i class="el-icon-s-help" />
                                  {{ $t('window.containerInfo.workflowLog') }}
                                </span>
                                <div
                                  v-if="getIsWorkflowLog"
                                  key="workflow-log-loaded"
                                >
                                  <workflow-logs />
                                </div>
                              </el-tab-pane>
                            </el-tabs>
                          </el-card>
                        </div>
                        <div style="right: 0%; top: 40%; position: absolute;">
                          <!-- open container info -->
                          <el-button
                            v-show="!showContainerInfo && !isMobile"
                            type="info"
                            icon="el-icon-info"
                            circle
                            style="float: right;"
                            class="el-button-window"
                            @click="contentInfo"
                          />
                        </div>
                        <div class="small-4 columns">
                          <div class="wrapper">
                            <div
                              v-show="!isEmptyValue(windowMetadata.tabsListChildren)"
                              class="open-detail"
                            />
                            <!-- open childs tabs -->
                            <el-button
                              v-if="windowMetadata.tabsListChildren.length &&
                                (isMobile && !isShowedRecordNavigation || !isMobile)"
                              v-show="!isShowedTabsChildren"
                              icon="el-icon-caret-top"
                              :class="classIsMobile"
                              circle
                              type="primary"
                              @click="handleChangeShowedTabChildren(true)"
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
                            <!-- open record navigation and advanced query if is closed -->
                            <el-button
                              v-show="!isShowedRecordNavigation"
                              :icon="iconShowedRecordNavigation"
                              class="open-navegation"
                              circle
                              type="primary"
                              @click="handleChangeShowedRecordNavigation(true)"
                            />
                          </div>
                        </div>
                      </el-main>
                    </SplitArea>
                    <SplitArea v-show="isShowedTabsChildren" :size="50">
                      <el-header
                        v-if="isShowedTabsChildren && !isEmptyValue(windowMetadata.tabsListChildren)"
                        style="height: auto; padding-right: 35px !important; padding-bottom: 33px;"
                      >
                        <div class="w-33">
                          <div class="center">
                            <!-- close tab children if is openend -->
                            <el-button
                              icon="el-icon-caret-bottom"
                              circle
                              class="el-button-window"
                              @click="handleChangeShowedTabChildren(false)"
                            />
                          </div>
                        </div>
                        <tab-children
                          :window-uuid="windowUuid"
                          :window-metadata="windowMetadata"
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
          </el-aside>
        </SplitArea>
        <SplitArea :size="showContainerInfo ? isSize : 0">
          <el-main>
            <div :class="isCloseInfo">
              <!-- close container info if is opened -->
              <el-button
                v-show="showContainerInfo"
                type="info"
                icon="el-icon-info"
                circle
                style="float: right;"
                class="el-button-window"
                @click="contentInfo"
              />
            </div>
            <div id="example-1">
              <transition name="slide-fade">
                <p v-if="showContainerInfo">
                  <el-card class="box-card">
                    <el-tabs v-model="activeInfo" @tab-click="handleClick">
                      <el-tab-pane
                        name="listChatEntries"
                      >
                        <span slot="label">
                          <i class="el-icon-s-comment" />
                          {{ $t('window.containerInfo.notes') }}
                        </span>
                        <chat-entries
                          :table-name="getTableName"
                          :record-id="recordId"
                        />
                      </el-tab-pane>

                      <el-tab-pane
                        name="listRecordLogs"
                      >
                        <span slot="label">
                          <svg-icon icon-class="tree-table" />
                          {{ $t('window.containerInfo.changeLog') }}
                        </span>
                        <div
                          v-if="getIsChangeLog"
                          key="change-log-loaded"
                        >
                          <record-logs />
                        </div>
                      </el-tab-pane>

                      <el-tab-pane
                        name="listWorkflowLogs"
                      >
                        <span slot="label">
                          <i class="el-icon-s-help" />
                          {{ $t('window.containerInfo.workflowLog') }}
                        </span>
                        <div
                          key="workflow-log-loaded"
                        >
                          <workflow-logs />
                        </div>
                      </el-tab-pane>
                    </el-tabs>
                  </el-card>
                </p>
              </transition>
            </div>
          </el-main>
        </SplitArea>
      </Split>
    </el-container>
  </div>
  <div
    v-else
    key="window-loading"
    v-loading="!isLoaded"
    :element-loading-text="$t('notifications.loading')"
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
// Container Info
import ChatEntries from '@/components/ADempiere/ChatEntries'
import RecordLogs from '@/components/ADempiere/ContainerInfo/recordLogs'
import WorkflowLogs from '@/components/ADempiere/ContainerInfo/workflowLogs'
// Workflow
import WorkflowStatusBar from '@/components/ADempiere/WorkflowStatusBar'

export default {
  name: 'WindowView',
  components: {
    TabParent,
    TabChildren,
    ContextMenu,
    DataTable,
    splitPane,
    ModalDialog,
    ChatEntries,
    RecordLogs,
    WorkflowLogs,
    WorkflowStatusBar
  },
  props: {
    styleSteps: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      windowMetadata: {},
      windowUuid: this.$route.meta.uuid,
      panelType: 'window',
      isLoaded: false,
      // TODO: Manage attribute with store
      activeInfo: 'listChatEntries',
      showContainerInfo: false,
      // TODO: Manage attribute with store
      isShowedRecordPanel: false
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.$store.dispatch('setWindowOldRoute', {
      path: from.path,
      fullPath: from.fullPath,
      params: {
        ...from.params
      },
      query: {
        ...from.query
      }
    })
    next()
  },
  computed: {
    showContextMenu() {
      return this.$store.state.settings.showContextMenu
    },
    defaultPorcentSplitPane() {
      if (this.isShowedRecordPanel) {
        if (this.isShowedRecordNavigation) {
          return 100
        }
        return 50
      }
      if (this.isShowedRecordNavigation) {
        if (this.isMobile) {
          return 100
        }
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
      }
      return 'open-table-detail'
    },
    isSize() {
      if (this.isMobile && this.showContainerInfo) {
        return 98
      }
      return 50
    },
    sizePanel() {
      if (this.showContainerInfo) {
        if (this.isMobile) {
          return 2
        }
        return 50
      }
      return 100
    },
    isCloseInfo() {
      if (this.isMobile) {
        return 'close-info-mobile'
      }
      return 'close-info'
    },
    iconShowedRecordNavigation() {
      if (this.isShowedRecordNavigation) {
        return 'el-icon-caret-left'
      }
      return 'el-icon-caret-right'
    },
    iconIsShowedAside() {
      if (this.isShowedRecordPanel) {
        return 'el-icon-caret-left'
      }
      return 'el-icon-caret-right'
    },
    styleMainTab() {
      if (this.isShowedTabsChildren) {
        return {
          height: 'initial',
          overflow: 'auto'
        }
      }
      return {
        height: 'initial',
        overflow: 'hidden'
      }
    },
    styleTableNavigation() {
      if (this.isShowedRecordNavigation && this.isMobile) {
        return 'open-datatable-aside-mobile'
      }
      return 'open-datatable-aside'
    },
    splitAreaStyle() {
      if (this.isShowedTabsChildren || this.isMobile) {
        return {
          overflowX: 'hidden',
          overflowY: 'auto'
        }
      }
      return {
        overflow: 'hidden'
      }
    },
    styleStepsSimple() {
      const baseStyle = {
        paddingTop: '0px',
        paddingBottom: '0px',
        paddingLeft: '0px',
        paddingRight: '0px',
        borderRadius: '4px',
        background: '#F5F7FA',
        overflowX: 'auto',
        overflowY: 'hidden'
      }
      if (this.isShowedRecordNavigation) {
        return {
          ...baseStyle,
          width: this.$store.getters.getPanelRight + 'px'
        }
      }
      return {
        ...baseStyle,
        width: 'auto'
      }
    },
    sizeAreaStyle() {
      if (this.isShowedTabsChildren) {
        return 50
      }
      return 110
    },
    getterWindow() {
      return this.$store.getters.getWindow(this.windowUuid)
    },
    isShowedTabsChildren() {
      if (this.windowMetadata && this.windowMetadata.isShowedTabsChildren) {
        return this.windowMetadata.isShowedTabsChildren
      }
      return false
    },
    isShowedRecordNavigation() {
      if (this.windowMetadata && this.windowMetadata.isShowedRecordNavigation) {
        return this.windowMetadata.isShowedRecordNavigation
      }
      return false
    },
    getHeightPanelBottom() {
      return this.$store.getters.getSplitHeight - 11
    },
    getterRecordList() {
      return this.$store.getters.getDataRecordsList(this.windowMetadata.currentTabUuid).length
    },
    gettersListRecordLogs() {
      const changeLog = this.$store.getters.getRecordLogs.entityLogs
      if (this.isEmptyValue(changeLog)) {
        return changeLog
      }
      // TODO: Verify it, parse date value
      changeLog.sort((a, b) => {
        const c = new Date(a.logDate)
        const d = new Date(b.logDate)
        return d - c
      })
      return changeLog
    },
    getIsChangeLog() {
      if (this.isEmptyValue(this.gettersListRecordLogs)) {
        return false
      }
      return true
    },
    getIsWorkflowLog() {
      if (this.isEmptyValue(this.$store.getters.getNodeWorkflow)) {
        return false
      }
      return true
    },
    getterShowContainerInfo() {
      return this.$store.getters.getShowContainerInfo
    },
    getterDataRecordsAndSelection() {
      return this.$store.getters.getDataRecordAndSelection(this.windowMetadata.firstTabUuid)
    },
    getterDataRecords() {
      return this.getterDataRecordsAndSelection.record
    },
    getTableName() {
      if (this.windowMetadata && this.windowMetadata.firstTab.tableName) {
        return this.windowMetadata.firstTab.tableName
      }
      return undefined
    },
    // current record
    getRecord() {
      const { action } = this.$route.query
      if (!this.isEmptyValue(action) && action !== 'create-new') {
        return this.getterDataRecords.find(record => {
          return record.UUID === action
        })
      }
      return undefined
    },
    recordId() {
      const currentRecord = this.getRecord
      if (this.isEmptyValue(currentRecord)) {
        return undefined
      }
      return currentRecord[`${this.getTableName}_ID`]
    },
    currentRecord() {
      const currentRecord = this.$store.getters.getCurrentRecord
      if (this.isEmptyValue(currentRecord)) {
        return this.getterDataRecords[0]
      }
      return currentRecord
    },
    isDocument() {
      const panel = this.$store.getters.getPanel(this.windowMetadata.currentTabUuid)
      return panel.isDocument
    },
    isWorkflowBarStatus() {
      const panel = this.$store.getters.getPanel(this.windowMetadata.currentTabUuid)
      if (!this.isEmptyValue(panel) && this.isDocument && this.$route.query.action !== 'create-new') {
        return true
      }
      return false
    }
  },
  watch: {
    $route(value) {
      if (this.showContainerInfo) {
        this.$store.dispatch(this.activeInfo, {
          tableName: this.$route.params.tableName,
          recordId: this.$route.params.recordId
        })
          .then(response => {
            if (value.query.action === 'create-new') {
              this.$store.commit('isNote', false)
            }
          })
      }
    }
  },
  created() {
    this.getWindow()
    if (this.isShowedRecordNavigation) {
      this.handleResize()
    }
    this.$store.dispatch('settings/changeSetting', {
      key: 'showContextMenu',
      value: true
    })
  },
  methods: {
    handleResize() {
      const panelRight = document.getElementById('PanelRight')
      if (!this.isEmptyValue(panelRight)) {
        const widthPanel = panelRight.clientWidth - 350
        this.$store.commit('setPanelRight', widthPanel)
      }
    },
    contentInfo() {
      this.showContainerInfo = !this.showContainerInfo
      if (this.showContainerInfo) {
        let tableName = this.$route.params.tableName
        if (this.isEmptyValue(tableName)) {
          tableName = this.getTableName
        }

        const record = this.currentRecord
        let recordId
        if (!this.isEmptyValue(record)) {
          recordId = record[tableName + '_ID']
        }
        this.$router.push({
          params: {
            recordId,
            tableName
          },
          query: {
            ...this.$route.query
          }
        }, () => {})

        const action = this.$route.query.action
        let recordUuid
        if (!this.isEmptyValue(action) && action !== 'create-new') {
          recordUuid = action
        }

        // TODO: Verify if first tab is document
        this.$store.dispatch('listWorkflowLogs', {
          tableName,
          recordUuid,
          recordId
        })
        this.$store.dispatch(this.activeInfo, {
          tableName,
          recordId,
          recordUuid
        })
      }
      this.$store.dispatch('showContainerInfo', !this.getterShowContainerInfo)
    },
    handleClick(tab, event) {
      let tableName = this.$route.params.tableName
      if (this.isEmptyValue(tableName)) {
        tableName = this.getTableName
      }

      const action = this.$route.query.action
      let recordUuid
      if (!this.isEmptyValue(action) && action !== 'create-new') {
        recordUuid = action
      }

      const record = this.currentRecord
      let recordId
      if (!this.isEmptyValue(record)) {
        recordId = record[tableName + '_ID']
      }

      this.$store.dispatch(tab.name, {
        tableName,
        recordId,
        recordUuid
      })
    },
    // callback new size
    onDrag(size) {
      this.$store.dispatch('setSplitHeightTop', {
        splitHeightTop: size[0]
      })
      this.$store.dispatch('setSplitHeight', {
        splitHeight: size[1]
      })
    },
    // get window from vuex store or server
    getWindow() {
      const window = this.getterWindow
      if (window) {
        this.generateWindow(window)
        return
      }
      this.$store.dispatch('getWindowFromServer', {
        windowUuid: this.windowUuid,
        routeToDelete: this.$route
      })
        .then(response => {
          this.generateWindow(response)
        })
    },
    generateWindow(window) {
      this.windowMetadata = window
      let isShowRecords = this.isShowedRecordNavigation
      if (isShowRecords === undefined) {
        if ((['M', 'Q'].includes(this.windowMetadata.windowType) && this.getterRecordList >= 10 && this.$route.query.action !== 'create-new') ||
          this.$route.query.action === 'advancedQuery') {
          isShowRecords = true
        } else if (this.windowMetadata.windowType === 'T' || this.$route.query.action === 'create-new') {
          isShowRecords = false
        } else if (this.$route.query.action === 'listRecords') {
          isShowRecords = true
          this.handleChangeShowedPanel(true)
        }
        this.handleChangeShowedRecordNavigation(isShowRecords)
      }
      this.isLoaded = true
      const record = this.currentRecord
      this.$store.dispatch('listDocumentStatus', {
        tableName: this.getTableName,
        recordUuid: this.$route.query.action,
        recordId: record[this.getTableName + '_ID']
      })
    },
    handleChangeShowedRecordNavigation(valueToChange) {
      this.$store.dispatch('changeWindowAttribute', {
        parentUuid: this.windowUuid, // act as parentUuid
        window: this.windowMetadata,
        attributeName: 'isShowedRecordNavigation',
        attributeValue: valueToChange
      })
    },
    handleChangeShowedPanel(value) {
      this.isShowedRecordPanel = !this.isShowedRecordPanel
    },
    handleChangeShowedTabChildren(isShowedChilds) {
      this.$store.dispatch('changeWindowAttribute', {
        parentUuid: this.windowUuid, // act as parentUuid
        window: this.windowMetadata,
        attributeName: 'isShowedTabsChildren',
        attributeValue: isShowedChilds
      })
    }
  }
}
</script>

<style scoped>
  .scroll {
    max-height: 60vh;
  }
  /* Enter and leave animations can use different */
  /* durations and timing functions.              */
  .slide-fade-enter-active {
    transition: all .2s ease;
  }
  .slide-fade-leave-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active below version 2.1.8 */ {
    transform: translateX(10px);
    opacity: 0;
  }
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
  .open-datatable-aside-mobile {
    position: absolute;
    top: 41%;
    display: grid;
    z-index: 5;
    right: 1%!important;
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
  .open-detail {
    width: 100%;
    height: 20px;
    position: absolute;
    bottom: 5%;
  }
  .open-left {
    width: 2%;
    height: 97%;
    position: absolute;
    top: 2%;
    left: 1%;
  }
  .el-button-window {
    cursor: pointer;
    background: #FFFFFF;
    border: 1px solid #DCDFE6;
    border-color: #DCDFE6;
    color: white;
    background: #008fd3;
  }
  .close-info {
    top: 40%;
    position: absolute;
  }
  .close-info-mobile {
    top: 29%;
    position: absolute;
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
  .el-step.is-simple .el-step__icon-inner {
    font-size: 18px;
    padding-top: 30px;
  }
  .el-steps--simple {
    /* padding: 13px 8%; */
    padding-top: 0px;
    padding-bottom: 0px;
    padding-left: 0%;
    padding-right: 0px;
    border-radius: 4px;
    background: #F5F7FA;
    overflow-x: auto;
    overflow-y: hidden;
    width: auto;
  }
  .scroll-window-log-change {
    max-height: 74vh !important;
  }
  .scroll-window-log-workflow {
    max-height: 68vh !important;
  }
  .scroll-window-log-chat {
    max-height: 28vh !important;
  }
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
    width: 11px !important;
    /* width: 9px; */
    height: 100%;
    background: gray !important;
    margin-left: -10px;
    /* margin-left: -5px; */
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
