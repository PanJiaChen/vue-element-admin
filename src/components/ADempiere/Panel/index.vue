<template>
  <div class="wrapper">
    <el-form
      v-if="isLoadPanel"
      key="panel-loaded"
      v-model="dataRecords"
      label-position="top"
      label-width="200px"
    >
      <template
        v-if="firstGroup && firstGroup.groupFinal === ''"
      >
        <div v-show="firstGroup.activeFields" class="cards-not-group">
          <div
            v-if="(groupTab.groupType == 'T' && groupTab.groupName == firstGroup.groupFinal)
              || (groupTab.groupType !== 'T' && firstGroup.typeGroup !== 'T')"
            class="card"
          >
            <div class="select-filter">
              <span>
                {{ firstGroup.groupFinal }}
              </span>
              <filter-fields
                :container-uuid="containerUuid"
                :panel-type="panelType"
                :group-field="firstGroup.groupFinal"
                :is-advanced-query="isAdvancedQuery"
              />
            </div>
            <el-card
              :shadow="isMobile ? 'never' : 'hover'"
              :body-style="{ padding: '10px' }"
            >
              <el-row :gutter="gutterRow">
                <template v-for="(fieldAttributes, subKey) in firstGroup.metadataFields">
                  <field-definition
                    :ref="fieldAttributes.columnName"
                    :key="subKey"
                    :parent-uuid="parentUuid"
                    :container-uuid="containerUuid"
                    :metadata-field="{
                      ...fieldAttributes,
                      optionCRUD
                    }"
                    :record-data-fields="isAdvancedQuery ? undefined : dataRecords[fieldAttributes.columnName]"
                    :panel-type="panelType"
                    :in-group="!getterIsShowedRecordNavigation"
                    :is-advanced-query="isAdvancedQuery"
                  />
                </template>
              </el-row>
            </el-card>
          </div>
        </div>
      </template>
      <div :class="cards()">
        <draggable
          v-if="!isMobile"
          :list="fieldGroups"
          v-bind="$attrs"
          :set-data="setData"
        >
          <template v-for="(item, key) in fieldGroups">
            <el-row :key="key">
              <el-col :key="key" :span="24">
                <div
                  v-if="item.groupFinal !== ''
                    && (groupTab.groupType == 'T' && groupTab.groupName == item.groupFinal)
                    || (groupTab.groupType !== 'T' && item.typeGroup !== 'T')"
                  :key="key"
                  class="card"
                >
                  <el-card
                    :shadow="isMobile ? 'never' : 'hover'"
                    :body-style="{ padding: '10px' }"
                  >
                    <div slot="header" class="clearfix">
                      <span>
                        {{ item.groupFinal }}
                      </span>
                      <div class="select-filter-header">
                        <filter-fields
                          :container-uuid="containerUuid"
                          :panel-type="panelType"
                          :group-field="item.groupFinal"
                          :is-first-group="false"
                          :is-advanced-query="isAdvancedQuery"
                        />
                      </div>
                    </div>
                    <el-row :gutter="gutterRow">
                      <template v-for="(fieldAttributes, subKey) in item.metadataFields">
                        <field-definition
                          :ref="fieldAttributes.columnName"
                          :key="subKey"
                          :parent-uuid="parentUuid"
                          :container-uuid="containerUuid"
                          :metadata-field="{
                            ...fieldAttributes,
                            optionCRUD
                          }"
                          :record-data-fields="isAdvancedQuery ? undefined : dataRecords[fieldAttributes.columnName]"
                          :panel-type="panelType"
                          :in-group="isPanelWindow && fieldGroups.length > 1"
                          :is-advanced-query="isAdvancedQuery"
                        />
                      </template>
                    </el-row>
                  </el-card>
                </div>
              </el-col>
            </el-row>
          </template>
        </draggable>
        <template v-else>
          <template v-for="(item, key) in fieldGroups">
            <el-row :key="key">
              <el-col :key="key" :span="24">
                <div
                  v-if="item.groupFinal !== ''
                    && (groupTab.groupType == 'T' && groupTab.groupName == item.groupFinal)
                    || (groupTab.groupType !== 'T' && item.typeGroup !== 'T')"
                  :key="key"
                  class="card"
                >
                  <el-card
                    :shadow="isMobile ? 'never' : 'hover'"
                    :body-style="{ padding: '10px' }"
                  >
                    <div slot="header" class="clearfix">
                      <span>
                        {{ item.groupFinal }}
                      </span>
                      <div v-if="!isAdvancedQuery" class="select-filter-header">
                        <filter-fields
                          :container-uuid="containerUuid"
                          :panel-type="panelType"
                          :group-field="item.groupFinal"
                          :is-first-group="false"
                        />
                      </div>
                    </div>
                    <el-row :gutter="gutterRow">
                      <template v-for="(fieldAttributes, subKey) in item.metadataFields">
                        <field-definition
                          :ref="fieldAttributes.columnName"
                          :key="subKey"
                          :parent-uuid="parentUuid"
                          :container-uuid="containerUuid"
                          :metadata-field="{
                            ...fieldAttributes,
                            optionCRUD
                          }"
                          :record-data-fields="isAdvancedQuery ? undefined : dataRecords[fieldAttributes.columnName]"
                          :panel-type="panelType"
                          :in-group="isPanelWindow && fieldGroups.length > 1"
                        />
                      </template>
                    </el-row>
                  </el-card>
                </div>
              </el-col>
            </el-row>
          </template>
        </template>
      </div>
    </el-form>
    <div
      v-else
      key="panel-loading"
      v-loading="!isLoadPanel"
      :element-loading-text="$t('notifications.loading')"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)"
      class="loading-panel"
    />
  </div>
