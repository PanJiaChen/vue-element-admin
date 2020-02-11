import { runCallOutRequest } from '@/api/ADempiere/data'
import { showMessage } from '@/utils/ADempiere/notification'

const callOutControl = {
  actions: {
    getCallout({ rootGetters, dispatch }, {
      parentUuid,
      containerUuid,
      callout,
      tableName,
      columnName,
      withOutColumnNames = [],
      inTable = false,
      row,
      value,
      oldValue
    }) {
      const window = rootGetters.getWindow(parentUuid)
      let attributesList = []
      if (inTable) {
        attributesList = rootGetters.getParametersToServer({
          containerUuid,
          row
        })
      } else {
        attributesList = rootGetters.getParametersToServer({
          containerUuid
        })
      }

      return runCallOutRequest({
        windowUuid: parentUuid,
        tabUuid: containerUuid,
        tableName,
        columnName,
        value,
        oldValue,
        callout,
        attributesList,
        windowNo: window.windowIndex
      })
        .then(calloutResponse => {
          const newValues = {}
          Object.keys(calloutResponse.values).forEach(key => {
            if (calloutResponse.values[key] !== undefined) {
              newValues[key] = calloutResponse.values[key]
            }
          })
          if (inTable) {
            dispatch('notifyRowTableChange', {
              parentUuid,
              containerUuid,
              row: newValues,
              isEdit: true
            })
          } else {
            dispatch('notifyPanelChange', {
              parentUuid,
              containerUuid,
              panelType: 'window',
              newValues,
              isSendToServer: false,
              withOutColumnNames,
              isSendCallout: false,
              isChangeFromCallout: true
            })
          }
        })
        .catch(error => {
          showMessage({
            message: error.message,
            type: 'error'
          })
          console.warn(`Field ${columnName} error callout`, error.message)
        })
    }
  }
}

export default callOutControl
