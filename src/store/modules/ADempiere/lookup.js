import { getLookup, getLookupList } from '@/api/ADempiere/values'
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

      return getLookup({
        tableName,
        directQuery: parsedDirectQuery,
        value
      })
        .then(lookupItemResponse => {
          const label = lookupItemResponse.values.DisplayColumn
          const option = {
            label: isEmptyValue(label) ? ' ' : label,
            key: value // lookupItemResponse.values.KeyColumn
          }

          commit('addLoockupItem', {
            option,
            value, // isNaN(objectParams.value) ? objectParams.value : parseInt(objectParams.value, 10),
            parsedDirectQuery: directQuery,
            tableName,
            sessionUuid: getSession(),
            clientId: rootGetters.getContextClientId
          })
          return option
        })
        .catch(error => {
          console.warn(`Get Lookup, Select Base - Error ${error.code}: ${error.message}.`)
        })
    },
    /**
    * Get display column's list from lookup
    * @param {string} parentUuid
    * @param {string} containerUuid
    * @param {string} tableName
    * @param {string} query
    */
    getLookupListFromServer({ commit, rootGetters }, {
      parentUuid,
      containerUuid,
      tableName,
      query
    }) {
      if (isEmptyValue(query)) {
        return
      }
      let parsedQuery = query
      if (parsedQuery.includes('@')) {
        parsedQuery = parseContext({
          parentUuid,
          containerUuid,
          value: query,
          isBooleanToString: true
        }).value
      }
      return getLookupList({
        tableName,
        query: parsedQuery
      })
        .then(lookupListResponse => {
          const list = []
          lookupListResponse.recordsList.forEach(itemLookup => {
            const key = itemLookup.values.KeyColumn
            if (![null, -1, undefined].includes(key)) {
              list.push({
                label: itemLookup.values.DisplayColumn,
                key
              })
            }
          })

          commit('addLoockupList', {
            list,
            tableName,
            parsedQuery,
            sessionUuid: getSession(),
            clientId: rootGetters.getContextClientId
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
          itemLookup.clientId === rootGetters.getContextClientId &&
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
          itemLookup.clientId === rootGetters.getContextClientId
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
