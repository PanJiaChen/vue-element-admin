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
          v-for="(field) in fieldsList"
          :key="field.columnName"
          :metadata-field="field"
          :v-model="field.value"
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
import fieldsList from './fieldsList.js'
import { getProductPrice } from '@/api/ADempiere/form/price-checking'

export default {
  name: 'PriceInquiry',
  mixins: [formMixin],
  data() {
    return {
      fieldsList,
      unsubscribe: () => {}
    }
  },
  created() {
    this.unsubscribe = this.subscribeChanges()
  },
  beforeDestroy() {
    this.unsubscribe()
  },
  methods: {
    subscribeChanges() {
      return this.$store.subscribe((mutation, state) => {
        if (mutation.type === 'addActionKeyPerformed' && mutation.payload.columnName === 'ProductValue') {
          // cleans all values except column name 'ProductValue'
          this.setValues({ withOutColumnNames: ['ProductValue'] })
          getProductPrice({
            searchValue: mutation.payload.value
          })
            .then(productPrice => {
              const { product, taxRate } = productPrice

              const values = {
                ProductName: product.name,
                ProductDescription: product.description,
                PriceList: productPrice.priceList,
                TaxAmt: this.getTaxAmount(productPrice.priceList, taxRate.rate),
                GrandTotal: this.getGrandTotal(productPrice.priceList, taxRate.rate)
              }

              // set new values except column name 'ProductValue'
              this.setValues({ values, withOutColumnNames: ['ProductValue'] })
            })
            .catch(error => {
              this.$message({
                type: 'info',
                message: error.message
              })
            })
        }
      })
    },
    getTaxAmount(priceList, taxRate) {
      if (this.isEmptyValue(priceList) || this.isEmptyValue(taxRate)) {
        return 0
      }
      return (priceList * taxRate) / 100
    },
    getGrandTotal(priceList, taxRate) {
      if (this.isEmptyValue(priceList)) {
        return 0
      }
      return priceList + this.getTaxAmount(priceList, taxRate)
    }
  }
}
</script>
<style lang="scss">
  .price-inquiry {
    input {
      color: #606266 !important;
      font-size: 200% !important;
    }
  }
</style>
