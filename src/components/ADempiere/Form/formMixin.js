// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Edwin Betancourt edwinBetanc0urt@hotmail.com www.erpya.com
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

import Field from '@/components/ADempiere/Field'
import { createFieldFromDefinition, createFieldFromDictionary } from '@/utils/ADempiere/lookupFactory'

export default {
  name: 'FormMixn',
  components: {
    Field,
    FieldDefinition: Field
  },
  props: {
    metadata: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    let containerUuid = this.$route.meta.uuid
    if (!this.isEmptyValue(this.metadata)) {
      containerUuid = this.metadata.containerUuid
      if (this.isEmptyValue(containerUuid)) {
        containerUuid = this.metadata.uuid
      }
    }

    return {
      formUuid: this.$route.meta.uuid,
      containerUuid,
      fieldsList: [],
      panelMetadata: {},
      isLoaded: false,
      isCustomForm: false,
      unsubscribe: () => {},
      panelType: 'form'
    }
  },
  computed: {
    getterPanel() {
      return this.$store.getters.getPanel(this.containerUuid)
    }
  },
  created() {
    this.getPanel()
  },
  methods: {
    createFieldFromDefinition,
    createFieldFromDictionary,
    /**
     * Using forms and events with the enter key prevents the page from reloading
     * with @submit.native.prevent="notSubmitForm" in el-form component
     */
    notSubmitForm(event) {
      event.preventDefault()
      return false
    },
    async getPanel() {
      const panel = this.getterPanel
      if (!this.isEmptyValue(panel)) {
        this.fieldsList = panel.fieldsList
        this.isLoaded = true
        this.panelMetadata = panel
      } else {
        await this.generateFieldsList()
        this.$store.dispatch('addPanel', {
          ...this.metadata,
          isCustomForm: this.isCustomForm,
          uuid: this.containerUuid,
          panelType: this.panelType,
          fieldsList: this.fieldsList
        })
          .then(responsePanel => {
            this.fieldsList = responsePanel.fieldsList

            this.$store.dispatch('changeFormAttribute', {
              containerUuid: this.containerUuid,
              attributeName: 'fieldsList',
              attributeValue: this.fieldsList
            })
            this.panelMetadata = responsePanel
            this.runAfterLoadPanel()
          })
          .finally(() => {
            this.isLoaded = true
          })
      }
    },
    runAfterLoadPanel() {
      // some actions after load form panel
    },
    generateFieldsList() {
      let sequence = 0
      const incrementSequence = (newValue) => {
        if (newValue) {
          sequence = newValue
        }
        sequence = sequence + 10
        return sequence
      }

      if (this.metadata) {
        return new Promise(resolve => {
          const additionalAttributes = {
            containerUuid: this.containerUuid,
            isEvaluateValueChanges: false,
            panelType: this.panelType
          }

          const fieldsListFromDictionary = []
          const fieldsListFromMetadata = []

          this.fieldsList.forEach(fieldElement => {
            if (fieldElement.isFromDictionary) {
              // set sequence
              if (fieldElement.overwriteDefinition) {
                if (this.isEmptyValue(fieldElement.overwriteDefinition.sequence)) {
                  fieldElement.overwriteDefinition.sequence = incrementSequence()
                } else {
                  incrementSequence(fieldElement.overwriteDefinition.sequence)
                }
              } else {
                fieldElement.overwriteDefinition = {}
                fieldElement.overwriteDefinition.sequence = incrementSequence()
              }

              fieldsListFromDictionary.push(
                this.createFieldFromDictionary({
                  ...fieldElement,
                  ...additionalAttributes
                })
              )
            } else {
              // set sequence
              if (fieldElement.definition) {
                if (this.isEmptyValue(fieldElement.definition.sequence)) {
                  fieldElement.definition.sequence = incrementSequence()
                } else {
                  incrementSequence(fieldElement.definition.sequence)
                }
              } else {
                fieldElement.definition = {}
                fieldElement.definition.sequence = incrementSequence()
              }

              fieldsListFromMetadata.push(
                this.createFieldFromDefinition({
                  ...fieldElement,
                  ...additionalAttributes
                })
              )
            }
          })
          let fieldsList = fieldsListFromMetadata

          if (this.isEmptyValue(fieldsListFromDictionary)) {
            this.fieldsList = fieldsList
            resolve(fieldsList)
            this.isLoaded = true
          } else {
            Promise.all(fieldsListFromDictionary)
              .then(responsefields => {
                fieldsList = fieldsList.concat(responsefields)
                resolve(fieldsList)
                this.fieldsList = fieldsList
                this.isLoaded = true
              })
          }
        })
      }
    },
    // Set value for one field from panel
    // use example: setValue('ProductName', 'Patio Fun')
    setValue(columnName, value) {
      // this.$store.dispatch('notifyFieldChange', {
      //   containerUuid: this.metadata.containerUuid,
      //   panelType: this.metadata.panelType,
      //   columnName,
      //   newValue: value
      // })
    },
    //  Set values for all list of columns
    // Use example: setValues(values)
    setValues({ values = {}, withOutColumnNames = [] }) {
      this.$store.dispatch('notifyPanelChange', {
        containerUuid: this.containerUuid,
        panelType: this.metadata.panelType,
        attributes: values,
        withOutColumnNames,
        isChangedAllValues: true
      })
    },
    addAction(action) {
      this.$store.dispatch('addAction', {
        name: action.name,
        action: action.action,
        containerUuid: this.containerUuid
      })
    }
  }
}
