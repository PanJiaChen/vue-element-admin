// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Yamel Senih ysenih@erpya.com www.erpya.com
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
import { requestUpdateEntity } from '@/api/ADempiere/common/persistence.js'
import { requestTranslations } from '@/api/ADempiere/actions/translation.js'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

const languageControl = {
  state: {
    translationsList: []
  },
  mutations: {
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
    },
    resetStateTranslations(state) {
      state.translationsList = []
      state.translationsList = []
      state.currentLanguage = {}
    }
  },
  actions: {
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
          const { values, uuid, language } = translationResponse.translationsList[0]
          dispatch('setTranslation', {
            containerUuid,
            tableName,
            recordUuid,
            recordId,
            translations: [{
              language,
              uuid,
              values
            }]
          })
          return values
        })
        .catch(error => {
          console.warn(`Error Get Translations List ${error.message}. Code: ${error.code}.`)
        })
    },
    changeTranslationValue({ state, commit }, {
      containerUuid,
      language,
      columnName,
      recordUuid,
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

        return requestUpdateEntity({
          tableName: `${translationData.tableName}_Trl`, // '_Trl' is suffix for translation tables
          recordUuid,
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
            return newValues
          })
          .catch(error => {
            console.warn(`Error Update Translation ${error.message}. Code: ${error.code}.`)
          })
      })
    }
  },
  getters: {
    getLanguageByParameter: (state) => (parameter) => {
      const list = state.languagesList
      list.forEach(language => {
        if (Object.prototype.hasOwnProperty.call(language, parameter)) {
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
      recordUuid
    }) => {
      const translationContainer = getters.getTranslationContainer(containerUuid)
      if (translationContainer && translationContainer.recordUuid === recordUuid) {
        const translationRecord = translationContainer.translations.find(itemTranslation => {
          return itemTranslation.language === language
        })
        if (translationRecord) {
          return translationRecord.values
        }
      }
      return {}
    }
  }
}
export default languageControl
