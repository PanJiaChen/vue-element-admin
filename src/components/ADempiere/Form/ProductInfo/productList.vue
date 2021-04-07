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
      :height="isMobile ? '300' : '550'"
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
            <p><b style="float: left">{{ $t('form.productInfo.quantityOnHand') }}</b><span style="float: right"> {{ formatQuantity(scope.row.quantityOnHand) }} </span></p><br>
            <p><b style="float: left">{{ $t('form.productInfo.price') }}</b><span style="float: right"> {{ formatPrice(scope.row.priceStandard, scope.row.currency.iSOCode) }} </span></p><br>
            <p><b style="float: left">{{ $t('form.productInfo.taxAmount') }}</b><span style="float: right"> {{ formatPrice(getTaxAmount(scope.row.priceStandard, scope.row.taxRate.rate), scope.row.currency.iSOCode) }} </span></p><br>
            <p><b style="float: left">{{ $t('form.productInfo.grandTotal') }}</b><span style="float: right"><b> {{ formatPrice(getTaxAmount(scope.row.priceStandard, scope.row.taxRate.rate) + scope.row.priceStandard, scope.row.currency.iSOCode) }} </b></span></p><br>
            <p><b style="float: left">{{ $t('form.productInfo.grandTotalConverted') }} ({{ scope.row.schemaCurrency.iSOCode }}) </b><span style="float: right"><b> {{ formatPrice(getTaxAmount(scope.row.schemaPriceStandard, scope.row.taxRate.rate) + scope.row.schemaPriceStandard, scope.row.schemaCurrency.iSOCode) }} </b></span></p>
            <div slot="reference" class="name-wrapper">
              {{ scope.row.product.name }}
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('form.productInfo.quantityOnHand')"
        align="right"
        width="100"
      >
        <template slot-scope="scope">
          {{ formatQuantity(scope.row.quantityOnHand) }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('form.productInfo.quantityAvailable')"
        align="right"
        width="100"
      >
        <template slot-scope="scope">
          {{ formatQuantity(scope.row.quantityAvailable) }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('form.productInfo.price')"
        align="right"
      >
        <template slot-scope="scope">
          {{ formatPrice(scope.row.priceStandard, scope.row.currency.iSOCode) }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('form.productInfo.taxAmount')"
        align="right"
        width="200"
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
      <el-table-column
        label=""
        width="100"
      >
        <template slot-scope="scope">
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              {{ $t('form.pos.tableProduct.options') }}
              <i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown" style="padding-bottom: 0px;">
              <span v-show="!isEmptyValue(process)">
                <el-dropdown-item v-for="(report, key) in process" :key="key" icon="el-icon-document">
                  <span @click="associatedprocesses(scope.row.product.id, report)">
                    {{ report.name }}
                  </span>
                </el-dropdown-item>
              </span>
            </el-dropdown-menu>
          </el-dropdown>
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
    },
    reportAsociated: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      defaultMaxPagination: 50,
      resource: {},
      fieldsList: fieldsListProductPrice,
      isCustomForm: true,
      timeOut: null,
      indexTable: 0
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
        options: ['enter'],
        up: ['arrowup'],
        down: ['arrowdown']
      }
    },
    isReadyFromGetData() {
      const { isLoaded, isReload } = this.productPrice
      return (!isLoaded || isReload) // && this.isShowProductsPriceList
    },
    listPrice() {
      const pos = this.$store.getters.getCurrentPOS
      if (!this.isEmptyValue(pos)) {
        return pos.priceList.id
      }
      return 0
    },
    process() {
      if (!this.isEmptyValue(this.reportAsociated)) {
        const process = this.reportAsociated.map(element => {
          const findProcess = this.$store.getters.getProcess(element.uuid)
          if (!this.isEmptyValue(findProcess)) {
            return {
              ...element,
              name: findProcess.name,
              id: findProcess.id
            }
          }
          return []
        })
        return process
      }
      return []
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    }
  },
  watch: {
    isReadyFromGetData(isToLoad) {
      if (isToLoad) {
        this.loadProductsPricesList()
      }
    },
    indexTable(value) {
      this.setCurrent(this.listWithPrice[value])
    },
    currentPoint(value) {
      if (!this.isEmptyValue(value)) {
        this.loadProductsPricesList()
      }
    }
  },
  created() {
    this.unsubscribe = this.subscribeChanges()
    this.$store.commit('setListProductPrice', {
      isLoaded: false
    })
    this.timeOut = setTimeout(() => {
      this.validatePos(this.currentPoint)
    }, 3000)
  },
  beforeDestroy() {
    this.unsubscribe()
  },
  methods: {
    formatPrice,
    formatQuantity,
    getImageFromSource(keyValue) {
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
      this.findPosition(val)
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
        case 'down':
          if (this.indexTable < (this.listWithPrice.length - 1)) {
            this.indexTable++
          }
          break
        case 'up':
          if (this.indexTable > 0) {
            this.indexTable--
          }
          break
        case 'options':
          this.$store.commit('setIsReloadProductPrice')
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
    associatedprocesses(product, report) {
      report.parametersList.push({ columnName: 'M_Product_ID', value: product }, { columnName: 'M_PriceList_ID', value: this.listPrice })
      this.$store.dispatch('processOption', {
        action: report,
        parametersList: report.parametersList,
        reportFormat: 'pdf',
        routeToDelete: this.$route
      })
    },
    findPosition(current) {
      const arrow = this.listWithPrice.findIndex(element => {
        if (element.product.id === current.product.id) {
          return element
        }
      })
      this.indexTable = arrow
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
            if (this.productPrice.isLoaded) {
              this.$store.commit('setIsReloadProductPrice')
            }
          }, 1000)
        }
      })
    },
    /**
     * @param {object} PointOfSales
     */
    validatePos(PointOfSales) {
      console.log(this.isEmptyValue(PointOfSales), this.isReadyFromGetData)
      if (this.isEmptyValue(PointOfSales)) {
        const message = this.$t('notifications.errorPointOfSale')
        this.$store.commit('setListProductPrice', {
          isLoaded: true,
          productPricesList: []
        })
        this.$message({
          type: 'info',
          message,
          duration: 1500,
          showClose: true
        })
      }
    }
  }
}
</script>
