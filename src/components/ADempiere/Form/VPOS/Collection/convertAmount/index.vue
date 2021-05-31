<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Yamel Senih ysenih@erpya.com www.erpya.com
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
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>
        <b>
          {{ $t('form.pos.collect.convertAmount') }}:
          {{ formatPrice(amountConvertionTotal, displayCurrency) }}
        </b>
      </span>
    </div>
    <div class="text item">
      <el-row>
        <el-col :span="24">
          <el-form
            label-position="top"
            label-width="10px"
            style="float: right; display: flex; line-height: 10px;"
          >
            <span v-for="(field, index) in fieldsList" :key="index">
              <field-definition
                :key="field.columnName"
                :metadata-field="field"
              />
            </span>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>
<script>
import formMixin from '@/components/ADempiere/Form/formMixin'
import { formatPrice } from '@/utils/ADempiere/valueFormat.js'
import fieldsListConvertAmountCollection from './fieldsListConvertAmountCollection.js'

export default {
  name: 'ConvertAmount',
  mixins: [
    formMixin
  ],
  props: {
    isAddTypePay: {
      type: Array,
      default: undefined
    },
    currency: {
      type: Object,
      default: undefined
    },
    amount: {
      type: Number,
      default: undefined
    },
    convert: {
      type: Number,
      default: undefined
    },
    metadata: {
      type: Object,
      default: () => {
        return {
          uuid: 'Collection-Convert-Amount',
          containerUuid: 'Collection-Convert-Amount'
        }
      }
    },
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fieldsList: fieldsListConvertAmountCollection,
      amountConvertionTotal: 0
    }
  },
  computed: {
    displayCurrency() {
      return this.$store.getters.getValueOfField({
        containerUuid: 'Collection-Convert-Amount',
        columnName: 'DisplayColumn_C_Currency_ID'
      })
    },
    typeCurrency() {
      return this.$store.getters.getValueOfField({
        containerUuid: 'Collection-Convert-Amount',
        columnName: 'C_Currency_ID'
      })
    },
    currencyUuid() {
      return this.$store.getters.getValueOfField({
        containerUuid: 'Collection-Convert-Amount',
        columnName: 'C_Currency_ID_UUID'
      })
    },
    currentPointOfSales() {
      return this.$store.getters.posAttributes.currentPointOfSales
    },
    pointOfSalesCurrency() {
      // const currency = this.currentPointOfSales
      if (!this.isEmptyValue(this.currentPointOfSales.priceList)) {
        return {
          ...this.currentPointOfSales.priceList.currency,
          amountConvertion: 1
        }
      }
      return {
        uuid: '',
        iSOCode: '',
        curSymbol: '',
        amountConvertion: 1
      }
    },
    dateRate() {
      return this.$store.getters.getConvertionRate.find(currency => {
        if (currency.id === this.typeCurrency) {
          return currency
        }
      })
    }
  },
  watch: {
    dateRate(value) {
      if (value && !this.isEmptyValue(value.amountConvertion)) {
        this.amountConvertionTotal = this.amount / value.amountConvertion
      } else {
        this.amountConvertionTotal = this.amount
      }
    },
    currencyUuid(value) {
      const listCurrency = this.$store.getters.getConvertionRate.find(currency => {
        if (currency.uuid === value) {
          return currency
        }
      })
      if (listCurrency === undefined) {
        this.$store.dispatch('conversionDivideRate', {
          conversionTypeUuid: this.currentPointOfSales.conversionTypeUuid,
          currencyFromUuid: this.pointOfSalesCurrency.uuid,
          conversionDate: this.formatDate(new Date()),
          currencyToUuid: value
        })
      }
    }
  },
  created() {
    this.defaultValueCurrency()
  },
  methods: {
    formatPrice,
    formatDate(date) {
      let month = '' + (date.getMonth() + 1)
      let day = '' + date.getDate()
      const year = date.getFullYear()
      if (month.length < 2) {
        month = '0' + month
      }
      if (day.length < 2) {
        day = '0' + day
      }
      return [year, month, day].join('-')
    },
    defaultValueCurrency() {
      this.$store.commit('updateValueOfField', {
        containerUuid: this.containerUuid,
        columnName: 'DisplayColumn_C_Currency_ID',
        value: this.currency.iSOCode
      })
      this.$store.commit('updateValueOfField', {
        containerUuid: this.containerUuid,
        columnName: 'C_Currency_ID',
        value: this.currency.id
      })
    }
  }
}
</script>
