// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Yamel Senih ysenih@erpya.com www.erpya.com
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { showNotification } from '@/utils/ADempiere/notification.js'
import ItemsRelations from './itemsRelations'
import { clientDateTime, convertFieldsListToShareLink, recursiveTreeSearch } from '@/utils/ADempiere/valueUtils.js'
import { supportedTypes, exportFileFromJson } from '@/utils/ADempiere/exportUtil.js'
import ROUTES from '@/utils/ADempiere/constants/zoomWindow'
import relationsMixin from './relationsMixin.js'

export default {
  name: 'MixinContextMenu',
  mixins: [
    relationsMixin
  ],
  components: {
    ItemsRelations
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
    },
    isDisplayed: {
      type: Boolean,
      default: false
    },
    isListRecord: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      actions: [],
      supportedTypes,
      references: [],
      file: this.$store.getters.getProcessResult.download,
      downloads: this.$store.getters.getProcessResult.url,
      metadataMenu: {},
      recordUuid: this.$route.query.action,
      isLoadedReferences: false
    }
  },
  computed: {
    getterContextMenu() {
      return this.$store.getters.getContextMenu(this.containerUuid)
    },
    isWindow() {
      return this.panelType === 'window'
    },
    isWithRecord() {
      return !this.isEmptyValue(this.recordUuid) && this.recordUuid !== 'create-new'
    },
    isReferecesContent() {
      if (this.isWindow && this.isWithRecord) {
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
    permissionRoutes() {
      return this.$store.getters.permission_routes
    },
    valuesPanelToShare() {
      let containerUuid = this.containerUuid
      if (this.$route.query.action === 'advancedQuery') {
        containerUuid = 'table_' + containerUuid
      }

      return this.$store.getters.getParametersToShare({
        containerUuid,
        isOnlyDisplayed: true
      })
    },
    getterFieldsList() {
      return this.$store.getters.getFieldsListFromPanel(this.containerUuid)
    },
    getterFieldsListHeader() {
      const header = this.getterFieldsList.filter(fieldItem => {
        const isDisplayed = fieldItem.isDisplayed || fieldItem.isDisplayedFromLogic
        if (fieldItem.isActive && isDisplayed && !fieldItem.isKey) {
          return fieldItem.name
        }
      })
      return header.map(fieldItem => {
        return fieldItem.name
      })
    },
    getterFieldsListValue() {
      const value = this.getterFieldsList.filter(fieldItem => {
        const isDisplayed = fieldItem.isDisplayed || fieldItem.isDisplayedFromLogic
        if (fieldItem.isActive && isDisplayed && !fieldItem.isKey) {
          return fieldItem
        }
      })
      return value.map(fieldItem => {
        if (fieldItem.componentPath === 'FieldSelect') {
          return fieldItem.displayColumnName
        }
        return fieldItem.columnName
      })
    },
    isDisabledExportRecord() {
      if (this.panelType === 'browser') {
        return this.getDataSelection.length < 1
      }
      return false
    },
    getAllDataRecords() {
      return this.$store.getters.getDataRecordAndSelection(this.containerUuid)
    },
    getDataSelection() {
      return this.getAllDataRecords.selection
    },
    getDataRecord() {
      return this.getAllDataRecords.record.filter(fieldItem => {
        if (this.recordUuid === fieldItem.UUID) {
          return fieldItem
        }
      })
    },
    getDataLog() {
      if (this.isWindow) {
        return this.$store.getters.getDataLog(this.containerUuid, this.recordUuid)
      }
      return undefined
    },
    processParametersExecuted() {
      return this.$store.getters.getCachedReport(this.$route.params.instanceUuid).parameters
    },
    getOldRouteOfWindow() {
      if (this.isWindow) {
        const oldRoute = this.$store.state['windowControl/index'].windowOldRoute
        if (!this.isEmptyValue(oldRoute.query.action) && oldRoute.query.action !== 'create-new' && this.$route.query.action === 'create-new') {
          return oldRoute
        }
      }
      return false
    },
    getReportDefinition() {
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
    },
    shorcutKey() {
      return {
        defaultValues: ['f2'],
        deleteRecord: ['f3'],
        deleteRecord2: ['ctrl', 'd'],
        refreshData: ['f5']
      }
    },
    getCurrentRecord() {
      const record = this.getAllDataRecords.record.find(fieldItem => {
        if (this.recordUuid === fieldItem.UUID) {
          return fieldItem
        }
      })
      if (!this.isEmptyValue(record)) {
        return record
      }
      return {}
    },
    tableNameCurrentTab() {
      const current = this.$store.getters.getWindow(this.getterContextMenu.actions[0].uuidParent).tabs[0]
      if (!this.isEmptyValue(current)) {
        return current.tableName
      }
      return ''
    },
    isLockRecord() {
      return this.$store.getters['user/getRole'].isPersonalLock
    },
    recordAccess() {
      return {
        action: 'recordAccess',
        disabled: false,
        hidden: false,
        isSortTab: true,
        name: this.$t('data.recordAccess.actions'),
        type: 'dataAction',
        tableName: this.tableNameCurrentTab
      }
    }
  },
  watch: {
    '$route.query.action'(actionValue) {
      this.recordUuid = actionValue
      // only requires updating the context menu if it is Window
      if (this.isWindow) {
        this.generateContextMenu()
        this.getReferences()
      }
    },
    isInsertRecord(newValue, oldValue) {
      if (this.isWindow && newValue !== oldValue) {
        this.generateContextMenu()
      }
    },
    getDataLog(newValue, oldValue) {
      if (this.isWindow && newValue !== oldValue) {
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
  methods: {
    showNotification,
    actionContextMenu(event) {
      switch (event.srcKey) {
        case 'defaultValues':
          this.$store.dispatch('setDefaultValues', {
            parentUuid: this.parentUuid,
            containerUuid: this.containerUuid,
            recordUuid: this.recordUuid,
            panelType: 'window',
            isNewRecord: true
          })
          break
        case 'deleteRecord':
        case 'deleteRecord2':
          this.$store.dispatch('deleteEntity', {
            parentUuid: this.parentUuid,
            containerUuid: this.containerUuid,
            recordUuid: this.recordUuid
          })
          break
        case 'refreshData':
          this.refreshData()
          break
      }
    },
    refreshData() {
      if (this.isWindow) {
        this.$store.dispatch('getDataListTab', {
          parentUuid: this.parentUuid,
          containerUuid: this.containerUuid,
          isRefreshPanel: true,
          recordUuid: this.recordUuid
        })
          .catch(error => {
            console.warn(`Error getting data list tab. Message: ${error.message}, code ${error.code}.`)
          })
      } else if (this.panelType === 'browser') {
        const fieldsEmpty = this.$store.getters.getFieldsListEmptyMandatory({
          containerUuid: this.containerUuid,
          fieldsList: this.getterFieldsList
        })
        if (fieldsEmpty.length) {
          this.$message({
            message: this.$t('notifications.mandatoryFieldMissing') + fieldsEmpty,
            type: 'info',
            showClose: true
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
      const tHeader = this.getterFieldsListHeader
      const filterVal = this.getterFieldsListValue
      let list = []
      if (this.isWindow) {
        list = this.getDataRecord
      } else if (this.panelType === 'browser') {
        // TODO: Check usage as the selection is exported with the table menu
        list = this.getDataSelection
      }

      let title = this.metadataMenu.name
      if (this.isEmptyValue(title)) {
        title = this.$route.meta.title
      }

      const data = this.formatJson(filterVal, list)
      exportFileFromJson({
        header: tHeader,
        data,
        fileName: `${title} ${clientDateTime()}`,
        exportType: fotmatToExport
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(row => {
        return filterVal.map(column => {
          return row[column]
        })
      })
    },
    generateContextMenu() {
      this.metadataMenu = this.getterContextMenu

      // the function is broken avoiding that an error is generated when closing
      // session being in a window, since the store of vuex is cleaned, being
      // this.metadataMenu with value undefined
      if (this.isEmptyValue(this.metadataMenu)) {
        return
      }
      this.actions = this.metadataMenu.actions

      // TODO: Add store attribute to avoid making repeated requests
      let isChangePrivateAccess = true
      if (this.isReferecesContent) {
        if ((!this.isEmptyValue(this.getCurrentRecord) && !this.isEmptyValue(this.tableNameCurrentTab))) {
          this.$store.dispatch('getPrivateAccessFromServer', {
            tableName: this.tableNameCurrentTab,
            recordId: this.getCurrentRecord[this.tableNameCurrentTab + '_ID'],
            recordUuid: this.$route.query.action
          })
            .then(privateAccessResponse => {
              isChangePrivateAccess = false
              this.validatePrivateAccess(privateAccessResponse)
            })
        }

        const processAction = this.actions.find(item => {
          // TODO: Compare with 'action' attribute and not with 'name' (this change with language)
          if (item.name === 'Procesar Orden' || (item.name === 'Process Order')) {
            return item
          }
        })
        if (processAction) {
          this.$store.dispatch('setOrder', processAction)
        }
      }
      if (this.isWindow && this.isEmptyValue(this.actions.find(element => element.action === 'recordAccess'))) {
        this.actions.push(this.recordAccess)
      }

      if (this.actions && this.actions.length) {
        this.actions.forEach(itemAction => {
          const { action } = itemAction
          if (this.$route.meta.type === 'report' && action === 'startProcess') {
            itemAction.reportExportType = 'html'
          }

          // if no exists set prop with value
          itemAction.disabled = false
          if ((this.$route.name !== 'Report Viewer' && action === 'changeParameters') ||
             (this.$route.meta.type === 'process' && itemAction.type === 'summary')) {
            itemAction.disabled = true
          }

          if (this.$route.meta.type === 'window') {
            if (this.isLockRecord) {
              if (action === 'lockRecord') {
                itemAction.hidden = isChangePrivateAccess
              } else if (action === 'unlockRecord') {
                itemAction.hidden = !isChangePrivateAccess
              }
            }

            // rollback
            if (itemAction.action === 'undoModifyData') {
              itemAction.disabled = Boolean(!this.getDataLog && !this.getOldRouteOfWindow)
            } else if (!this.isWithRecord || !this.isInsertRecord) {
              itemAction.disabled = true
            }
          }
        })
      }
    },
    showModal(action) {
      // TODO: Refactor and remove redundant dispatchs
      if (['process'].includes(action.type)) {
        // Add context from view open in process to opening
        if (action.parentUuidAssociated || action.containerUuidAssociated) {
          const attributes = this.$store.getters.getValuesView({
            parentUuid: action.parentUuidAssociated,
            containerUuid: action.containerUuidAssociated
          })

          if (!this.isEmptyValue(attributes)) {
            this.$store.dispatch('updateValuesOfContainer', {
              containerUuid: action.uuid,
              attributes
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
        this.executeAction(action)
      } else if (action.type === 'process') {
        // run process associate with view (window or browser)
        this.showModal(action)
      } else if (action.type === 'dataAction') {
        if (action.action === 'undoModifyData' && Boolean(!this.getDataLog) && this.getOldRouteOfWindow) {
          this.$router.push({
            path: this.getOldRouteOfWindow.path,
            query: {
              ...this.getOldRouteOfWindow.query
            }
          }, () => {})
        } else if (action.action === 'recordAccess') {
          this.$store.dispatch('setShowDialog', {
            type: this.panelType,
            action: action
          })
        } else if (action.action !== 'undoModifyData') {
          if (action.action === 'setDefaultValues' && this.$route.query.action === 'create-new') {
            return
          }

          this.$store.dispatch(action.action, {
            parentUuid: this.parentUuid,
            containerUuid: this.containerUuid,
            recordUuid: this.recordUuid,
            panelType: this.panelType,
            isNewRecord: action.action === 'setDefaultValues',
            tableName: this.tableName,
            recordId: this.getCurrentRecord[this.tableNameCurrentTab + '_ID']
          })
            .then(response => {
              this.$message({
                type: 'success',
                message: this.$t('data.lockRecord'),
                showClose: true
              })
              if (response && response.isPrivateAccess) {
                this.validatePrivateAccess(response)
              }
            })
            .catch(error => {
              this.$message({
                type: 'error',
                message: this.$t('notifications.error') + error.message,
                showClose: true
              })
            })
        }
      } else if (action.type === 'updateReport') {
        this.updateReport(action)
      }
    },
    executeAction(action) {
      let containerParams = this.$route.meta.uuid
      if (this.lastParameter !== undefined) {
        containerParams = this.lastParameter
      }
      const fieldsNotReady = this.$store.getters.getFieldsListEmptyMandatory({
        containerUuid: containerParams
      })

      // run process or report
      if (this.isEmptyValue(fieldsNotReady)) {
        let menuParentUuid = this.menuParentUuid
        if (this.isEmptyValue(menuParentUuid) && this.$route.params) {
          if (!this.isEmptyValue(this.$route.params.menuParentUuid)) {
            menuParentUuid = this.$route.params.menuParentUuid
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
          reportFormat, // this.$route.query.reportType ? this.$route.query.reportType : action.reportExportType,
          menuParentUuid, // to load relationsList in context menu (report view)
          routeToDelete: this.$route
        })
          .catch(error => {
            console.warn(error)
          })
      } else {
        this.showNotification({
          type: 'warning',
          title: this.$t('notifications.emptyValues'),
          name: '<b>' + fieldsNotReady + '.</b> ',
          message: this.$t('notifications.fieldMandatory'),
          isRedirect: false
        })
      }
    },
    updateReport(action) {
      let instanceUuid = action.instanceUuid
      if (this.isEmptyValue(instanceUuid)) {
        instanceUuid = this.$route.params.instanceUuid
      }
      let processId = action.processId
      if (this.isEmptyValue(processId)) {
        processId = this.$route.params.processId
      }
      this.$store.dispatch('getReportOutputFromServer', {
        instanceUuid,
        processUuid: action.processUuid,
        tableName: action.tableName,
        processId,
        printFormatUuid: action.printFormatUuid,
        reportViewUuid: action.reportViewUuid,
        isSummary: false,
        reportName: this.$store.getters.getProcessResult.name,
        reportType: this.$store.getters.getReportType,
        option: action.option
      })
        .then(reportOutputResponse => {
          if (!reportOutputResponse.isError) {
            let link = {
              href: undefined,
              download: undefined
            }

            const blob = new Blob(
              [reportOutputResponse.outputStream],
              { type: reportOutputResponse.mimeType }
            )
            link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.download = reportOutputResponse.fileName
            if (reportOutputResponse.reportType !== 'pdf' && reportOutputResponse.reportType !== 'html') {
              link.click()
            }
            reportOutputResponse.url = link.href
          }
          this.$store.dispatch('finishProcess', {
            processOutput: reportOutputResponse,
            routeToDelete: this.$route
          })
        })
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
          }, () => {})
        } else {
          this.$message({
            type: 'error',
            message: this.$t('notifications.noRoleAccess'),
            showClose: true
          })
        }
      }
    },
    setShareLink() {
      let shareLink = this.isWindow || window.location.href.includes('?') ? `${window.location.href}&` : `${window.location.href}?`
      if (this.$route.name === 'Report Viewer') {
        const processParameters = convertFieldsListToShareLink(this.processParametersExecuted)
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
        showClose: true,
        duration: 1500
      })
    },
    redirect() {
      const { uuid: name, tabParent } = ROUTES.PRINT_FORMAT_SETUP_WINDOW
      this.$router.push({
        name,
        query: {
          action: this.getReportDefinition.output.printFormatUuid,
          tabParent
        }
      }, () => {})
    },
    validatePrivateAccess({ isLocked, tableName, recordId }) {
      if (!this.isPersonalLock) {
        let isHiddenLock = false
        if (isLocked) {
          isHiddenLock = true
        }
        this.actions = this.actions.map(actionItem => {
          if (actionItem.action === 'lockRecord') {
            return {
              ...actionItem,
              hidden: isHiddenLock,
              tableName,
              recordId
            }
          } else if (actionItem.action === 'unlockRecord') {
            return {
              ...actionItem,
              hidden: !isHiddenLock
            }
          }
          return actionItem
        })
      }
    }
  }
}
