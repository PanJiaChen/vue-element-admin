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
          {{ formatPrice(amount * convert, displayCurrency) }}
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
    }
  },
  data() {
    return {
      fieldsList: fieldsListConvertAmountCollection
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
    }
  },
  created() {
    this.defaultValueCurrency()
  },
  methods: {
    formatPrice,
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
