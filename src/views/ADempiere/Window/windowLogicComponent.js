
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

/**
 * Window Logic Component View
 * Build and show window, tab and records view, generates with
 * metadata from adempiere dictionary aplication.
 * @author Edwin Betancourt <EdwinBetanc0urt@outlook.com>
 * TODO: Add manage record change and set with common method
 */
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
      const tableName = this.getTableName
      let recordId
      if (!this.isEmptyValue(record)) {
        recordId = record[tableName + '_ID']
      }
      this.$store.dispatch('listDocumentStatus', {
        tableName,
        recordUuid: this.$route.query.action,
        recordId
      })
    },
    handleChangeShowedRecordNavigation(valueToChange) {
      const panelRight = document.getElementById('PanelRight')
      const heightPanel = panelRight.clientHeight + 50
      this.$store.dispatch('setHeight', heightPanel)
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
