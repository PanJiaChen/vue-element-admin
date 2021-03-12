import { supportedTypes, exportFileFromJson, exportZipFile } from '@/utils/ADempiere/exportUtil.js'
import { clientDateTime, recursiveTreeSearch } from '@/utils/ADempiere/valueUtils.js'
import { FIELDS_QUANTITY } from '@/utils/ADempiere/references'
import TableMixin from '@/components/ADempiere/DataTable/mixin/tableMixin.js'

export default {
  name: 'MixinMenuTable',
  mixins: [
    TableMixin
  ],
  props: {
    currentRow: {
      type: Object,
      default: () => {}
    },
    processMenu: {
      type: Array,
      default: () => []
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
    fieldsList() {
      if (this.panelMetadata && this.panelMetadata.fieldsList) {
        return this.panelMetadata.fieldsList
      }
      return []
    },
    isFieldsQuantity() {
      const fieldsQuantity = this.getterFieldsList.filter(fieldItem => {
        return FIELDS_QUANTITY.includes(fieldItem.displayType)
      }).length
      return !fieldsQuantity
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
    permissionRoutes() {
      return this.$store.getters.permission_routes
    }
  },
  methods: {
    sortTab(actionSequence) {
      // TODO: Refactor and remove redundant dispatchs
      this.$store.dispatch('setShowDialog', {
        type: 'window',
        action: actionSequence,
        parentRecordUuid: this.$route.query.action
      })
    },
    showModalTable(process) {
      if (process.type === 'application') {
        this.sortTab(process)
        return
      }

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
    addNewRow() {
      if (this.newRecordsQuantity <= 0) {
        this.$store.dispatch('addNewRow', {
          parentUuid: this.parentUuid,
          containerUuid: this.containerUuid,
          fieldsList: this.fieldsList,
          isEdit: true,
          isSendServer: false
        })
        return
      }
      const fieldsEmpty = this.$store.getters.getFieldsListEmptyMandatory({
        containerUuid: this.containerUuid
      })
      this.$message({
        message: this.$t('notifications.mandatoryFieldMissing') + fieldsEmpty,
        showClose: true,
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
      const header = this.getterFieldsListHeader
      const filterVal = this.getterFieldsListValue

      let list = []
      if (this.menuType === 'tableContextMenu') {
        list = [this.currentRow]
      } else {
        list = this.getDataSelection
      }

      let title = this.panelMetadata.name
      if (this.isEmptyValue(title)) {
        title = this.$route.meta.title
      }

      const data = this.formatJson(filterVal, list)
      exportFileFromJson({
        header,
        data,
        fileName: `${title} ${clientDateTime()}`,
        exportType: formatToExport
      })

      this.closeMenu()
    },
    /**
     * Export records as .txt into compressed .zip file
     */
    exporZipRecordTable({
      recordContexMenu = false
    }) {
      const header = this.getterFieldsListHeader
      const filterVal = this.getterFieldsListValue
      let list = this.getDataSelection
      if (this.getDataSelection.length <= 0) {
        list = this.recordsData
      }
      if (recordContexMenu) {
        list = [this.currentRow]
      }
      const data = this.formatJson(filterVal, list)

      let title = this.panelMetadata.name
      if (this.isEmptyValue(title)) {
        title = this.$route.meta.title
      }

      exportZipFile({
        header,
        data,
        txtName: title,
        zipName: `${title} ${clientDateTime()}`
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(row => {
        return filterVal.map(column => {
          return row[column]
        })
      })
    },
    zoomRecord() {
      const browserMetadata = this.$store.getters.getBrowser(this.$route.meta.uuid)
      const { elementName } = browserMetadata.fieldsList.find(field => field.columnName === browserMetadata.keyColumn)
      const records = []
      this.getDataSelection.forEach(recordItem => {
        let record = recordItem[browserMetadata.keyColumn]
        if (!isNaN(record)) {
          record = Number(record)
        }
        records.push(record)
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
        }, () => {})
      }
    }
  }
}
