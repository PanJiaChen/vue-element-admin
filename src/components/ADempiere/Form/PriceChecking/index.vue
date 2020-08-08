<template>
  <div
    v-if="isLoaded"
    style="height: 100% !important;"
    @click="focusProductValue"
  >
    <el-container style="height: 100% !important;">
      <img
        fit="contain"
        :src="valuesImage.length > 1 ? valuesImage.value : getDefaultImage()"
        class="background-price-checking"
      >
      <el-main>
        <div class="inquiry-form">
          <el-form
            key="form-loaded"
            label-position="top"
            label-width="10px"
            @submit.native.prevent="notSubmitForm"
          >
            <field
              v-for="(field) in fieldsList"
              ref="ProductValue"
              :key="field.columnName"
              :metadata-field="field"
              :v-model="field.value"
              class="product-value"
            />
          </el-form>
        </div>
        <div class="inquiry-product">
          <el-row v-if="!isEmptyValue(productPrice)" :gutter="20">
            <el-col style="padding-left: 0px; padding-right: 0%;">
              <div class="product-description">
                {{ productPrice.productName }} {{ productPrice.productDescription }}
              </div>
              <br><br><br>

              <div class="product-price-base">
                Precio Base
                <span class="amount">
                  {{ formatPrice(productPrice.priceBase, productPrice.currency.iSOCode) }}
                </span>
              </div>
              <br><br><br>

              <div class="product-tax">
                {{ productPrice.taxName }}
                <span class="amount">
                  {{ formatPrice(productPrice.taxAmt, productPrice.currency.iSOCode) }}
                </span>
              </div>
              <br><br><br>

              <div class="product-price amount">
                {{ formatPrice(productPrice.grandTotal, productPrice.currency.iSOCode) }}
              </div>
            </el-col>
          </el-row>
        </div>
      </el-main>
    </el-container>
  </div>
  <div
    v-else
    key="form-loading"
    v-loading="!isLoaded"
    :element-loading-text="$t('notifications.loading')"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 0.8)"
    class="loading-panel"
  />
  <!-- </div> -->
</template>

<script>
import formMixin from '@/components/ADempiere/Form/formMixin.js'
import fieldsList from './fieldsList.js'
import { getProductPrice } from '@/api/ADempiere/form/price-checking.js'
import { formatPercent, formatPrice } from '@/utils/ADempiere/valueFormat.js'
import { getResource } from '@/api/ADempiere/persistence.js'
import { mergeByteArray, buildImageFromArray } from '@/utils/ADempiere/resource.js'

export default {
  name: 'PriceChecking',
  mixins: [formMixin],
  data() {
    return {
      fieldsList,
      productPrice: {},
      resource: {},
      valuesImage: [{
        identifier: 'undefined',
        value: 'price-checking-background',
        isLoaded: true
      }],
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
    buildImageFromArray,
    getDefaultImage() {
      return require('@/image/ADempiere/priceChecking/price-checking-background.png')
    },
    getImage(resource) {
      let isImage
      if (resource) {
        if (resource.image) {
          if (!this.valuesImage.some(item => item.identifier === resource.image)) {
            this.valuesImage.push({
              identifier: resource.image,
              value: '',
              isLoaded: false
            })
          }
          if (this.resource[resource.image]) {
            this.valuesImage.map(item => {
              if (item.identifier === resource.image) {
                return {
                  ...item,
                  value: this.buildImageFromArray(resource, this.resource[resource.image]),
                  isLoaded: true
                }
              }
              return item
            })
          } else { //  Reload
            if (!this.valuesImage.some(item => item.identifier === resource.image)) {
              this.valuesImage.push({
                identifier: resource.image,
                value: '',
                isLoaded: false
              })
            }
            let result = new Uint8Array()
            const callBack = {}
            callBack.onData = (response) => {
              result = mergeByteArray(result, response.getData())
            }
            callBack.onStatus = (status) => {

            }
            callBack.onEnd = (end) => {
              this.resource[resource.image] = result
              this.valuesImage.map(item => {
                if (item.identifier === resource.image) {
                  return {
                    ...item,
                    value: this.buildImageFromArray(resource, this.resource[isImage]),
                    isLoaded: true
                  }
                }
                return item
              })
            }
            getResource({
              resourceUuid: '1816f354-a868-4f4f-9a83-b0eb98cf1d05'
            },
            callBack)
          }
        }
      }
    },
    focusProductValue() {
      this.$refs.ProductValue[0].$children[0].$children[0].$children[1].$children[0].focus()
    },
    formatPercent,
    formatPrice,
    subscribeChanges() {
      return this.$store.subscribe((mutation, state) => {
        if (mutation.type === 'addActionKeyPerformed' && mutation.payload.columnName === 'ProductValue') {
          // cleans all values except column name 'ProductValue'
          getProductPrice({
            searchValue: mutation.payload.value
          })
            .then(productPrice => {
              const { product, taxRate, priceStd: priceBase } = productPrice
              const { rate } = taxRate

              this.productPrice = {
                productName: product.name,
                productDescription: product.description,
                priceBase,
                priceStd: productPrice.priceStd,
                priceList: productPrice.priceList,
                priceLimit: productPrice.priceLimit,
                taxRate: rate,
                image: product.imageURL,
                taxName: taxRate.name,
                taxIndicator: taxRate.taxIndicator,
                taxAmt: this.getTaxAmount(priceBase, rate),
                grandTotal: this.getGrandTotal(priceBase, rate),
                currency: productPrice.currency
              }
            })
            .catch(error => {
              this.$message({
                type: 'info',
                message: error.message
              })
              this.productPrice = {}
            })
            .finally(() => {
              this.$store.commit('updateValueOfField', {
                containerUuid: this.containerUuid,
                columnName: 'ProductValue',
                value: ''
              })
              this.getImage(this.productPrice)
            })
        }
      })
    },
    getTaxAmount(basePrice, taxRate) {
      if (this.isEmptyValue(basePrice) || this.isEmptyValue(taxRate)) {
        return 0
      }
      return (basePrice * taxRate) / 100
    },
    getGrandTotal(basePrice, taxRate) {
      if (this.isEmptyValue(basePrice)) {
        return 0
      }
      return basePrice + this.getTaxAmount(basePrice, taxRate)
    }
  }
}
</script>

<style lang="scss" scoped>
  .background-price-checking {
    width: 100%;
    height: 100%;
    float: inherit;
    // color: white;
    // opacity: 0.5;
  }

  .product-description {
    color: #32363a;
    font-size: 25px;
    float: right;
    padding-bottom: 0px;
  }
  .product-price-base, .product-tax {
    font-size: 35px;
    float: right;
  }
  .product-price {
    padding-top: 15px;
    font-size: 50px;
    float: right;
  }

  .inquiry-form {
    position: absolute;
    right: 5%;
    width: 100%;
    top: 10%;
    z-index: 0;
  }
  .inquiry-product {
    position: absolute;
    right: 5%;
    width: 100%;
    top: 33%;
    .amount {
      color: black;
      font-weight: bold;
    }
  }
</style>
<style lang="scss">
  .price-inquiry {
    input {
      color: #606266 !important;
      font-size: 100% !important;
    }
  }
  .product-value {
    float: right;
    padding-right: 0% !important;
    z-index: 0;
    .el-form-item__label {
      font-size: 15px !important;
      color: #000 !important;
    }
  }

  .el-aside {
    background: white;
    width: 60%;
    overflow: hidden;
  }

  .el-form-item {
    margin-bottom: 10px !important;
    margin-left: 10px;
    margin-right: 0px !important;
  }
</style>
