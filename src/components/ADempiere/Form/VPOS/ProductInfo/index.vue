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
          placement="right"
          trigger="click"
          width="800"
        >
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
        :fetch-suggestions="localSearch"
        :select-when-unmatched="true"
        @shortkey.native="shortcutKeyMethod"
        @select="handleSelect"
      >
        <template slot="prefix">
          <svg-icon
            icon-class="shopping"
            class="el-input__icon"
          />
          <!--
          <i
            class="el-icon-shopping-cart-full el-input__icon"
          />
          -->
        </template>

        <template slot-scope="props">
          <div class="header">
            <b> {{ props.item.product.value }} - {{ props.item.product.name }} </b>
          </div>
          <el-row :gutter="20">
            <el-col :span="12">
              <span class="upc">
                <!-- <b>UPC / EAN Barras:</b> <br> -->
                {{ props.item.product.upc }} <br>
                <span class="description">
                  {{ props.item.product.description }}
                </span>
              </span>
            </el-col>
            <!-- <el-col :span="6">
              <span class="upc">
                {{ props.item.product.description }}
              </span>
            </el-col> -->
            <!-- <el-col :span="6">
              <span class="upc">
                {{ props.item.quantityAvailable }}
              </span>
            </el-col> -->
            <el-col :span="12">
              <span class="price">
                {{ formatPrice(props.item.priceStandard, props.item.currency.iSOCode) }}
                <br>
                <span class="quantityAvailable">
                  {{ formatQuantity(props.item.quantityAvailable) }}
                </span>
                <!-- {{ props.item.currency.curSymbol }} -->
              </span>
            </el-col>
          </el-row>
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
