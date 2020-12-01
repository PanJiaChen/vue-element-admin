<template>
  <div>
    <product-info-list />
  </div>
</template>

<script>
/**
 * This component is made to be the prototype of the Product Info search field
 */
import ProductInfoList from './productList'
import fieldMixin from '@/components/ADempiere/Field/mixin/mixinField.js'
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
      timeOut: null
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
    keyShortcuts() {
      return {
        refreshList: ['f5'],
        refreshList2: ['shift', 'f5']
      }
    }
  },
  methods: {
    formatPrice,
    formatQuantity,
    shortcutKeyMethod(event) {
      console.log(event)
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
      console.log(stringToMatch, callBack)

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
          const epa = this.$store.getters.getSearchProduct
          console.log({ epa })
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
