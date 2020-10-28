import {
  requestGetCountryDefinition,
  requestLanguagesList
} from '@/api/ADempiere/system-core.js'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { convertDateFormat } from '@/utils/ADempiere/valueFormat'

const system = {
  state: {
    systemDefinition: {},
    country: {},
    languagesList: []
  },
  mutations: {
    setSystemDefinition(state, payload) {
      state.systemDefinition = payload
    },
    setCountry(state, payload) {
      state.country = payload
    },
    setLanguagesList: (state, payload) => {
      const languagesList = payload.map(language => {
        return {
          ...language,
          datePattern: convertDateFormat(language.datePattern),
          timePattern: convertDateFormat(language.timePattern)
        }
      })

      state.languagesList = Object.freeze(languagesList)
    }
  },
  actions: {
    getCountryFormServer({ commit }, {
      id,
      uuid
    }) {
      return new Promise(resolve => {
        requestGetCountryDefinition({
          id,
          uuid
        })
          .then(responseCountry => {
            commit('setCountry', responseCountry)

            resolve(responseCountry)
          })
          .catch(error => {
            console.warn(`Error getting Country Definition: ${error.message}. Code: ${error.code}.`)
          })
      })
    },
    getLanguagesFromServer({ commit }) {
      return new Promise(resolve => {
        requestLanguagesList({
          pageToke: undefined,
          pageSize: undefined
        })
          .then(languageResponse => {
            const languagesList = languageResponse.languagesList.map(language => {
              return {
                ...language,
                datePattern: convertDateFormat(language.datePattern),
                timePattern: convertDateFormat(language.timePattern)
              }
            })

            commit('setLanguagesList', languagesList)

            resolve(languagesList)
          })
          .catch(error => {
            console.warn(`Error getting Languages List: ${error.message}. Code: ${error.code}.`)
          })
      })
    }
  },
  getters: {
    getCountry: (state) => {
      return state.country
    },
    getCurrency: (state) => {
      const { currencyIsoCode, standardPrecision } = state.systemDefinition

      return {
        standardPrecision: standardPrecision || 2,
        iSOCode: currencyIsoCode || 'USD'
      }
    },
    getCountryLanguage: (state) => {
      return state.systemDefinition.language.replace('_', '-')
    },
    getLanguagesList: (state) => {
      return state.languagesList
    },
    getCurrentLanguageDefinition: (state) => {
      let { language } = state.systemDefinition
      if (isEmptyValue(language)) {
        language = 'en_US'
      }
      return state.languagesList.find(definition => {
        return definition.language === language
      })
    }
  }
}

export default system
