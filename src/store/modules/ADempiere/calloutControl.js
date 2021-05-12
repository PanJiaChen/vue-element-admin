import { runCallOutRequest } from '@/api/ADempiere/window'
import { showMessage } from '@/utils/ADempiere/notification'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import language from '@/lang'

const callOutControl = {
  actions: {
    /**
     * Run or execute callout to get values
     * @param {String} parentUuid
     * @param {String} containerUuid
     * @param {String} callout, path of callout to execute
     * @param {String} tableName
     * @param {String} columnName
     * @param {Array<String>} withOutColumnNames
     * @param {Boolean} inTable, indicate if is activate from table
     * @param {Object} row, if callout is activate in table
     * @param {Mixed} value
     * @param {Mixed} oldValue
     * @param {String} valueType
     * @return {Promise} values
     */
    runCallout({ rootGetters, dispatch }, {
      parentUuid,
      containerUuid,
      callout,
      tableName,
      columnName,
      withOutColumnNames = [],
      inTable = false,
      row,
      value,
      oldValue,
      valueType
    }) {
      // Validate callout
      if (isEmptyValue(callout)) {
        const notifyChange = inTable ? 'notifyRowTableChange' : 'notifyPanelChange'
        dispatch(notifyChange, {
          parentUuid,
          containerUuid,
          row: value,
          isEdit: true,
          panelType: 'window',
          newValues: value,
          isSendToServer: false,
          withOutColumnNames,
          isSendCallout: false,
          isChangeFromCallout: true
        })
        return undefined
      }
      //  Else
      return new Promise((resolve, reject) => {
        const window = rootGetters.getWindow(parentUuid)
        const attributesList = rootGetters.getParametersToServer({
          containerUuid,
          row
        })
        runCallOutRequest({
          windowUuid: parentUuid,
          tabUuid: containerUuid,
          callout,
          tableName,
          columnName,
          value,
          oldValue,
          valueType,
          attributesList,
          windowNo: window.windowIndex
        })
          .then(calloutResponse => {
            if (inTable) {
              const newValues = {
                ...row,
                ...calloutResponse.values
              }
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
                newValues: calloutResponse.values,
                isSendToServer: false,
                withOutColumnNames,
                isSendCallout: false,
                isChangeFromCallout: true
              })
            }
            resolve(calloutResponse.values)
          })
          .catch(error => {
            reject(error)
            showMessage({
              message: error.message || language.t('window.callout.error'),
              type: 'error'
            })
            console.warn(`Field ${columnName} error callout. Code ${error.code}: ${error.message}`)
          })
      })
    }
  }
}

export default callOutControl