</template>

<script>
import FieldDefinition from '@/components/ADempiere/Field'
import FilterFields from '@/components/ADempiere/Panel/filterFields'
import draggable from 'vuedraggable'
import { fieldIsDisplayed, parsedValueComponent } from '@/utils/ADempiere'

export default {
  name: 'MainPanel',
  components: {
    FieldDefinition,
    FilterFields,
    draggable
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
    metadata: {
      type: Object,
      default: () => {}
    },
    // tab type group
    groupTab: {
      type: Object,
      default: () => ({
        groupType: '',
        groupName: ''
      })
    },
    panelType: {
      type: String,
      default: 'window'
    },
    isAdvancedQuery: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fieldList: [],
      dataRecords: {},
      gutterRow: 0,
      isLoadPanel: false,
      isLoadRecord: false,
      uuidRecord: this.$route.query.action,
      fieldGroups: [],
      firstGroup: {},
      groupsView: 0,
      tagTitle: {
        base: this.$route.meta.title,
        action: ''
      }
    }
  },
  computed: {
    optionCRUD() {
      return this.isEmptyValue(this.uuidRecord) ? 'create-new' : this.uuidRecord
    },
    isPanelWindow() {
      return this.panelType === 'window'
    },
    getterIsShowedRecordNavigation() {
      if (this.isPanelWindow) {
        return this.$store.getters.getIsShowedRecordNavigation(this.parentUuid)
      }
      return false
    },
    getterFieldList() {
      const panel = this.$store.getters.getPanel(this.containerUuid, this.isAdvancedQuery)
      if (panel) {
        return panel.fieldList
      }
      return panel
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    getterDataStore() {
      if (this.isPanelWindow) {
        return this.$store.getters.getDataRecordAndSelection(this.containerUuid)
      }
      return {
        recordCount: 0,
        isLoaded: false,
        record: []
      }
    },
    getterTotalDataRecordCount() {
      return this.getterDataStore.recordCount
    },
    getterIsLoadedRecord() {
      return this.getterDataStore.isLoaded
    },
    getterRowData() {
      if (this.isPanelWindow) {
        if (!this.isEmptyValue(this.uuidRecord) && this.uuidRecord !== 'create-new') {
          return this.$store.getters.getRowData(this.containerUuid, this.uuidRecord)
        }
      }
      return false
    }
  },
  watch: {
    // used only panel modal (process associated in browser or window)
    containerUuid() {
      this.generatePanel(this.metadata.fieldList)
    },
    // used if the first load contains a uuid
    isLoadRecord(value) {
      // TODO: Validate UUID value
      if (value && this.isPanelWindow && this.uuidRecord !== 'create-new' &&
        !this.isEmptyValue(this.uuidRecord)) {
        this.setTagsViewTitle(this.uuidRecord)
      }
    },
    '$route.query.action'(newValue, oldValue) {
      // used in field, if uuid record or different create-new, field is read only
      this.uuidRecord = newValue

      if (newValue !== oldValue && this.isPanelWindow) {
        this.changePanelRecord(newValue)
      }
    },
    isLoadPanel(value) {
      if (value) {
        this.readParameters(this.$route)
      }
    }
  },
  created() {
    // get fields with uuid
    this.getPanel()
  },
  methods: {
    cards() {
      if (this.isMobile || this.fieldGroups.length < 2 || this.getterIsShowedRecordNavigation) {
        return 'cards-not-group'
      }
      return 'cards-in-group'
    },
    /**
     * Get the tab object with all its attributes as well as the fields it contains
     */
    getPanel() {
      const fieldsList = this.getterFieldList
      if (fieldsList && Array.isArray(fieldsList)) {
        this.generatePanel(fieldsList)
      } else {
        this.$store.dispatch('getPanelAndFields', {
          parentUuid: this.parentUuid,
          containerUuid: this.containerUuid,
          panelType: this.panelType,
          isAdvancedQuery: this.isAdvancedQuery
        }).then(() => {
          this.generatePanel(this.getterFieldList)
        }).catch(error => {
          console.warn(`Field Load Error: ${error.message}. Code: ${error.code}.`)
        })
      }
    },
    generatePanel(fieldsList) {
      // order and assign groups
      this.fieldList = fieldsList
      if (fieldsList.length) {
        this.fieldGroups = this.sortAndGroup(fieldsList)
      }
      let firstGroup
      if (this.fieldGroups[0] && this.fieldGroups[0].groupFinal === '') {
        firstGroup = this.fieldGroups[0]
        this.fieldGroups.shift()
      }
      this.firstGroup = firstGroup

      this.isLoadPanel = true
    },
    /**
     * TODO: Delete route parameters after reading them
     */
    readParameters(route) {
      var parameters = {
        isLoadAllRecords: true,
        isReference: false,
        isNewRecord: false,
        isWindow: true,
        criteria: {}
      }
      if (this.isPanelWindow) {
        // TODO: use action notifyPanelChange with isShowedField in true
        this.getterFieldList.forEach(fieldItem => {
          if (route.query.hasOwnProperty(fieldItem.columnName) && !fieldItem.isAdvancedQuery) {
            fieldItem.isShowedFromUser = true
            fieldItem.value = parsedValueComponent({
              fieldType: fieldItem.componentPath,
              value: route.query[fieldItem.columnName],
              referenceType: fieldItem.referenceType
            })
            if (String(route.query.isAdvancedQuery) === String(fieldItem.isAdvancedQuery)) {
              fieldItem.value = parsedValueComponent({
                fieldType: fieldItem.componentPath,
                value: route.query[fieldItem.columnName],
                referenceType: fieldItem.referenceType
              })
              if (fieldItem.isRange && this.$route.query[`${fieldItem.columnName}_To`]) {
                fieldItem.valueTo = parsedValueComponent({
                  fieldType: fieldItem.componentPath,
                  value: route.query[`${fieldItem.columnName}_To`],
                  referenceType: fieldItem.referenceType
                })
              }
            }
          }
        })

        if (route.query.action && route.query.action === 'reference') {
          const referenceInfo = this.$store.getters.getReferencesInfo(route.query.windowUuid, route.query.recordUuid, route.query.referenceUuid)
          route.params.isReadParameters = true
          parameters.isLoadAllRecords = false
          parameters.isReference = true
          parameters.referenceUuid = referenceInfo.uuid
          parameters.referenceWhereClause = referenceInfo.whereClause
        } else if (route.query.action && route.query.action === 'create-new') {
          parameters.isNewRecord = true
        } else if (route.query.action && route.query.action === 'criteria') {
          route.params.isReadParameters = true
          Object.keys(route.params).forEach(param => {
            if (!this.isEmptyValue(route.params[param])) {
              parameters.criteria[param] = route.params[param]
            }
          })
        } else if (route.query.action && route.query.action !== 'create-new' && route.query.action !== 'reference' && route.query.action !== 'advancedQuery' && route.query.action !== 'criteria') {
          parameters.isLoadAllRecords = false
          parameters.value = route.query.action
          parameters.tableName = this.metadata.tableName
          parameters.columnName = 'UUID'
          route.params.isReadParameters = true
        }
        // Only call get data if panel type is window
        if (!route.params.hasOwnProperty('isReadParameters') || route.params.isReadParameters) {
          this.getData(parameters)
        }
      } else {
        if (this.panelType === 'table' && route.query.action === 'advancedQuery') {
          // TODO: use action notifyPanelChange with isShowedField in true
          this.fieldList.forEach(fieldItem => {
            if (route.query.hasOwnProperty(fieldItem.columnName) && fieldItem.isAdvancedQuery) {
              fieldItem.isShowedFromUser = true

              if (route.query.action === 'advancedQuery' && fieldItem.isAdvancedQuery) {
                this.dataRecords[fieldItem.columnName] = parsedValueComponent({
                  fieldType: fieldItem.componentPath,
                  value: route.query[fieldItem.columnName]
                })
                if (fieldItem.isRange && route.query[`${fieldItem.columnName}_To`]) {
                  this.dataRecords[fieldItem.columnName] = parsedValueComponent({
                    fieldType: fieldItem.componentPath,
                    value: route.query[`${fieldItem.columnName}_To`]
                  })
                }
              }
            }
          })
          parameters.isWindow = false
          this.$store.dispatch('notifyPanelChange', {
            parentUuid: this.parentUuid,
            containerUuid: this.containerUuid,
            isAdvancedQuery: route.query.action === 'advancedQuery',
            newValues: this.dataRecords,
            isSendToServer: false,
            isSendCallout: false,
            fieldList: this.fieldList,
            panelType: this.panelType
          })
        } else if (this.panelType === 'process' || this.panelType === 'browser') {
          if (!this.isEmptyValue(route.query)) {
            this.$store.dispatch('notifyPanelChange', {
              containerUuid: this.containerUuid,
              newValues: route.query,
              isShowedField: true,
              isSendCallout: false,
              panelType: this.panelType
            })
            parameters.isWindow = false
          }
        }
      }
    },
    /**
     * @param  {object} parameters parameters to condition the data query
     */
    getData(parameters) {
      if (parameters.isWindow && this.isPanelWindow && !this.getterIsLoadedRecord) {
        this.$store.dispatch('getDataListTab', {
          parentUuid: this.parentUuid,
          containerUuid: this.containerUuid,
          isLoadAllRecords: parameters.isLoadAllRecords,
          isReference: parameters.isReference,
          referenceWhereClause: parameters.referenceWhereClause,
          columnName: parameters.columnName,
          value: parameters.value,
          criteria: parameters.criteria
        })
          .then(response => {
            if (response.length && !parameters.isNewRecord) {
              this.dataRecords = response[0]
              if (this.$route.query.action === 'criteria') {
                this.$router.push({
                  name: this.$route.name,
                  query: {
                    ...this.$route.query,
                    action: this.dataRecordsq
                  },
                  params: {
                    tableName: this.metadata.tableName,
                    recordId: this.dataRecords[`${this.metadata.tableName}_ID`]
                  }
                })
                this.$store.dispatch('notifyPanelChange', {
                  parentUuid: this.parentUuid,
                  containerUuid: this.containerUuid,
                  newValues: this.dataRecords,
                  isSendToServer: false,
                  isSendCallout: false,
                  fieldList: this.fieldList,
                  panelType: this.panelType
                })
              } else if (this.$route.query.action === 'reference') {
                this.$router.push({
                  name: this.$route.name,
                  query: {
                    ...this.$route.query
                  },
                  params: {
                    tableName: this.metadata.tableName,
                    recordId: this.dataRecords[`${this.metadata.tableName}_ID`]
                  }
                })
                this.$store.dispatch('notifyPanelChange', {
                  parentUuid: this.parentUuid,
                  containerUuid: this.containerUuid,
                  newValues: this.dataRecords,
                  isSendToServer: false,
                  isSendCallout: false,
                  fieldList: this.fieldList,
                  panelType: this.panelType
                })
              } else {
                this.$router.push({
                  query: {
                    ...this.$route.query,
                    action: this.dataRecords.UUID
                  }
                })
                this.$route.params['tableName'] = this.metadata.tableName
                this.$route.params['recordId'] = this.dataRecords[`${this.metadata.tableName}_ID`]
                this.$store.dispatch('notifyPanelChange', {
                  parentUuid: this.parentUuid,
                  containerUuid: this.containerUuid,
                  newValues: this.dataRecords,
                  isSendToServer: false,
                  isSendCallout: false,
                  fieldList: this.fieldList,
                  panelType: this.panelType
                })
              }
              this.setTagsViewTitle(this.$route.query.action)
              this.isLoadRecord = true
            } else {
              this.$router.push({
                query: {
                  action: 'create-new',
                  ...this.$route.query
                }
              })
            }
            this.setFocus()
          })
      }
    },
    /**
     * Group the arrangement into groups of columns that they contain, it must
     * be grouped after having the order
     * @param {array} array
     * @return {array} res
     */
    sortAndGroup(arr) {
      if (arr === undefined) {
        return
      }
      let res = [{
        groupFinal: '',
        metadataFields: arr
      }]

      // reduce, create array with number groupAssigned element comun
      if (this.isPanelWindow) {
        res = arr
          .reduce((res, currentValue) => {
            if (!res.includes(currentValue.groupAssigned)) {
              res.push(currentValue.groupAssigned)
            }
            return res
          }, [])
          .map(itemGroup => {
            return {
              groupFinal: itemGroup,
              metadataFields: arr.filter(itemField => {
                return itemField.groupAssigned === itemGroup
              })
            }
          })
      }

      // count and add the field numbers according to your group
      Object.keys(res).forEach(key => {
        let count = 0
        const typeG = res[key].metadataFields[0].typeGroupAssigned
        res[key].numberFields = res[key].metadataFields.length
        res[key].typeGroup = typeG
        res[key].numberFields = res[key].metadataFields.length

        res[key].metadataFields.forEach((element, index) => {
          if (element.isDisplayed) {
            count++
          }
        })

        if ((this.groupTab.groupType === 'T' && this.groupTab.groupName === res[key].groupFinal) ||
          (this.groupTab.groupType !== 'T' && res[key].typeGroup !== 'T')) {
          this.groupsView = this.groupsView + 1
        }
        res[key].activeFields = count
      })
      return res
    },
    setTagsViewTitle(actionValue) {
      if (actionValue === 'create-new' || actionValue === '') {
        this.tagTitle.action = this.$t('tagsView.newRecord')
      } else if (actionValue === 'advancedQuery') {
        this.tagTitle.action = this.$t('tagsView.advancedQuery')
      } else {
        var field = this.fieldList.find(fieldItem => fieldItem.isIdentifier)
        if (field) {
          if (this.dataRecords[field.columnName]) {
            this.tagTitle.action = this.dataRecords[field.columnName]
          } else {
            this.tagTitle.action = field.value
          }
        } else {
          this.tagTitle.action = this.$t('tagsView.seeRecord')
        }
      }
      if (this.isPanelWindow) {
        var tempRoute = Object.assign({}, this.$route, { title: `${this.tagTitle.base} - ${this.tagTitle.action}` })
        this.$store.dispatch('tagsView/updateVisitedView', tempRoute)
      }
    },
    setData(dataTransfer) {
      // to avoid Firefox bug
      // Detail see : https://github.com/RubaXa/Sortable/issues/1012
      dataTransfer.setData('Text', '')
    },
    changePanelRecord(uuidRecord) {
      if (uuidRecord !== 'create-new' && uuidRecord !== 'reference' && uuidRecord !== 'advancedQuery' && uuidRecord !== 'criteria') {
        var recordSelected = this.$store.getters.getDataRecordsList(this.containerUuid).find(record => record.UUID === uuidRecord)
        if (recordSelected) {
          this.dataRecords = recordSelected
          this.$store.dispatch('notifyPanelChange', {
            parentUuid: this.parentUuid,
            containerUuid: this.containerUuid,
            newValues: this.dataRecords,
            isSendToServer: false,
            isSendCallout: false,
            fieldList: this.fieldList,
            panelType: this.panelType
          }).then(() => {
            // delete records tabs children when change record uuid
            this.$store.dispatch('deleteRecordContainer', {
              viewUuid: this.parentUuid,
              withOut: [this.containerUuid]
            })
          })
        }
      }
      this.setTagsViewTitle(uuidRecord)
      this.setFocus()
    },
    setFocus() {
      let isFocusEnabled = false
      this.getterFieldList.forEach(fieldItem => {
        if (!isFocusEnabled) {
          if (this.isFocusable(fieldItem) && this.$refs.hasOwnProperty(fieldItem.columnName)) {
            this.$refs[fieldItem.columnName][0].focus(fieldItem.columnName)
            isFocusEnabled = true
          }
        }
        return
      })
    },
    isFocusable(field) {
      if (fieldIsDisplayed(field) && !field.isReadOnly && field.isUpdateable) {
        return true
      }
      return false
    }
  }
}
</script>

<style scoped>
  .loading-panel {
    padding: 100px;
    height: 100%;
  }

  .cards-in-group {
    column-count: 2;  /*numbers of columns */
    column-gap: 1em;
  }
  .cards-not-group {
    column-count: 1; /* numbers of columns */
    column-gap: 1em;
    margin-bottom: 5px;
  }

  .card {
    /* padding: 10px; */
    width: 100% !important;
    transition: all 100ms ease-in-out;
    display: inline-block;
    perspective: 1000;
    backface-visibility: hidden;
  }
  .el-card {
    width: 100% !important;
  }
</style>
<style>
  .select-filter {
    width: 280px !important;
    float: right;
    top: 0;
  }
  .select-filter-header {
    width: 60% !important;
    float: right;
    top: 0px;
  }
</style>
