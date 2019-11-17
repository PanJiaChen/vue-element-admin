import { runCallOutRequest } from '@/api/ADempiere/data'
import { convertValuesMapToObject, showMessage } from '@/utils/ADempiere'

const callOutControl = {
  actions: {
    getCallout({ rootGetters, dispatch }, parameters) {
      const window = rootGetters.getWindow(parameters.parentUuid)
      var finalParameters = []
      if (parameters.inTable) {
        finalParameters = rootGetters.getParametersToServer({
          containerUuid: parameters.containerUuid,
          row: parameters.row
        })
      } else {
        finalParameters = rootGetters.getParametersToServer({
          containerUuid: parameters.containerUuid
        })
      }

      return runCallOutRequest({
        windowUuid: parameters.parentUuid,
        tabUuid: parameters.containerUuid,
        tableName: parameters.tableName,
        columnName: parameters.columnName,
        value: parameters.value,
        oldValue: parameters.oldValue,
        callout: parameters.callout,
        attributesList: finalParameters,
        windowNo: window.windowIndex
      })
        .then(response => {
          const values = convertValuesMapToObject(
            response.getValuesMap()
          )
          if (parameters.inTable) {
            dispatch('notifyRowTableChange', {
              parentUuid: parameters.parentUuid,
              containerUuid: parameters.containerUuid,
              row: values,
              isEdit: true
            })
          } else {
            dispatch('notifyPanelChange', {
              parentUuid: parameters.parentUuid,
              containerUuid: parameters.containerUuid,
              panelType: 'window',
              newValues: values,
              isSendToServer: false,
              withOutColumnNames: parameters.withOutColumnNames,
              isSendCallout: false
            })
          }
        })
        .catch(error => {
          showMessage({
            message: error.message,
            type: 'error'
          })
          console.warn(`Field ${parameters.name} error callout`, error.message)
        })
    }
  }
}

export default callOutControl
