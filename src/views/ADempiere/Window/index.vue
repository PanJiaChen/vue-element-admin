<template>
  <div
    v-if="isLoaded"
    key="window-loaded"
  >
    <el-container style="height: 86vh;">
      <Split>
        <SplitArea :size="!show ? 100 : 70" :min-size="100">
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
                          <el-button v-show="!show" type="info" icon="el-icon-info" circle style="float: right;" @click="conteInfo" />
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
          </el-aside>
        </SplitArea>
        <SplitArea :size="show ? 30 : 0">
          <el-main>
            <div style="top: 40%;position: absolute;">
              <el-button v-show="show" type="info" icon="el-icon-info" circle style="float: right;" @click="conteInfo" />
            </div>
            <div id="example-1">
              <transition name="slide-fade">
                <p v-if="show">
                  <el-card class="box-card">
                    <el-tabs v-model="activeName" @tab-click="handleClick">
                      <el-tab-pane
                        :label="$t('window.containerInfo.changeLog')"
                        name="listRecordLogs"
                        style="overflow: auto;max-height: 74vh;"
                      >
                        <span slot="label"><svg-icon icon-class="tree-table" /> {{ $t('window.containerInfo.changeLog') }} </span>
                        <div
                          v-if="getIsChangeLog"
                        >
                          <el-card
                            v-for="(listLogs, index) in getTypeLogs"
                            :key="index"
                          >
                            <el-timeline>
                              <el-timeline-item
                                v-for="(evenType, key) in listLogs.logs"
                                :key="key"
                                :timestamp="translateDate(evenType.logDate)"
                                placement="top"
                                :color="listLogs.eventType === 1 ? 'rgb(22, 130, 230)' : 'rgba(67, 147, 239, 1)'"
                              >
                                <el-card shadow="hover" @click.native="changeField(evenType)">
                                  <div>
                                    <span>{{ evenType.userName }}</span>
                                    <el-dropdown style="float: right;">
                                      <span class="el-dropdown-link" style="color: #1682e6" @click="showkey(key)">
                                        {{ $t('window.containerInfo.changeDetail') }}
                                      </span>
                                    </el-dropdown>
                                  </div>
                                  <br>
                                  <el-collapse-transition>
                                    <div v-show="currentKey === key" :key="key" class="text item">
                                      <span><p><b><i> {{ evenType.displayColumnName }}:  </i></b> <strike>{{ evenType.oldDisplayValue }} </strike>     {{ evenType.newDisplayValue }}</p></span>
                                    </div>
                                  </el-collapse-transition>
                                </el-card>
                              </el-timeline-item>
                            </el-timeline>
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
                        name="listWorkflowLogs"
                      >
                        <span slot="label"><i class="el-icon-s-help" /> {{ $t('window.containerInfo.workflowLog') }} </span>
                        <div
                          v-if="getIsWorkflowLog"
                        >
                          <el-card
                            class="box-card"
                          >
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
                                      :space="200"
                                      :active="workflow.workflowState"
                                      align-center
                                      process-status="process"
                                    >
                                      <el-step
                                        v-for="(nodeList, key) in workflow.workflowEventsList"
                                        :key="key"
                                        :title="nodeList.nodeName"
                                        :description="$t('login.userName')+ '' + nodeList.userName"
                                      />
                                    </el-steps>
                                  </div>
                                </el-card>
                              </el-timeline-item>
                            </el-timeline>
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
                          v-if="getIsChat"
                        >
                          <el-card class="box-card">
                            <div slot="header" class="clearfix">
                              <span>{{ $t('window.containerInfo.notes') }} {{ gettersLisRecordChats[0].description }} </span>
                            </div>
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
      activeName: 'listRecordLogs',
      show: false,
      isLoadingFromServer: false,
      listRecordNavigation: 0,
      show3: false,
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
      } else {
        return true
      }
    },
    getIsWorkflowLog() {
      if (this.isEmptyValue(this.gettersListWorkflow)) {
        return false
      } else {
        return true
      }
    },
    getIsChat() {
      if (this.isEmptyValue(this.gettersLischat)) {
        return false
      } else {
        return true
      }
    },
    getTypeLogs() {
      const reducer = this.gettersListRecordLogs.reduce((reducer, item) => {
        if (!reducer.includes(item.logId)) {
          reducer.push(item.logId)
        }
        return reducer
      }, [])
        .map(i => {
          // agrup for logId
          return {
            logs: this.gettersListRecordLogs.filter(b => b.logId === i),
            logId: i
          }
        })
      return reducer
      // }
    },
    gettersLischat() {
      return this.$store.getters.getChatEntries.chatEntriesList
    },
    gettersLisRecordChats() {
      return this.$store.getters.getListRecordChats.recordChatsList
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
    showkey(key) {
      if (key === this.currentKey) {
        this.currentKey = 1000
      } else {
        this.currentKey = key
      }
      this.show3 = !this.show3
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
      if (tab.name === 'listChatEntries') {
        this.$store.dispatch(tab.name, {
          tableName: this.$route.params.tableName,
          recordId: this.$route.params.recordId
        })
      } else {
        this.$store.dispatch(tab.name, {
          tableName: this.$route.params.tableName,
          recordId: this.$route.params.recordId
        })
      }
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
