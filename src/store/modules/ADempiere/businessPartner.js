import { isEmptyValue, extractPagingToken } from '@/utils/ADempiere/valueUtils.js'
import { requestListBusinessPartner } from '@/api/ADempiere/system-core.js'
import { showMessage } from '@/utils/ADempiere/notification.js'

const withoutResponse = {
  isLoaded: false,
  isReload: true,
  recordCount: 0,
  nextPageToken: undefined
}

const businessPartner = {
  state: {
    businessPartner: {
      ...withoutResponse,
      isShowList: false, // popover with records list
      isShowCreate: false, // popover with create form
      businessPartnersList: []
    }
  },
  mutations: {
    setBusinessPartnersList(state, businessPartners) {
      state.businessPartner = {
        ...state.businessPartner,
        ...businessPartners
      }
    },
    setBPartnerPageNumber(state, pageNumber) {
      state.businessPartner.pageNumber = pageNumber
    }
  },
  actions: {
    listBPartnerFromServer({ state, commit }, {
      searchValue,
      value,
      name,
      contactName,
      eMail,
      postalCode,
      phone,
      // Query
      criteria,
      pageNumber
    }) {
      let pageToken, token
      if (isEmptyValue(pageNumber)) {
        pageNumber = state.businessPartner.pageNumber
        if (isEmptyValue(pageNumber)) {
          pageNumber = 1 // default page is 1
        }

        token = state.businessPartner.token
        if (!isEmptyValue(token)) {
          pageToken = token + '-' + pageNumber
        }
      }

      return requestListBusinessPartner({
        searchValue,
        value,
        name,
        contactName,
        eMail,
        postalCode,
        phone,
        // Query
        criteria,
        pageToken
      })
        .then(responseBusinessPartnerList => {
          if (isEmptyValue(token) || isEmptyValue(pageToken)) {
            token = extractPagingToken(responseBusinessPartnerList.nextPageToken)
          }

          commit('setBusinessPartnersList', {
            ...responseBusinessPartnerList,
            isLoaded: true,
            isReload: false,
            token,
            pageNumber
          })

          return responseBusinessPartnerList.businessPartnersList
        })
        .catch(error => {
          console.warn(error)
          showMessage({
            type: 'info',
            message: error.message
          })
        })
    },
    setBPartnerPageNumber({ commit, dispatch }, pageNumber) {
      commit('setBPartnerPageNumber', pageNumber)
      dispatch('listBPartnerFromServer', {
        // posUuid: getters.getPointOfSalesUuid
      })
    }
  },
  getters: {
    getBusinessPartner: (state) => {
      const bp = state.businessPartner
      if (isEmptyValue(bp)) {
        return {
          ...withoutResponse
        }
      }
      return bp
    },
    getBusinessPartnersList: (state) => {
      const list = state.businessPartner.businessPartnersList
      if (isEmptyValue(list)) {
        return []
      }
      return list
    }
  }
}

export default businessPartner
