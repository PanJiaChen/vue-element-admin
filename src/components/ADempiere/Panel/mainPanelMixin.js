import FieldDefinition from '@/components/ADempiere/Field'
import FilterFields from '@/components/ADempiere/Panel/filterFields'
import { fieldIsDisplayed } from '@/utils/ADempiere/dictionaryUtils.js'
import { parsedValueComponent } from '@/utils/ADempiere/valueUtils.js'
import { convertObjectToKeyValue } from '@/utils/ADempiere/valueFormat.js'

export default {
  name: 'MainPanelMixin',
  components: {
    FieldDefinition,
    FilterFields
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
    },
    isShowedRecordNavigation: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      panelMetadata: {},
      fieldList: [], // groups list of fields
      dataRecords: {},
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
    shadowGroup() {
      if (this.isMobile) {
        return 'never'
      }
      return 'hover'
    },
    optionCRUD() {
      return this.isEmptyValue(this.uuidRecord) ? 'create-new' : this.uuidRecord
    },
    isPanelWindow() {
      return this.panelType === 'window'
    },
    panelAttributes() {
      return {
        recordUuid: this.uuidRecord,
        optionCRUD: this.optionCRUD,
        isShowedRecordNavigation: this.isShowedRecordNavigation,
        isProcessingContext: this.getContainerProcessing,
        isProcessedContext: this.getContainerProcessed
      }
    },
    getContainerProcessing() {
      if (this.panelType === 'window' && !this.isAdvancedQuery) {
        return this.$store.getters.getContainerProcessing(this.parentUuid)
      }
      return false
    },
    getContainerProcessed() {
      if (this.panelType === 'window' && !this.isAdvancedQuery) {
        return this.$store.getters.getContainerProcessed(this.parentUuid)
      }
      return false
    },
    getterPanel() {
      return this.$store.getters.getPanel(this.containerUuid, this.isAdvancedQuery)
    },
    fieldsList() {
      let panel = this.panelMetadata
      if (!this.isEmptyValue(panel) && panel.fieldList) {
        return panel.fieldList
      }
      panel = this.getterPanel
      if (panel) {
        return panel.fieldList
      }
      return undefined
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
    getterIsLoadedRecord() {
      return this.getterDataStore.isLoaded
    },
    classCards() {
      if (this.isMobile || this.fieldGroups.length < 2 || this.isShowedRecordNavigation) {
        return 'cards-not-group'
      }
      return 'cards-in-group'
    }
  },
  watch: {
    // used only panel modal (process associated in browser or window)
    containerUuid() {
      if (['report', 'process'].includes(this.panelType)) {
        this.generatePanel(this.metadata.fieldList)
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
        this.readParameters()
      }
    }
  },
  created() {
    // get fields with uuid
    this.getPanel()
  },
  methods: {
    /**
     * Get the tab object with all its attributes as well as the fields it contains
     */
    getPanel() {
      const panel = this.getterPanel
      if (!this.isEmptyValue(panel) && panel.fieldList) {
        this.panelMetadata = panel
        const fieldsList = panel.fieldList
        if (fieldsList && Array.isArray(fieldsList)) {
          this.generatePanel(fieldsList)
        }
      } else {
        this.$store.dispatch('getPanelAndFields', {
          parentUuid: this.parentUuid,
          containerUuid: this.containerUuid,
          panelType: this.panelType,
          panelMetadata: this.metadata,
          isAdvancedQuery: this.isAdvancedQuery
        }).then(panelResponse => {
          this.panelMetadata = panelResponse
          this.generatePanel(panelResponse.fieldList)
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
    readParameters() {
      const parameters = {
        isLoadAllRecords: true,
        isReference: false,
        isNewRecord: false,
        isWindow: true,
        criteria: {}
      }
      const route = this.$route
      if (this.isPanelWindow) {
        // TODO: use action notifyPanelChange with isShowedField in true
        this.fieldsList.forEach(fieldItem => {
          if (Object.prototype.hasOwnProperty.call(route.query, fieldItem.columnName) && !fieldItem.isAdvancedQuery) {
            fieldItem.isShowedFromUser = true
            fieldItem.value = parsedValueComponent({
              componentPath: fieldItem.componentPath,
              columnName: fieldItem.columnName,
              value: route.query[fieldItem.columnName],
              displayType: fieldItem.displayType,
              isIdentifier: fieldItem.columnName.includes('_ID')
            })
            if (String(route.query.isAdvancedQuery) === String(fieldItem.isAdvancedQuery)) {
              fieldItem.value = parsedValueComponent({
                componentPath: fieldItem.componentPath,
                columnName: fieldItem.columnName,
                value: route.query[fieldItem.columnName],
                displayType: fieldItem.displayType,
                isIdentifier: fieldItem.columnName.includes('_ID')
              })
              if (fieldItem.isRange && this.$route.query[`${fieldItem.columnName}_To`]) {
                fieldItem.valueTo = parsedValueComponent({
                  componentPath: fieldItem.componentPath,
                  columnName: fieldItem.componentPath,
                  value: route.query[`${fieldItem.columnName}_To`],
                  displayType: fieldItem.displayType,
                  isIdentifier: fieldItem.columnName.includes('_ID')
                })
              }
            }
          }
        })

        if (route.query.action && route.query.action === 'reference') {
          const referenceInfo = this.$store.getters.getReferencesInfo({
            windowUuid: this.parentUuid,
            recordUuid: route.query.recordUuid,
            referenceUuid: route.query.referenceUuid
          })
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
        } else if (route.query.action && route.query.action === 'listRecords') {
          parameters.isLoadAllRecords = true
          route.params.isReadParameters = true
        } else if (!this.isEmptyValue(route.query.action) &&
          !['create-new', 'reference', 'advancedQuery', 'criteria', 'listRecords'].includes(route.query.action)) {
          parameters.isLoadAllRecords = false
          parameters.value = route.query.action
          parameters.tableName = this.metadata.tableName
          parameters.columnName = 'UUID'
          route.params.isReadParameters = true
        }
        // Only call get data if panel type is window
        if (!Object.prototype.hasOwnProperty.call(route.params, 'isReadParameters') || route.params.isReadParameters) {
          this.getData(parameters)
        }
        let viewTitle = ''
        if (route.query && !this.isEmptyValue(route.query.action)) {
          viewTitle = route.query.action
        }
        this.setTagsViewTitle(viewTitle)
      } else {
        if (this.panelType === 'table' && route.query.action === 'advancedQuery') {
          // TODO: use action notifyPanelChange with isShowedField in true
          this.fieldList.forEach(fieldItem => {
            if (Object.prototype.hasOwnProperty.call(route.query, fieldItem.columnName) && fieldItem.isAdvancedQuery) {
              fieldItem.isShowedFromUser = true

              if (route.query.action === 'advancedQuery' && fieldItem.isAdvancedQuery) {
                this.dataRecords[fieldItem.columnName] = parsedValueComponent({
                  componentPath: fieldItem.componentPath,
                  columnName: fieldItem.columnName,
                  value: route.query[fieldItem.columnName],
                  isIdentifier: fieldItem.columnName.includes('_ID')
                })
                if (fieldItem.isRange && route.query[`${fieldItem.columnName}_To`]) {
                  this.dataRecords[fieldItem.columnName] = parsedValueComponent({
                    componentPath: fieldItem.componentPath,
                    columnName: fieldItem.columnName,
                    value: route.query[`${fieldItem.columnName}_To`],
                    isIdentifier: fieldItem.columnName.includes('_ID')
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
            isSendToServer: true,
            isSendCallout: false,
            fieldList: this.fieldList,
            panelType: this.panelType
          })
        } else if (['process', 'browser'].includes(this.panelType)) {
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
            let action = 'create-new'
            let params = this.$route.params
            if (response.length && !parameters.isNewRecord) {
              this.dataRecords = response[0]
              const recordId = this.dataRecords[`${this.metadata.tableName}_ID`]
              params = {
                ...params,
                tableName: this.metadata.tableName,
                recordId
              }
              if (this.$route.query.action === 'reference') {
                action = 'reference'
              } else {
                // 'criteria'
                action = this.dataRecords.UUID
              }
              let viewTitle = ''
              if (this.$route.query && !this.isEmptyValue(this.$route.query.action)) {
                viewTitle = this.$route.query.action
              }
              this.setTagsViewTitle(viewTitle)
              this.isLoadRecord = true
            }

            this.$router.push({
              name: this.$route.name,
              params,
              query: {
                ...this.$route.query,
                action
              }
            }).catch(error => {
              console.info(`Panel Component: ${error.name}, ${error.message}`)
            })

            if (action === 'create-new') {
              this.$store.dispatch('setDefaultValues', {
                panelType: this.panelType,
                parentUuid: this.parentUuid,
                containerUuid: this.containerUuid,
                isNewRecord: true
              })
            } else {
              const attributes = convertObjectToKeyValue({
                object: this.dataRecords
              })
              this.$store.dispatch('notifyPanelChange', {
                parentUuid: this.parentUuid,
                containerUuid: this.containerUuid,
                attributes
              })
            }
          })
          .catch(error => {
            console.warn(`Error getting data list tab. Message: ${error.message}, code ${error.code}.`)
          })
      }
    },
    /**
     * Group the arrangement into groups of columns that they contain, it must
     * be grouped after having the order
     * @param {array} fieldsList
     * @return {array} groupsList
     * TODO: Save into store to dont regenerate
     */
    sortAndGroup(fieldsList) {
      if (this.isEmptyValue(fieldsList)) {
        return
      }
      let groupsList = [{
        groupFinal: '',
        metadataFields: fieldsList
      }]

      // reduce, create array with number groupAssigned element comun
      if (this.isPanelWindow) {
        groupsList = fieldsList
          .reduce((groupsList, currentValue) => {
            if (!groupsList.includes(currentValue.groupAssigned)) {
              groupsList.push(currentValue.groupAssigned)
            }
            return groupsList
          }, [])
          .map(itemGroup => {
            return {
              groupFinal: itemGroup,
              metadataFields: fieldsList.filter(itemField => {
                return itemField.groupAssigned === itemGroup
              })
            }
          })
      }

      // count and add the field numbers according to your group
      groupsList.forEach(groupFields => {
        const typeG = groupFields.metadataFields[0].typeGroupAssigned
        groupFields.typeGroup = typeG

        const fieldsDisplayed = groupFields.metadataFields.filter(field => {
          return fieldIsDisplayed(field)
        })

        if ((this.groupTab.groupType === 'T' && this.groupTab.groupName === groupFields.groupFinal) ||
          (this.groupTab.groupType !== 'T' && groupFields.typeGroup !== 'T')) {
          this.groupsView = this.groupsView + 1
        }
        groupFields.activeFields = fieldsDisplayed.length
      })

      return groupsList
    },
    /**
     * Set title in tag view
     * @param {string} actionValue
     */
    setTagsViewTitle(actionValue) {
      if (actionValue !== 'create-new' && !this.isEmptyValue(actionValue) && this.panelMetadata.isDocument && this.getterDataStore.isLoaded) {
        this.$store.dispatch('listWorkflows', this.metadata.tableName)
        this.$store.dispatch('listDocumentStatus', {
          recordUuid: this.$route.query.action,
          tableName: this.metadata.tableName
        })
      }
      if (actionValue === 'create-new' || this.isEmptyValue(actionValue)) {
        this.tagTitle.action = this.$t('tagsView.newRecord')
      } else if (actionValue === 'advancedQuery') {
        this.tagTitle.action = this.$t('tagsView.advancedQuery')
      } else {
        const { identifierColumns } = this.panelMetadata
        if (!this.isEmptyValue(identifierColumns)) {
          const keyName = identifierColumns[0].columnName
          if (this.dataRecords[keyName]) {
            this.tagTitle.action = this.dataRecords[keyName]
          } else {
            const field = this.fieldList.find(fieldItem => fieldItem.isIdentifier)
            const value = this.$store.getters.getValueOfField({
              parentUuid: this.parentUuid,
              containerUuid: this.containerUuid,
              columnName: field.columnName
            })
            this.tagTitle.action = value
          }
        } else {
          this.tagTitle.action = this.$t('tagsView.seeRecord')
        }
      }
      if (this.isPanelWindow) {
        this.$store.dispatch('tagsView/updateVisitedView', {
          ...this.$route,
          title: `${this.tagTitle.base} - ${this.tagTitle.action}`
        })
      }
    },
    changePanelRecord(uuidRecord) {
      if (!['create-new', 'reference', 'advancedQuery', 'criteria', 'listRecords'].includes(uuidRecord)) {
        this.$store.dispatch('seekRecord', {
          parentUuid: this.parentUuid,
          containerUuid: this.containerUuid,
          recordUuid: uuidRecord
        }).then(() => {
          if (this.panelMetadata.isTabsChildren) {
            // delete records tabs children when change record uuid
            this.$store.dispatch('deleteRecordContainer', {
              viewUuid: this.parentUuid,
              withOut: [this.containerUuid]
            })
          }
        })
      }

      const currentRecord = this.getterDataStore.record.find(record => record.UUID === uuidRecord) || {}
      this.dataRecords = currentRecord
      this.$store.dispatch('currentRecord', currentRecord)

      this.setTagsViewTitle(uuidRecord)
      if (this.$route.query && this.$route.query.action === 'create-new') {
        this.setFocus()
      }
    },
    async setFocus() {
      return new Promise(resolve => {
        const fieldFocus = this.fieldsList.find(itemField => {
          if (itemField.handleRequestFocus) {
            return true
          }
          if (Object.prototype.hasOwnProperty.call(this.$refs, itemField.columnName)) {
            if (fieldIsDisplayed(itemField) &&
              !itemField.isReadOnly &&
              itemField.isUpdateable &&
              itemField.componentPath !== 'FieldSelect') {
              return true
            }
          }
        })
        if (fieldFocus) {
          this.$refs[fieldFocus.columnName][0].focusField()
        }
        resolve()
        return
      })
    }
  }
}
