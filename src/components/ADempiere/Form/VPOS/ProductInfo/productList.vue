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
  <el-main
    v-shortkey="shortsKey"
    @shortkey.native="keyAction"
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
      ref="listProducto"
      v-shortkey="shortsKey"
      v-loading="!productPrice.isLoaded"
      :data="listWithPrice"
      border
      fit
      height="450"
      highlight-current-row
      @row-click="findlistProductWithRow"
      @shortkey.native="keyAction"
    >
      <el-table-column
        prop="product.value"
        label="Codigo"
      />
      <el-table-column
        prop="product.name"
        label="Producto"
      />
      <el-table-column
        prop="priceListName"
        label="Lista de Precio"
      />
      <el-table-column
        label="Precio"
        align="right"
      >
        <template slot-scope="scope">
          {{ formatPrice(scope.row.priceStandard) }}
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
import { formatPrice } from '@/utils/ADempiere/valueFormat.js'

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
          uuid: 'Products-Price-List',
          containerUuid: 'Products-Price-List'
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
      fieldsList: fieldsListProductPrice,
      isCustomForm: true,
      timeOut: null
    }
  },
  computed: {
    isShowProductsPriceList() {
      return this.$store.state['pointOfSales/listProductPrice'].productPrice[this.attribute]
    },
    // currentPoint() {
    //   return this.$store.getters.getCurrentPOS
    // },
    currentPointOfSales() {
      return this.$store.getters.posAttributes.currentPointOfSales
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
        refreshList: ['f5']
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
    // currentPointOfSales(value) {
    //   if (!this.isEmptyValue(value)) {
    //     this.loadProductsPricesList()
    //   }
    // }
  },
  created() {
    this.unsubscribe = this.subscribeChanges()
    this.$store.commit('setListProductPrice', {
      isLoaded: false
    })
    this.timeOut = setTimeout(() => {
      this.validatePos(this.currentPointOfSales)
    }, 3000)
  },
  beforeDestroy() {
    this.unsubscribe()
  },
  methods: {
    formatPrice,
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
      this.$store.dispatch('listProductPriceFromServer', {})
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
    subscribeChanges() {
      return this.$store.subscribe((mutation, state) => {
        if (mutation.type === 'updateValueOfField' &&
          !mutation.payload.columnName.includes('DisplayColumn') &&
          mutation.payload.containerUuid === this.metadata.containerUuid) {
          clearTimeout(this.timeOut)
          this.timeOut = setTimeout(() => {
            this.$store.commit('setIsReloadProductPrice')
          }, 1000)
        }
      })
    },
    /**
     * @param {object} PointOfSales
     */
    validatePos(PointOfSales) {
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
