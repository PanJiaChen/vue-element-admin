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
          <el-row :gutter="24">
            <el-col :span="14" style="padding-left: 0px; padding-right: 0px;">
              <template
                v-for="(field) in fieldsList"
              >
                <product-info
                  v-if="field.columnName === 'ProductValue'"
                  :key="field.columnName"
                  :metadata="field"
                />
              </template>
            </el-col>
            <el-col :span="6" style="padding-left: 2px; padding-right: 2px;">
              <business-partner
                :parent-metadata="{
                  name: panelMetadata.name,
                  containerUuid: panelMetadata.containerUuid,
                  uuid: panelMetadata.uuid,
                  panelType: panelMetadata.panelType
                }"
              />
            </el-col>
            <el-col :span="2" :style="styleTab">
              <el-tag
                :type="tagStatus(getOrder.documentStatus.value)"
              >
                <span v-if="isEmptyValue(getOrder.documentStatus.value)">
                  Borrador
                </span>
                {{ getOrder.documentStatus.name }}
              </el-tag>
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <el-main style="background: white; padding: 0px; height: 100% !important; overflow: hidden">
        <el-container style="background: white; padding: 0px; height: 100% !important;">
          <el-main style="padding-top: 0px; padding-right: 10px; padding-bottom: 0px; padding-left: 10px;">
            <el-table
              ref="linesTable"
              v-loading="updateOrderProcessPos"
              v-shortkey="shortsKey"
              :data="allOrderLines"
              border
              style="width: 100%; max-width: 100%; background-color: #FFFFFF; font-size: 14px; overflow: auto; color: #606266;"
              highlight-current-row
              fit
              @current-change="handleCurrentLineChange"
              @shortkey.native="shortcutKeyMethod"
            >
              <el-table-column
                v-for="(valueOrder, item, key) in orderLineDefinition"
                :key="key"
                :column-key="valueOrder.columnName"
                :label="valueOrder.label"
                :width="valueOrder.isNumeric ? 'auto' : '380'"
                :align="valueOrder.isNumeric ? 'right' : 'left'"
              >
                <template slot-scope="scope">
                  <span>
                    {{ displayValue(scope.row, valueOrder) }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                label=""
                width="120"
              >
                <template slot-scope="scope">
                  <el-dropdown trigger="click" @command="changeLine">
                    <span class="el-dropdown-link">
                      {{ $t('form.pos.tableProduct.options') }}
                      <i class="el-icon-arrow-down el-icon--right" />
                    </span>
                    <el-dropdown-menu slot="dropdown" style="padding-bottom: 0px;">
                      <el-dropdown-item :command="scope.row">
                        <el-popover
                          placement="right"
                          trigger="click"
                          :title="$t('form.productInfo.productInformation')"
                        >
                          <el-form
                            label-position="top"
                            label-width="60px"
                            style="float: right; display: flex; line-height: 30px;"
                          >
                            <el-row :gutter="24">
                              <el-col :span="4">
                                <div>
                                  <el-avatar shape="square" :size="100" src="https://#" @error="true">
                                    <el-image>
                                      <div slot="error" class="image-slot">
                                        <i class="el-icon-picture-outline" />
                                      </div>
                                    </el-image>
                                  </el-avatar>
                                </div>
                              </el-col>
                              <el-col :span="10">
                                {{ $t('form.productInfo.code') }}: <b>{{ currentOrderLine.product.value }}</b><br>
                                {{ $t('form.productInfo.name') }}: <b>{{ currentOrderLine.product.name }}</b><br>
                                {{ $t('form.productInfo.description') }}: <b>{{ currentOrderLine.product.description }}</b><br>
                              </el-col>
                              <el-col :span="10">
                                <div style="float: right">
                                  {{ $t('form.productInfo.price') }}:
                                  <b>{{ formatPrice(currentOrderLine.product.priceStandard, currencyPoint.iSOCode) }}</b>
                                  <br>
                                  {{ $t('form.productInfo.taxAmount') }}:
                                  <b>{{ currentOrderLine.taxIndicator }}</b>
                                  <br>
                                  {{ $t('form.productInfo.quantityAvailable') }}:
                                  <b>{{ formatQuantity(currentOrderLine.quantityOrdered) }}</b>
                                </div>
                              </el-col>
                            </el-row>
                          </el-form>
                          <el-button slot="reference" type="text" style="display: flex;width: 110%;padding-bottom: 5%;padding-top: 5%;">
                            <i class="el-icon-info" /> {{ $t('form.productInfo.productInformation') }}
                          </el-button>
                        </el-popover>
                      </el-dropdown-item>
                      <el-dropdown-item :command="$t('form.pos.tableProduct.editQuantities')">
                        <el-popover
                          placement="right"
                          trigger="click"
                          :title="$t('form.pos.tableProduct.editQuantities')"
                        >
                          <el-row>
                            <el-col :span="8">
                              <el-form label-position="top" label-width="10px" @submit.native.prevent="notSubmitForm">
                                <template
                                  v-for="(field) in fieldsList"
                                >
                                  <field-definition
                                    v-if="field.columnName === 'PriceEntered'"
                                    :key="field.columnName"
                                    :metadata-field="field"
                                  />
                                </template>
                              </el-form>
                            </el-col>
                            <el-col :span="8">
                              <el-form label-position="top" label-width="10px" @submit.native.prevent="notSubmitForm">
                                <template
                                  v-for="(field) in fieldsList"
                                >
                                  <field-definition
                                    v-if="field.columnName === 'QtyEntered'"
                                    :key="field.columnName"
                                    :metadata-field="field"
                                  />
                                </template>
                              </el-form>
                            </el-col>
                            <el-col :span="8">
                              <el-form label-position="top" label-width="10px" @submit.native.prevent="notSubmitForm">
                                <template
                                  v-for="(field) in fieldsList"
                                >
                                  <field-definition
                                    v-if="field.columnName === 'Discount'"
                                    :key="field.columnName"
                                    :metadata-field="field"
                                  />
                                </template>
                              </el-form>
                            </el-col>
                          </el-row>
                          <el-button slot="reference" type="text">
                            <i class="el-icon-edit" /> {{ $t('form.pos.tableProduct.editQuantities') }}
                          </el-button>
                        </el-popover>
                      </el-dropdown-item>
                      <el-button type="danger" icon="el-icon-delete" class="delete-buttom" plain @click="deleteOrderLine(scope.row)">
                        {{ $t('form.pos.tableProduct.remove') }}
                      </el-button>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>
            </el-table>
          </el-main>

          <el-footer class="footer-table">
            <div class="keypad">
              <el-button type="primary" icon="el-icon-top" @click="arrowTop" />
              <el-button type="primary" icon="el-icon-bottom" @click="arrowBottom" />
              <el-button v-show="isValidForDeleteLine(allOrderLines)" type="danger" icon="el-icon-delete" @click="deleteOrderLine(currentOrderLine)" />
              <el-button
                v-show="isValidForDeleteLine(allOrderLines)"
                type="success"
                icon="el-icon-bank-card"
                @click="openCollectionPanel"
              >
                {{ $t('form.pos.order.collect') }}
              </el-button>
              <br>
              <p>
                <el-dropdown
                  trigger="click"
                  style="padding-top: 8px; color: black;"
                  @command="changePos"
                >
                  <p>
                    <i class="el-icon-mobile-phone" />
                    {{ $t('form.pos.order.pointSale') }}: <b style="cursor: pointer"> {{ namePointOfSales.name }} </b>
                  </p>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="item in sellingPointsList"
                      :key="item.uuid"
                      :command="item"
                    >
                      {{ item.name }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </p>
            </div>
            <span style="float: right;">
              <p class="total">{{ $t('form.pos.order.seller') }}:<b style="float: right;">
                {{ getOrder.salesRepresentative.name }}
              </b></p>
              <p class="total"> {{ $t('form.pos.order.subTotal') }}:<b class="order-info">{{ formatPrice(getOrder.totalLines, currencyPoint.iSOCode) }}</b></p>
              <p class="total"> {{ $t('form.pos.order.discount') }}:<b class="order-info">{{ formatPrice(0, currencyPoint.iSOCode) }}</b> </p>
              <p class="total"> {{ $t('form.pos.order.tax') }}:<b style="float: right;">{{ getOrderTax(currencyPoint.iSOCode) }}</b> </p>
              <p class="total">
                <b>
                  {{ $t('form.pos.order.total') }}:
                </b>
                <b style="float: right;">
                  <el-popover
                    :v-model="seeConversion"
                    placement="top-start"
                  >
                    <convert-amount
                      v-show="seeConversion"
                      :convert="multiplyRate"
                      :amount="getOrder.grandTotal"
                      :currency="currencyPoint"
                    />
                    <el-button slot="reference" type="text" style="color: #000000;font-weight: 604!important;font-size: 100%;" @click="seeConversion = !seeConversion">
                      {{ formatPrice(getOrder.grandTotal, currencyPoint.iSOCode) }}
                    </el-button>
                  </el-popover>
                </b>
              </p>
            </span>
            <span style="float: right;padding-right: 40px;">
              <p class="total">{{ $t('form.pos.order.order') }}: <b class="order-info">{{ getOrder.documentNo }}</b></p>
              <p class="total">
                {{ $t('form.pos.order.date') }}:
                <b class="order-info">
                  {{ orderDate }}
                </b>
              </p>
              <p class="total">{{ $t('form.pos.order.type') }}:<b class="order-info">{{ getOrder.documentType.name }}</b></p>
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
    <div style="position: relative;padding-top: 30vh; z-index: 100;">
      <el-button
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
import posMixin from '@/components/ADempiere/Form/VPOS/posMixin.js'
import BusinessPartner from '@/components/ADempiere/Form/VPOS/BusinessPartner'
import ProductInfo from '@/components/ADempiere/Form/VPOS/ProductInfo'
import convertAmount from '@/components/ADempiere/Form/VPOS/Collection/convertAmount/index'

export default {
  name: 'Order',
  components: {
    BusinessPartner,
    ProductInfo,
    convertAmount
  },
  mixins: [
    formMixin,
    orderLineMixin,
    posMixin
  ],
  data() {
    return {
      fieldsList: fieldsListOrder,
      seeConversion: false
    }
  },
  computed: {
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
        return 'adding-left: 0px; padding-right: 0px; padding-top: 3.5%;'
      }
      return 'padding-left: 30px; padding-right: 0px; padding-top: 2.2%;'
    },
    namePointOfSales() {
      const currentPOS = this.$store.getters.getCurrentPOS
      if (currentPOS && !this.isEmptyValue(currentPOS.name)) {
        return currentPOS
      }
      return {
        name: '',
        uuid: ''
      }
    },
    sellingPointsList() {
      return this.$store.getters.getSellingPointsList
    },
    orderDate() {
      if (this.isEmptyValue(this.getOrder) || this.isEmptyValue(this.getOrder.dateOrdered)) {
        return this.formatDate(new Date())
      }
      return this.formatDate(this.getOrder.dateOrdered)
    },
    getItemQuantity() {
      if (this.isEmptyValue(this.getOrder)) {
        return 0
      }
      const result = this.allOrderLines.map(order => {
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
      if (this.isEmptyValue(this.getOrder)) {
        return
      }
      return this.allOrderLines.length
    },
    currencyPoint() {
      const currency = this.currentPoint
      if (!this.isEmptyValue(currency)) {
        return currency.priceList.currency
      }
      return {
        uuid: '',
        iSOCode: '',
        curSymbol: ''
      }
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
    displayeTypeCurrency() {
      return this.$store.getters.getValueOfField({
        containerUuid: this.containerUuid,
        columnName: 'DisplayColumn_C_Currency_ID'
      })
    }
  },
  watch: {
    currencyUuid(value) {
      if (!this.isEmptyValue(value) && !this.isEmptyValue(this.currentPoint)) {
        this.$store.dispatch('conversionDivideRate', {
          conversionTypeUuid: this.$store.getters.getCurrentPOS.conversionTypeUuid,
          currencyFromUuid: this.currencyPoint.uuid,
          currencyToUuid: value
        })
      }
    },
    converCurrency(value) {
      if (!this.isEmptyValue(value) && !this.isEmptyValue(this.currentPoint)) {
        this.$store.dispatch('conversionMultiplyRate', {
          containerUuid: 'Order',
          conversionTypeUuid: this.$store.getters.getCurrentPOS.conversionTypeUuid,
          currencyFromUuid: this.currencyPoint.uuid,
          currencyToUuid: value
        })
      } else {
        this.$store.commit('currencyMultiplyRate', 1)
      }
    },
    namePo1intOfSales(value) {
      if (!this.isEmptyValue(value)) {
        this.$router.push({
          query: {
            pos: value.id
          }
        })
      }
    }
  },
  mounted() {
    setTimeout(() => {
      this.currencyDisplaye()
    }, 1500)
  },
  methods: {
    changePos(posElement) {
      this.$store.dispatch('setCurrentPOS', posElement)
      this.newOrder()
    },
    openCollectionPanel() {
      this.isShowedPOSKeyLayout = !this.isShowedPOSKeyLayout
      this.$store.commit('setShowPOSCollection', true)
      const orderUuid = this.$route.query.action
      this.$store.dispatch('listPayments', { orderUuid })
      this.isShowedPOSKeyLaout = !this.isShowedPOSKeyLaout
      this.$store.commit('setShowPOSOptions', false)
    },
    newOrder() {
      this.$router.push({
        params: {
          ...this.$route.params
        },
        query: {
          pos: this.currentPoint.id
        }
      }).catch(() => {
      }).finally(() => {
        const { templateBusinessPartner } = this.currentPoint
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
        this.$store.dispatch('listOrderLine', [])
      })
    },
    open() {
      if (!this.seeConversion) {
        this.seeConversion = true
      }
    },
    tenderTypeDisplaye() {
      if (!this.isEmptyValue(this.fieldsList)) {
        const tenderType = this.fieldsList[5].reference
        if (!this.isEmptyValue(tenderType)) {
          this.$store.dispatch('getLookupListFromServer', {
            tableName: tenderType.tableName,
            query: tenderType.query
          })
            .then(response => {
              this.$store.dispatch('tenderTypeDisplaye', response)
            })
        }
      }
    },
    currencyDisplaye() {
      if (!this.isEmptyValue(this.fieldsList)) {
        const currency = this.fieldsList[4].reference
        if (!this.isEmptyValue(currency)) {
          this.$store.dispatch('getLookupListFromServer', {
            tableName: currency.tableName,
            query: currency.query
          })
            .then(response => {
              this.$store.dispatch('currencyDisplaye', response)
            })
        }
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
    padding-top: 25px;
  }
  .total {
    margin-top: 10px;
    margin-bottom: 10px
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
