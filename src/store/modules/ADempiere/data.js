import Vue from 'vue'
import {
  getEntity,
  getEntitiesList,
  getDefaultValueFromServer,
  getContextInfoValueFromServer,
  getPrivateAccessFromServer,
  lockPrivateAccessFromServer,
  unlockPrivateAccessFromServer
} from '@/api/ADempiere/data'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { showMessage } from '@/utils/ADempiere/notification'
import language from '@/lang'

const data = {
  state: {
    recordSelection: [], // record data and selection
    inGetting: [],
    contextInfoField: [],
    recordPrivateAccess: {}
  },
  mutations: {
    addInGetting(state, payload) {
      state.inGetting.push(payload)
    },
    deleteInGetting(state, payload) {
      state.inGetting = state.inGetting.filter(item => item.containerUuid !== payload.containerUuid)
    },
    addRecordSelection(state, payload) {
      state.recordSelection.push(payload)
    },
    setRecordSelection(state, payload) {
      payload.dataStore.record = payload.newDataStore.record
      payload.dataStore.selection = payload.newDataStore.selection
      payload.dataStore.pageNumber = payload.newDataStore.pageNumber
      payload.dataStore.recordCount = payload.newDataStore.recordCount
      payload.dataStore.nextPageToken = payload.newDataStore.nextPageToken
      payload.dataStore.isLoadedContext = payload.newDataStore.isLoadedContext
      payload.dataStore.isLoaded = payload.newDataStore.isLoaded
    },
    setSelection(state, payload) {
      payload.data.selection = payload.newSelection
    },
    deleteRecordContainer(state, payload) {
      state.recordSelection = payload
    },
    notifyCellTableChange: (state, payload) => {
      payload.row[payload.columnName] = payload.value
      if (payload.displayColumn !== undefined) {
        const key = `DisplayColumn_${payload.columnName}`
        payload.row[key] = payload.displayColumn
      }
    },
    notifyCellSelectionChange: (state, payload) => {
      if (payload.row !== undefined) {
        payload.row[payload.columnName] = payload.value
        if (payload.displayColumn !== undefined) {
          const key = `DisplayColumn_${payload.columnName}`
          payload.row[key] = payload.displayColumn
        }
      }
    },
    notifyRowTableChange: (state, payload) => {
      Object.assign(payload.row, payload.newRow)
    },
    setPageNumber(state, payload) {
      payload.data.pageNumber = payload.pageNumber
    },
    setIsloadContext(state, payload) {
      payload.data.isLoadedContext = payload.isLoadedContext
    },
    addNewRow(state, payload) {
      payload.data = payload.data.unshift(payload.values)
    },
    addDisplayColumn(state, payload) {
      Vue.set(payload.row, payload.columnName, payload.displayColumn)
    },
    setContextInfoField(state, payload) {
      state.contextInfoField.push(payload)
    },
    setPrivateAccess(state, payload) {
      state.recordPrivateAccess = payload
    }
  },
  actions: {
    /**
     * Set page number of pagination list
     * @param {string}  parameters.parentUuid
     * @param {string}  parameters.containerUuid
     * @param {integer} parameters.panelType
     * @param {string}  parameters.pageNumber
     */
    setPageNumber({ commit, state, dispatch, rootGetters }, parameters) {
      const {
        parentUuid, containerUuid, panelType = 'window', pageNumber,
        isAddRecord = false, isShowNotification = true
      } = parameters
      const data = state.recordSelection.find(recordItem => {
        return recordItem.containerUuid === containerUuid
      })
      commit('setPageNumber', {
        data: data,
        pageNumber: pageNumber
      })

      // refresh list table with data from server
      if (panelType === 'window') {
        dispatch('getDataListTab', {
          parentUuid,
          containerUuid,
          isAddRecord,
          isShowNotification
        })
      } else if (panelType === 'browser') {
        if (!rootGetters.isNotReadyForSubmit(containerUuid)) {
          dispatch('getBrowserSearch', {
            containerUuid,
            isClearSelection: true
          })
        }
      }
    },
    /**
     * Insert new row bottom list table, used only from window
     * @param {string}  parentUuid
     * @param {string}  containerUuid
     * @param {boolean} isPanelValues, define if used values form panel
     * @param {boolean} isEdit, define if used values form panel
     */
    addNewRow({ commit, getters, rootGetters, dispatch }, parameters) {
      const { parentUuid, containerUuid, isPanelValues = false, isEdit = true, isNew = true } = parameters
      let { fieldList = [] } = parameters

      const tabPanel = rootGetters.getPanel(containerUuid)

      if (!fieldList.length) {
        fieldList = tabPanel.fieldList
      }

      let values = {}
      // add row with default values to create new record
      if (isPanelValues) {
        // add row with values used from record in panel
        values = rootGetters.getColumnNamesAndValues({
          containerUuid,
          propertyName: 'value',
          isObjectReturn: true,
          isAddDisplayColumn: true,
          fieldList
        })
      } else {
        values = rootGetters.getParsedDefaultValues({
          parentUuid,
          containerUuid,
          fieldList
        })
      }
      values.isNew = isNew
      values.isEdit = isEdit
      values.isSendServer = false

      // get the link column name from the tab
      var linkColumnName = tabPanel.linkColumnName
      if (isEmptyValue(linkColumnName)) {
        // get the link column name from field list
        linkColumnName = tabPanel.fieldLinkColumnName
      }

      var valueLink
      // get context value if link column exists and does not exist in row
      if (!isEmptyValue(linkColumnName)) {
        valueLink = rootGetters.getContext({
          parentUuid,
          containerUuid,
          columnName: linkColumnName
        })
      }
      if (!isEmptyValue(valueLink)) {
        valueLink = parseInt(valueLink, 10)
      }

      // get display column
      if (fieldList.length) {
        fieldList
          // TODO: Evaluate if is field is read only and FieldSelect
          .filter(itemField => itemField.componentPath === 'FieldSelect' || String(values[itemField.columnName]) === '[object Object]')
          .forEach(itemField => {
            var valueGetDisplayColumn = values[itemField.columnName]
            if (String(values[itemField.columnName]) === '[object Object]' && itemField.componentPath === 'FieldSelect') {
              values[itemField.columnName] = ' '
              values[`DisplayColumn_${itemField.columnName}`] = ' '
            } else if (String(values[itemField.columnName]) === '[object Object]' && itemField.componentPath === 'FieldNumber') {
              values[itemField.columnName] = 0
            }
            // overwrite value with column link
            if (!isEmptyValue(linkColumnName) && linkColumnName === itemField.columnName) {
              valueGetDisplayColumn = valueLink
              if (isEmptyValue(values[itemField.columnName])) {
                values[itemField.columnName] = valueGetDisplayColumn
              }
            }

            // break this itineration if is empty
            if (isEmptyValue(valueGetDisplayColumn)) {
              return
            }
            // always the values for these types of fields are integers
            if (['TableDirect'].includes(itemField.referenceType)) {
              valueGetDisplayColumn = parseInt(valueGetDisplayColumn, 10)
            } else {
              if (!isNaN(valueGetDisplayColumn)) {
                valueGetDisplayColumn = parseInt(valueGetDisplayColumn, 10)
              }
            }
            if (!isEmptyValue(valueGetDisplayColumn) && String(valueGetDisplayColumn) === '[object Object]' && valueGetDisplayColumn.isSQL) {
              // get value from direct Query
              dispatch('getRecordBySQL', {
                query: valueGetDisplayColumn.query,
                field: itemField
              })
                .then(defaultValue => {
                  if (itemField.componentPath === 'FieldSelect') {
                    values[itemField.columnName] = defaultValue.key
                    values[`DisplayColumn_${itemField.columnName}`] = defaultValue.label
                  } else {
                    values[itemField.columnName] = defaultValue.key
                    dispatch('notifyRowTableChange', {
                      parentUuid,
                      containerUuid,
                      isNew,
                      isEdit,
                      row: values
                    })
                  }
                })
              return
            }
            // get label (DisplayColumn) from vuex store
            const options = rootGetters.getLookupAll({
              parentUuid,
              containerUuid,
              tableName: itemField.reference.tableName,
              query: itemField.reference.query,
              directQuery: itemField.reference.directQuery,
              value: valueGetDisplayColumn
            })

            const option = options.find(itemOption => itemOption.key === valueGetDisplayColumn)
            // if there is a lookup option, assign the display column with the label
            if (option) {
              values[`DisplayColumn_${itemField.columnName}`] = option.label
              if (isEmptyValue(option.label) && !itemField.isMandatory) {
                values[itemField.columnName] = undefined
              }
              return
            }
            if (linkColumnName === itemField.columnName) {
              // get context value if link column exists and does not exist in row
              const nameParent = rootGetters.getContext({
                parentUuid,
                containerUuid,
                columnName: 'Name'
              })
              if (nameParent) {
                values[`DisplayColumn_${itemField.columnName}`] = nameParent
                return
              }
            }
            // get from server
            dispatch('getLookupItemFromServer', {
              parentUuid,
              containerUuid,
              tableName: itemField.reference.tableName,
              directQuery: itemField.reference.directQuery,
              value: valueGetDisplayColumn
            })
              .then(responseLookup => {
                dispatch('addDisplayColumn', {
                  containerUuid,
                  columnName: itemField.columnName,
                  displayColumn: responseLookup.label
                })
              })
          })
      }

      // overwrite value with column link
      if (isEmptyValue(values[linkColumnName])) {
        values[linkColumnName] = valueLink
      }

      const dataStore = getters.getDataRecordsList(containerUuid)
      commit('addNewRow', {
        values,
        data: dataStore
      })
    },
    addDisplayColumn({ commit, getters }, parameters) {
      const { containerUuid, columnName, displayColumn } = parameters
      const dataStore = getters.getDataRecordsList(containerUuid)
      const rowRecord = dataStore.find(itemData => itemData.isNew)

      commit('addDisplayColumn', {
        row: rowRecord,
        displayColumn,
        columnName: `DisplayColumn_${columnName}`
      })
    },
    /**
     * Is load context in true when panel is set context
     * @param {string}  containerUuid
     */
    setIsloadContext({ commit, state }, { containerUuid }) {
      const dataStore = state.recordSelection.find(recordItem => {
        return recordItem.containerUuid === containerUuid
      })
      if (dataStore) {
        commit('setIsloadContext', {
          data: dataStore,
          isLoadedContext: true
        })
      }
    },
    /**
     * Set record, selection, page number, token, and record count, with container uuid
     * @param {string}  parameters.containerUuid
     * @param {array}   parameters.record
     * @param {array}   parameters.selection
     * @param {integer} parameters.pageNumber
     * @param {integer} parameters.recordCount
     * @param {string}  parameters.nextPageToken
     * @param {string}  parameters.panelType
     */
    setRecordSelection({ state, commit }, parameters) {
      const {
        parentUuid, containerUuid, panelType = 'window', record = [],
        query, whereClause, orderByClause,
        selection = [], pageNumber = 1, recordCount = 0, nextPageToken,
        originalNextPageToken, isAddRecord = false, isLoaded = true
      } = parameters

      const dataStore = state.recordSelection.find(recordItem => {
        return recordItem.containerUuid === containerUuid
      })

      const newDataStore = {
        parentUuid,
        containerUuid,
        record,
        selection,
        pageNumber,
        recordCount,
        nextPageToken,
        originalNextPageToken,
        panelType,
        isLoaded,
        isLoadedContext: false,
        query,
        whereClause,
        orderByClause
      }

      if (dataStore) {
        if (isAddRecord) {
          newDataStore.record = dataStore.record.concat(newDataStore.record)
        }
        commit('setRecordSelection', {
          dataStore,
          newDataStore
        })
      } else {
        commit('addRecordSelection', newDataStore)
      }
    },
    /**
     * Set selection in data list associated in container
     * @param {string} parameters.containerUuid
     * @param {string} parameters.selection
     */
    setSelection({ commit, getters }, parameters) {
      const recordSelection = getters.getDataRecordAndSelection(parameters.containerUuid)
      commit('setSelection', {
        newSelection: parameters.selection,
        data: recordSelection
      })
    },
    /**
     * Delete record result in container
     * @param {string}  viewUuid // As parentUuid in window
     * @param {array}   withOut
     * @param {boolean} isNew
     */
    deleteRecordContainer({ commit, state, dispatch }, {
      viewUuid,
      withOut = [],
      isNew = false
    }) {
      var setNews = []
      const record = state.recordSelection.filter(itemRecord => {
        // ignore this uuid
        if (withOut.includes(itemRecord.containerUuid)) {
          return true
        }
        // remove window and tabs data
        if (itemRecord.parentUuid) {
          if (isNew) {
            setNews.push(itemRecord.containerUuid)
          }
          return itemRecord.parentUuid !== viewUuid
        }
        // remove browser data
        return itemRecord.containerUuid !== viewUuid
      })
      commit('deleteRecordContainer', record)
      dispatch('setTabSequenceRecord', [])

      if (setNews.length) {
        setNews.forEach(uuid => {
          dispatch('setRecordSelection', {
            parentUuid: viewUuid,
            containerUuid: uuid
          })
        })
      }
    },
    /**
     * @param {string} tableName
     * @param {string} recordUuid
     * @param {number} recordId
     */
    getEntity({ commit }, {
      tableName,
      recordUuid,
      recordId
    }) {
      return new Promise((resolve, reject) => {
        getEntity({
          tableName,
          recordUuid,
          recordId
        })
          .then(responseGetEntity => {
            resolve(responseGetEntity.values)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    /**
     * Request list to view in table
     * TODO: Join with getDataListTab action
     * @param {string} parentUuid, uuid from window
     * @param {string} containerUuid, uuid from tab
     * @param {string} tableName, table name to search record data
     * @param {string} query, criteria to search record data
     * @param {string} whereClause, criteria to search record data
     * @param {string} orderByClause, criteria to search record data
     * @param {array}  conditionsList, conditions list to criteria
     */
    getObjectListFromCriteria({ commit, dispatch, getters, rootGetters }, parameters) {
      const {
        parentUuid, containerUuid,
        tableName, query, whereClause, orderByClause, conditionsList = [],
        isShowNotification = true, isParentTab = true, isAddRecord = false
      } = parameters
      if (isShowNotification) {
        showMessage({
          title: language.t('notifications.loading'),
          message: language.t('notifications.searching'),
          type: 'info'
        })
      }
      const dataStore = getters.getDataRecordAndSelection(containerUuid)

      let nextPageToken
      if (!isEmptyValue(dataStore.nextPageToken)) {
        nextPageToken = dataStore.nextPageToken + '-' + dataStore.pageNumber
      }

      let inEdited = []
      if (!isParentTab) {
        // TODO: Evaluate peformance to evaluate records to edit
        inEdited = dataStore.record.filter(itemRecord => {
          return itemRecord.isEdit && !itemRecord.isNew
        })
      }

      commit('addInGetting', {
        containerUuid,
        tableName,
        conditionsList
      })

      // gets the default value of the fields (including whether it is empty or undefined)
      const defaultValues = rootGetters.getParsedDefaultValues({
        parentUuid: parentUuid,
        containerUuid: containerUuid,
        isGetServer: false
      })
      return getEntitiesList({
        tableName,
        query,
        whereClause,
        conditionsList,
        orderByClause,
        pageToken: nextPageToken
      })
        .then(dataResponse => {
          const recordsList = dataResponse.recordsList.map(itemRecord => {
            const values = itemRecord.values

            // datatables attributes
            values.isNew = false
            values.isEdit = false
            values.isSelected = false
            values.isReadOnlyFromRow = false

            if (inEdited.find(itemEdit => itemEdit.UUID === values.UUID)) {
              values.isEdit = true
            }

            // overwrite default values and sets the values obtained from the
            // server (empty fields are not brought from the server)
            return {
              ...defaultValues,
              ...values
            }
          })

          const originalNextPageToken = dataResponse.nextPageToken
          let token = originalNextPageToken
          if (isEmptyValue(token)) {
            token = dataStore.nextPageToken
          } else {
            token = token.slice(0, -2)
            if (token.substr(-1, 1) === '-') {
              token = token.slice(0, -1)
            }
          }
          if (isShowNotification) {
            let searchMessage = 'searchWithOutRecords'
            if (recordsList.length) {
              searchMessage = 'succcessSearch'
            }
            showMessage({
              title: language.t('notifications.succesful'),
              message: language.t(`notifications.${searchMessage}`),
              type: 'success'
            })
          }
          dispatch('setRecordSelection', {
            parentUuid,
            containerUuid,
            record: recordsList,
            selection: dataStore.selection,
            recordCount: dataResponse.recordCount,
            nextPageToken: token,
            originalNextPageToken: originalNextPageToken,
            isAddRecord,
            pageNumber: dataStore.pageNumber,
            tableName,
            query,
            whereClause
          })
          return recordsList
        })
        .catch(error => {
          // Set default registry values so that the table does not say loading,
          // there was already a response from the server
          dispatch('setRecordSelection', {
            parentUuid,
            containerUuid
          })

          if (isShowNotification) {
            showMessage({
              title: language.t('notifications.error'),
              message: error.message,
              type: 'error'
            })
          }
          console.warn(`Error Get Object List ${error.message}. Code: ${error.code}.`)
        })
        .finally(() => {
          commit('deleteInGetting', {
            containerUuid,
            tableName
          })
        })
    },
    getRecordBySQL({ dispatch }, {
      query,
      field
    }) {
      // TODO: Change to promise all
      return new Promise((resolve, reject) => {
        getDefaultValueFromServer(query)
          .then(defaultValueResponse => {
            const valueToReturn = {}
            valueToReturn.key = defaultValueResponse
            // add display Column for table
            if (field.componentPath === 'FieldSelect') {
              dispatch('getLookupItemFromServer', {
                parentUuid: field.parentUuid,
                containerUuid: field.containerUuid,
                tableName: field.reference.tableName,
                directQuery: field.reference.directQuery,
                value: valueToReturn.key
              })
                .then(responseLookup => {
                  valueToReturn.label = responseLookup.label
                  dispatch('addDisplayColumn', {
                    containerUuid: field.containerUuid,
                    columnName: field.columnName,
                    displayColumn: responseLookup.label
                  })
                })
            }
            resolve(valueToReturn)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    /**
     * TODO: Add support to tab children
     * @param {object} objectParams
     * @param {string} objectParams.containerUuid
     * @param {objec}  objectParams.row, new data to change
     * @param {objec}  objectParams.isEdit, if the row displayed to edit mode
     * @param {objec}  objectParams.isNew, if insert data to new row
     */
    notifyRowTableChange({ commit, getters, rootGetters }, objectParams) {
      const { parentUuid, containerUuid, isEdit = true } = objectParams
      var currentValues = {}
      if (objectParams.hasOwnProperty('row')) {
        currentValues = objectParams.row
      } else {
        currentValues = rootGetters.getColumnNamesAndValues({
          parentUuid,
          containerUuid,
          propertyName: 'value',
          isObjectReturn: true,
          isAddDisplayColumn: true
        })
      }

      var row = getters.getRowData(objectParams.containerUuid, currentValues.UUID)

      var newRow = {
        ...currentValues,
        // ...objectParams.row,
        isEdit
      }

      commit('notifyRowTableChange', {
        isNew: objectParams.isNew,
        newRow,
        row
      })
    },
    notifyCellTableChange({ commit, state, dispatch, rootGetters }, parameters) {
      const {
        parentUuid, containerUuid, field, panelType = 'window',
        isSendToServer = true, columnName, rowKey, keyColumn, newValue,
        displayColumn, withOutColumnNames = [], isSendCallout = true
      } = parameters

      const recordSelection = state.recordSelection.find(recordItem => {
        return recordItem.containerUuid === containerUuid
      })
      const row = recordSelection.record.find(itemRecord => {
        return itemRecord[keyColumn] === rowKey
      })

      // the field has not changed, then the action is broken
      if (row[columnName] === newValue) {
        return
      }

      const rowSelection = recordSelection.selection.find(itemRecord => {
        return itemRecord[keyColumn] === rowKey
      })
      commit('notifyCellTableChange', {
        row,
        value: newValue,
        columnName,
        displayColumn
      })

      if (panelType === 'browser') {
        commit('notifyCellSelectionChange', {
          row: rowSelection,
          value: newValue,
          columnName,
          displayColumn
        })
      } else if (panelType === 'window') {
        // request callouts
        if (isSendCallout && !withOutColumnNames.includes(field.columnName) &&
          !isEmptyValue(newValue) && !isEmptyValue(field.callout)) {
          withOutColumnNames.push(field.columnName)
          dispatch('getCallout', {
            parentUuid,
            containerUuid,
            tableName: field.tableName,
            columnName: field.columnName,
            callout: field.callout,
            value: newValue,
            withOutColumnNames,
            row,
            inTable: true
          })
        }

        if (isSendToServer) {
          const fieldNotReady = rootGetters.isNotReadyForSubmit(containerUuid, row)
          if (!fieldNotReady) {
            if (!isEmptyValue(row.UUID)) {
              dispatch('updateCurrentEntityFromTable', {
                parentUuid,
                containerUuid,
                row
              })
            } else {
              dispatch('createEntityFromTable', {
                parentUuid,
                containerUuid,
                row
              })
                .then(() => {
                  // refresh record list
                  dispatch('getDataListTab', {
                    parentUuid,
                    containerUuid
                  })
                })
            }
          } else {
            const fieldsEmpty = rootGetters.getFieldListEmptyMandatory({
              containerUuid,
              row
            })
            showMessage({
              message: language.t('notifications.mandatoryFieldMissing') + fieldsEmpty,
              type: 'info'
            })
          }
        }
      }
    },
    getContextInfoValueFromServer({ commit, getters }, {
      contextInfoUuid,
      sqlStatement
    }) {
      const contextInforField = getters.getContextInfoField(contextInfoUuid, sqlStatement)
      if (contextInforField) {
        return contextInforField
      }
      return getContextInfoValueFromServer({
        uuid: contextInfoUuid,
        query: sqlStatement
      })
        .then(contextInfoResponse => {
          commit('setContextInfoField', {
            contextInfoUuid,
            sqlStatement,
            ...contextInfoResponse
          })
          return contextInfoResponse
        })
        .catch(error => {
          console.warn(`Error ${error.code} getting context info value for field ${error.message}.`)
        })
    },
    getPrivateAccessFromServer({ rootGetters }, {
      tableName,
      recordId,
      userUuid
    }) {
      if (isEmptyValue(userUuid)) {
        userUuid = rootGetters['user/getUserUuid']
      }
      return getPrivateAccessFromServer({
        tableName,
        recordId,
        userUuid
      })
        .then(privateAccessResponse => {
          if (isEmptyValue(privateAccessResponse.recordId) || privateAccessResponse.recordId !== recordId) {
            return {
              isLocked: false,
              tableName,
              recordId,
              userUuid
            }
          }
          return {
            ...privateAccessResponse,
            isLocked: true
          }
        })
        .catch(error => {
          console.warn(`Error get private access: ${error.message}. Code: ${error.code}.`)
        })
    },
    lockRecord({ rootGetters }, {
      tableName,
      recordId,
      userUuid
    }) {
      if (isEmptyValue(userUuid)) {
        userUuid = rootGetters['user/getUserUuid']
      }
      return lockPrivateAccessFromServer({
        tableName,
        recordId,
        userUuid
      })
        .then(privateAccessResponse => {
          if (!isEmptyValue(privateAccessResponse.recordId)) {
            const recordLocked = {
              isPrivateAccess: true,
              isLocked: true,
              ...privateAccessResponse
            }
            showMessage({
              title: language.t('notifications.succesful'),
              message: language.t('notifications.recordLocked'),
              type: 'success'
            })
            return recordLocked
          }
        })
        .catch(error => {
          showMessage({
            title: language.t('notifications.error'),
            message: language.t('login.unexpectedError'),
            type: 'error'
          })
          console.warn(`Error lock private access: ${error.message}. Code: ${error.code}.`)
        })
    },
    unlockRecord({ rootGetters }, {
      tableName,
      recordId,
      userUuid
    }) {
      if (isEmptyValue(userUuid)) {
        userUuid = rootGetters['user/getUserUuid']
      }
      return unlockPrivateAccessFromServer({
        tableName,
        recordId,
        userUuid
      })
        .then(privateAccessResponse => {
          if (!isEmptyValue(privateAccessResponse.recordId)) {
            const recordUnlocked = {
              isPrivateAccess: true,
              isLocked: false,
              ...privateAccessResponse
            }
            showMessage({
              title: language.t('notifications.succesful'),
              message: language.t('notifications.recordUnlocked'),
              type: 'success'
            })
            return recordUnlocked
          }
        })
        .catch(error => {
          showMessage({
            title: language.t('notifications.error'),
            message: language.t('login.unexpectedError'),
            type: 'error'
          })
          console.warn(`Error unlock private access: ${error.message}. Code: ${error.code}.`)
        })
    }
  },
  getters: {
    getInGetting: (state) => (containerUuid) => {
      return state.inGetting.find(item => item.containerUuid === containerUuid)
    },
    /**
     * Used by datatables in tab children, record navigation in window, result in browser
     * @param {string} containerUuid
     */
    getDataRecordAndSelection: (state, getters) => (containerUuid) => {
      return state.recordSelection.find(itemRecord => {
        return itemRecord.containerUuid === containerUuid
      }) || {
        containerUuid,
        record: [],
        recordCount: 0,
        selection: [],
        pageNumber: 1,
        nextPageToken: undefined,
        originalNextPageToken: undefined,
        isLoadedContext: false,
        isLoaded: false // Boolean(false || getters.getInGetting(containerUuid))
      }
    },
    getDataRecordsList: (state, getters) => (containerUuid) => {
      return getters.getDataRecordAndSelection(containerUuid).record
    },
    getDataRecordCount: (state, getters) => (containerUuid) => {
      return getters.getDataRecordAndSelection(containerUuid).recordCount
    },
    getNextPageToken: (state, getters) => (containerUuid) => {
      return getters.getDataRecordAndSelection(containerUuid).nextPageToken
    },
    getOriginalNextPageToken: (state, getters) => (containerUuid) => {
      return getters.getDataRecordAndSelection(containerUuid).originalNextPageToken
    },
    getDataRecordSelection: (state, getters) => (containerUuid) => {
      return getters.getDataRecordAndSelection(containerUuid).selection
    },
    getPageNumber: (state, getters) => (containerUuid) => {
      return getters.getDataRecordAndSelection(containerUuid).pageNumber
    },
    getRowData: (state, getters) => (containerUuid, recordUuid) => {
      return getters.getDataRecordsList(containerUuid).find(itemData => {
        if (itemData.UUID === recordUuid) {
          return true
        }
      })
    },
    /**
     * Getter converter selection data record in format
     * @param {string} containerUuid
     * @param {array}  selection
     * [{
     *    selectionId: keyColumn Value,
     *    selectionValues: [{ columname, value }]
     * }]
     */
    getSelectionToServer: (state, getters, rootState, rootGetters) => ({ containerUuid, selection = [] }) => {
      const selectionToServer = []
      const withOut = ['isEdit', 'isSelected', 'isSendToServer']

      if (selection.length <= 0) {
        selection = getters.getDataRecordSelection(containerUuid)
      }
      if (selection.length) {
        const { fieldList, keyColumn } = rootGetters.getPanel(containerUuid)
        // reduce list
        const fieldsList = fieldList.filter(itemField => itemField.isIdentifier || itemField.isUpdateable)

        selection.forEach(itemRow => {
          const records = []

          Object.keys(itemRow).forEach(key => {
            if (!key.includes('DisplayColumn') && !withOut.includes(key)) {
              // evaluate metadata attributes before to convert
              const field = fieldsList.find(itemField => itemField.columnName === key)
              if (field) {
                records.push({
                  columnName: key,
                  value: itemRow[key]
                })
              }
            }
          })

          selectionToServer.push({
            selectionId: itemRow[keyColumn],
            selectionValues: records
          })
        })
      }
      return selectionToServer
    },
    getContextInfoField: (state) => (contextInfoUuid, sqlStatement) => {
      return state.contextInfoField.find(info =>
        info.contextInfoUuid === contextInfoUuid &&
        info.sqlStatement === sqlStatement
      )
    },
    getRecordPrivateAccess: (state) => (tableName, recordId) => {
      if (!isEmptyValue(tableName) && !isEmptyValue(recordId)) {
        if (state.recordPrivateAccess.tableName === tableName && state.recordPrivateAccess.recordId === recordId) {
          return state.recordPrivateAccess
        }
        return undefined
      }
    }
  }
}

export default data
