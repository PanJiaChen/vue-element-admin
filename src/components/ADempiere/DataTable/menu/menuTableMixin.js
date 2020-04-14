import { supportedTypes, exportFileFromJson, exportFileZip } from '@/utils/ADempiere/exportUtil'
import { showNotification } from '@/utils/ADempiere/notification'
import { recursiveTreeSearch } from '@/utils/ADempiere/valueUtils'
import { FIELDS_QUANTITY } from '@/utils/ADempiere/references'

export const menuTableMixin = {
  props: {
    parentUuid: {
      type: String,
      default: undefined
    },
    containerUuid: {
      type: String,
      required: true
    },
    panelType: {
      type: String,
      default: 'window'
    },
    currentRow: {
      type: Object,
      default: () => {}
    },
    isParent: {
      type: Boolean,
      default: false
    },
    processMenu: {
      type: Array,
      default: () => []
    },
    isPanelWindow: {
      type: Boolean,
      default: false
    },
    isMobile: {
      type: Boolean,
      default: false
    },
    panelMetadata: {
      type: Object,
      default: () => {}
    },
    defaultFromatExport: {
      type: String,
      default: 'xlsx'
    }
  },
  data() {
    return {
      supportedTypes,
      menuTable: '1',
      isCollapse: true
    }
  },
  computed: {
    classTableMenu() {
      if (this.isMobile) {
        return 'menu-table-mobile'
      }
      return 'menu-table'
    },
    getterDataRecordsAndSelection() {
      return this.$store.getters.getDataRecordAndSelection(this.containerUuid)
    },
    getterNewRecords() {
      if (this.isPanelWindow && !this.isParent) {
        const newRecordTable = this.getterDataRecordsAndSelection.record.filter(recordItem => {
          return recordItem.isNew
        })
        return newRecordTable.length
      }
      return 0
    },
    getDataSelection() {
      return this.getterDataRecordsAndSelection.selection
    },
    getDataAllRecord() {
      return this.getterDataRecordsAndSelection.record
    },
    fieldsList() {
      if (this.panelMetadata && this.panelMetadata.fieldList) {
        return this.panelMetadata.fieldList
      }
      return []
    },
    isReadOnlyParent() {
      if (this.isPanelWindow) {
        if (this.$store.getters.getContextIsActive(this.parentUuid) === false) {
          return true
        }
        if (this.$store.getters.getContextProcessing(this.parentUuid) === true ||
          this.$store.getters.getContextProcessing(this.parentUuid) === 'Y') {
          return true
        }
        if (this.$store.getters.getContextProcessed(this.parentUuid)) {
          return true
        }
      }
      return false
    },
    isDisabledAddNew() {
      if (this.isParent) {
        return true
      }
      if (this.$route.query.action === 'create-new') {
        return true
      }
      if (!this.panelMetadata.isInsertRecord) {
        return true
      }
      if (this.isReadOnlyParent) {
        return true
      }
      if (this.getterNewRecords) {
        return true
      }
      return false
    },
    isFieldsQuantity() {
      const fieldsQuantity = this.getterFieldList.filter(fieldItem => {
        return FIELDS_QUANTITY.includes(fieldItem.displayType)
      }).length
      return !fieldsQuantity
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
        }
        return fieldItem.columnName
      })
    },
    permissionRoutes() {
      return this.$store.getters.permission_routes
    }
  },
  methods: {
    showNotification,
    sortTab(actionSequence) {
      // TODO: Refactor and remove redundant dispatchs
      this.$store.dispatch('setShowDialog', {
        type: 'window',
        action: actionSequence,
        parentRecordUuid: this.$route.query.action
      })
    },
    closeMenu() {
      // TODO: Validate to dispatch one action
      this.$store.dispatch('showMenuTable', {
        isShowedTable: false
      })
      this.$store.dispatch('showMenuTabChildren', {
        isShowedTabChildren: false
      })
    },
    showModalTable(process) {
      const processData = this.$store.getters.getProcess(process.uuid)
      if (!this.currentRow) {
        this.$store.dispatch('setProcessSelect', {
          selection: this.getDataSelection,
          processTablaSelection: true,
          tableName: this.panelMetadata.keyColumn
        })
      } else {
        let valueProcess
        const selection = this.currentRow
        for (const element in selection) {
          if (element === this.panelMetadata.keyColumn) {
            valueProcess = selection[element]
          }
        }
        this.$store.dispatch('setProcessTable', {
          valueRecord: valueProcess,
          tableName: this.panelMetadata.keyColumn,
          processTable: true
        })
      }
      if (processData === undefined) {
        this.$store.dispatch('getProcessFromServer', {
          containerUuid: process.uuid,
          routeToDelete: this.$route
        })
          .then(response => {
            this.$store.dispatch('setShowDialog', {
              type: process.type,
              action: response,
              record: this.getDataSelection
            })
          }).catch(error => {
            console.warn(`ContextMenu: Dictionary Process (State) - Error ${error.code}: ${error.message}.`)
          })
      } else {
        this.$store.dispatch('setShowDialog', {
          type: process.type,
          action: processData
        })
      }
    },
    showTotals() {
      this.$store.dispatch('changePanelAttributesBoolean', {
        containerUuid: this.containerUuid,
        attributeName: 'isShowedTotals'
      })
    },
    showOnlyMandatoryColumns() {
      this.$store.dispatch('showOnlyMandatoryColumns', {
        containerUuid: this.containerUuid
      })
    },
    showAllAvailableColumns() {
      this.$store.dispatch('showAllAvailableColumns', {
        containerUuid: this.containerUuid
      })
    },
    deleteSelection() {
      this.$store.dispatch('deleteSelectionDataList', {
        parentUuid: this.parentUuid,
        containerUuid: this.containerUuid
      }).then(() => {
        this.$store.dispatch('setRecordSelection', {
          parentUuid: this.parentUuid,
          containerUuid: this.containerUuid,
          panelType: this.panelType
        })
      })
    },
    addNewRow() {
      if (this.getterNewRecords <= 0) {
        this.$store.dispatch('addNewRow', {
          parentUuid: this.parentUuid,
          containerUuid: this.containerUuid,
          fieldList: this.fieldsList,
          isEdit: true,
          isSendServer: false
        })
        return
      }
      const fieldsEmpty = this.$store.getters.getFieldListEmptyMandatory({
        containerUuid: this.containerUuid
      })
      this.$message({
        message: this.$t('notifications.mandatoryFieldMissing') + fieldsEmpty,
        type: 'info'
      })
    },
    showOptionalColums() {
      this.$store.dispatch('changePanelAttributesBoolean', {
        containerUuid: this.containerUuid,
        attributeName: 'isShowedTableOptionalColumns'
      })
    },
    /**
     * @param {string} formatToExport
     */
    exporRecordTable(formatToExport) {
      const header = this.getterFieldListHeader
      const filterVal = this.getterFieldListValue
      let list = this.getDataSelection
      if (this.menuType === 'tableContextMenu') {
        list = [this.currentRow]
      }

      const data = this.formatJson(filterVal, list)
      exportFileFromJson({
        header,
        data,
        filename: '',
        exportType: formatToExport
      })
      this.closeMenu()
    },
    exporZipRecordTable() {
      const header = this.getterFieldListHeader
      const filterVal = this.getterFieldListValue
      let list = this.getDataSelection
      if (this.getDataSelection.length <= 0) {
        list = this.getDataAllRecord
      }
      const data = this.formatJson(filterVal, list)
      exportFileZip({
        header,
        data,
        title: this.$route.meta.title,
        exportType: 'zip'
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(rowData => filterVal.map(j => rowData[j]))
    },
    zoomRecord() {
      const browserMetadata = this.$store.getters.getBrowser(this.$route.meta.uuid)
      const { elementName } = browserMetadata.fieldList.find(field => field.columnName === browserMetadata.keyColumn)
      const records = []
      this.getDataSelection.forEach(record => {
        if (isNaN(record[browserMetadata.keyColumn])) {
          records.push(record[browserMetadata.keyColumn])
        } else {
          records.push(Number(record[browserMetadata.keyColumn]))
        }
      })

      const viewSearch = recursiveTreeSearch({
        treeData: this.permissionRoutes,
        attributeValue: browserMetadata.window.uuid,
        attributeName: 'meta',
        secondAttribute: 'uuid',
        attributeChilds: 'children'
      })
      if (viewSearch) {
        this.$router.push({
          name: viewSearch.name,
          query: {
            action: 'advancedQuery',
            [elementName]: records
          }
        })
      }
    }
  }
}
