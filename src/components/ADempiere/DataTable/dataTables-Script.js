
import FieldDefinition from '@/components/ADempiere/Field'
import FilterColumns from '@/components/ADempiere/DataTable/filterColumns'
import FixedColumns from '@/components/ADempiere/DataTable/fixedColumns'
import TableContextMenu from '@/components/ADempiere/DataTable/menu/tableContextMenu'
import TableMainMenu from '@/components/ADempiere/DataTable/menu'
import IconElement from '@/components/ADempiere/IconElement'
import { formatField } from '@/utils/ADempiere/valueFormat'
import MainPanel from '@/components/ADempiere/Panel'
import { sortFields } from '@/utils/ADempiere/dictionaryUtils'
import { FIELDS_DECIMALS, FIELDS_QUANTITY, FIELDS_READ_ONLY_FORM } from '@/utils/ADempiere/references'
import { LOG_COLUMNS_NAME_LIST } from '@/utils/ADempiere/dataUtils.js'
import { fieldIsDisplayed } from '@/utils/ADempiere'
import evaluator from '@/utils/ADempiere/evaluator'
import TableMixin from './mixin/tableMixin.js'
import TableMixinSort from './mixin/mixinTableSort.js'
import CustomPagination from '@/components/ADempiere/Pagination'

export default {
  name: 'DataTable',
  components: {
    CustomPagination,
    FieldDefinition,
    FilterColumns,
    FixedColumns,
    IconElement,
    MainPanel,
    TableContextMenu,
    TableMainMenu
  },
  mixins: [
    TableMixin,
    TableMixinSort
  ],
  props: {
    // Show check from selection row
    isTableSelection: {
      type: Boolean,
      default: true
    },
    // Show check from selection row, send to panel form
    isShowedPanelRecord: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const activeName = []
    // TODO: Manage attribute with vuex store in window module
    if (this.isParent && this.$route.query.action && this.$route.query.action === 'advancedQuery') {
      activeName.push('PanelAdvancedQuery')
    }
    return {
      topContextualMenu: 0,
      leftContextualMenu: 0,
      currentRowMenu: {},
      currentRow: null,
      currentTable: 0,
      visible: this.getShowContextMenuTable,
      searchTable: '', // text from search
      defaultMaxPagination: 50,
      activeName,
      rowStyle: {
        height: '52px'
      },
      uuidCurrentRecordSelected: '',
      showTableSearch: false
    }
  },
  computed: {
    isShowedContextMenu() {
      if (this.isParent) {
        return this.getShowContextMenuTable
      }
      return this.getShowContextMenuTabChildren
    },
    getMenuTable() {
      const process = this.$store.getters.getContextMenu(this.containerUuid)
      if (process && !this.isEmptyValue(process.actions)) {
        return process.actions.filter(menu => {
          if (menu.type === 'process' || menu.type === 'application') {
            return menu
          }
        })
      }
      return []
    },
    getShowContextMenuTable() {
      return this.$store.getters.getShowContextMenuTable
    },
    getShowContextMenuTabChildren() {
      return this.$store.getters.getShowContextMenuTabChildren
    },
    panelMetadata() {
      return this.$store.getters.getPanel(this.containerUuid)
    },
    isLoadedPanel() {
      const panelMetadata = this.$store.getters.getPanel('table_' + this.containerUuid)
      if (!this.isEmptyValue(panelMetadata)) {
        return true
      }
      return false
    },
    isShowedTotals() {
      return this.panelMetadata.isShowedTotals
    },
    isShowOptionalColumns() {
      return this.panelMetadata.isShowedTableOptionalColumns
    },
    totalRecords() {
      return this.getterDataRecordsAndSelection.recordCount
    },
    pageNumber() {
      return this.getterDataRecordsAndSelection.pageNumber
    },
    isLoaded() {
      return !this.getterDataRecordsAndSelection.isLoaded
    },
    fieldsIsDisplayed() {
      return this.$store.getters.getFieldsIsDisplayed(this.containerUuid)
    },
    getterIsShowedCriteria() {
      const browser = this.$store.getters.getBrowser(this.containerUuid)
      if (browser) {
        return browser.isShowedCriteria
      }
      return false
    },
    getHeightPanelBottom() {
      return this.$store.getters.getSplitHeight - 25
    },
    getterHeight() {
      return this.$store.getters.getHeigth
    },
    tableHeaderStyle() {
      if (this.isParent) {
        if (!this.isEmptyValue(this.activeName)) {
          return {
            height: '55%',
            overflow: 'auto'
          }
        }
        return {
          height: '11%',
          overflow: 'hidden'
        }
      }
      return {
        height: '35px'
      }
    },
    getHeigthTable() {
      let totalRow = 0
      // to refresh height table if changed isShowedTotals
      if (this.isShowedTotals) {
        totalRow = 5
      }

      if (this.isPanelWindow) {
        // table record navigation
        if (this.isParent) {
          if (this.isEmptyValue(this.activeName)) {
            return this.getterHeight - 210 - totalRow
          }
          // panel advanced query is showed
          return this.getterHeight - 420 - totalRow
        }
        // tabs children
        if (totalRow) {
          totalRow = 1
        }
        return (this.getHeightPanelBottom - 5 - totalRow) + 'vh'
      } else if (this.panelType === 'browser') {
        // open browser criteria
        if (this.getterIsShowedCriteria) {
          // showed some field in panel query criteria
          if (this.fieldsIsDisplayed.isDisplayed) {
            return this.getterHeight - 495 - totalRow
          }
          return this.getterHeight - 415 - totalRow
        }
        return this.getterHeight - 290 - totalRow
      }
      return this.getterHeight - 300 - totalRow
    },
    fieldsList() {
      const panelMetadata = this.panelMetadata
      if (panelMetadata && panelMetadata.fieldsList) {
        if ((this.panelType === 'window' && this.isParent) || this.panelType === 'browser') {
          let orderBy = 'seqNoGrid'
          if (this.panelType === 'browser') {
            orderBy = 'sequence'
          }

          return this.sortFields({
            fieldsList: panelMetadata.fieldsList,
            orderBy
          })
        }
        return panelMetadata.fieldsList
      }
      return []
    },
    isLoadPanel() {
      const panelMetadata = this.panelMetadata
      if (panelMetadata && panelMetadata.fieldsList) {
        return true
      }
      return false
    },
    preferenceClientId() {
      if (this.isPanelWindow) {
        return this.$store.getters.getPreferenceClientId
      }
      return undefined
    },
    shorcutKey() {
      return {
        f6: ['f6'],
        ctrlf: ['ctrl', 'f']
      }
    },
    keyUp() {
      if (this.currentTable < 1) {
        return this.currentTable
      }
      return this.currentTable - 1
    },
    keyDow() {
      const maxDown = this.recordsData.length - 1
      if (maxDown === this.currentTable) {
        return this.currentTable
      }
      return this.currentTable + 1
    }
  },
  watch: {
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  created() {
    this.getPanel()
  },
  mounted() {
    if (this.isTableSelection) {
      this.toggleSelection(this.getDataSelection)
    }
  },
  methods: {
    sortFields,
    actionAdvancedQuery() {
      const activeNames = []
      if (!this.activeName.length) {
        activeNames.push('PanelAdvancedQuery')
        if (this.isParent) {
          const { isShowedRecordNavigation } = this.$store.getters.getWindow(this.parentUuid)
          if (!isShowedRecordNavigation) {
            this.$store.dispatch('changeWindowAttribute', {
              parentUuid: this.parentUuid, // act as parentUuid
              attributeName: 'isShowedRecordNavigation',
              attributeValue: true
            })
          }
        }
      }
      this.activeName = activeNames
    },
    setCurrent(row) {
      this.$refs.multipleTable.setCurrentRow(row)
    },
    theAction(event) {
      switch (event.srcKey) {
        case 'up':
          this.currentTable = this.keyUp
          break
        case 'down':
          this.currentTable = this.keyDow
          break
      }
      this.handleRowClick(this.recordsData[this.currentTable])
      return this.setCurrent(this.recordsData[this.currentTable])
    },
    block() {
      return false
    },
    rowMenu(row, column, event) {
      const menuMinWidth = 105
      const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
      const offsetWidth = this.$el.offsetWidth // container width
      const maxLeft = offsetWidth - menuMinWidth // left boundary
      const left = event.clientX - offsetLeft + 15 // 15: margin right

      this.leftContextualMenu = left
      if (left > maxLeft) {
        this.leftContextualMenu = maxLeft
      }

      const offsetTop = this.$el.getBoundingClientRect().top
      let top = event.clientY - offsetTop
      if (this.panelType === 'browser' && this.panelMetadata.isShowedCriteria) {
        top = event.clientY - 200
      }
      this.topContextualMenu = top

      this.currentRowMenu = row
      this.visible = true

      // TODO: Verify use
      this.$store.dispatch('showMenuTable', {
        isShowedTable: this.isParent
      })
      this.$store.dispatch('showMenuTabChildren', {
        isShowedTabChildren: !this.isParent
      })
    },
    headerLabel(field) {
      if (field.isMandatory || field.isMandatoryFromLogic) {
        return '* ' + field.name
      }
      return field.name
    },
    /**
     * @param {object} row, row data
     * @param {object} field, field with attributes
     */
    displayedValue(row, field) {
      const { columnName, componentPath, displayColumnName, displayType } = field

      let valueToShow
      switch (componentPath) {
        case 'FieldDate':
        case 'FieldTime': {
          let cell = row[columnName]
          if (this.typeValue(cell) === 'DATE') {
            cell = cell.getTime()
          }
          // replace number timestamp value for date
          valueToShow = formatField(cell, displayType)
          break
        }

        case 'FieldNumber':
          if (this.isEmptyValue(row[columnName])) {
            valueToShow = undefined
            break
          }
          valueToShow = this.formatNumber({
            displayType,
            number: row[columnName]
          })
          break

        case 'FieldSelect':
          valueToShow = row[displayColumnName]
          if (this.isEmptyValue(valueToShow) && row[columnName] === 0) {
            valueToShow = field.defaultValue
            break
          }
          break

        case 'FieldYesNo':
          // replace boolean true-false value for 'Yes' or 'Not' ('Si' or 'No' for spanish)
          valueToShow = row[columnName]
            ? this.$t('components.switchActiveText')
            : this.$t('components.switchInactiveText')
          break

        default:
          valueToShow = row[columnName]
          break
      }

      return valueToShow
    },
    rowCanBeEdited(record, fieldAttributes) {
      if (!this.isParent) {
        if (this.isPanelWindow) {
          // getter with context
          if (this.isReadOnlyParent) {
            return false
          }
          // if record is IsActive, Processed, Processing
          if (this.isReadOnlyRow(record, fieldAttributes)) {
            return false
          }
        }

        // if isReadOnly, isReadOnlyFromLogic, or columns log
        if (this.isReadOnlyCell(record, fieldAttributes)) {
          return false
        }
        if (record.isEdit) {
          return true
        }
      }
      return false
    },
    isReadOnlyRow(row, field) {
      // evaluate context
      if (this.preferenceClientId !== parseInt(row.AD_Client_ID, 10)) {
        return true
      }
      if (fieldIsDisplayed(field)) {
        // columnName: IsActive
        const fieldReadOnlyForm = FIELDS_READ_ONLY_FORM.find(item => {
          return !item.isChangedAllForm &&
            // columnName: IsActive, Processed, Processing
            Object.prototype.hasOwnProperty.call(row, item.columnName)
        })
        if (fieldReadOnlyForm) {
          const { columnName, valueIsReadOnlyForm } = fieldReadOnlyForm
          // compare if is same key
          return field.columnName !== columnName &&
            // compare if is same value
            row[columnName] === valueIsReadOnlyForm
        }
      }
      return false
    },
    /**
     * Idicate if cell is read only
     * TODO: Create common method to evaluate isReadOnly
     */
    isReadOnlyCell(row, field) {
      // TODO: Add support to its type fields
      if (['FieldImage', 'FieldBinary'].includes(field.componentPath)) {
        return true
      }

      // records in columns manage by backend
      const isLogColumns = LOG_COLUMNS_NAME_LIST.includes(field.columnName)

      const isUpdateableAllFields = field.isReadOnly || field.isReadOnlyFromLogic
      if (this.isPanelWindow) {
        if (isLogColumns) {
          return true
        }

        const panelMetadata = this.panelMetadata
        if (field.columnName === panelMetadata.linkColumnName ||
          field.columnName === panelMetadata.fieldLinkColumnName) {
          return true
        }
        // edit mode is diferent to create new
        const editMode = !this.isEmptyValue(row.UUID)
        return (!field.isUpdateable && editMode) || (isUpdateableAllFields || field.isReadOnlyFromForm)
      } else if (this.panelType === 'browser') {
        // browser result
        return field.isReadOnly || isLogColumns
      }

      // other type of panels (process/reports/forms)
      return Boolean(isUpdateableAllFields)
    },
    callOffNewRecord() {
      this.recordsData.shift()
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.isNew && rowIndex === 0) {
        return 'warning-row'
      }
      return ''
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
        this.$refs.multipleTable.$refs.bodyWrapper.scrollTop = 0
      } else {
        const fieldsEmpty = this.$store.getters.getFieldsListEmptyMandatory({
          containerUuid: this.containerUuid
        })
        this.$message({
          message: this.$t('notifications.mandatoryFieldMissing') + fieldsEmpty,
          type: 'info'
        })
      }
    },
    async setFocus() {
      return new Promise(resolve => {
        const fieldFocus = this.fieldsList.find(itemField => {
          if (Object.prototype.hasOwnProperty.call(this.$refs, itemField.columnName)) {
            if (fieldIsDisplayed(itemField) && !itemField.isReadOnly && itemField.isUpdateable) {
              return true
            }
          }
        })
        this.$refs[fieldFocus.columnName][0].focusField()
        resolve()
      })
    },
    /**
     * @param {object} field
     */
    cellClass(field) {
      let classReturn = ''
      if (field.isReadOnly) {
        classReturn += ' cell-no-edit '
      }
      if (field.componentPath === 'FieldNumber') {
        classReturn += ' cell-align-right '
      }
      // return 'cell-edit'
      return classReturn
    },
    /**
     * Select or unselect rows
     * USE ONLY MOUNTED
     */
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    confirmEdit(row) {
      const fieldsEmpty = this.$store.getters.getFieldsListEmptyMandatory({
        containerUuid: this.containerUuid,
        row
      })

      if (row.isNew) {
        row.isEdit = true
        this.$message({
          message: this.$t('notifications.mandatoryFieldMissing') + fieldsEmpty,
          type: 'info'
        })
        return
      }

      if (row.isEdit && fieldsEmpty) {
        row.isEdit = false
        this.$message({
          message: this.$t('notifications.mandatoryFieldMissing') + fieldsEmpty,
          type: 'info'
        })
        return
      }
      row.isEdit = false
    },
    handleRowClick(row, column, event) {
      this.currentTable = this.recordsData.findIndex(item => item.UUID === row.UUID)
      if (this.isShowedPanelRecord && this.isParent) {
        if (this.uuidCurrentRecordSelected !== row.UUID) {
          this.uuidCurrentRecordSelected = row.UUID
          // disabled rollback when change route
          this.$store.dispatch('setDataLog', {})
        }
        const tableName = this.panelMetadata.tableName
        this.$router.push({
          name: this.$route.name,
          query: {
            ...this.$route.query,
            action: row.UUID
          },
          params: {
            ...this.$router.params,
            tableName,
            recordId: row[`${tableName}_ID`]
          }
        }, () => {})
        this.$store.commit('setCurrentRecord', row)
      } else {
        if (!row.isEdit) {
          row.isEdit = true
          /*
          const inSelection = this.getDataSelection.some(item => {
            return JSON.stringify(item) === JSON.stringify(row)
          })
          if (inSelection) {
            row.isEdit = true
          }
          */
        }
      }
    },
    handleRowDblClick(row, column, event) {
      if (!this.isShowedPanelRecord) {
        this.confirmEdit(row)
      }
    },
    handleSelection(rowsSelection, rowSelected) {
      this.$store.dispatch('setSelection', {
        containerUuid: this.containerUuid,
        selection: rowsSelection
      })
    },
    handleSelectionAll(rowsSelection) {
      this.$store.dispatch('setSelection', {
        containerUuid: this.containerUuid,
        selection: rowsSelection
      })
    },
    filterResult() {
      const data = this.recordsData.filter(rowItem => {
        if (this.searchTable.trim().length) {
          let find = false
          Object.keys(rowItem).forEach(key => {
            if (String(rowItem[key]).toLowerCase().includes(String(this.searchTable).toLowerCase())) {
              find = true
              return find
            }
          })
          return find
        }
        return true
      })
      return data
    },
    /**
     * Verify is displayed field in column table
     */
    isDisplayed(field) {
      const isDisplayed = field.isDisplayed &&
        field.isDisplayedFromLogic &&
        field.isShowedTableFromUser &&
        !field.isKey
      //  Verify for displayed and is active
      return field.isActive && isDisplayed
    },
    /**
     * Get the tab object with all its attributes as well as the fields it contains
     */
    getPanel() {
      // get panel from server only window and tab children
      if (this.isPanelWindow && !this.isParent && !this.panelMetadata) {
        this.$store.dispatch('getPanelAndFields', {
          containerUuid: this.containerUuid,
          parentUuid: this.parentUuid,
          panelType: this.panelType
        }).catch(error => {
          console.warn(`Fields List Load Error ${error.code}: ${error.message}.`)
        })
      }
    },
    /**
     * @param {array} columns
     * @param {array} data
     */
    getSummaries({ columns, data }) {
      const sums = []
      if (!this.isShowedTotals) {
        return
      }

      const fieldsList = this.fieldsList
      columns.forEach((columnItem, index) => {
        if (index === 0) {
          sums[index] = 'Σ'
          return
        }
        const field = fieldsList.find(fieldItem => fieldItem.columnName === columnItem.property)
        const { displayType } = field
        if (!FIELDS_QUANTITY.includes(displayType)) {
          sums[index] = ''
          return
        }
        const values = this.getDataSelection.map(item => Number(item[columnItem.property]))
        if (values.every(value => isNaN(value))) {
          sums[index] = 0
        } else {
          const total = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            }
            return prev
          }, 0)
          sums[index] = this.formatNumber({
            displayType,
            number: total
          })
        }
      })

      return sums
    },
    formatNumber({ displayType, number }) {
      let fixed = 0
      // Amount, Costs+Prices, Number
      if (FIELDS_DECIMALS.includes(displayType)) {
        fixed = 2
      }
      return new Intl.NumberFormat().format(number.toFixed(fixed))
    },
    handleChangePage(newPage) {
      this.$store.dispatch('setPageNumber', {
        parentUuid: this.parentUuid,
        containerUuid: this.containerUuid,
        pageNumber: newPage,
        panelType: this.panelType
      })
    },
    click() {
      this.showTableSearch = !this.showTableSearch
      if (this.showTableSearch) {
        this.$refs.headerSearchInput && this.$refs.headerSearchInput.focus()
      }
    },
    getFieldDefinition(fieldDefinition, row) {
      let styleSheet = ''
      if (fieldDefinition && (!this.isEmptyValue(fieldDefinition.id) || fieldDefinition.conditions.length)) {
        fieldDefinition.conditions.forEach(condition => {
          const columns = evaluator.parseDepends(condition.condition)
          let conditionLogic = condition.condition
          columns.forEach(column => {
            conditionLogic = conditionLogic.replace(/@/g, '')
            conditionLogic = conditionLogic.replace(column, row[column])
            conditionLogic = evaluator.evaluateLogic({
              logic: conditionLogic
            })
          })
          if (conditionLogic && condition.isActive) {
            styleSheet = condition.styleSheet
          }
        })
      }
      return styleSheet
    }
  }
}
