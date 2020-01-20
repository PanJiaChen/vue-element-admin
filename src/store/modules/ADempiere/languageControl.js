import {
  requestLanguages,
  requestTranslations,
  updateEntity
} from '@/api/ADempiere/data'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
const languageControl = {
  state: {
    languagesList: [],
    translationsList: []
  },
  mutations: {
    setlanguagesList(state, payload) {
      state.languagesList = payload
    },
    // Add data in container
    addTranslationToList(state, payload) {
      state.translationsList.push(payload)
    },
    addTranslationToRecord(state, payload) {
      payload.translations.push(payload.translationToAdd)
    },
    setTranslationToRecord(state, payload) {
      payload.currentTranslation.values = payload.newValues
    },
    addTranslationChangeRecord(state, payload) {
      payload.currentTranslation = payload.newTranlation
    }
  },
  actions: {
    getLanguagesFromServer({ commit }) {
      return new Promise((resolve, reject) => {
        requestLanguages()
          .then(languageResponse => {
            commit('setlanguagesList', languageResponse.languagesList)
            resolve(languageResponse.languagesList)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    setTranslation({ state, commit }, {
      containerUuid,
      tableName,
      recordUuid,
      recordId,
      translations
    }) {
      const currentTranslation = state.translationsList.find(itemTrannslation => {
        return itemTrannslation.containerUuid === containerUuid
      })

      const newTranlation = {
        containerUuid,
        tableName,
        recordUuid,
        recordId,
        translations
      }
      if (currentTranslation) {
        if (currentTranslation.recordUuid === recordUuid) {
          const translationRecord = currentTranslation.translations.find(itemTrannslation => {
            return itemTrannslation.language === translations[0].language
          })
          if (isEmptyValue(translationRecord)) {
            commit('addTranslationToRecord', {
              translations: currentTranslation.translations,
              translationToAdd: translations[0]
            })
          } else {
            // there is translation for the language and change the values in the translation record
            commit('setTranslationToRecord', {
              currentTranslation: translationRecord,
              newValues: translations[0].values
            })
          }
        } else {
          // this same container uuid, and other record
          commit('addTranslationChangeRecord', {
            currentTranslation,
            newTranlation
          })
        }
      } else {
        // no translation has been uploaded to this container uuid
        commit('addTranslationToList', newTranlation)
      }
    },
    getTranslationsFromServer({ dispatch }, {
      containerUuid,
      language,
      tableName,
      recordUuid,
      recordId
    }) {
      return requestTranslations({
        recordUuid,
        recordId,
        tableName,
        language
      })
        .then(translationResponse => {
          if (translationResponse.translationsList.length < 1) {
            console.warn(translationResponse)
            return
          }
          dispatch('setTranslation', {
            containerUuid,
            tableName,
            recordUuid,
            recordId,
            translations: [{
              language,
              translationUuid: translationResponse.translationsList[0].translationUuid,
              values: translationResponse.translationsList[0].values
            }]
          })
          return translationResponse.translationsList[0].values
        })
        .catch(error => {
          console.warn(`Error Get Translations List ${error.message}. Code: ${error.code}.`)
        })
    },
    changeTranslationValue({ state, commit }, {
      containerUuid,
      language,
      columnName,
      value
    }) {
      return new Promise(resolve => {
        const translationData = state.translationsList.find(itemTranslation => {
          return itemTranslation.containerUuid === containerUuid
        })
        const translationSelected = translationData.translations.find(itemTranslation => {
          return itemTranslation.language === language
        })

        const values = translationSelected.values
        // not change value
        if (values[columnName] === value) {
          resolve(value)
          return value
        }

        updateEntity({
          tableName: `${translationData.tableName}_Trl`, // '_Trl' is suffix for translation tables
          recordUuid: translationSelected.translationUuid,
          attributesList: [{
            columnName,
            value
          }]
        })
          .then(responseEntity => {
            const newValues = {}
            Object.keys(values).forEach(key => {
              newValues[key] = responseEntity.values[key]
            })
            commit('setTranslationToRecord', {
              currentTranslation: translationSelected,
              newValues
            })
            resolve(newValues)
          })
          .catch(error => {
            console.warn(`Error Update Translation ${error.message}. Code: ${error.code}.`)
          })
      })
    }
  },
  getters: {
    getLanguagesList: (state) => {
      return state.languagesList
    },
    getLanguageByParameter: (state) => (parameter) => {
      const list = state.languagesList
      list.forEach(language => {
        if (language.hasOwnProperty(parameter)) {
          return language
        }
      })
    },
    getTranslationsList: (state) => {
      return state.translationsList
    },
    getTranslationContainer: (state) => (containerUuid) => {
      return state.translationsList.find(itemTranslation => itemTranslation.containerUuid === containerUuid)
    },
    getTranslationByLanguage: (state, getters) => ({
      containerUuid,
      language,
      recordUuid,
      recordId
    }) => {
      const translationContainer = getters.getTranslationContainer(containerUuid)
      if (translationContainer && translationContainer.recordUuid === recordUuid) {
        const translationRecord = translationContainer.translations.find(itemTranslation => {
          return itemTranslation.language === language
        })
        if (translationRecord) {
          return translationRecord.values
        }
        return {}
      }
      return {}
    }
  }
}
export default languageControl
