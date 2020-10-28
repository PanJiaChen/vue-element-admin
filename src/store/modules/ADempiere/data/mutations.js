
const mutations = {
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
  setContextInfoField(state, payload) {
    state.contextInfoField.push(payload)
  },
  setPrivateAccess(state, payload) {
    state.recordPrivateAccess = payload
  }
}

export default mutations
