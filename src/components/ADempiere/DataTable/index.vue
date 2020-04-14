<template>
  <el-container v-if="isLoadPanel" label-position="top" style="height: inherit;">
    <el-main style="padding: 0px !important; overflow: hidden;">
      <el-container style="height: 100%;">
        <el-header :style="tableHeaderStyle">
          <el-collapse
            v-if="isParent"
            v-model="activeName"
            v-shortkey="{ f6: ['f6'], ctrlf: ['ctrl', 'f'] }"
            @shortkey.native="actionAdvancedQuery()"
          >
            <el-collapse-item :title="$t('table.dataTable.advancedQuery')" name="1">
              <main-panel
                :container-uuid="containerUuid"
                :parent-uuid="parentUuid"
                :metadata="getterPanel"
                panel-type="table"
                is-advanced-query
                :class="isEmptyValue(activeName) ? 'collapse_item' : 'collapse_item_wrap'"
              />
            </el-collapse-item>
          </el-collapse>
          <div>
            <div v-if="!isMobile">
              <table-main-menu
                :container-uuid="containerUuid"
                :parent-uuid="parentUuid"
                :panel-type="panelType"
                :is-parent="isParent"
                :is-panel-window="isPanelWindow"
                :process-menu="getterContextMenu"
                :is-mobile="isMobile"
                :panel-metadata="getterPanel"
              />
              <el-button
                v-if="!isParent && isPanelWindow"
                type="text"
                :icon="(getterNewRecords <= 0) ? 'el-icon-circle-plus' : 'el-icon-remove'"
                style="float: right; padding-top: 8px; font-size: larger; padding-left: 6px; color: gray;"
                :disabled="getterNewRecords <= 0 ? isDisabledAddNew : false"
                @click="(getterNewRecords <= 0) ? addNewRow() : callOffNewRecord()"
              />
              <icon-element v-if="!isMobile" icon="el-icon-news">
                <fixed-columns
                  :container-uuid="containerUuid"
                  :panel-type="panelType"
                  class="header-search-input"
                />
              </icon-element>
              <filter-columns
                v-if="isShowOptionalColumns"
                :container-uuid="containerUuid"
                :panel-type="panelType"
                class="field-optional"
              />
              <div :class="{ show: showTableSearch }" class="table-search">
                <svg-icon class-name="search-icon" icon-class="search" @click.stop="click()" />
                <el-input
                  ref="headerSearchSelect"
                  v-model="searchTable"
                  size="mini"
                  :placeholder="$t('table.dataTable.search')"
                  class="header-search-select"
                />
              </div>
            </div>
            <div v-else>
              <div v-if="!isParent">
                <fixed-columns
                  :container-uuid="containerUuid"
                  :panel-type="panelType"
                  class="header-search-input"
                />
                <filter-columns
                  v-if="isShowOptionalColumns"
                  :container-uuid="containerUuid"
                  :panel-type="panelType"
                  class="field-optional"
                />
                <div :class="{ show: showTableSearch }" class="table-search">
                  <svg-icon class-name="search-icon" icon-class="search" @click.stop="click()" />
                  <el-input
                    ref="headerSearchSelect"
                    v-model="searchTable"
                    size="mini"
                    :placeholder="$t('table.dataTable.search')"
                    class="header-search-select"
                    clearable
                  />
                </div>
              </div>
              <div v-else class="panel-expand">
                <div :class="{ show: showTableSearch }" class="table-search">
                  <svg-icon class-name="search-icon" icon-class="search" @click.stop="click()" />
                  <el-input
                    ref="headerSearchSelect"
                    v-model="searchTable"
                    size="mini"
                    :placeholder="$t('table.dataTable.search')"
                    class="header-search-select-mobile"
                    clearable
                  />
                </div>
                <el-button
                  v-show="isParent && isPanelWindow && isMobile && getDataSelection.length"
                  type="text"
                  icon="el-icon-delete"
                  style="color: black; font-size: 17px; font-weight: 605 !important;"
                  @click="deleteSelection()"
                />
                <icon-element icon="el-icon-news" style="padding-top: 0px;" @click="searchRecordNavegation()">
                  <fixed-columns
                    :container-uuid="containerUuid"
                    :panel-type="panelType"
                    class="header-search-input-mobile"
                  />
                </icon-element>
              </div>
            </div>
          </div>
        </el-header>
        <el-main style="padding: 0px !important; overflow: hidden;">
          <table-context-menu
            v-show="isParent ? getShowContextMenuTable : getShowContextMenuTabChildren"
            :style="{ left: leftContextualMenu + 'px', top: topContextualMenu + 'px' }"
            class="contextual-menu"
            :container-uuid="containerUuid"
            :parent-uuid="parentUuid"
            :panel-type="panelType"
            :current-row="currentRowMenu"
            :is-panel-window="isPanelWindow"
            :process-menu="getterContextMenu"
            :is-mobile="isMobile"
            :panel-metadata="getterPanel"
          />
          <el-table
            ref="multipleTable"
            v-loading="$route.query.action !== 'create-new' && isLoaded"
            :height="getHeigthTable"
            style="width: 100%"
            border
            :row-key="getterPanel.keyColumn"
            reserve-selection
            highlight-current-row
            :row-style="rowStyle"
            :data="showTableSearch ? filterResult() : getterDataRecords"
            :element-loading-text="$t('notifications.loading')"
            element-loading-background="rgba(255, 255, 255, 0.8)"
            element-loading-spinner="el-icon-loading"
            cell-class-name="datatable-max-cell-height"
            :show-summary="getterPanel.isShowedTotals"
            :row-class-name="tableRowClassName"
            :summary-method="getSummaries"
            @row-click="handleRowClick"
            @row-dblclick="handleRowDblClick"
            @select="handleSelection"
            @select-all="handleSelectionAll"
            @row-contextmenu="rowMenu"
            @contextmenu.prevent.native="block"
          >
            <el-table-column
              v-if="isTableSelection"
              type="selection"
              :prop="getterPanel.keyColumn"
              fixed
              min-width="50"
            />
            <template v-for="(fieldAttributes, key) in fieldsList">
              <el-table-column
                v-if="isDisplayed(fieldAttributes)"
                :key="key"
                :label="headerLabel(fieldAttributes)"
                :column-key="fieldAttributes.columnName"
                :prop="fieldAttributes.columnName"
                sortable
                :formatter="changeOrder"
                min-width="200"
                :class-name="cellClass(fieldAttributes)"
                :fixed="fieldAttributes.isFixedTableColumn"
              >
                <template slot-scope="scope">
                  <template v-if="rowCanBeEdited(scope.row, fieldAttributes)">
                    <field-definition
                      :is-data-table="true"
                      :is-show-label="false"
                      :in-table="true"
                      :metadata-field="{
                        ...fieldAttributes,
                        displayColumn: scope.row['DisplayColumn_' + fieldAttributes.columnName],
                        tableIndex: scope.$index,
                        rowKey: scope.row[getterPanel.keyColumn],
                        keyColumn: getterPanel.keyColumn,
                        recordUuid: scope.row.UUID
                      }"
                      :record-data-fields="scope.row[fieldAttributes.columnName]"
                      size="mini"
                      @keyup.enter.native="confirmEdit(scope.row)"
                    />
                  </template>
                  <template
                    v-else
                  >
                    <el-tag
                      v-if="fieldAttributes.columnName === 'DocStatus' || (fieldAttributes.columnName === 'O_DocStatus')"
                      :style="getFieldDefinition(fieldAttributes.fieldDefinition, scope.row)"
                      :type="fieldAttributes.columnName === 'DocStatus' ? tagStatus(scope.row.DocStatus) : tagStatus(scope.row.O_DocStatus)"
                      disable-transitions
                    >
                      {{ displayedValue(scope.row, fieldAttributes) }}
                    </el-tag>
                    <span v-else :style="getFieldDefinition(fieldAttributes.fieldDefinition, scope.row)">
                      {{ displayedValue(scope.row, fieldAttributes) }}
                    </span>
                  </template>
                </template>
              </el-table-column>
            </template>
          </el-table>
        </el-main>
      </el-container>
    </el-main>
    <el-footer style="height: 30px;">
      <div style="float: right;">
        <el-pagination
          small
          layout="slot, total, prev, pager, next"
          :current-page="pageNumber"
          :page-size="defaultMaxPagination"
          :total="getterRecordCount"
          @current-change="handleChangePage"
        >
          <template v-slot>
            <span>
              {{ $t('table.dataTable.selected') }}: {{ getDataSelection.length }} /
            </span>
          </template>
        </el-pagination>
      </div>
    </el-footer>
  </el-container>
