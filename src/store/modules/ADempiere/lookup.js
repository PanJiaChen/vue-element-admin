import { getLookup, getLookupList } from '@/api/ADempiere/data'
import { getCurrentRole } from '@/utils/ADempiere/auth'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { parseContext } from '@/utils/ADempiere/contextUtils'

const lookup = {
  state: {
    lookupItem: [],
    lookupList: []
  },
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
    }
  },
  actions: {
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
        value: value
      })
        .then(response => {
          const label = response.values.DisplayColumn
          const option = {
            label: isEmptyValue(label) ? ' ' : label,
            key: value // response.values.KeyColumn
          }

          commit('addLoockupItem', {
            option: option,
            value: value, // isNaN(objectParams.value) ? objectParams.value : parseInt(objectParams.value, 10),
            parsedDirectQuery: directQuery,
            tableName,
            roleUuid: getCurrentRole(),
            clientId: rootGetters.getContextClientId
          })
          return option
        })
        .catch(error => {
          console.warn(`Get Lookup, Select Base - Error ${error.code}: ${error.message}`)
        })
    },
    /**
     * tableName,
     * query
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
        .then(response => {
          const options = response.recordsList.map(itemLookup => {
            return {
              label: itemLookup.values.DisplayColumn,
              key: itemLookup.values.KeyColumn
            }
          })

          commit('addLoockupList', {
            list: options,
            tableName,
            parsedQuery,
            roleUuid: getCurrentRole(),
            clientId: rootGetters.getContextClientId
          })
          return options
        })
        .catch(error => {
          console.warn(`Get Lookup List, Select Base - Error ${error.code}: ${error.message}`)
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
        itemLookup.roleUuid !== getCurrentRole()
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
        itemLookup.roleUuid !== getCurrentRole()
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
          itemLookup.roleUuid === getCurrentRole() &&
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
          itemLookup.roleUuid === getCurrentRole() &&
          itemLookup.clientId === rootGetters.getContextClientId
      })
      if (lookupList) {
        const resultLookup = lookupList.list.filter(lookup => {
          if (lookup.key !== undefined) {
            return lookup
          }
        })
        return resultLookup
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
      const item = getters.getLookupItem({
        parentUuid,
        containerUuid,
        tableName,
        directQuery,
        value
      })
      const list = getters.getLookupList({
        parentUuid,
        containerUuid,
        tableName,
        query
      })
      const allList = list
      if (item && !list.find(itemLookup => itemLookup.key === item.key)) {
        allList.push(item)
      }
      return allList
    }
  }
}

export default lookup
