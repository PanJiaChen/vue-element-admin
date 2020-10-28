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
        containerUuid: this.containerUuid,
        columnName: 'DisplayColumn_C_Currency_ID'
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
