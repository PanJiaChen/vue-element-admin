import { showNotification, showMessage } from '@/utils/ADempiere/notification'
import Item from './items'
import { convertFieldListToShareLink, recursiveTreeSearch } from '@/utils/ADempiere/valueUtils'
import { supportedTypes, exportFileFromJson } from '@/utils/ADempiere/exportUtil'
import ROUTES from '@/utils/ADempiere/zoomWindow'

export const contextMixin = {
  components: {
    Item
  },
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
    tableName: {
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
    },
    defaultFromatExport: {
      type: String,
      default: 'xlsx'
    }
  },
  data() {
    return {
      actions: [],
      supportedTypes: supportedTypes,
      references: [],
      file: this.$store.getters.getProcessResult.download,
      downloads: this.$store.getters.getProcessResult.url,
      metadataMenu: {},
      recordUuid: this.$route.query.action,
      isLoadedReferences: false,
      exportDefault: 'xls',
      ROUTES
    }
  },
  computed: {
    activeMenu() {
      const { meta, path } = this.$route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    getterContextMenu() {
      return this.$store.getters.getContextMenu(this.containerUuid)
    },
    isReferecesContent() {
      if (this.panelType === 'window' && !this.isEmptyValue(this.recordUuid) && this.recordUuid !== 'create-new') {
        return true
      }
      return false
    },
    getterReferences() {
      if (this.isReferecesContent) {
        return this.$store.getters.getReferencesList(this.parentUuid, this.recordUuid)
      }
      return []
    },
    relationsList() {
      let menuUuid = this.$route.params.menuParentUuid
      if (this.isEmptyValue(menuUuid)) {
        menuUuid = this.menuParentUuid
      }
      const relations = this.$store.getters.getRelations(menuUuid)
      return relations.children
    },
    permissionRoutes() {
      return this.$store.getters.permission_routes
    },
    valuesPanelToShare() {
      return this.$store.getters.getParametersToShare({
        containerUuid: this.containerUuid,
        isOnlyDisplayed: true,
        isAdvancedQuery: this.$route.query.action === 'advancedQuery'
      })
    },
    getterFieldList() {
      return this.$store.getters.getFieldsListFromPanel(this.containerUuid)
    },
    getterFieldListHeader() {
      const header = this.getterFieldList.filter(fieldItem => {
        const isDisplayed = fieldItem.isDisplayed || fieldItem.isDisplayedFromLogic
        if (fieldItem.isActive && isDisplayed && !fieldItem.isKey) {
          return fieldItem.name
        }
      })
      return header.map(fieldItem => {
        return fieldItem.name
      })
    },
    getterFieldListValue() {
      const value = this.getterFieldList.filter(fieldItem => {
        const isDisplayed = fieldItem.isDisplayed || fieldItem.isDisplayedFromLogic
        if (fieldItem.isActive && isDisplayed && !fieldItem.isKey) {
          return fieldItem
        }
      })
      return value.map(fieldItem => {
        if (fieldItem.componentPath === 'FieldSelect') {
          return 'DisplayColumn_' + fieldItem.columnName
        } else {
          return fieldItem.columnName
        }
      })
    },
    isDisabledExportRecord() {
      if (this.panelType === 'browser') {
        return this.getDataSelection.length < 1
      }
      return false
    },
    getterDataRecordsAll() {
      return this.$store.getters.getDataRecordAndSelection(this.containerUuid)
    },
    getDataSelection() {
      return this.getterDataRecordsAll.selection
    },
    getDataRecord() {
      return this.getterDataRecordsAll.record.filter(fieldItem => {
        if (this.recordUuid === fieldItem.UUID) {
          return fieldItem
        }
      })
    },
    getterDataLog() {
      if (this.panelType === 'window') {
        return this.$store.getters.getDataLog(this.containerUuid, this.recordUuid)
      }
      return undefined
    },
    processParametersExecuted() {
      return this.$store.getters.getCachedReport(this.$route.params.instanceUuid).parameters
    },
    getterWindowOldRoute() {
      if (this.panelType === 'window') {
        const oldRoute = this.$store.state.windowControl.windowOldRoute
        if (!this.isEmptyValue(oldRoute.query.action) && oldRoute.query.action !== 'create-new' && this.$route.query.action === 'create-new') {
          return oldRoute
        }
      }
      return false
    },
    metadataReport() {
      return this.$store.getters.getCachedReport(this.$route.params.instanceUuid)
    },
    isPersonalLock() {
      return this.$store.getters['user/getIsPersonalLock']
    },
    listDocumentActions() {
      return this.$store.getters.getListDocumentActions.documentActionsList
    },
    isManageDataRecords() {
      return ['browser', 'window'].includes(this.panelType)
    }
  },
  watch: {
    '$route.query.action'(actionValue) {
      this.recordUuid = actionValue
      // only requires updating the context menu if it is Window
      if (this.panelType === 'window') {
        this.generateContextMenu()
        this.getReferences()
      }
    },
    isInsertRecord(newValue, oldValue) {
      if (this.panelType === 'window' && newValue !== oldValue) {
        this.generateContextMenu()
      }
    },
    getterDataLog(newValue, oldValue) {
      if (this.panelType === 'window' && newValue !== oldValue) {
        this.generateContextMenu()
      }
    },
    isDisabledExportRecord(isDisabled) {
      if (isDisabled) {
        this.$nextTick(() => {
          // close childs items in exportRecord menu
          this.$refs.contextMenu.close('exportRecord')
        })
      }
    }
  },
  created() {
    this.generateContextMenu()
  },
  mounted() {
    this.getReferences()
  },
  methods: {
    showMessage,
    showNotification,
    actionContextMenu(event) {
      switch (event.srcKey) {
        case 'f2':
          this.$store.dispatch('resetPanelToNew', {
            parentUuid: this.parentUuid,
            containerUuid: this.containerUuid,
            recordUuid: this.recordUuid,
            panelType: 'window',
            isNewRecord: true
          })
          break
        case 'f3':
          this.$store.dispatch('deleteEntity', {
            parentUuid: this.parentUuid,
            containerUuid: this.containerUuid,
            recordUuid: this.recordUuid
          })
          break
        case 'f5':
          this.refreshData()
          break
      }
    },
    refreshData() {
      if (this.panelType === 'window') {
        this.$store.dispatch('getDataListTab', {
          parentUuid: this.parentUuid,
          containerUuid: this.containerUuid,
          isRefreshPanel: true,
          recordUuid: this.recordUuid
        })
      } else if (this.panelType === 'browser') {
        const fieldsEmpty = this.$store.getters.getFieldListEmptyMandatory({
          containerUuid: this.containerUuid,
          fieldsList: this.getterFieldList
        })
        if (fieldsEmpty.length) {
          this.showMessage({
            message: this.$t('notifications.mandatoryFieldMissing') + fieldsEmpty,
            type: 'info'
          })
        } else {
          this.$store.dispatch('getBrowserSearch', {
            containerUuid: this.containerUuid,
            isClearSelection: true
          })
        }
      }
    },
    getReferences() {
      if (this.isReferecesContent) {
        const references = this.getterReferences
        if (references && references.length) {
          this.references = references
          this.isLoadedReferences = true
        } else {
          this.isLoadedReferences = false
          this.$store.dispatch('getReferencesListFromServer', {
            parentUuid: this.parentUuid,
            containerUuid: this.containerUuid,
            tableName: this.tableName,
            recordUuid: this.recordUuid
          })
            .then(() => {
              this.references = this.getterReferences
            })
            .catch(error => {
              console.warn(`References Load Error ${error.code}: ${error.message}.`)
            })
            .finally(() => {
              this.isLoadedReferences = true
            })
        }
      } else {
        this.references = []
        this.isLoadedReferences = false
      }
    },
    exportRecord(fotmatToExport) {
      const tHeader = this.getterFieldListHeader
      const filterVal = this.getterFieldListValue
      let list = []
      if (this.panelType === 'window') {
        list = this.getDataRecord
      } else if (this.panelType === 'browser') {
        // TODO: Check usage as the selection is exported with the table menu
        list = this.getDataSelection
      }
      const data = this.formatJson(filterVal, list)
      exportFileFromJson({
        header: tHeader,
        data,
        filename: '',
        exportType: fotmatToExport
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    generateContextMenu() {
      this.metadataMenu = this.getterContextMenu

      // the function is broken avoiding that an error is generated when closing
      // session being in a window, since the store of vuex is cleaned, being
      // this.metadataMenu with value undefined
      if (this.isEmptyValue(this.metadataMenu)) {
        return
      }

      // TODO: Add store attribute to avoid making repeated requests
      if (this.panelType === 'window' && !this.isEmptyValue(this.$route.params.tableName)) {
        this.$store.dispatch('getPrivateAccessFromServer', {
          tableName: this.$route.params.tableName,
          recordId: this.$route.params.recordId
        })
          .then(privateAccessResponse => {
            if (!this.isEmptyValue(privateAccessResponse)) {
              this.$nextTick(() => {
                this.validatePrivateAccess(privateAccessResponse)
              })
            }
          })
      }
      this.actions = this.metadataMenu.actions
      if (this.panelType === 'window') {
        const processAction = this.actions.find(item => {
          if (item.name === 'Procesar Orden' || (item.name === 'Process Order')) {
            return item
          }
        })
        this.$store.dispatch('setOrder', processAction)
      }

      if (this.actions && this.actions.length) {
        this.actions.forEach(itemAction => {
          if (this.$route.meta.type === 'report' && itemAction.action === 'startProcess') {
            itemAction.reportExportType = 'html'
          }

          // if no exists set prop with value
          itemAction.disabled = false
          if ((this.$route.name !== 'Report Viewer' && itemAction.action === 'changeParameters') ||
             (this.$route.meta.type === 'process' && itemAction.type === 'summary')) {
            itemAction.disabled = true
          }

          if (this.$route.meta.type === 'window') {
            if (this.recordUuid === 'create-new' || !this.isInsertRecord) {
              itemAction.disabled = true
            }
            // rollback
            if (itemAction.action === 'undoModifyData') {
              itemAction.disabled = Boolean(!this.getterDataLog && !this.getterWindowOldRoute)
            }
          }
        })
      }
    },
    showModal(action) {
      // TODO: Refactor and remove redundant dispatchs
      if (action.type === 'process') {
        // Add context from view open in process to opening
        if (action.parentUuidAssociated || action.containerUuidAssociated) {
          const contextValues = this.$store.getters.getContextView({
            parentUuid: action.parentUuidAssociated,
            containerUuid: action.containerUuidAssociated
          })
          if (!this.isEmptyValue(contextValues)) {
            this.$store.dispatch('setMultipleContextView', {
              containerUuid: action.uuid,
              values: contextValues
            })
          }
        }

        // open modal dialog with metadata
        this.$store.dispatch('setShowDialog', {
          type: action.type,
          action: {
            ...action,
            containerUuid: action.uuid
          }
        })
      }
    },
    runAction(action) {
      if (action.type === 'action') {
        // run process or report
        const fieldNotReady = this.$store.getters.isNotReadyForSubmit(this.$route.meta.uuid)
        if (!fieldNotReady) {
          let containerParams = this.$route.meta.uuid
          if (this.lastParameter !== undefined) {
            containerParams = this.lastParameter
          }

          var parentMenu = this.menuParentUuid
          if (this.$route.params) {
            if (this.$route.params.menuParentUuid) {
              parentMenu = this.$route.params.menuParentUuid
            }
          }
          if (this.panelType === 'process') {
            this.$store.dispatch('setTempShareLink', {
              processId: this.$route.params.processId,
              href: window.location.href
            })
          }

          let reportFormat = action.reportExportType
          if (this.isEmptyValue(reportFormat)) {
            reportFormat = this.$route.query.reportType
            if (this.isEmptyValue(reportFormat)) {
              reportFormat = this.$route.meta.reportFormat
              if (this.isEmptyValue(reportFormat)) {
                reportFormat = 'html'
              }
            }
          }

          this.$store.dispatch(action.action, {
            action,
            parentUuid: this.containerUuid,
            containerUuid: containerParams, // EVALUATE IF IS action.uuid
            panelType: this.panelType, // determinate if get table name and record id (window) or selection (browser)
            reportFormat: reportFormat, // this.$route.query.reportType ? this.$route.query.reportType : action.reportExportType,
            menuParentUuid: parentMenu, // to load relationsList in context menu (report view)
            routeToDelete: this.$route
          })
            .catch(error => {
              console.warn(error)
            })
        } else {
          this.showNotification({
            type: 'warning',
            title: this.$t('notifications.emptyValues'),
            name: '<b>' + fieldNotReady.name + '.</b> ',
            message: this.$t('notifications.fieldMandatory')
          })
        }
      } else if (action.type === 'process') {
        // run process associate with view (window or browser)
        this.showModal(action)
      } else if (action.type === 'dataAction') {
        if (action.action === 'undoModifyData' && Boolean(!this.getterDataLog) && this.getterWindowOldRoute) {
          this.$router.push({
            path: this.getterWindowOldRoute.path,
            query: {
              ...this.getterWindowOldRoute.query
            }
          })
        } else {
          this.$store.dispatch(action.action, {
            parentUuid: this.parentUuid,
            containerUuid: this.containerUuid,
            recordUuid: this.recordUuid,
            panelType: this.panelType,
            isNewRecord: action.action === 'resetPanelToNew',
            tableName: action.tableName,
            recordId: action.recordId
          })
            .then(response => {
              if (response && response.isPrivateAccess) {
                this.validatePrivateAccess(response)
              }
            })
        }
      } else if (action.type === 'updateReport') {
        const updateReportParams = {
          instanceUuid: action.instanceUuid,
          processUuid: action.processUuid,
          tableName: action.tableName,
          processId: action.processId,
          printFormatUuid: action.printFormatUuid,
          reportViewUuid: action.reportViewUuid,
          isSummary: false,
          reportName: this.$store.getters.getProcessResult.name,
          reportType: this.$store.getters.getReportType,
          option: action.option
        }
        if (this.isEmptyValue(updateReportParams.instanceUuid)) {
          updateReportParams.instanceUuid = this.$route.params.instanceUuid
        }
        if (this.isEmptyValue(updateReportParams.processId)) {
          updateReportParams.processId = this.$route.params.processId
        }
        this.$store.dispatch('getReportOutputFromServer', updateReportParams)
          .then(response => {
            if (!response.isError) {
              let link = {
                href: undefined,
                download: undefined
              }

              const blob = new Blob(
                [response.outputStream],
                { type: response.mimeType }
              )
              link = document.createElement('a')
              link.href = window.URL.createObjectURL(blob)
              link.download = response.fileName
              if (response.reportType !== 'pdf' && response.reportType !== 'html') {
                link.click()
              }
              response.url = link.href
            }
            this.$store.dispatch('finishProcess', {
              processOutput: response
            })
          })
      }
    },
    openReference(referenceElement) {
      if (referenceElement.windowUuid && referenceElement.recordUuid) {
        const viewSearch = recursiveTreeSearch({
          treeData: this.permissionRoutes,
          attributeValue: referenceElement.windowUuid,
          attributeName: 'meta',
          secondAttribute: 'uuid',
          attributeChilds: 'children'
        })
        if (viewSearch) {
          this.$router.push({
            name: viewSearch.name,
            query: {
              action: referenceElement.type,
              referenceUuid: referenceElement.uuid,
              recordUuid: referenceElement.recordUuid,
              // windowUuid: this.parentUuid,
              tabParent: 0
            }
          })
        } else {
          this.showMessage({
            type: 'error',
            message: this.$t('notifications.noRoleAccess')
          })
        }
      }
    },
    setShareLink() {
      let shareLink = this.panelType === 'window' || window.location.href.includes('?') ? `${window.location.href}&` : `${window.location.href}?`
      if (this.$route.name === 'Report Viewer') {
        const processParameters = convertFieldListToShareLink(this.processParametersExecuted)
        const reportFormat = this.$store.getters.getReportType
        shareLink = this.$store.getters.getTempShareLink
        if (String(processParameters).length) {
          shareLink += '?' + processParameters
          shareLink += `&reportType=${reportFormat}`
        }
      } else {
        if (String(this.valuesPanelToShare).length) {
          shareLink += this.valuesPanelToShare
        }
        if (this.$route.query.action && this.$route.query.action !== 'create-new' && this.$route.query.action !== 'reference' && this.$route.query.action !== 'advancedQuery' && this.$route.query.action !== 'criteria') {
          shareLink = window.location.href
        }
      }
      if (shareLink !== this.$route.fullPath) {
        this.activeClipboard(shareLink)
      }
    },
    fallbackCopyTextToClipboard(text) {
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      try {
        if (document.execCommand('copy')) {
          this.clipboardMessage(this.$t('notifications.copySuccessful'))
        }
      } catch (err) {
        this.clipboardMessage(this.$t('notifications.copyUnsuccessful'))
      }
      document.body.removeChild(textArea)
    },
    activeClipboard(text) {
      if (!navigator.clipboard) {
        this.fallbackCopyTextToClipboard(text)
        return
      }
      navigator.clipboard.writeText(text)
        .then(() => {
          this.clipboardMessage(this.$t('notifications.copySuccessful'))
        })
        .catch(() => {
          this.clipboardMessage(this.$t('notifications.copyUnsuccessful'))
        })
      navigator.clipboard.writeText(text)
    },
    clipboardMessage(message) {
      this.$message({
        message: message,
        type: 'success',
        duration: 1500
      })
    },
    redirect() {
      this.$router.push({
        name: ROUTES.PRINT_FORMAT_SETUP_WINDOW.uuid,
        query: {
          action: this.metadataReport.output.printFormatUuid,
          tabParent: ROUTES.PRINT_FORMAT_SETUP_WINDOW.tabParent
        }
      })
    },
    validatePrivateAccess({ isLocked, tableName, recordId }) {
      if (this.isPersonalLock) {
        if (isLocked) {
          this.actions = this.actions.map(actionItem => {
            if (actionItem.action === 'unlockRecord') {
              return {
                ...actionItem,
                hidden: false,
                tableName,
                recordId
              }
            } else if (actionItem.action === 'lockRecord') {
              return {
                ...actionItem,
                hidden: true
              }
            }
            return actionItem
          })
        } else {
          this.actions = this.actions.map(actionItem => {
            if (actionItem.action === 'lockRecord') {
              return {
                ...actionItem,
                hidden: false,
                tableName,
                recordId
              }
            } else if (actionItem.action === 'unlockRecord') {
              return {
                ...actionItem,
                hidden: true
              }
            }
            return actionItem
          })
        }
      }
    }
  }
}
