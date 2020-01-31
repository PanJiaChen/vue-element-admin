<template>
  <div
    v-if="isLoaded"
    key="window-loaded"
  >
    <el-container style="height: 86vh;">
      <Split>
        <SplitArea :size="!show ? 100 : 50" :min-size="100">
          <el-aside width="100%">
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
                            class="el-button-window"
                            @click="handleChangeShowedRecordNavigation()"
                          />
                          <el-button
                            v-show="!isPanel"
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
                        <div class="close-datatable">
                          <el-button
                            v-show="isPanel"
                            icon="el-icon-caret-left"
                            circle
                            class="el-button-window"
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
                  <Split v-shortkey="['f8']" direction="vertical" @onDrag="onDrag" @shortkey.native="handleChangeShowedRecordNavigation">
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
                      <el-main :style="styleMainIsShowedTabChildren">
                        <tab-parent
                          :window-uuid="windowUuid"
                          :tabs-list="windowMetadata.tabsListParent"
                          class="tab-window"
                        />
                        <div style="right: 0%;top: 40%;position: absolute;">
                          <el-button v-show="!show" type="info" icon="el-icon-info" circle style="float: right;" class="el-button-window" @click="conteInfo" />
                        </div>
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
                              type="primary"
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
                              type="primary"
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
                              class="el-button-window"
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
          </el-aside>
        </SplitArea>
        <SplitArea :size="show ? 50 : 0">
          <el-main>
            <div style="top: 40%;position: absolute;">
              <el-button v-show="show" type="info" icon="el-icon-info" circle style="float: right;" class="el-button-window" @click="conteInfo" />
            </div>
            <div id="example-1">
              <transition name="slide-fade">
                <p v-if="show">
                  <el-card class="box-card">
                    <el-tabs v-model="activeInfo" @tab-click="handleClick">
                      <el-tab-pane
                        name="listRecordLogs"
                      >
                        <span slot="label"><svg-icon icon-class="tree-table" /> {{ $t('window.containerInfo.changeLog') }} </span>
                        <div
                          v-if="getIsChangeLog"
                        >
                          <el-scrollbar wrap-class="scroll-window-log-change">
                            <el-timeline>
                              <el-timeline-item
                                v-for="(listLogs, key) in gettersListRecordLogs"
                                :key="key"
                                :timestamp="translateDate(listLogs.logDate)"
                                placement="top"
                                color="#008fd3"
                              >
                                <el-card shadow="hover" class="clearfix">
                                  <div>
                                    {{ listLogs.userName }}
                                    <el-link type="primary" style="float: right;" @click="showkey(key)"> {{ $t('window.containerInfo.changeDetail') }} </el-link>
                                  </div>
                                  <br>
                                  <el-collapse-transition>
                                    <div v-show="(currentKey === key)">
                                      <span v-for="(list, index) in listLogs.changeLogs" :key="index">
                                        <p><b> {{ list.displayColumnName }} :</b> <strike> <el-link type="danger"> {{ list.oldDisplayValue }} </el-link> </strike> <el-link type="success"> {{ list.newDisplayValue }} </el-link> </p>
                                      </span>
                                    </div>
                                  </el-collapse-transition>
                                </el-card>
                              </el-timeline-item>
                            </el-timeline>
                          </el-scrollbar>
                        </div>
                        <div
                          v-else
                          v-loading="true"
                          :element-loading-text="$t('notifications.loading')"
                          element-loading-spinner="el-icon-loading"
                          element-loading-background="rgba(255, 255, 255, 0.8)"
                          class="loading-window"
                        />
                      </el-tab-pane>
                      <el-tab-pane
                        name="listWorkflowLogs"
                      >
                        <span slot="label"><i class="el-icon-s-help" /> {{ $t('window.containerInfo.workflowLog') }} </span>
                        <div
                          v-if="getIsWorkflowLog"
                        >
                          <el-card
                            class="box-card"
                          >
                            <el-scrollbar wrap-class="scroll-window-log-workflow">
                              <el-timeline>
                                <el-timeline-item
                                  v-for="(workflow,index) in gettersListWorkflow"
                                  :key="index"
                                  :timestamp="translateDate(workflow.logDate)"
                                  placement="top"
                                >
                                  <el-card shadow="hover">
                                    <div slot="header" class="clearfix">
                                      <span> {{ workflow.workflowName }} </span>
                                    </div>
                                    <div>
                                      <el-steps
                                        :active="workflow.workflowEventsList.length"
                                        align-center
                                        finish-status="success"
                                      >
                                        <el-step
                                          v-for="(nodeList, key) in workflow.workflowEventsList"
                                          :key="key"
                                        >
                                          <span slot="title">
                                            <el-popover
                                              placement="top-start"
                                              width="400"
                                              trigger="hover"
                                            >
                                              <p><b> {{ $t('login.userName') }}:</b> {{ nodeList.userName }} </p>
                                              <p v-if="!isEmptyValue(nodeList.textMessage)"><b> {{ $t('window.containerInfo.logWorkflow.message') }}:</b> {{ nodeList.textMessage }} </p>
                                              <p><b> {{ $t('window.containerInfo.logWorkflow.responsible') }}:</b>  {{ nodeList.responsibleName }} </p>
                                              <p><b> {{ $t('window.containerInfo.logWorkflow.workflowName') }}:</b>  {{ nodeList.workflowStateName }} </p>
                                              <p><b> {{ $t('window.containerInfo.logWorkflow.timeElapsed') }}:</b>  {{ nodeList.timeElapsed }} </p>
                                              <el-button slot="reference" type="text"> {{ nodeList.nodeName }} </el-button>
                                            </el-popover>
                                          </span>
                                        </el-step>
                                      </el-steps>
                                    </div>
                                  </el-card>
                                </el-timeline-item>
                              </el-timeline>
                            </el-scrollbar>
                          </el-card>
                        </div>
                        <div
                          v-else
                          v-loading="true"
                          :element-loading-text="$t('notifications.loading')"
                          element-loading-spinner="el-icon-loading"
                          element-loading-background="rgba(255, 255, 255, 0.8)"
                          class="loading-window"
                        />
                      </el-tab-pane>
                      <el-tab-pane
                        name="listChatEntries"
                      >
                        <span slot="label"><i class="el-icon-s-comment" /> {{ $t('window.containerInfo.notes') }} </span>
                        <div
                          v-if="!gettersLisRecordChats.epale"
                        >
                          <el-card class="box-card">
                            <div slot="header" class="clearfix">
                              <span>{{ $t('window.containerInfo.notes') }}</span>
                            </div>
                            <el-scrollbar wrap-class="scroll-window-log-chat">
                              <el-timeline>
                                <el-timeline-item
                                  v-for="(chats, key) in gettersLischat"
                                  :key="key"
                                  :timestamp="translateDate(chats.logDate)"
                                  placement="top"
                                >
                                  <el-card shadow="hover">
                                    <div>
                                      <span>{{ chats.userName }}</span>
                                      <span>{{ chats.characterData }}</span>
                                    </div>
                                  </el-card>
                                </el-timeline-item>
                              </el-timeline>
                            </el-scrollbar>
                          </el-card>
                        </div>
                        <div>
                          <el-card class="box-card">
                            <div slot="header" class="clearfix">
                              {{ $t('window.containerInfo.logWorkflow.addNote') }}
                            </div>
                            <el-input
                              v-model="chatNote"
                              type="chatNote"
                              :rows="2"
                              placeholder="Please input"
                              @keyup.enter.native="sendComment(chatNote)"
                            />
                          </el-card>
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
      activeInfo: 'listRecordLogs',
      show: false,
      chatNote: '',
      typeAction: 0,
      isLoadingFromServer: false,
      listRecordNavigation: 0,
      currentKey: 100,
      isShowedTabChildren: true,
      isShowedRecordPanel: false,
      isShowedRecordNavigation: this.$route.query.action === 'advancedQuery'
    }
  },
  beforeRouteUpdate(to, from, next) {
    // this.activeName = this.$t('window.containerInfo.changeLog')
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
    },
    gettersListRecordLogs() {
      return this.$store.getters.getRecordLogs.recorLogs
    },
    getIsChangeLog() {
      if (this.isEmptyValue(this.gettersListRecordLogs)) {
        return false
      }
      return true
    },
    getIsWorkflowLog() {
      if (this.isEmptyValue(this.gettersListWorkflow)) {
        return false
      }
      return true
    },
    getIsChat() {
      if (this.isEmptyValue(this.gettersLisRecordChats)) {
        return false
      }
      return true
    },
    getTypeLogs() {
      const groupLog = this.gettersListRecordLogs.reduce((groupLog, item) => {
        if (!groupLog.includes(item.logId)) {
          groupLog.push(item.logId)
        }
        return groupLog
      }, [])
        .map(log => {
          // agrup for logId
          return {
            logs: this.gettersListRecordLogs.filter(change => change.logId === log),
            logId: log
          }
        })
      return groupLog
    },
    gettersLischat() {
      return this.$store.getters.getChatEntries.chatEntriesList
    },
    gettersLisRecordChats() {
      return this.$store.getters.getListRecordChats
    },
    gettersListWorkflow() {
      return this.$store.getters.getWorkflow
    },
    gettersrecorCount() {
      return 1
    },
    language() {
      return this.$store.getters.language
    },
    getterShowContainerInfo() {
      return this.$store.getters.getShowContainerInfo
    }
  },
  watch: {
    $route(value) {
      this.$store.dispatch('listChatEntries', {
        tableName: value.params.tableName,
        recordId: value.params.recordId
      })
    },
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
    sendComment(comment) {
      this.$store.dispatch('createChatEntry', {
        tableName: this.$route.params.tableName,
        recordId: this.$route.params.recordId,
        comment: comment
      })
      this.chatNote = ''
    },
    showkey(key, index) {
      if (key === this.currentKey && index === this.typeAction) {
        this.currentKey = 1000
      } else {
        this.currentKey = key
        this.typeAction = index
      }
    },
    changeField(log) {
      this.$store.dispatch('notifyPanelChange', {
        newValues: log.oldDisplayValue,
        isSendToServer: false,
        isSendCallout: false,
        isPrivateAccess: false
      })
    },
    translateDate(value) {
      return this.$d(new Date(value), 'long', this.language)
    },
    conteInfo() {
      this.show = !this.show
      this.$store.dispatch('listChatEntries', {
        tableName: this.$route.params.tableName,
        recordId: this.$route.params.recordId
      })
      this.$store.dispatch('showContainerInfo', !this.getterShowContainerInfo)
      if (this.show) {
        this.$store.dispatch('listRecordLogs', {
          tableName: this.$route.params.tableName,
          recordId: this.$route.params.recordId
        })
      }
    },
    handleClick(tab, event) {
      this.$store.dispatch(tab.name, {
        tableName: this.$route.params.tableName,
        recordId: this.$route.params.recordId
      })
    },
    refres() {
      this.$store.dispatch('listWorkflowLogs', {
        tableName: this.$route.params.tableName,
        recordId: this.$route.params.recordId
      })
      this.$store.dispatch('listRecordLogs', {
        tableName: this.$route.params.tableName,
        recordId: this.$route.params.recordId
      })
      this.$store.dispatch('listChatEntries', {
        tableName: this.$route.params.tableName,
        recordId: this.$route.params.recordId
      })
    },
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
  .el-button-window {
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
  .scroll-window-log-change {
    max-height: 74vh !important;
  }
  .scroll-window-log-workflow {
    max-height: 68vh !important;
  }
  .scroll-window-log-chat {
    max-height: 45vh !important;
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
