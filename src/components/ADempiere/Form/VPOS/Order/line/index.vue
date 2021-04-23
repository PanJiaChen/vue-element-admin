<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Elsio Sanchez esanchez@erpya.com www.erpya.com
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <https:www.gnu.org/licenses/>.
-->
<template>
  <div class="wrapper">
    <el-row
      v-if="!isEmptyValue(metadataList) && isLoadedField"
    >
      <template
        v-for="(field, index) in metadataList"
      >
        <el-col :key="index" :span="8">
          <el-form label-position="top" label-width="10px" @submit.native.prevent="notSubmitForm">
            <field
              v-if="field.columnName === 'PriceEntered'"
              :key="field.columnName"
              :metadata-field="field"
            />
            <field
              v-if="field.columnName === 'QtyEntered'"
              :key="field.columnName"
              :metadata-field="field"
            />
            <el-popover
              ref="ping"
              placement="right"
              trigger="click"
            >
              <el-form label-position="top" label-width="10px" @submit.native.prevent="notSubmitForm">
                <el-form-item label="Ingrese Ping">
                  <el-input
                    v-model="input"
                    placeholder="Ingrese Ping"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <span style="float: right;">
                <el-button
                  type="danger"
                  icon="el-icon-close"
                  @click="closePing"
                />
                <el-button
                  type="primary"
                  icon="el-icon-check"
                />
                {{
                  isPosRequiredPin
                }}
              </span>
              <field
                v-if="field.columnName === 'Discount'"
                slot="reference"
                :key="field.columnName"
                :metadata-field="{
                  ...field,
                  isReadOnly: !isModifyPrice || isPosRequiredPin
                }"
              />
            </el-popover>
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
      default: false
    },
    currentLine: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      metadataList: [],
      panelMetadata: {},
      isLoaded: false,
      isLoadedField: false,
      panelType: 'custom',
      fieldsListLine,
      fieldsList: [],
      input: '',
      visible: false
    }
  },
  computed: {
    isModifyPrice() {
      const pos = this.$store.getters.getCurrentPOS
      if (!this.isEmptyValue(pos.isModifyPrice)) {
        return this.$store.getters.getCurrentPOS.isModifyPrice
      }
      return false
    },
    isPosRequiredPin() {
      const pos = this.$store.getters.getCurrentPOS
      if (!this.isEmptyValue(pos.isPosRequiredPin)) {
        return this.$store.getters.getCurrentPOS.isPosRequiredPin
      }
      return false
    }
  },
  watch: {
    showField(value) {
      if (value && this.isEmptyValue(this.metadataList) && (this.dataLine.uuid === this.currentLine.uuid)) {
        this.setFieldsList()
        this.metadataList = this.setFieldsList()
        this.isLoadedField = true
      }
      if (value) {
        this.fillOrderLineQuantities({
          currentPrice: this.currentLine.price,
          quantityOrdered: this.currentLine.quantity,
          discount: this.currentLine.discountRate
        })
        this.isLoadedField = true
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
      return fieldsList
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
    },
    closePing() {
      this.$refs.ping[this.$refs.ping.length - 1].showPopper = false
    }
  }
}
</script>
