<template>
  <div class="wrapper">
    <el-row
      v-if="!isEmptyValue(metadataList)"
    >
      <template
        v-for="(field, index) in metadataList"
      >
        <el-col :key="index" :span="8">
          <el-form label-position="top" label-width="10px" @submit.native.prevent="notSubmitForm">
            <field
              :key="field.columnName"
              :metadata-field="field"
            />
          </el-form>
        </el-col>
      </template>
    </el-row>
    <div
      v-else
      key="form-loading"
      v-loading="isEmptyValue(metadataList)"
      :element-loading-text="$t('notifications.loading')"
      :element-loading-spinner="'el-icon-loading'"
      element-loading-background="rgba(255, 255, 255, 0.8)"
      class="view-loading"
    />
  </div>
</template>

<script>

import {
  // createFieldFromDefinition,
  createFieldFromDictionary
} from '@/utils/ADempiere/lookupFactory'
import fieldsListLine from './fieldsListLine.js'
import Field from '@/components/ADempiere/Field'

export default {
  name: 'FieldLine',
  components: {
    Field
  },
  props: {
    dataLine: {
      type: Object,
      default: () => {}
    },
    showField: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      metadataList: [],
      panelMetadata: {},
      isLoaded: false,
      panelType: 'custom',
      fieldsListLine
    }
  },
  watch: {
    showField(value) {
      if (value && this.isEmptyValue(this.metadataList)) {
        this.setFieldsList()
      }
      if (value) {
        this.fillOrderLineQuantities({
          currentPrice: this.dataLine.price,
          quantityOrdered: this.dataLine.quantity,
          discount: this.dataLine.discountRate
        })
      }
    }
  },
  methods: {
    createFieldFromDictionary,
    notSubmitForm(event) {
      event.preventDefault()
      return false
    },
    setFieldsList() {
      const fieldsList = []
      // Product Code
      this.fieldsListLine.forEach(element => {
        this.createFieldFromDictionary(element)
          .then(metadata => {
            const data = metadata
            fieldsList.push({
              ...data,
              containerUuid: 'line'
            })
          }).catch(error => {
            console.warn(`LookupFactory: Get Field From Server (State) - Error ${error.code}: ${error.message}.`)
          })
      })
      this.metadataList = fieldsList
    },
    fillOrderLineQuantities({
      currentPrice,
      quantityOrdered,
      discount
    }) {
      const containerUuid = 'line'
      // Editable fields
      if (!this.isEmptyValue(quantityOrdered)) {
        this.$store.commit('updateValueOfField', {
          containerUuid: 'line',
          columnName: 'QtyEntered',
          value: quantityOrdered
        })
      }
      if (!this.isEmptyValue(currentPrice)) {
        this.$store.commit('updateValueOfField', {
          containerUuid,
          columnName: 'PriceEntered',
          value: currentPrice
        })
      }
      if (!this.isEmptyValue(discount)) {
        this.$store.commit('updateValueOfField', {
          containerUuid,
          columnName: 'Discount',
          value: discount
        })
      }
    }
  }
}
</script>
