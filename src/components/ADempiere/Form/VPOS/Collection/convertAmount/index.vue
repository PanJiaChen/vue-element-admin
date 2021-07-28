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
          {{ formatPrice(amount / dayRate.divideRate, dayRate.iSOCode) }}
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
            <el-form-item :label="fieldsList[0].name">
              <el-select
                v-model="currentFieldCurrency"
                :placeholder="fieldsList[0].help"
                @change="changeCurrency"
              >
                <el-option
                  v-for="item in listCurrency"
                  :key="item.id"
                  :label="item.name"
                  :value="item.key"
                />
              </el-select>
            </el-form-item>
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
      amountConvertionTotal: this.amount,
      currentFieldCurrency: '',
      grandTotalConverted: {
        divideRate: 1,
        currencyTo: {
          iSOCode: this.currency.iSOCode
        }
      }
    }
  },
  computed: {
    listCurrency() {
      return this.$store.getters.getCurrenciesList
    },
    convertionsList() {
      return this.$store.state['pointOfSales/point/index'].conversionsList
    },
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
    dayRate() {
      if (this.isEmptyValue(this.currentFieldCurrency)) {
        return {
          currencyTo: this.currentPointOfSales.currentPriceList.currency,
          divideRate: 1,
          iSOCode: this.currency.iSOCode
        }
      }
      const currency = this.listCurrency.find(currency => currency.key === this.currentFieldCurrency)
      const convert = this.convertionsList.find(convert => {
        if (!this.isEmptyValue(currency) &&
          !this.isEmptyValue(convert.currencyTo) &&
          currency.id === convert.currencyTo.id &&
          this.currentPointOfSales.currentPriceList.currency.id !== currency.id
        ) {
          return convert
        }
      })
      if (!this.isEmptyValue(convert)) {
        return convert
      }
      return {
        currencyTo: this.currentPointOfSales.currentPriceList.currency,
        divideRate: 1,
        iSOCode: this.currency.iSOCode
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
    },
    amountConvert(currency) {
      this.$store.dispatch('searchConversion', {
        conversionTypeUuid: this.currentPointOfSales.conversionTypeUuid,
        currencyFromUuid: this.currentPointOfSales.priceList.currency.uuid,
        currencyToUuid: currency.uuid
      })
    },
    changeCurrency(value) {
      this.currentFieldCurrency = value
      const currency = this.listCurrency.find(currency => currency.key === value)
      const convert = this.convertionsList.find(convert => {
        if (!this.isEmptyValue(currency) && !this.isEmptyValue(convert.currencyTo) && currency.id === convert.currencyTo.id && this.currentPointOfSales.currentPriceList.currency.id !== currency.id) {
          return convert
        }
      })
      this.grandTotalConverted = convert
      if (!this.isEmptyValue(currency) && this.isEmptyValue(convert) && currency.uuid !== this.currentPointOfSales.currentPriceList.currency.uuid) {
        this.$store.dispatch('searchConversion', {
          conversionTypeUuid: this.currentPointOfSales.conversionTypeUuid,
          currencyFromUuid: this.currentPointOfSales.priceList.currency.uuid,
          currencyToUuid: currency.uuid
        })
      }
    }
  }
}
</script>
