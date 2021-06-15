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
  <div
    v-if="isLoaded"
    id="headerContainer"
    style="display: -webkit-box; height: 100%"
  >
    <el-container style="background: white; height: 100%!important;">
      <el-header
        height="auto"
        :style="isShowedPOSKeyLayout ? 'padding-right: 20px; padding-left: 0px;' : 'padding-right: 0px; padding-left: 0px;'"
      >
        <el-form label-position="top" label-width="10px" @submit.native.prevent="notSubmitForm">
          <el-row :gutter="24" style="display: flex;">
            <el-col :span="colFieldProductCode" style="padding-left: 0px; padding-right: 0px;">
              <template
                v-for="(field) in fieldsList"
              >
                <product-info
                  v-if="field.columnName === 'ProductValue'"
                  id="ProductValue"
                  :key="field.columnName"
                  :metadata="field"
                />
              </template>
            </el-col>
            <el-col :span="isEmptyValue(currentOrder) ? 9 : 7" :style="styleTab">
              <business-partner
                id="BusinessPartner"
                :parent-metadata="{
                  name: panelMetadata.name,
                  containerUuid: panelMetadata.containerUuid,
                  uuid: panelMetadata.uuid,
                  panelType: panelMetadata.panelType
                }"
                :is-disabled="isDisabled"
              />
            </el-col>
            <el-col :span="isEmptyValue(currentOrder) ? 1 : 4" :style="isShowedPOSKeyLayout ? 'padding: 0px; margin-top: 3.%;' : 'padding: 0px; margin-top: 2.4%;'">
              <el-form-item>
                <el-row :gutter="24">
                  <el-col :span="10" style="padding-left: 0px; padding-right: 0px;">
                    <el-tag
                      v-if="!isEmptyValue(currentOrder.documentStatus.value)"
                      :type="tagStatus(currentOrder.documentStatus.value)"
                    >
                      <span v-if="!isEmptyValue(currentOrder.documentStatus.value)">
                        {{ currentOrder.documentStatus.name }}
                      </span>
                    </el-tag>
                  </el-col>
                  <el-col :span="14" style="padding-left: 0px; padding-right: 0px;">
                    <el-button type="primary" plain :disabled="isEmptyValue(this.$route.query.action)" @click="newOrder">
                      {{ $t('form.pos.optionsPoinSales.salesOrder.newOrder') }}
                    </el-button>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <el-main style="background: white; padding: 0px; height: 100% !important; overflow: hidden">
        <el-container style="background: white; padding: 0px; height: 100% !important;">
          <el-main style="padding-top: 0px; padding-right: 10px; padding-bottom: 0px; padding-left: 10px;">
            <el-table
              id="linesOrder"
              ref="linesTable"
              v-shortkey="shortsKey"
              :data="listOrderLine"
              border
              highlight-current-row
              fit
              style="overflow: auto;"
              @current-change="handleCurrentLineChange"
              @shortkey.native="shortcutKeyMethod"
            >
              <el-table-column
                v-for="(valueOrder, item, key) in orderLineDefinition"
                :key="key"
                :column-key="valueOrder.columnName"
                :label="valueOrder.label"
                :width="!valueOrder.isNumeric ? valueOrder.size : valueOrder.size"
                :align="valueOrder.isNumeric ? 'right' : 'left'"
              >
                <template slot-scope="scope">
                  <span>
                    {{ displayValue(scope.row, valueOrder) }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('form.pos.tableProduct.options')"
                width="180"
              >
                <template slot-scope="scope">
                  <el-popover
                    v-if="!isEmptyValue(listOrderLine)"
                    placement="top-start"
                    trigger="click"
                    :title="$t('form.productInfo.productInformation')"
                  >
                    <el-form
                      label-position="top"
                      style="float: right; display: flex; line-height: 30px;"
                    >
                      <el-row :gutter="24">
                        <el-col :span="3">
                          <div>
                            <el-avatar v-if="isEmptyValue(scope.row.product.imageUrl)" shape="square" :size="100" src="https://#" @error="true">
                              <el-image>
                                <div slot="error" class="image-slot">
                                  <i class="el-icon-picture-outline" />
                                </div>
                              </el-image>
                            </el-avatar>
                            <el-image
                              v-else
                              style="width: 100px; height: 100px"
                              :src="scope.row.product.imageUrl"
                              fit="contain"
                            />
                          </div>
                        </el-col>
                        <el-col :span="16">
                          {{ $t('form.productInfo.code') }}: <b>{{ scope.row.product.value }}</b><br>
                          {{ $t('form.productInfo.name') }}: <b>{{ scope.row.product.name }}</b><br>
                          {{ $t('form.productInfo.description') }}: <b>{{ scope.row.product.description }}</b><br>
                        </el-col>
                        <el-col :span="5">
                          <div style="float: right">
                            {{ $t('form.productInfo.price') }}:
                            <b>{{ formatPrice(scope.row.product.priceStandard, pointOfSalesCurrency.iSOCode) }}</b>
                            <br>
                            {{ $t('form.productInfo.taxAmount') }}:
                            <b>{{ scope.row.taxIndicator }}</b>
                            <br>
                            {{ $t('form.productInfo.quantityAvailable') }}:
                            <b>{{ formatQuantity(scope.row.quantityOrdered) }}</b>
                          </div>
                        </el-col>
                      </el-row>
                    </el-form>
                    <el-button slot="reference" type="primary" icon="el-icon-info" size="mini" style="margin-right: 3%;" />
                  </el-popover>
                  <el-popover
                    placement="right"
                    trigger="click"
                    :title="$t('form.pos.tableProduct.editQuantities')"
                    width="600"
                    @hide="showFieldLine = false"
                  >
                    <field-line
                      :data-line="scope.row"
                      :show-field="showFieldLine"
                      :current-line="currentLineOrder"
                    />
                    <el-button slot="reference" type="success" icon="el-icon-edit" size="mini" style="margin-right: 3%;" @click="showEditLine(scope.row)" />
                  </el-popover>
                  <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteOrderLine(scope.row)" />
                </template>
              </el-table-column>
            </el-table>
          </el-main>

          <el-footer :class="classOrderFooter">
            <div class="keypad">
              <span id="toolPoint">
                <el-button type="primary" icon="el-icon-top" :disabled="isDisabled" @click="arrowTop" />
                <el-button type="primary" icon="el-icon-bottom" :disabled="isDisabled" @click="arrowBottom" />
                <el-button v-show="isValidForDeleteLine(listOrderLine)" type="danger" icon="el-icon-delete" :disabled="isDisabled" @click="deleteOrderLine(currentOrderLine)" />
                <el-button
                  v-show="isValidForDeleteLine(listOrderLine)"
                  type="success"
                  icon="el-icon-bank-card"
                  @click="openCollectionPanel"
                >
                  {{ labelButtonCollections }}
                </el-button>
              </span>
              <br>
              <p id="point" style="margin-bottom: 5%;margin-top: 3%;">
                <el-dropdown
                  v-if="!isEmptyValue(currentPointOfSales)"
                  trigger="click"
                  class="info-pos"
                  @command="changePos"
                >
                  <span>
                    <i class="el-icon-mobile-phone" />
                    {{ $t('form.pos.order.pointSale') }}: <b style="cursor: pointer"> {{ currentPointOfSales.name }} </b>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="item in listPointOfSales"
                      :key="item.uuid"
                      :command="item"
                    >
                      {{ item.name }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <br>
                <el-dropdown
                  v-if="!isEmptyValue(currentWarehouse)"
                  trigger="click"
                  class="info-pos"
                  @command="changeWarehouse"
                >
                  <span>
                    <svg-icon icon-class="tree" />
                    {{ $t('route.warehouse') }}: <b style="cursor: pointer"> {{ currentWarehouse.name }} </b>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="item in listWarehouse"
                      :key="item.uuid"
                      :command="item"
                    >
                      {{ item.name }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <br>
                <el-dropdown
                  v-if="!isEmptyValue(currentPriceList)"
                  trigger="click"
                  class="info-pos"
                  @command="changePriceList"
                >
                  <span>
                    <svg-icon icon-class="tree-table" />
                    {{ $t('form.pos.priceList') }}: <b style="cursor: pointer"> {{ currentPriceList.name }} </b>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="item in pointPriceList"
                      :key="item.uuid"
                      :command="item"
                    >
                      {{ item.name }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </p>
            </div>
            <span v-if="isMobile" style="float: right;padding-right: 3%;">
              <p class="total">{{ $t('form.pos.order.order') }}: <b class="order-info">{{ currentOrder.documentNo }}</b></p>
              <p class="total">
                {{ $t('form.pos.order.date') }}:
                <b class="order-info">
                  {{ orderDate }}
                </b>
              </p>
              <p class="total">{{ $t('form.pos.order.type') }}:<b class="order-info">{{ currentOrder.documentType.name }}</b></p>
              <p class="total">
                {{ $t('form.pos.order.itemQuantity') }}
                <b class="order-info">
                  {{ getItemQuantity }}
                </b>
              </p>
              <p class="total">
                {{ $t('form.pos.order.numberLines') }}
                <b class="order-info">
                  {{ numberOfLines }}
                </b></p>
            </span>
            <span style="float: right;">
              <p class="total">{{ $t('form.pos.order.seller') }}:<b style="float: right;">
                {{ currentOrder.salesRepresentative.name }}
              </b></p>
              <p class="total"> {{ $t('form.pos.order.subTotal') }}:<b class="order-info">{{ formatPrice(currentOrder.totalLines, pointOfSalesCurrency.iSOCode) }}</b></p>
              <p class="total"> {{ $t('form.pos.order.discount') }}:<b class="order-info">{{ formatPrice(0, pointOfSalesCurrency.iSOCode) }}</b> </p>
              <p class="total"> {{ $t('form.pos.order.tax') }}:<b style="float: right;">{{ getOrderTax(pointOfSalesCurrency.iSOCode) }}</b> </p>
              <p class="total">
                <b>
                  {{ $t('form.pos.order.total') }}:
                </b>
                <b style="float: right;">
                  <el-popover
                    :v-model="seeConversion"
                    placement="top-start"
                    trigger="click"
                    @hide="closeConvertion"
                  >
                    <convert-amount
                      v-show="seeConversion"
                      :convert="multiplyRate"
                      :amount="currentOrder.grandTotal"
                      :currency="pointOfSalesCurrency"
                      :is-open="seeConversion"
                    />
                    <el-button slot="reference" type="text" style="color: #000000;font-weight: 604!important;font-size: 100%;" @click="seeConversion = !seeConversion">
                      {{ formatPrice(currentOrder.grandTotal, pointOfSalesCurrency.iSOCode) }}
                    </el-button>
                  </el-popover>
                </b>
              </p>
            </span>
            <span v-if="!isMobile" style="float: right;padding-right: 3%;">
              <p class="total">{{ $t('form.pos.order.order') }}: <b class="order-info">{{ currentOrder.documentNo }}</b></p>
              <p class="total">
                {{ $t('form.pos.order.date') }}:
                <b class="order-info">
                  {{ orderDate }}
                </b>
              </p>
              <p class="total">{{ $t('form.pos.order.type') }}:<b class="order-info">{{ currentOrder.documentType.name }}</b></p>
              <p class="total">
                {{ $t('form.pos.order.itemQuantity') }}
                <b class="order-info">
                  {{ getItemQuantity }}
                </b>
              </p>
              <p class="total">
                {{ $t('form.pos.order.numberLines') }}
                <b class="order-info">
                  {{ numberOfLines }}
                </b></p>
            </span>
          </el-footer>
        </el-container>
      </el-main>
    </el-container>
    <div v-if="isMobile && isShowedPOSKeyLayout" :style="classButtomRight">
      <el-button
        :circle="true"
        type="primary"
        :icon="isShowedPOSKeyLayout ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"
        @click="isShowedPOSKeyLayout = !isShowedPOSKeyLayout"
      />
    </div>
    <div v-if="!isMobile" :style="classButtomRight">
      <el-button
        id="buttonPanelRightPos"
        :circle="true"
        type="primary"
        :icon="isShowedPOSKeyLayout ? 'el-icon-arrow-right' : 'el-icon-arrow-left'"
        @click="isShowedPOSKeyLayout = !isShowedPOSKeyLayout"
      />
    </div>
  </div>
  <div
    v-else
    key="form-loading"
    v-loading="!isLoaded"
    :element-loading-text="$t('notifications.loading')"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 0.8)"
    class="view-loading"
  />
</template>

<script>
import formMixin from '@/components/ADempiere/Form/formMixin.js'
import orderLineMixin from './orderLineMixin.js'
import fieldsListOrder from './fieldsListOrder.js'
import BusinessPartner from '@/components/ADempiere/Form/VPOS/BusinessPartner'
import fieldLine from '@/components/ADempiere/Form/VPOS/Order/line/index'
import ProductInfo from '@/components/ADempiere/Form/VPOS/ProductInfo'
import convertAmount from '@/components/ADempiere/Form/VPOS/Collection/convertAmount/index'
// Format of values ( Date, Price, Quantity )
import {
  formatDate,
  formatPrice,
  formatQuantity
} from '@/utils/ADempiere/valueFormat.js'

export default {
  name: 'Order',
  components: {
    BusinessPartner,
    ProductInfo,
    convertAmount,
    fieldLine
  },
  mixins: [
    formMixin,
    orderLineMixin
  ],
  data() {
    return {
      fieldsList: fieldsListOrder,
      seeConversion: false,
      showFieldLine: false
    }
  },
  computed: {
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    classOrderFooter() {
      if (this.isMobile) {
        return 'footer-mobile'
      }
      return 'footer-table'
    },
    classButtomRight() {
      if (this.isMobile) {
        if (this.$store.getters.getIsShowPOSOptions) {
          return 'position: fixed'
        }
        return 'position: absolute;top: 34%;z-index: 100;right: 0;'
      }
      return 'position: relative;padding-top: 30vh; z-index: 100;'
    },
    colFieldBusinessPartner() {
      if (this.isMobile) {
        return 12
      }
      if (this.isEmptyValue(this.currentOrder)) {
        return 9
      }
      return 7
    },
    colFieldProductCode() {
      if (this.isMobile) {
        return 12
      }
      if (this.isEmptyValue(this.currentOrder)) {
        return 14
      }
      return 11
    },
    shortsKey() {
      return {
        popoverConvet: ['ctrl', 'x']
      }
    },
    isShowedPOSKeyLayout: {
      get() {
        return this.$store.getters.getShowPOSKeyLayout
      },
      set(val) {
        this.$store.commit('setShowPOSKeyLayout', val)
      }
    },
    styleTab() {
      const isShowedPOSOptions = this.$store.getters.getIsShowPOSOptions
      if (this.isShowedPOSKeyLayout || isShowedPOSOptions) {
        return 'adding-left: 0px; padding-left: 0px; padding-right: 0px; padding: 0px; '
      }
      return 'padding-left: 0px; padding-right: 0px; '
    },
    orderDate() {
      if (this.isEmptyValue(this.currentOrder) || this.isEmptyValue(this.currentOrder.dateOrdered)) {
        return this.formatDate(new Date())
      }
      return this.formatDate(this.currentOrder.dateOrdered)
    },
    getItemQuantity() {
      if (this.isEmptyValue(this.currentOrder)) {
        return 0
      }
      const result = this.listOrderLine.map(order => {
        return order.quantityOrdered
      })

      if (!this.isEmptyValue(result)) {
        return result.reduce((accumulator, currentValue) => {
          return accumulator + currentValue
        })
      }
      return 0
    },
    numberOfLines() {
      if (this.isEmptyValue(this.currentOrder)) {
        return
      }
      return this.listOrderLine.length
    },
    multiplyRate() {
      return this.$store.getters.getMultiplyRate
    },
    converCurrency() {
      return this.$store.getters.getValueOfField({
        containerUuid: 'Collection-Convert-Amount',
        columnName: 'C_Currency_ID_UUID'
      })
    },
    currencyUuid() {
      return this.$store.getters.getValueOfField({
        containerUuid: 'Collection-Convert-Amount',
        columnName: 'C_Currency_ID_UUID'
      })
    },
    labelButtonCollections() {
      return this.isDisabled ? this.$t('form.pos.order.collections') : this.$t('form.pos.order.collect')
    },
    currentPointOfSales() {
      return this.$store.getters.posAttributes.currentPointOfSales
    },
    // Currency Point Of Sales
    pointOfSalesCurrency() {
      // const currency = this.currentPointOfSales
      if (!this.isEmptyValue(this.currentPointOfSales.priceList)) {
        return {
          ...this.currentPointOfSales.priceList.currency,
          amountConvertion: 1
        }
      }
      return {
        uuid: '',
        iSOCode: '',
        curSymbol: '',
        amountConvertion: 1
      }
    },
    listPointOfSales() {
      return this.$store.getters.posAttributes.pointOfSalesList
    },
    ordersList() {
      if (this.isEmptyValue(this.currentPointOfSales)) {
        return []
      }
      return this.currentPointOfSales.listOrder
    },
    currentOrder() {
      if (this.isEmptyValue(this.currentPointOfSales)) {
        return {
          documentType: {},
          documentStatus: {
            value: ''
          },
          totalLines: 0,
          grandTotal: 0,
          salesRepresentative: {},
          businessPartner: {
            value: '',
            uuid: ''
          }
        }
      }
      return this.currentPointOfSales.currentOrder
    },
    isDisabled() {
      return this.currentPointOfSales.currentOrder.isProcessed
    },
    listOrderLine() {
      if (this.isEmptyValue(this.currentOrder)) {
        return []
      }
      return this.currentOrder.lineOrder
    },
    currentLineOrder() {
      const line = this.$store.state['pointOfSales/orderLine/index'].line
      return line
    },
    currentPriceList() {
      if (!this.isEmptyValue(this.$store.getters.currentPriceList)) {
        return this.$store.getters.currentPriceList
      }
      return {}
    },
    pointPriceList() {
      const list = this.$store.getters.posAttributes.currentPointOfSales.pricesList
      if (this.isEmptyValue(list)) {
        return []
      }
      return list
    },
    currentWarehouse() {
      if (!this.isEmptyValue(this.$store.getters['user/getWarehouse'])) {
        return this.$store.getters['user/getWarehouse']
      }
      return {}
    },
    listWarehouse() {
      if (!this.isEmptyValue(this.$store.getters.posAttributes.currentPointOfSales.warehousesList)) {
        return this.$store.getters.posAttributes.currentPointOfSales.warehousesList
      }
      return []
    }
  },
  mounted() {
    if (!this.isEmptyValue(this.$route.query.action)) {
      this.$store.dispatch('reloadOrder', { orderUuid: this.$route.query.action })
    }
  },
  methods: {
    formatDate,
    formatPrice,
    formatQuantity,
    closeConvertion() {
      this.seeConversion = false
    },
    openCollectionPanel() {
      this.isShowedPOSKeyLayout = this.isMobile ? !this.isShowedPOSKeyLayout : true
      this.$store.commit('setShowPOSCollection', true)
      const orderUuid = this.$route.query.action
      this.$store.dispatch('listPayments', { orderUuid })
      this.$store.commit('setShowPOSOptions', false)
    },
    open() {
      if (!this.seeConversion) {
        this.seeConversion = true
      }
    },
    getOrderTax(currency) {
      return this.formatPrice(this.currentOrder.grandTotal - this.currentOrder.totalLines, currency)
    },
    newOrder() {
      this.$router.push({
        params: {
          ...this.$route.params
        },
        query: {
          pos: this.currentPointOfSales.id
        }
      }).catch(() => {
      }).finally(() => {
        this.$store.commit('setListPayments', [])
        const { templateBusinessPartner } = this.currentPointOfSales
        this.$store.commit('updateValuesOfContainer', {
          containerUuid: this.metadata.containerUuid,
          attributes: [{
            columnName: 'UUID',
            value: undefined
          },
          {
            columnName: 'ProductValue',
            value: undefined
          },
          {
            columnName: 'C_BPartner_ID',
            value: templateBusinessPartner.id
          },
          {
            columnName: 'DisplayColumn_C_BPartner_ID',
            value: templateBusinessPartner.name
          },
          {
            columnName: ' C_BPartner_ID_UUID',
            value: templateBusinessPartner.uuid
          }]
        })
        this.$store.dispatch('setOrder', {
          documentType: {},
          documentStatus: {
            value: ''
          },
          totalLines: 0,
          grandTotal: 0,
          salesRepresentative: {},
          businessPartner: {
            value: '',
            uuid: ''
          }
        })
        this.$store.commit('setShowPOSCollection', false)
        this.$store.dispatch('listOrderLine', [])
      })
    },
    changePos(pointOfSales) {
      this.$store.dispatch('setCurrentPOS', pointOfSales)
      this.newOrder()
    },
    changeWarehouse(warehouse) {
      this.$store.commit('setCurrentWarehouse', warehouse)
    },
    changePriceList(priceList) {
      this.$store.commit('setCurrentPriceList', priceList)
    },
    arrowTop() {
      if (this.currentTable > 0) {
        this.currentTable--
        this.$refs.linesTable.setCurrentRow(this.listOrderLine[this.currentTable])
        this.currentOrderLine = this.listOrderLine[this.currentTable]
      }
    },
    showEditLine(line) {
      this.$store.commit('setLine', line)
      this.showFieldLine = !this.showFieldLine
    },
    arrowBottom() {
      const top = this.listOrderLine.length - 1
      if (this.currentTable < top) {
        this.currentTable++
        this.$refs.linesTable.setCurrentRow(this.listOrderLine[this.currentTable])
        this.currentOrderLine = this.listOrderLine[this.currentTable]
      }
    }
  }
}
</script>

<style scoped>
  .delete-buttom {
    border: none;
    width: 100%;
    text-align: left;
  }
  .el-col-24 {
    width: 100%;
    padding-right: 0px !important;
    padding-left: 0px !important;
  }
  .el-col-6 {
    padding-right: 0px !important;
    padding-left: 0px !important;
  }
  .footer-mobile {
    padding: 0px;
    height: auto !important;
    overflow: auto;
    display: contents;
  }
  .footer-table {
    padding-top: 0px;
    padding-right: 9px;
    padding-bottom: 0px;
    padding-left: 9px;
    height: auto !important;
  }
  .keypad {
    float: left;
    height: 20%;
    padding-top: 10px;
  }
  .total {
    margin-top: 10px;
    margin-bottom: 10px
  }
  .info-pos {
    padding-top: 10px;
    color: black;
  }
  .split {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    overflow-y: hidden;
    overflow-x: hidden;
    height: 100%;
    width: 100%;
  }
  .el-card__body {
    padding-top: 0px !important;
    padding-right: 0px!important;
    padding-bottom: 20px;
    padding-left: 10px!important;
    height: 100%!important;
  }

  /* Style of Table */
  .el-table {
    position: relative;
    overflow: hidden;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    width: 100%;
    max-width: 100%;
    height: 100%;
    background-color: #FFFFFF;
    font-size: 14px;
    color: #606266;
  }
  .el-card__header {
    padding: 0px 20px;
    border-bottom: 1px solid #e6ebf5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }
  .el-header {
    background: 'white';
    color: #333;
    line-height: 10px;
  }
  .el-button--text {
    border-color: transparent;
    color: #1890ff;
    background: transparent;
    padding: 0px;
  }
  .el-aside {
    color: #333;
  }
  .el-row {
    margin: 0px!important;
  }
  .el-tag--medium {
    height: 34px;
    line-height: 32px;
    text-align: center;
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .order-header {
    padding-left: 10px;
    font-size: 13px;
  }
  .order-info {
    float: right;
    padding-left: 9px;
  }
  .transition-box {
    z-index: 1;
    width: auto;
    position: fixed;
    bottom: 5%;
    right: 5%;
  }
</style>
