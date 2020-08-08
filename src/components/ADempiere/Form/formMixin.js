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
        this.fieldsList = panel.fieldList
        this.isLoaded = true
        this.panelMetadata = panel
      } else {
        await this.generateFieldsList()
        this.$store.dispatch('addPanel', {
          ...this.metadata,
          isCustomForm: this.isCustomForm,
          uuid: this.containerUuid,
          panelType: this.panelType,
          fieldList: this.fieldsList
        })
          .then(responsePanel => {
            this.fieldsList = responsePanel.fieldList

            this.$store.dispatch('changeFormAttribute', {
              containerUuid: this.containerUuid,
              attributeName: 'fieldList',
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
