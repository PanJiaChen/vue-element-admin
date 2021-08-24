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
  <div>
    <el-form-item>
      <template slot="label">
        {{ $t('form.productInfo.codeProduct') }}
        <el-popover
          v-model="visible"
          v-shortkey="keyShortcuts"
          placement="bottom-start"
          trigger="click"
          width="1250"
          @shortkey.native="close"
        >
          <el-button icon="el-icon-close" type="text" style="float: right;padding: 1% 1% 0px 0px;font-size: 20px;" @click="close" />
          <br>
          <product-info-list />
          <el-button
            slot="reference"
            type="text"
            icon="el-icon-search"
            style="color: black"
          />
        </el-popover>
      </template>

      <el-autocomplete
        v-model="value"
        v-shortkey="keyShortcuts"
        :placeholder="$t('quickAccess.searchWithEnter')"
        clearable
        style="width: 100%;"
        popper-class="custom-field-prodcut-info"
        :trigger-on-focus="true"
        :fetch-suggestions="localSearch"
        :select-when-unmatched="true"
        :highlight-first-item="true"
        @shortkey.native="shortcutKeyMethod"
        @select="handleSelect"
      >
        <template slot="prefix">
          <svg-icon
            icon-class="shopping"
            class="el-input__icon"
          />
        </template>

        <template slot-scope="props">
          <div class="header">
            <b> {{ props.item.product.value }} - {{ props.item.product.name }} </b>
          </div>
          <div>
            <div style="float: left;width: 70%;">
              <p style="overflow: hidden;text-overflow: ellipsis;text-align: inherit;">
                {{ props.item.product.upc }} <br>
                {{ props.item.product.description }}
              </p>
            </div>
            <div style="width: 30%;float: right;">
              <p style="overflow: hidden;text-overflow: ellipsis;text-align: end;">
                {{ formatPrice(props.item.priceStandard, props.item.currency.iSOCode) }}
                <br>
                {{ formatQuantity(props.item.quantityAvailable) }}
              </p>
            </div>
          </div>
        </template>
      </el-autocomplete>
    </el-form-item>
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
  name: 'FieldProductInfo',
  components: {
    ProductInfoList
  },
  mixins: [
    fieldMixin
  ],
  props: {
    popoverName: {
      type: String,
      default: 'isShowPopoverField'
    }
  },
  data() {
    return {
      visible: false,
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
        refreshList2: ['shift', 'f5'],
        closeProductList: ['esc']
      }
    }
  },
  methods: {
    formatPrice,
    formatQuantity,
    shortcutKeyMethod(event) {
      switch (event.srcKey) {
        case 'refreshList':
        case 'refreshList2':
          this.$store.dispatch('listProductPriceFromServer', {})
          break
        case 'closeProductList':
          this.$store.commit('showListProductPrice', {
            attribute: this.popoverName,
            isShowed: false
          })
          break
      }
    },
    localSearch(stringToMatch, callBack) {
      let results = this.listWithPrice
      if (!this.isEmptyValue(stringToMatch)) {
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
            this.$store.dispatch('listProductPriceFromServer', {
              containerUuid: 'Products-Price-List',
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
    close() {
      this.visible = false
    },
    handleSelect(elementSelected) {
      const valueProduct = this.isEmptyValue(elementSelected.product) ? elementSelected.value : elementSelected.product.value
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
  .transition-box {
    z-index: 3;
    position: absolute;
    width: 800px;
    left: 15%;
  }
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