</template>

<script>
import FieldDefinition from '@/components/ADempiere/Field'
import Sortable from 'sortablejs'
import FilterColumns from '@/components/ADempiere/DataTable/filterColumns'
import FixedColumns from '@/components/ADempiere/DataTable/fixedColumns'
import TableContextMenu from '@/components/ADempiere/DataTable/menu/tableContextMenu'
import TableMainMenu from '@/components/ADempiere/DataTable/menu'
import IconElement from '@/components/ADempiere/IconElement'
import { formatDate } from '@/filters/ADempiere'
import MainPanel from '@/components/ADempiere/Panel'
import { sortFields } from '@/utils/ADempiere/dictionaryUtils'
import { FIELDS_DECIMALS, FIELDS_QUANTITY, FIELD_READ_ONLY_FORM } from '@/utils/ADempiere/references'
import { fieldIsDisplayed } from '@/utils/ADempiere'
import evaluator from '@/utils/ADempiere/evaluator'

export default {
  name: 'DataTable',
  components: {
    FieldDefinition,
    FilterColumns,
    FixedColumns,
    IconElement,
    MainPanel,
    TableContextMenu,
    TableMainMenu
  },
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
    // is used in root view with primary records
    isParent: {
      type: Boolean,
      default: false
    },
    // Show input section from search in data
    isSearchable: {
      type: Boolean,
      default: false
    },
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
      activeName.push('1')
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
      isLoadPanelFromServer: false,
      rowStyle: { height: '52px' },
      sortable: null,
      uuidCurrentRecordSelected: '',
      showTableSearch: false
    }
  },
  computed: {
    getterContextMenu() {
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
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    getterPanel() {
      return this.$store.getters.getPanel(this.containerUuid)
    },
    isShowOptionalColumns() {
      return this.getterPanel.isShowedTableOptionalColumns
    },
    getterDataRecordsAndSelection() {
      return this.$store.getters.getDataRecordAndSelection(this.containerUuid)
    },
    getterRecordCount() {
      return this.getterDataRecordsAndSelection.recordCount
    },
    getterDataRecords() {
      return this.getterDataRecordsAndSelection.record
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
    pageNumber() {
      return this.getterDataRecordsAndSelection.pageNumber
    },
    isLoaded() {
      return !this.getterDataRecordsAndSelection.isLoaded
    },
    getDataSelection() {
      return this.getterDataRecordsAndSelection.selection
    },
    getterFieldIsDisplayed() {
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
          height: '17%',
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
      if (this.getterPanel.isShowedTotals) {
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
          if (this.getterFieldIsDisplayed.isDisplayed) {
            return this.getterHeight - 495 - totalRow
          }
          return this.getterHeight - 415 - totalRow
        }
        return this.getterHeight - 290 - totalRow
      }
      return this.getterHeight - 300 - totalRow
    },
    fieldsList() {
      if (this.getterPanel && this.getterPanel.fieldList) {
        if ((this.panelType === 'window' && this.isParent) || this.panelType === 'browser') {
          let orderBy = 'seqNoGrid'
          if (this.panelType === 'browser') {
            orderBy = 'sequence'
          }

          return this.sortFields({
            fieldsList: this.getterPanel.fieldList,
            orderBy
          })
        }
        return this.getterPanel.fieldList
      }
      return []
    },
    isLoadPanel() {
      if (this.getterPanel && this.getterPanel.fieldList) {
        return true
      }
      return false
    },
    isPanelWindow() {
      return Boolean(this.panelType === 'window')
    },
    getterContextClientId() {
      if (this.isPanelWindow) {
        return this.$store.getters.getContextClientId
      }
      return undefined
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
      if (!this.getterPanel.isInsertRecord) {
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
    keyUp() {
      if (this.currentTable < 1) {
        return this.currentTable
      }
      return this.currentTable - 1
    },
    keyDow() {
      const maxDown = this.getterDataRecords.length - 1
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
    actionAdvancedQuery() {
      const activeNames = []
      if (!this.activeName.length) {
        activeNames.push('1')
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
      this.handleRowClick(this.getterDataRecords[this.currentTable])
      return this.setCurrent(this.getterDataRecords[this.currentTable])
    },
    closeMenu() {
      this.$store.dispatch('showMenuTable', {
        isShowedTable: false
      })
      this.$store.dispatch('showMenuTabChildren', {
        isShowedTabChildren: false
      })
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
      if (this.panelType === 'browser' && this.getterPanel.isShowedCriteria) {
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
    sortFields,
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
      if (typeof row[field.columnName] === 'boolean') {
        // replace boolean true-false value for 'Yes' or 'Not'
        return row[field.columnName] ? this.$t('components.switchActiveText') : this.$t('components.switchInactiveText')
      } else if (field.componentPath === 'FieldDate' || field.componentPath === 'FieldTime') {
        let cell = row[field.columnName]
        if (Object.prototype.toString.call(cell) === '[object Date]') {
          cell = cell.getTime()
        }
        // replace number timestamp value for date
        return formatDate(cell, field.displayType)
      } else if (field.componentPath === 'FieldNumber') {
        if (this.isEmptyValue(row[field.columnName])) {
          return undefined
        }
        return this.formatNumber({
          displayType: field.displayType,
          number: row[field.columnName]
        })
      } else if (field.componentPath === 'FieldSelect' && this.isEmptyValue(row['DisplayColumn_' + field.columnName]) && row[field.columnName] === 0) {
        return field.defaultValue
      }
      return row['DisplayColumn_' + field.columnName] || row[field.columnName]
    },
    rowCanBeEdited(record, fieldAttributes) {
      if (!this.isParent) {
        if (this.isPanelWindow) {
          // getter with context
          if (this.isReadOnlyParent) {
            return false
          }
          // if is IsActive, Processed, Processing
          if (this.isReadOnlyRow(record, fieldAttributes)) {
            return false
          }
        }
        // if isReadOnly, isReadOnlyFromLogic
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
      if (this.getterContextClientId !== parseInt(row.AD_Client_ID, 10)) {
        return true
      }
      if (fieldIsDisplayed(field)) {
        // const fieldReadOnlyAllForm = FIELD_READ_ONLY_FORM.filter(item => {
        //   return row.hasOwnProperty(item.columnName) && item.isChangedAllForm
        // })
        // // columnName: Processed, Processing
        // if (fieldReadOnlyAllForm.length) {
        //   const isReadOnlyAllRow = Boolean(fieldReadOnlyAllForm.find(item => row[item.columnName] === item.valueIsReadOnlyForm))
        //   return isReadOnlyAllRow
        // }

        // columnName: IsActive
        const fieldReadOnlyForm = FIELD_READ_ONLY_FORM.find(item => {
          return row.hasOwnProperty(item.columnName) && !item.isChangedAllForm
        })
        if (fieldReadOnlyForm) {
          const isReadOnlyRow = row[fieldReadOnlyForm.columnName] === fieldReadOnlyForm.valueIsReadOnlyForm && field.columnName !== fieldReadOnlyForm.columnName
          return isReadOnlyRow
        }
      }
      return false
    },
    isReadOnlyCell(row, field) {
      // TODO: Add support to its type fields
      if (['FieldImage', 'FieldBinary'].includes(field.componentPath)) {
        return true
      }

      const isUpdateableAllFields = field.isReadOnly || field.isReadOnlyFromLogic
      if (this.isPanelWindow) {
        if (field.columnName === this.getterPanel.linkColumnName ||
          field.columnName === this.getterPanel.fieldLinkColumnName) {
          return true
        }
        // edit mode is diferent to create new
        const editMode = !this.isEmptyValue(row.UUID)
        return (!field.isUpdateable && editMode) || (isUpdateableAllFields || field.isReadOnlyFromForm)
      } else if (this.panelType === 'browser') {
        // browser result
        return field.isReadOnly
      }
      // other type of panels (process/reports)
      return isUpdateableAllFields
    },
    deleteSelection() {
      this.$store.dispatch('deleteSelectionDataList', {
        parentUuid: this.parentUuid,
        containerUuid: this.containerUuid
      })
        .then(() => {
          this.$store.dispatch('setRecordSelection', {
            parentUuid: this.parentUuid,
            containerUuid: this.containerUuid,
            panelType: this.panelType
          })
        })
    },
    callOffNewRecord() {
      this.getterDataRecords.shift()
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.isNew && rowIndex === 0) {
        return 'warning-row'
      }
      return ''
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
        this.$refs.multipleTable.$refs.bodyWrapper.scrollTop = 0
      } else {
        const fieldsEmpty = this.$store.getters.getFieldListEmptyMandatory({
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
          if (this.$refs.hasOwnProperty(itemField.columnName)) {
            if (fieldIsDisplayed(itemField) && !itemField.isReadOnly && itemField.isUpdateable) {
              return true
            }
          }
        })
        this.$refs[fieldFocus.columnName][0].focusField()
        resolve()
        return
      })
    },
    async getList() {
      this.oldgetDataDetail = this.getterDataRecords.map(v => v.id)
      this.newgetDataDetail = this.oldgetDataDetail.slice()
      this.$nextTick(() => {
        this.setSort()
      })
    },
    setSort() {
      if (!this.isMobile) {
        const el = this.$refs.multipleTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
        this.sortable = Sortable.create(el, {
          ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
          setData: function(dataTransfer) {
            // to avoid Firefox bug
            // Detail see : https://github.com/RubaXa/Sortable/issues/1012
            dataTransfer.setData('Text', '')
          },
          onEnd: evt => {
            const targetRow = this.getterDataRecords.splice(evt.oldIndex, 1)[0]
            this.getterDataRecords.splice(evt.newIndex, 0, targetRow)

            // for show the changes, you can delete in you code
            const tempIndex = this.newgetDataDetail.splice(evt.oldIndex, 1)[0]
            this.newgetDataDetail.splice(evt.newIndex, 0, tempIndex)
          }
        })
      }
    },
    changeOrder() {
      return this.getterDataRecords.reverse()
    },
    /**
     * @param {object} field
     */
    cellClass(field) {
      let classReturn = ''
      if (field.isReadOnly) {
        classReturn += 'cell-no-edit'
      }
      if (field.componentPath === 'FieldNumber') {
        classReturn += ' cell-align-right'
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
      const fieldsEmpty = this.$store.getters.getFieldListEmptyMandatory({
        containerUuid: this.containerUuid,
        row: row
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
      this.currentTable = this.getterDataRecords.findIndex(item => item.UUID === row.UUID)
      if (this.isShowedPanelRecord && this.isParent) {
        if (this.uuidCurrentRecordSelected !== row.UUID) {
          this.uuidCurrentRecordSelected = row.UUID
          // disabled rollback when change route
          this.$store.dispatch('setDataLog', {})
        }
        this.$router.push({
          query: {
            ...this.$route.query,
            action: row.UUID
          },
          params: {
            tableName: this.getterPanel.tableName,
            recordId: row[`${this.getterPanel.tableName}_ID`]
          }
        })
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
    isAllSelected(selection = 0) {
      if (selection > 0) {
        const data = this.getterDataRecords
        return data.length === selection
      }
      return false
    },
    handleSelectionAll(rowsSelection) {
      // let selectAll = false
      // if (this.isAllSelected(rowsSelection.length)) {
      //   selectAll = true
      // }
      this.$store.dispatch('setSelection', {
        containerUuid: this.containerUuid,
        selection: rowsSelection
      })
      // rowsSelection.forEach(row => {
      //   row.isEdit = selectAll
      // })
    },
    filterResult() {
      const data = this.getterDataRecords.filter(rowItem => {
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
      const isDisplayed = field.isDisplayed && field.isDisplayedFromLogic && field.isShowedTableFromUser && !field.isKey
      //  Verify for displayed and is active
      return field.isActive && isDisplayed
    },
    /**
     * Get the tab object with all its attributes as well as the fields it contains
     */
    getPanel() {
      // get panel from server only window and tab children
      if (this.isPanelWindow && !this.isParent && !this.getterPanel) {
        this.$store.dispatch('getPanelAndFields', {
          containerUuid: this.containerUuid,
          parentUuid: this.parentUuid,
          panelType: this.panelType
        }).then(response => {
          this.isLoadPanelFromServer = true
        }).catch(error => {
          console.warn(`Fields List Load Error ${error.code}: ${error.message}.`)
        })
      }
    },
    /**
     * @param columns
     * @param data
     */
    getSummaries(parameters) {
      const { columns } = parameters
      const sums = []
      if (!this.getterPanel.isShowedTotals) {
        return
      }

      columns.forEach((columnItem, index) => {
        if (index === 0) {
          sums[index] = 'Σ'
          return
        }
        const field = this.fieldsList.find(field => field.columnName === columnItem.property)
        if (!FIELDS_QUANTITY.includes(field.displayType)) {
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
            displayType: field.displayType,
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
        this.$refs.headerSearchSelect && this.$refs.headerSearchSelect.focus()
      }
    },
    getFieldDefinition(fieldDefinition, row) {
      let styleSheet = ''
      if (fieldDefinition && (!this.isEmptyValue(fieldDefinition.id) || fieldDefinition.conditionsList.length)) {
        fieldDefinition.conditionsList.forEach(condition => {
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
</script>

<style lang="scss">
 .contextual-menu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
  .el-table-row {
    .hover-row {
      background-color: black;
    }
    .current-row {
      .hover-row {
        background-color: initial !important;
      }
    }
  }
</style>
<style>
  .el-table .warning-row {
    background: rgba(161, 250, 223, 0.945);
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
  .el-table > .cell {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    overflow: hidden;
    max-height: 41px;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: break-all;
    line-height: 23px;
    padding-left: 10px;
    padding-right: 10px;
  }
  .el-table .cell {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    overflow: hidden;
    max-height: 50px;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: break-all;
    line-height: 23px;
    padding-left: 10px;
    padding-right: 10px;
  }

  .tr.current-row > td {
    background-color: initial !important;
    /* background-color: #e8f4ff; */
  }
  .hover-row > tr {
    background-color: initial !important;
  }
  .hover-row > td {
    background-color: initial !important;
  }
  .header-table-records {
    height: 45px !important;
    padding: 0 !important;
  }
  .icon-mobile {
    padding-right: 5%;
  }
  .el-table th, .el-table td {
    padding: 12px 0;
    min-width: 0;
    height: 64px;
    max-height: 407px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    text-overflow: ellipsis;
    vertical-align: middle;
    position: relative;
    text-align: left;
  }
  .el-menu.el-menu--horizontal {
    border-bottom: solid 0px transparent !important;
  }
  .menu-table {
    width: 75px;
    float: right;
    height: 39px !important;
  }
  .menu-table-mobile {
    height: 39px !important;
    width: 35px;
    float: right;
  }
  ul.menu-table > .el-submenu {
    height: 39px !important;
    line-height: 39px !important;
    padding: 0 10px;
  }
  ul.menu-table > .el-submenu > .el-submenu__title {
    line-height: 39px !important;
    height: 39px !important;
    padding: 0;
  }
  .el-submenu__title {
    border-bottom: 0px !important;
    color: #303133;
  }
  .panel-expand {
    float: right;
    padding-right: 40px;
    display: flex;
  }
  .field-optional {
    margin: 3px 10px;
    float: right;
  }

  /* used in cell type number */
  td.cell-align-right {
    text-align: right !important;
  }
  .el-collapse {
    border-top: 1px solid #e6ebf5;
    border-bottom: 1px solid #e6ebf5;
    overflow: hidden;
    width: 100%;
  }
</style>
<style lang="scss" scoped>
  .collapse_item_wrap {
    min-height: 180px;
    max-height: 180px;
    will-change: height;
    background-color: #fff;
    overflow: auto;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border-bottom: 1px solid #e6ebf5;
  }
  .el-table__header-wrapper {
    .el-table__footer-wrapper {
      overflow: auto;
      /* background: black; */
    }
  }
  /* style in cursor if cell is no edit */
  .cell-no-edit {
    cursor: not-allowed !important;
  }
  .cell-edit {
    cursor: pointer !important;
  }

  .table-root {
    padding-right: 0px;
    .table-footer {
      bottom: 0px;
      float: right;
      text-align: right;
      padding: 10px;
    }
  }
  .table-search {
    font-size: 0 !important;
    float: right;
    color: #5a5e66;
    height: 39px !important;
    line-height: 39px !important;
      .search-icon {
        cursor: pointer;
        font-size: 18px;
        vertical-align: middle;
      }
    .header-search-select {
      transition: width 0.2s;
      width: 0 !important;
      overflow: hidden;
      background: transparent;
      border-radius: 0;
      display: inline-block;
      vertical-align: middle;

      /deep/ .el-input__inner {
        border-radius: 0;
        border: 0;
        padding-left: 0;
        padding-right: 0;
        box-shadow: none !important;
        border-bottom: 1px solid #d9d9d9;
        vertical-align: middle;
      }
    }
    &.show {
      .header-search-select {
        width: 190px !important;
        margin-left: 10px;
      }
    }
    .header-search-select-mobile {
      transition: width 0.2s;
      width: 0 !important;
      overflow: hidden;
      background: transparent;
      border-radius: 0;
      display: inline-block;
      vertical-align: middle;

      /deep/ .el-input__inner {
        border-radius: 0;
        border: 0;
        padding-left: 0;
        padding-right: 0;
        box-shadow: none !important;
        border-bottom: 1px solid #d9d9d9;
        vertical-align: middle;
      }
    }
    &.show{
      .header-search-select-mobile {
        width: 120px !important;
        margin-left: 5px;
      }
    }
  }
</style>
