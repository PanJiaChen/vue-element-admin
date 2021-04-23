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
  <div>
    <product-info-list
      :report-asociated="process"
    />
  </div>
</template>

<script>
/**
 * This component is made to be the prototype of the Product Info search field
 */
import ProductInfoList from './productList'
import fieldMixin from '@/components/ADempiere/Field/mixin/mixinField.js'
import staticReportRoutes from '@/utils/ADempiere/constants/zoomReport'
import {
  formatPrice,
  formatQuantity
} from '@/utils/ADempiere/valueFormat.js'

export default {
  name: 'ProductInfo',
  components: {
    ProductInfoList
  },
  mixins: [
    fieldMixin
  ],
  data() {
    return {
      timeOut: null,
      process: staticReportRoutes
    }
  },
  computed: {
    isShowProductsPriceList: {
      get() {
        return this.$store.state['pointOfSales/listProductPrice'].productPrice.isShowPopoverField
      },
      set(isShowed) {
        if (!this.isEmptyValue(this.$route.query.pos)) {
          this.$store.commit('showListProductPrice', {
            attribute: 'isShowPopoverField',
            isShowed
          })
        }
      }
    },
    listWithPrice() {
      const { productPricesList } = this.$store.getters.getProductPrice
      if (!this.isEmptyValue(productPricesList)) {
        return productPricesList
      }
      return []
    },
    currentPos() {
      return this.$store.getters.posAttributes.currentPointOfSales
    },
    keyShortcuts() {
      return {
        refreshList: ['f5'],
        refreshList2: ['shift', 'f5']
      }
    }
  },
  // beforeMount() {
  //   if (this.isEmptyValue(this.currentPos)) {
  //     this.$store.dispatch('listPointOfSalesFromServer')
  //   }
  // },
  created() {
    // if (this.isEmptyValue(this.currentPos)) {
    this.$store.dispatch('listPointOfSalesFromServer')
    this.findProcess(this.process)
    // }
  },
  methods: {
    formatPrice,
    formatQuantity,
    shortcutKeyMethod(event) {
      switch (event.srcKey) {
        case 'refreshList':
        case 'refreshList2':
          this.$store.dispatch('listProductPriceFromServerProductInfo', {})
          break
      }
    },
    localSearch(stringToMatch, callBack) {
      if (this.isEmptyValue(stringToMatch)) {
        // not show list
        callBack([])
        return
      }

      let results = this.listWithPrice
      if (stringToMatch) {
        const parsedValue = stringToMatch.toLowerCase().trim()

        results = results.filter(rowProduct => {
          const productAttributes = rowProduct.product

          for (const columnProductPrice in productAttributes) {
            const valueToCompare = String(productAttributes[columnProductPrice]).toLowerCase()

            if (valueToCompare.includes(parsedValue)) {
              return true
            }
          }
          return false
        })

        // Remote search
        if (this.isEmptyValue(results) && String(stringToMatch.length > 3)) {
          clearTimeout(this.timeOut)
          this.timeOut = setTimeout(() => {
            this.$store.dispatch('listProductPriceFromServerProductInfo', {
              containerUuid: 'Products-Price-List-ProductInfo',
              pageNumber: 1,
              searchValue: stringToMatch
            })
              .then(() => {
                const recordsList = this.listWithPrice

                if (this.isEmptyValue(recordsList)) {
                  this.$message({
                    message: 'Sin resultados coincidentes con la busqueda',
                    type: 'info',
                    showClose: true
                  })
                }

                callBack(recordsList)
              })
          }, 2000)
          return
        }
      }

      // call callback function to return suggestions
      callBack(results)
    },
    handleSelect(elementSelected) {
      const valueProduct = elementSelected.product.value
      this.$store.dispatch('notifyActionKeyPerformed', {
        containerUuid: 'POS',
        columnName: 'ProductValue',
        // TODO: Verify with 'value' or 'searchValue' attribute
        value: valueProduct
      })
    },
    findProcess(procces) {
      // if (this.isEmptyValue(this.currentPos)) {
      procces.forEach(report => {
        this.$store.dispatch('getProcessFromServer', { containerUuid: report.uuid })
      })
      // }
    }
  }
}
</script>

<style lang="scss" scope>
  .custom-field-prodcut-info {
    li {
      line-height: normal;
      padding: 15px;

      .header {
        text-overflow: ellipsis;
        overflow: hidden;
      }

      .upc {
        color: #7e7e7e;
        padding-top: 10px;
        float: left;
      }
      .description {
        padding-top: 10px;
        float: left;
      }
      .price {
        color: #7e7e7e;
        padding-top: 10px;
        float: right;
        padding-right: 10px;
      }
      .quantityAvailable {
        float: right;
        padding-top: 10px;
      }
    }
  }
</style>
