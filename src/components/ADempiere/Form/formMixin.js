import Field from '@/components/ADempiere/Field'
import { createFieldFromDefinition, createFieldFromDictionary } from '@/utils/ADempiere/lookupFactory'

export default {
  name: 'FormMixn',
  components: {
    Field
  },
  props: {
    metadata: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      metadataList: [],
      panelMetadata: {},
      isLoaded: false,
      panelType: 'custom'
    }
  },
  computed: {
    getterPanel() {
      return this.$store.getters.getPanel(this.metadata.containerUuid)
    }
  },
  methods: {
    createFieldFromDefinition,
    createFieldFromDictionary,
    getPanel() {
      const panel = this.getterPanel
      if (panel) {
        this.metadataList = panel.fieldList
        this.isLoaded = true
      } else {
        this.setFieldsList()
        this.$store.dispatch('addPanel', {
          ...this.metadata,
          uuid: this.metadata.containerUuid,
          panelType: this.panelType,
          fieldList: this.metadataList
        })
          .then(responsePanel => {
            this.metadataList = responsePanel.fieldList

            this.$store.dispatch('changeFormAttribute', {
              containerUuid: this.metadata.containerUuid,
              attributeName: 'fieldList',
              attributeValue: this.metadataList
            })
          })
          .finally(() => {
            this.isLoaded = true
          })
      }
    }
  }
}
