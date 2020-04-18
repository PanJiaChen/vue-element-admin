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
import { COSTS_PLUS_PRICES, CHAR, TEXT } from '@/utils/ADempiere/references'

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
      let sequence = 10
      const sequenceIncrement = () => {
        sequence = sequence + 10
        return sequence
      }

      fieldsList.push(this.createField({
        containerUuid: this.metadata.containerUuid,
        columnName: 'Value',
        definition: {
          name: 'Product Code/Bar Code',
          displayType: CHAR.id,
          panelType: this.panelType,
          sequence,
          size: 24
        }
      }))

      fieldsList.push(this.createField({
        containerUuid: this.metadata.containerUuid,
        columnName: 'Name',
        definition: {
          name: 'Product Name',
          displayType: TEXT.id,
          panelType: this.panelType,
          sequence: sequenceIncrement(),
          size: 24
        }
      }))

      fieldsList.push(this.createField({
        containerUuid: this.metadata.containerUuid,
        columnName: 'Description',
        definition: {
          name: 'Product Description',
          displayType: TEXT.id,
          panelType: this.panelType,
          sequence: sequenceIncrement(),
          size: 24
        }
      }))

      fieldsList.push(this.createField({
        containerUuid: this.metadata.containerUuid,
        columnName: 'Price',
        definition: {
          name: 'Price',
          displayType: COSTS_PLUS_PRICES.id,
          panelType: this.panelType,
          sequence: sequenceIncrement(),
          size: 16
        }
      }))

      fieldsList.push(this.createField({
        containerUuid: this.metadata.containerUuid,
        columnName: 'Tax',
        definition: {
          name: 'Tax',
          displayType: COSTS_PLUS_PRICES.id,
          panelType: this.panelType,
          sequence: sequenceIncrement(),
          size: 8
        }
      }))

      fieldsList.push(this.createField({
        containerUuid: this.metadata.containerUuid,
        columnName: 'Total',
        definition: {
          name: 'Total',
          displayType: COSTS_PLUS_PRICES.id,
          panelType: this.panelType,
          sequence: sequenceIncrement(),
          size: 24
        }
      }))

      this.metadataList = fieldsList
    }
  }
}
</script>
