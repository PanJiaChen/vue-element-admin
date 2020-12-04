<template>
  <el-main
    v-shortkey="shortsKey"
  >
    <el-form
      v-shortkey="shortsKey"
      label-position="top"
      label-width="10px"
      @shortkey.native="keyAction"
      @submit.native.prevent="notSubmitForm"
    >
      <field-definition
        v-for="(field) in fieldsList"
        :key="field.columnName"
        :metadata-field="field"
      />
    </el-form>

    <el-table
      ref="singleTable"
      v-loading="!productPrice.isLoaded"
      :data="listWithPrice"
      border
      fit
      height="550"
      highlight-current-row
      @row-click="findlistProductWithRow"
      @current-change="handleCurrentChange"
    >
      <el-table-column
        prop="product.value"
        :label="$t('form.productInfo.code')"
      />
      <el-table-column
        :label="$t('form.productInfo.product')"
      >
        <template slot-scope="scope">
          <el-popover trigger="click" placement="right" width="450">
            <b><i> {{ scope.row.product.name }} </i> </b>
            <el-divider />
            <p><b style="float: left">{{ $t('form.productInfo.code') }}</b><span style="float: right">{{ scope.row.product.value }}</span></p><br>
            <p><b style="float: left">{{ $t('form.productInfo.upc') }}</b><span style="float: right"> {{ scope.row.product.upc }} </span></p><br>
            <p><b style="float: left">{{ $t('form.productInfo.price') }}</b><span style="float: right"> {{ formatPrice(scope.row.priceStandard, scope.row.currency.iSOCode) }} </span></p><br>
            <p><b style="float: left">{{ $t('form.productInfo.taxAmount') }}</b><span style="float: right"> {{ formatPrice(getTaxAmount(scope.row.priceStandard, scope.row.taxRate.rate), scope.row.currency.iSOCode) }} </span></p><br>
            <p><b style="float: left">{{ $t('form.productInfo.grandTotal') }}</b><span style="float: right"> {{ formatPrice(getTaxAmount(scope.row.priceStandard, scope.row.taxRate.rate) + scope.row.priceStandard, scope.row.currency.iSOCode) }} </span></p><br>
            <p><b style="float: left">{{ $t('form.productInfo.grandTotalConverted') }} {{ scope.row.schemaCurrency.iSOCode }} </b><span style="float: right"> {{ formatPrice(getTaxAmount(scope.row.schemaPriceStandard, scope.row.taxRate.rate) + scope.row.schemaPriceStandard, scope.row.schemaCurrency.iSOCode) }} </span></p>
            <div slot="reference" class="name-wrapper">
              {{ scope.row.product.name }}
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('form.productInfo.quantityOnHand')"
        align="right"
        width="200"
      >
        <template slot-scope="scope">
          {{ formatQuantity(scope.row.quantityOnHand) }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('form.productInfo.price')"
        align="right"
        width="200"
      >
        <template slot-scope="scope">
          {{ formatPrice(scope.row.priceStandard, scope.row.currency.iSOCode) }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('form.productInfo.taxAmount')"
        align="right"
        width="150"
      >
        <template slot-scope="scope">
          {{ formatPrice(getTaxAmount(scope.row.priceStandard, scope.row.taxRate.rate), scope.row.currency.iSOCode) }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('form.productInfo.grandTotal')"
        align="right"
        width="300"
      >
        <template slot-scope="scope">
          {{ formatPrice(getTaxAmount(scope.row.priceStandard, scope.row.taxRate.rate) + scope.row.priceStandard, scope.row.currency.iSOCode) }}
        </template>
      </el-table-column>
    </el-table>
    <custom-pagination
      :total="productPrice.recordCount"
      :current-page="productPrice.pageNumber"
      :handle-change-page="handleChangePage"
    />
  </el-main>
</template>

<script>
import formMixin from '@/components/ADempiere/Form/formMixin.js'
import CustomPagination from '@/components/ADempiere/Pagination'
import fieldsListProductPrice from './fieldsList.js'
import { formatPrice, formatQuantity } from '@/utils/ADempiere/valueFormat.js'

export default {
  name: 'ProductList',
  components: {
    CustomPagination
  },
  mixins: [
    formMixin
  ],
  props: {
    metadata: {
      type: Object,
      default: () => {
        return {
          uuid: 'Products-Price-List-ProductInfo',
          containerUuid: 'Products-Price-List-ProductInfo'
        }
      }
    },
    isSelectable: {
      type: Boolean,
      default: true
    },
    popoverName: {
      type: String,
      default: 'isShowPopoverField'
    }
  },
  data() {
    return {
      defaultMaxPagination: 50,
      resource: {},
      fieldsList: fieldsListProductPrice,
      isCustomForm: true,
      timeOut: null
    }
  },
  computed: {
    defaultImage() {
      return require('@/image/ADempiere/pos/no-image.jpg')
    },
    isShowProductsPriceList() {
      return this.$store.state['pointOfSales/listProductPrice'].productPrice[this.attribute]
    },
    currentPoint() {
      return this.$store.getters.getCurrentPOS
    },
    productPrice() {
      return this.$store.getters.getProductPrice
    },
    listWithPrice() {
      const { productPricesList } = this.productPrice
      if (!this.isEmptyValue(productPricesList)) {
        return productPricesList
      }
      return []
    },
    shortsKey() {
      return {
        closeProductList: ['esc'],
        refreshList: ['enter']
      }
    },
    isReadyFromGetData() {
      const { isLoaded, isReload } = this.productPrice
      return (!isLoaded || isReload) // && this.isShowProductsPriceList
    }
  },
  watch: {
    isReadyFromGetData(isToLoad) {
      if (isToLoad) {
        this.loadProductsPricesList()
      }
    }
  },
  created() {
    this.unsubscribe = this.subscribeChanges()

    if (this.isReadyFromGetData) {
      this.loadProductsPricesList()
    }
  },
  beforeDestroy() {
    this.unsubscribe()
  },
  methods: {
    formatPrice,
    formatQuantity,
    srcImage(keyValue) {
      if (this.isEmptyValue(keyValue)) {
        return this.defaultImage
      }

      // const image = this.valuesImage.find(item => item.identifier === fileName).value
      const image = this.resource[keyValue]
      if (this.isEmptyValue(image)) {
        return this.defaultImage
      }
      return image
    },
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row)
    },
    handleCurrentChange(val) {
      this.currentRow = val
      this.setCurrent(this.currentRow)
    },
    keyAction(event) {
      switch (event.srcKey) {
        case 'refreshList':
          /**
           * TODO: When refreshing you are making 2 list requests, you can be the
           * observer that activates the second request
          */
          this.loadProductsPricesList()
          break

        case 'closeProductList':
          this.$store.commit('showListProductPrice', {
            attribute: this.popoverName,
            isShowed: false
          })
          break
      }
    },
    loadProductsPricesList() {
      this.$store.dispatch('listProductPriceFromServerProductInfo', {})
    },
    /**
     * @param {number} newPage
     */
    handleChangePage(newPage) {
      this.$store.dispatch('setProductPicePageNumber', newPage)
    },
    findlistProductWithRow(row) {
      if (!this.isSelectable) {
        return
      }
      // TODO: Change this dispatch for set values with local methods, to delete subscripton
      this.$store.dispatch('notifyActionKeyPerformed', {
        containerUuid: 'POS',
        columnName: 'ProductValue',
        // TODO: Verify with 'value' or 'searchValue' attribute
        value: row.product.name
      })

      // close popover of list product price
      this.$store.commit('showListProductPrice', {
        attribute: this.popoverName,
        isShowed: false
      })
    },
    getTaxAmount(basePrice, taxRate) {
      if (this.isEmptyValue(basePrice) || this.isEmptyValue(taxRate)) {
        return 0
      }
      return (basePrice * taxRate) / 100
    },
    subscribeChanges() {
      return this.$store.subscribe((mutation, state) => {
        // if (!this.isEmptyValue(this.listWithPrice)) {
        //   this.setCurrent(this.listWithPrice[0])
        // }
        if (mutation.type === 'updateValueOfField' &&
          !mutation.payload.columnName.includes('DisplayColumn') &&
          mutation.payload.containerUuid === this.metadata.containerUuid) {
          clearTimeout(this.timeOut)
          this.timeOut = setTimeout(() => {
            this.$store.dispatch('updateSearch', mutation.payload.value)
            this.$store.commit('setIsReloadProductPrice')
          }, 1000)
        }
      })
    }
  }
}
</script>
