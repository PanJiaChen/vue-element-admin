<template>
  <div class="wrapper">
    <el-form
      v-if="isLoaded"
      key="form-loaded"
      label-position="top"
      label-width="200px"
    >
      <el-row>
        <field
          v-for="(metadata) in metadataList"
          :key="metadata.columnName"
          :metadata-field="metadata"
        />
      </el-row>
    </el-form>
    <div
      v-else
      key="form-loading"
      v-loading="!isLoaded"
      :element-loading-text="$t('notifications.loading')"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)"
      class="loading-panel"
    />
  </div>
</template>

<script>
import formMixin from '@/components/ADempiere/Form/formMixin'
import { TEXT } from '@/utils/ADempiere/references'
export default {
  name: 'TestView',
  mixins: [formMixin],
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
  created() {
    this.getPanel()
  },
  methods: {
    setFieldsList() {
      const fieldsList = []
      // Product Code
      this.createFieldFromDictionary({
        containerUuid: this.metadata.containerUuid,
        elementColumnName: 'ProductValue',
        overwriteDefinition: {
          size: 24,
          sequence: 10,
          isMandatory: true
        }
      })
        .then(metadata => {
          fieldsList.push(metadata)
        }).catch(error => {
          console.warn(`LookupFactory: Get Field From Server (State) - Error ${error.code}: ${error.message}.`)
        })
      // Product Name
      this.createFieldFromDictionary({
        containerUuid: this.metadata.containerUuid,
        elementColumnName: 'ProductName',
        overwriteDefinition: {
          size: 24,
          sequence: 20,
          isReadOnly: true
        }
      })
        .then(metadata => {
          fieldsList.push(metadata)
        }).catch(error => {
          console.warn(`LookupFactory: Get Field From Server (State) - Error ${error.code}: ${error.message}.`)
        })
      // Product Description
      this.createFieldFromDictionary({
        containerUuid: this.metadata.containerUuid,
        elementColumnName: 'ProductDescription',
        overwriteDefinition: {
          size: 24,
          sequence: 30,
          displayType: TEXT.id,
          isReadOnly: true
        }
      })
        .then(metadata => {
          fieldsList.push(metadata)
        }).catch(error => {
          console.warn(`LookupFactory: Get Field From Server (State) - Error ${error.code}: ${error.message}.`)
        })
      // Price List
      this.createFieldFromDictionary({
        containerUuid: this.metadata.containerUuid,
        elementColumnName: 'PriceList',
        overwriteDefinition: {
          size: 16,
          sequence: 40,
          isReadOnly: true
        }
      })
        .then(metadata => {
          fieldsList.push(metadata)
        }).catch(error => {
          console.warn(`LookupFactory: Get Field From Server (State) - Error ${error.code}: ${error.message}.`)
        })
      // Tax Amount
      this.createFieldFromDictionary({
        containerUuid: this.metadata.containerUuid,
        elementColumnName: 'TaxAmt',
        overwriteDefinition: {
          size: 8,
          sequence: 50,
          isReadOnly: true
        }
      })
        .then(metadata => {
          fieldsList.push(metadata)
        }).catch(error => {
          console.warn(`LookupFactory: Get Field From Server (State) - Error ${error.code}: ${error.message}.`)
        })
      // Total
      this.createFieldFromDictionary({
        containerUuid: this.metadata.containerUuid,
        elementColumnName: 'GrandTotal',
        overwriteDefinition: {
          size: 24,
          sequence: 60,
          isReadOnly: true
        }
      })
        .then(metadata => {
          fieldsList.push(metadata)
        }).catch(error => {
          console.warn(`LookupFactory: Get Field From Server (State) - Error ${error.code}: ${error.message}.`)
        })
      this.metadataList = fieldsList
    }
  }
}
</script>
