import { getBrowserSearch } from '@/api/ADempiere/browser'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { parseContext } from '@/utils/ADempiere/contextUtils'
import { showMessage } from '@/utils/ADempiere/notification'
import language from '@/lang'

const browserControl = {
  actions: {
    /**
     * Search with query criteria
     * @param {string}  containerUuid, browser to search record data
     * @param {boolean} isClearSelection, clear selection after search
     */
    getBrowserSearch({ dispatch, rootGetters }, {
      containerUuid,
      isClearSelection = false
    }) {
      showMessage({
        title: language.t('notifications.loading'),
        message: language.t('notifications.searching'),
        type: 'info'
      })
      const allData = rootGetters.getDataRecordAndSelection(containerUuid)
      // deletes the data from the container to replace it and to report the searches in the table
      dispatch('deleteRecordContainer', {
        viewUuid: containerUuid
      })

      const browser = rootGetters.getBrowser(containerUuid)
      // parameters isQueryCriteria
      const parametersList = rootGetters.getParametersToServer({
        containerUuid,
        fieldList: browser.fieldList
      })

      let parsedQuery = browser.query
      if (!isEmptyValue(parsedQuery) && parsedQuery.includes('@')) {
        parsedQuery = parseContext({
          containerUuid,
          value: parsedQuery,
          isBooleanToString: true
        }).value
      }

      let parsedWhereClause = browser.whereClause
      if (!isEmptyValue(parsedWhereClause) && parsedWhereClause.includes('@')) {
        parsedWhereClause = parseContext({
          containerUuid,
          value: parsedWhereClause,
          isBooleanToString: true
        }).value
      }

      let nextPageToken
      if (!isEmptyValue(allData.nextPageToken)) {
        nextPageToken = allData.nextPageToken + '-' + allData.pageNumber
      }

      // Add validation compare browserSearchQueryParameters
      return getBrowserSearch({
        uuid: containerUuid,
        query: parsedQuery,
        whereClause: parsedWhereClause,
        orderByClause: browser.orderByClause,
        parametersList,
        nextPageToken: nextPageToken
      })
        .then(browserSearchResponse => {
          const recordsList = browserSearchResponse.recordsList.map(itemRecord => {
            return {
              ...itemRecord.values,
              // datatables attributes
              isNew: false,
              isEdit: false,
              isSelected: false,
              isReadOnlyFromRow: false
            }
          })

          let selection = allData.selection
          if (isClearSelection) {
            selection = []
          }

          let token = browserSearchResponse.nextPageToken
          if (token !== undefined) {
            token = token.slice(0, -2)
          }

          dispatch('setRecordSelection', {
            containerUuid,
            record: recordsList,
            pageNumber: rootGetters.getPageNumber(containerUuid),
            selection: selection,
            recordCount: browserSearchResponse.recordCount,
            nextPageToken: token
          })
          showMessage({
            title: language.t('notifications.succesful'),
            message: language.t('notifications.succcessSearch'),
            type: 'success'
          })
          return recordsList
        })
        .catch(error => {
          // Set default registry values so that the table does not say loading,
          // there was already a response from the server
          dispatch('setRecordSelection', {
            containerUuid,
            panelType: 'browser'
          })

          showMessage({
            title: language.t('notifications.error'),
            message: language.t('notifications.errorSearch'),
            summary: error.message,
            type: 'error'
          })
          console.warn(`Error getting browser search: ${error.message}. Code: ${error.code}.`)
        })
    }
  }
}

export default browserControl
