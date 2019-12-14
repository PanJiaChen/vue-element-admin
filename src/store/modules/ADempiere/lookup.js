import { getLookup, getLookupList, convertValueFromGRPC } from '@/api/ADempiere/data'
import { isEmptyValue, getCurrentRole, parseContext } from '@/utils/ADempiere'

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
    getLookupItemFromServer({ commit, rootGetters }, parameters) {
      const { parentUuid, containerUuid, value, tableName, directQuery } = parameters
      if (isEmptyValue(directQuery)) {
        return
      }

      let parsedDirectQuery = directQuery
      if (parsedDirectQuery.includes('@')) {
        parsedDirectQuery = parseContext({
          parentUuid: parentUuid,
          containerUuid: containerUuid,
          value: directQuery
        }, true)
      }

      return getLookup({
        tableName: tableName,
        directQuery: parsedDirectQuery,
        value: value
      })
        .then(response => {
          const map = response.getValuesMap()
          const label = convertValueFromGRPC(map.get('DisplayColumn'))
          const option = {
            label: isEmptyValue(label) ? ' ' : label,
            // key: convertValueFromGRPC(map.get('KeyColumn'))
            key: value
          }

          commit('addLoockupItem', {
            option: option,
            value: value, // isNaN(objectParams.value) ? objectParams.value : parseInt(objectParams.value, 10),
            parsedDirectQuery: directQuery,
            tableName: tableName,
            roleUuid: getCurrentRole(),
            clientId: parseInt(rootGetters.getContextClientId)
          })
          return option
        })
        .catch(error => {
          console.warn('Get Lookup, Select Base - Error ' + error.code + ': ' + error.message)
        })
    },
    /**
     * tableName,
     * query
     */
    getLookupListFromServer({ commit, rootGetters }, parameters) {
      const { parentUuid, containerUuid, tableName, query } = parameters
      if (isEmptyValue(query)) {
        return
      }
      let parsedQuery = query
      if (parsedQuery.includes('@')) {
        parsedQuery = parseContext({
          parentUuid: parentUuid,
          containerUuid: containerUuid,
          value: query
        }, true)
      }

      return getLookupList({
        tableName: tableName,
        query: parsedQuery
      })
        .then(response => {
          const recordList = response.getRecordsList()
          const options = []
          recordList.forEach(element => {
            const map = element.getValuesMap()
            const name = convertValueFromGRPC(map.get('DisplayColumn'))
            const key = convertValueFromGRPC(map.get('KeyColumn'))
            options.push({
              label: isEmptyValue(name) ? ' ' : name,
              key: isEmptyValue(key) ? -1 : isNaN(key) ? key : parseInt(key)
            })
          })

          commit('addLoockupList', {
            list: options,
            tableName: tableName,
            parsedQuery: parsedQuery,
            roleUuid: getCurrentRole(),
            clientId: parseInt(rootGetters.getContextClientId)
          })
          return options
        })
        .catch(error => {
          console.warn('Get Lookup List, Select Base - Error ' + error.code + ': ' + error.message)
        })
    },
    deleteLookupList({ commit, state }, params) {
      const { parentUuid, containerUuid, tableName, query, directQuery, value } = params

      let parsedDirectQuery = directQuery
      if (directQuery && parsedDirectQuery.includes('@')) {
        parsedDirectQuery = parseContext({
          parentUuid: parentUuid,
          containerUuid: containerUuid,
          value: parsedDirectQuery
        }, true)
      }
      const lookupItem = state.lookupItem.filter(itemLookup => {
        return itemLookup.parsedDirectQuery !== params.parsedDirectQuery &&
        itemLookup.tableName !== tableName &&
        itemLookup.value !== value &&
        itemLookup.roleUuid !== getCurrentRole()
      })

      let parsedQuery = query
      if (parsedQuery && parsedQuery.includes('@')) {
        parsedQuery = parseContext({
          parentUuid: parentUuid,
          containerUuid: containerUuid,
          value: parsedQuery
        }, true)
      }
      const lookupList = state.lookupList.filter(itemLookup => {
        return itemLookup.parsedQuery !== parsedQuery &&
        itemLookup.tableName !== tableName &&
        itemLookup.roleUuid !== getCurrentRole()
      })
      commit('deleteLookupList', {
        lookupItem: lookupItem,
        lookupList: lookupList
      })
    }
  },
  getters: {
    getLookupItem: (state, getters, rootState, rootGetters) => (params) => {
      let parsedDirectQuery = params.directQuery
      if (parsedDirectQuery && parsedDirectQuery.includes('@')) {
        parsedDirectQuery = parseContext({
          parentUuid: params.parentUuid,
          containerUuid: params.containerUuid,
          value: parsedDirectQuery
        }, true)
      }
      const lookupItem = state.lookupItem.find(itemLookup => {
        return itemLookup.parsedDirectQuery === parsedDirectQuery &&
          itemLookup.tableName === params.tableName &&
          itemLookup.roleUuid === getCurrentRole() &&
          itemLookup.clientId === parseInt(rootGetters.getContextClientId) &&
          itemLookup.value === params.value
      })
      if (lookupItem) {
        return lookupItem.option
      }
      return undefined
    },
    getLookupList: (state, getters, rootState, rootGetters) => (params) => {
      let parsedQuery = params.query
      if (parsedQuery && parsedQuery.includes('@')) {
        parsedQuery = parseContext({
          parentUuid: params.parentUuid,
          containerUuid: params.containerUuid,
          value: parsedQuery
        }, true)
      }
      const lookupList = state.lookupList.find(itemLookup => {
        return itemLookup.parsedQuery === parsedQuery &&
          itemLookup.tableName === params.tableName &&
          itemLookup.roleUuid === getCurrentRole() &&
          itemLookup.clientId === parseInt(rootGetters.getContextClientId)
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
     *
     */
    getLookupAll: (state, getters, rootState, rootGetters) => (parameters) => {
      const item = getters.getLookupItem(parameters)
      const list = getters.getLookupList(parameters)
      if (item && !list.find(itemLookup => itemLookup.key === item.key)) {
        list.push(item)
      }
      return list
    }
  }
}

export default lookup
