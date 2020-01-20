import { supportedTypes, exportFileFromJson, exportFileZip } from '@/utils/ADempiere/exportUtil'
import { showNotification } from '@/utils/ADempiere/notification'

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
    isOption: {
      type: Object,
      default: () => {}
    },
    isParent: {
      type: Boolean,
      default: false
    },
    isProcessMenu: {
      type: Array,
      default: function() {
        return []
      }
    },
    isPanelWindow: {
      type: Boolean,
      default: false
    },
    isMobile: {
      type: Boolean,
      default: false
    },
    isPanel: {
      type: Object,
      default: () => {}
    },
    isDataRecord: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      option: supportedTypes,
      typoFormatExport: [],
      menuTable: '1',
      isCollapse: true,
      visible: false
    }
  },
  computed: {
    isProcessTable() {
      if (this.isProcessMenu) {
        return true
      }
      return false
    },
    classTableMenu() {
      if (this.isMobile) {
        return 'menu-table-mobile'
      } else if (this.$store.state.app.sidebar.opened) {
        return 'menu-table'
      }
      return 'menu-table'
    },
    getterDataRecordsAndSelection() {
      return this.$store.getters.getDataRecordAndSelection(this.containerUuid)
    },
    getterNewRecords() {
      if (this.isPanelWindow && !this.isParent) {
        var newRecordTable = this.getterDataRecordsAndSelection.record.filter(recordItem => {
          return recordItem.isNew
        })
        return newRecordTable.length
      }
      return 0
    },
    getDataSelection() {
      return this.getterDataRecordsAndSelection.selection
    },
    fieldList() {
      if (this.isPanel && this.isPanel.fieldList) {
        return this.sortFields(
          this.isPanel.fieldList,
          this.panelType !== 'browser' ? 'seqNoGrid' : 'sequence'
        )
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
      if (!this.isPanel.isInsertRecord) {
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
    getterFieldList() {
      return this.$store.getters.getFieldsListFromPanel(this.containerUuid)
    },
    getterFieldListHeader() {
      var header = this.getterFieldList.filter(fieldItem => {
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
      var value = this.getterFieldList.filter(fieldItem => {
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
    gettersRecordContextMenu() {
      var record = []
      var recordTable = this.isOption
      record.push(recordTable)
      return record
    }
  },
  methods: {
    showNotification,
    closeMenu() {
      this.$store.dispatch('showMenuTable', {
        isShowedTable: false
      })
      this.$store.dispatch('showMenuTabChildren', {
        isShowedTabChildren: false
      })
    },
    showModal(process) {
      var processData
      processData = this.$store.getters.getProcess(process.uuid)
      if (!this.isOption) {
        this.$store.dispatch('setProcessSelect', {
          selection: this.getDataSelection,
          processTablaSelection: true,
          tableName: this.isPanel.keyColumn
        })
      } else {
        var selection = this.isOption
        for (const element in selection) {
          if (element === this.isPanel.keyColumn) {
            valueProcess = selection[element]
          }
        }
        this.$store.dispatch('setProcessTable', {
          valueRecord: valueProcess,
          tableName: this.isPanel.keyColumn,
          processTable: true
        })
      }
      var valueProcess
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
            console.warn('ContextMenu: Dictionary Process (State) - Error ' + error.code + ': ' + error.message)
          })
      } else {
        this.$store.dispatch('setShowDialog', { type: process.type, action: processData })
      }
    },
    tableProcess(process) {
      // if (!this.isOption) {
      //   if (this.getDataSelection.length <= 1) {
      //     this.showModal(process)
      //   }
      // } else {
      //   this.showModal(process)
      // }
      this.showModal(process)
    },
    showTotals() {
      this.$store.dispatch('showedTotals', this.containerUuid)
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
      })
      this.$store.dispatch('setRecordSelection', {
        parentUuid: this.parentUuid,
        containerUuid: this.containerUuid,
        panelType: this.panelType
      })
    },
    addNewRow() {
      if (this.getterNewRecords <= 0) {
        this.$store.dispatch('addNewRow', {
          parentUuid: this.parentUuid,
          containerUuid: this.containerUuid,
          fieldList: this.fieldList,
          isEdit: true,
          isSendServer: false
        })
      } else {
        const fieldsEmpty = this.$store.getters.getFieldListEmptyMandatory({ containerUuid: this.containerUuid })
        this.$message({
          message: this.$t('notifications.mandatoryFieldMissing') + fieldsEmpty,
          type: 'info'
        })
      }
    },
    optionalPanel() {
      this.showTableSearch = false
      this.isOptional = !this.isOptional
    },
    fixedPanel() {
      this.showTableSearch = false
      this.isFixed = !this.isFixed
    },
    typeFormat(key, keyPath) {
      Object.keys(supportedTypes).forEach(type => {
        if (type === key) {
          this.exporRecordTable(key)
        }
      })
      this.closeMenu()
    },
    exporRecordTable(key) {
      const Header = this.getterFieldListHeader
      const filterVal = this.getterFieldListValue
      var list
      if (!this.isOption) {
        list = this.getDataSelection
      } else {
        list = this.gettersRecordContextMenu
      }

      const data = this.formatJson(filterVal, list)
      exportFileFromJson({
        header: Header,
        data,
        filename: '',
        exportType: key
      })
    },
    exporZipRecordTable() {
      const Header = this.getterFieldListHeader
      const filterVal = this.getterFieldListValue
      var list
      if (!this.isOption) {
        list = this.getDataSelection
      } else {
        list = this.gettersRecordContextMenu
      }

      const data = this.formatJson(filterVal, list)
      exportFileZip({
        header: Header,
        data,
        filename: '',
        exportType: 'zip'
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  }
}
