import { requestLookup, requestLookupList } from '@/api/ADempiere/window.js'
import { getToken as getSession } from '@/utils/auth'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { parseContext } from '@/utils/ADempiere/contextUtils'

const initStateLookup = {
  lookupItem: [],
  lookupList: []
}

const lookup = {
  state: initStateLookup,
  mutations: {
    addLoockupItem(state, payload) {
      state.lookupItem.push(payload)
    },
    addLoockupList(state, payload) {
      state.lookupList.push(payload)
    },
    deleteLookupList(state, payload) {
      state.lookupItem = payload.lookupItem
      state.lookupList = payload.lookupList
    },
    resetStateLookup(state) {
      state = initStateLookup
    }
  },
  actions: {
    /**
    * Get display column from lookup
    * @param {string} parentUuid
    * @param {string} containerUuid
    * @param {string} tableName
    * @param {string} directQuery
    * @param {string|number} value identifier or key
    */
    getLookupItemFromServer({ commit, rootGetters }, {
      parentUuid,
      containerUuid,
      tableName,
      directQuery,
      value
    }) {
      if (isEmptyValue(directQuery)) {
        return
      }

      let parsedDirectQuery = directQuery
      if (parsedDirectQuery.includes('@')) {
        parsedDirectQuery = parseContext({
          parentUuid,
          containerUuid,
          value: directQuery,
          isBooleanToString: true
        }).value
      }

      return requestLookup({
        tableName,
        directQuery: parsedDirectQuery,
        value
      })
        .then(lookupItemResponse => {
          const label = lookupItemResponse.values.DisplayColumn
          const option = {
            label: isEmptyValue(label) ? ' ' : label,
            uuid: lookupItemResponse.uuid,
            id: value // lookupItemResponse.values.KeyColumn
          }

          commit('addLoockupItem', {
            option,
            value, // isNaN(objectParams.value) ? objectParams.value : parseInt(objectParams.value, 10),
            parsedDirectQuery: directQuery,
            tableName,
            sessionUuid: getSession(),
            clientId: rootGetters.getPreferenceClientId
          })
          return option
        })
        .catch(error => {
          console.warn(`Get Lookup, Select Base - Error ${error.code}: ${error.message}.`)
        })
    },
    /**
    * Get display column's list from lookup
    * @param {string}  parentUuid
    * @param {string}  containerUuid
    * @param {string}  tableName
    * @param {string}  query
    * @param {string}  whereClause
    * @param {boolean} isAddBlankValue
    * @param {mixed}   blankValue
    * @param {Array<String>|<Number>}  valuesList
    */
    getLookupListFromServer({ commit, rootGetters }, {
      parentUuid,
      containerUuid,
      columnName,
      tableName,
      query,
      whereClause,
      isAddBlankValue = false,
      blankValue,
      valuesList = []
    }) {
      if (isEmptyValue(query)) {
        return
      }
      let parsedQuery = query
      if (String(parsedQuery).includes('@')) {
        parsedQuery = parseContext({
          parentUuid,
          containerUuid,
          value: query,
          isBooleanToString: true
        }).value
      }

      let parsedWhereClause = whereClause
      if (String(parsedWhereClause).includes('@')) {
        parsedWhereClause = parseContext({
          parentUuid,
          containerUuid,
          value: parsedWhereClause,
          isBooleanToString: true
        }).value
      }

      return requestLookupList({
        columnName,
        tableName,
        query: parsedQuery,
        whereClause: parsedWhereClause,
        valuesList
      })
        .then(lookupListResponse => {
          const list = []
          lookupListResponse.recordsList.forEach(itemLookup => {
            const {
              KeyColumn: id,
              DisplayColumn: label
            } = itemLookup.values

            if (!isEmptyValue(id)) {
              list.push({
                label,
                id,
                uuid: itemLookup.uuid
              })
            }
          })
          if (isAddBlankValue) {
            list.unshift({
              label: ' ',
              id: blankValue,
              uuid: undefined
            })
          }
          commit('addLoockupList', {
            list,
            tableName,
            parsedQuery,
            sessionUuid: getSession(),
            clientId: rootGetters.getPreferenceClientId
          })
          return list
        })
        .catch(error => {
          console.warn(`Get Lookup List, Select Base - Error ${error.code}: ${error.message}.`)
        })
    },
    deleteLookupList({ commit, state }, {
      parentUuid,
      containerUuid,
      tableName,
      query,
      directQuery,
      value
    }) {
      let parsedDirectQuery = directQuery
      if (directQuery && parsedDirectQuery.includes('@')) {
        parsedDirectQuery = parseContext({
          parentUuid,
          containerUuid,
          value: parsedDirectQuery,
          isBooleanToString: true
        }).value
      }
      const lookupItem = state.lookupItem.filter(itemLookup => {
        return itemLookup.parsedDirectQuery !== parsedDirectQuery &&
        itemLookup.tableName !== tableName &&
        itemLookup.value !== value &&
        itemLookup.sessionUuid !== getSession()
      })

      let parsedQuery = query
      if (parsedQuery && parsedQuery.includes('@')) {
        parsedQuery = parseContext({
          parentUuid,
          containerUuid,
          value: parsedQuery,
          isBooleanToString: true
        }).value
      }
      const lookupList = state.lookupList.filter(itemLookup => {
        return itemLookup.parsedQuery !== parsedQuery &&
        itemLookup.tableName !== tableName &&
        itemLookup.sessionUuid !== getSession()
      })
      commit('deleteLookupList', {
        lookupItem,
        lookupList
      })
    }
  },
  getters: {
    getLookupItem: (state, getters, rootState, rootGetters) => ({
      parentUuid,
      containerUuid,
      tableName,
      directQuery,
      value
    }) => {
      let parsedDirectQuery = directQuery
      if (parsedDirectQuery && parsedDirectQuery.includes('@')) {
        parsedDirectQuery = parseContext({
          parentUuid,
          containerUuid,
          value: parsedDirectQuery,
          isBooleanToString: true
        }).value
      }
      const lookupItem = state.lookupItem.find(itemLookup => {
        return itemLookup.parsedDirectQuery === parsedDirectQuery &&
          itemLookup.tableName === tableName &&
          itemLookup.sessionUuid === getSession() &&
          itemLookup.clientId === rootGetters.getPreferenceClientId &&
          itemLookup.value === value
      })
      if (lookupItem) {
        return lookupItem.option
      }
      return undefined
    },
    getLookupList: (state, getters, rootState, rootGetters) => ({
      parentUuid,
      containerUuid,
      tableName,
      query
    }) => {
      let parsedQuery = query
      if (parsedQuery && parsedQuery.includes('@')) {
        parsedQuery = parseContext({
          parentUuid,
          containerUuid,
          value: parsedQuery,
          isBooleanToString: true
        }).value
      }
      const lookupList = state.lookupList.find(itemLookup => {
        return itemLookup.parsedQuery === parsedQuery &&
          itemLookup.tableName === tableName &&
          itemLookup.sessionUuid === getSession() &&
          itemLookup.clientId === rootGetters.getPreferenceClientId
      })
      if (lookupList) {
        return lookupList.list
      }
      return []
    },
    /**
     * Get all lookups, item and list joined
     */
    getLookupAll: (state, getters) => ({
      parentUuid,
      containerUuid,
      tableName,
      query,
      directQuery,
      value
    }) => {
      const list = getters.getLookupList({
        parentUuid,
        containerUuid,
        tableName,
        query
      })
      const allList = list
      // set item values getter from server into list
      if (isEmptyValue(list)) {
        const item = getters.getLookupItem({
          parentUuid,
          containerUuid,
          tableName,
          directQuery,
          value
        })
        if (!isEmptyValue(item)) {
          allList.push(item)
        }
      }
      return allList
    }
  }
}

export default lookup
