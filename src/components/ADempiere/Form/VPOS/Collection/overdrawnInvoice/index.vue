<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Elsio Sanchez elsiosanches@gmail.com www.erpya.com
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
    <el-dialog
      :title="$t('form.pos.collect.overdrawnInvoice.title')"
      :visible.sync="showDialogo"
      :before-close="close"
      width="80%"
      @close="close"
    >
      <div v-if="caseOrder === 1">
        <el-form>
          <el-form-item>
            <el-radio v-model="option" :label="1"> {{ $t('form.pos.collect.overdrawnInvoice.returned') }} {{ formatPrice(change, currency.iSOCode) }} </el-radio>
            <el-radio v-model="option" :label="3"> {{ $t('form.pos.collect.overdrawnInvoice.returnMoney') }}</el-radio>
            <el-radio v-model="option" :label="4"> {{ $t('form.pos.collect.overdrawnInvoice.adjustDocument') }}</el-radio>
          </el-form-item>
        </el-form>
        <el-card v-if="option === 1" class="box-card">
          <div slot="header" class="clearfix">
            <span v-if="isEmptyValue(selectionTypeRefund)">{{ $t('form.pos.collect.overdrawnInvoice.above') }}</span>
            <template v-else>
              <span>
                {{ selectionTypeRefund.name }}
              </span>
              <span style="float: right;text-align: end">
                <b>
                  {{ $t('form.pos.collect.overdrawnInvoice.dailyLimit') }}: {{ formatPrice(maximumDailyRefundAllowed, refundReferenceCurrency) }}
                  {{ $t('form.pos.collect.overdrawnInvoice.customerLimit') }}: {{ formatPrice(maximumRefundAllowed, refundReferenceCurrency) }}
                </b>
              </span>
            </template>
          </div>
          <div class="text item">
            <el-row :gutter="24">
              <el-col v-for="(payment, index) in paymentTypeListRefund" :key="index" :span="6">
                <div @click="selectPayment(payment)">
                  <el-card shadow="hover">
                    <div slot="header" class="clearfix" style="text-align: center;">
                      <span>
                        <b>{{ payment.name }}</b> <br>
                      </span>
                    </div>
                    <div class="text item">
                      <el-image
                        :src="imageCard(payment.tender_type)"
                        tyle="width: 100px; height: 100px"
                        fit="contain"
                      />
                    </div>
                  </el-card>
                </div>
              </el-col>
            </el-row>
          </div>
          <div v-if="!isEmptyValue(selectionTypeRefund)" class="text item">
            <component
              :is="componentRender"
              :change="change"
            />
          </div>
        </el-card>
      </div>
      <div>
        <el-card v-if="option === 2" class="box-card">
          <div slot="header" class="clearfix">
            <span>{{ $t('form.pos.collect.overdrawnInvoice.above') }}</span>
          </div>
          <div class="text item">
            <el-form
              label-position="top"
              label-width="10px"
            >
              <el-row>
                <el-col
                  v-for="field in primaryFieldsList"
                  :key="field.sequence"
                  :span="8"
                >
                  <field-definition
                    v-if="field.sequence < 3"
                    :key="field.columnName"
                    :metadata-field="field"
                  />
                </el-col>
              </el-row>
            </el-form>
          </div>
        </el-card>
        <el-card v-if="option === 3" class="box-card">
          <div slot="header" class="clearfix">
            <span v-if="isEmptyValue(selectionTypeRefund)">{{ $t('form.pos.collect.overdrawnInvoice.above') }}</span>
            <template v-else>
              <span>
                {{ selectionTypeRefund.name }}
              </span>
              <span style="float: right;text-align: end">
                <b>
                  {{ $t('form.pos.collect.overdrawnInvoice.dailyLimit') }}: {{ formatPrice(maximumDailyRefundAllowed, refundReferenceCurrency) }}
                  {{ $t('form.pos.collect.overdrawnInvoice.customerLimit') }}: {{ formatPrice(maximumRefundAllowed, refundReferenceCurrency) }}
                </b>
              </span>
            </template>
          </div>
          <div class="text item">
            <el-row :gutter="24">
              <el-col v-for="(payment, index) in paymentTypeList" :key="index" :span="6">
                <div @click="selectPayment(payment)">
                  <el-card shadow="hover">
                    <div slot="header" class="clearfix" style="text-align: center;">
                      <span>
                        <b>{{ payment.name }}</b> <br>
                      </span>
                    </div>
                    <div class="text item">
                      <el-image
                        :src="imageCard(payment.tender_type)"
                        tyle="width: 100px; height: 100px"
                        fit="contain"
                      />
                    </div>
                  </el-card>
                </div>
              </el-col>
            </el-row>
          </div>
          <div v-if="!isEmptyValue(selectionTypeRefund)" class="text item">
            <component
              :is="componentRender"
              :change="change"
            />
          </div>
        </el-card>
      </div>
      <el-card v-if="option === 3" class="box-card">
        <div class="text item">
          <type-refund
            :is-add-type-pay="refundLoaded"
          />
        </div>
      </el-card>
      <div v-if="caseOrder === 2">
        <el-card>
          <div slot="header" class="clearfix">
            <span> {{ $t('form.pos.collect.overdrawnInvoice.below') }} </span>
          </div>
          <el-form label-width="120px">
            <el-form-item>
              <p>
                <b> {{ $t('form.pos.collect.orderTotal') }} </b> {{ formatPrice(totalOrder, currency.iSOCode) }}
                <el-divider direction="vertical" />
                <b> {{ $t('form.pos.collect.totalInvoiced') }} </b> {{ formatPrice(pay, currency.iSOCode) }}
                <el-divider direction="vertical" />
                <b> {{ $t('form.pos.collect.pending') }} </b> {{ formatPrice(pending, currency.iSOCode) }}
              </p>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="danger"
          class="custom-button-create-bp"
          icon="el-icon-close"
          @click="close"
        />
        <el-button
          type="success"
          class="custom-button-create-bp"
          icon="el-icon-check"
          @click="addRefund"
        />
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { formatPrice } from '@/utils/ADempiere/valueFormat.js'
import formMixin from '@/components/ADempiere/Form/formMixin'
import posMixin from '@/components/ADempiere/Form/VPOS/posMixin.js'
import fieldsListOverdrawnInvoice from './fieldsListOverdrawnInvoice.js'
import { overdrawnInvoice } from '@/api/ADempiere/form/point-of-sales.js'
import { processOrder } from '@/api/ADempiere/form/point-of-sales.js'
import typeRefund from './typeRefund/index.vue'

export default {
  name: 'OverdrawnInvoice',
  components: {
    typeRefund
  },
  mixins: [
    formMixin,
    posMixin
  ],
  props: {
    change: {
      type: Number,
      default: 0
    },
    pay: {
      type: Number,
      default: 0
    },
    pending: {
      type: Number,
      default: 0
    },
    totalOrder: {
      type: Number,
      default: 0
    },
    currency: {
      type: Object,
      default: undefined
    },
    metadata: {
      type: Object,
      default: () => {
        return {
          uuid: 'OverdrawnInvoice',
          containerUuid: 'OverdrawnInvoice'
        }
      }
    }
  },
  data() {
    return {
      option: 1,
      optionTypePay: 0,
      selectionTypeRefund: {},
      fieldsList: fieldsListOverdrawnInvoice,
      currentFieldCurrency: '',
      currentPaymentType: ''
    }
  },
  computed: {
    componentRender() {
      let typePay
      switch (this.selectionTypeRefund.tender_type) {
        case 'P':
          typePay = () => import('./paymentTypeChange/MobilePayment/index')
          break
        case 'X':
          typePay = () => import('./paymentTypeChange/Cash/index.vue')
          break
        case 'A':
          typePay = () => import('./paymentTypeChange/ACH/index')
          break
        case 'M':
          typePay = () => import('./paymentTypeChange/GiftCards/index.vue')
          break
        case 'Z':
          typePay = () => import('./paymentTypeChange/Zelle/index.vue')
          break
      }
      return typePay
    },
    renderComponentContainer() {
      let container
      switch (this.selectionTypeRefund.tender_type) {
        case 'P':
          container = 'MobilePayment'
          break
        case 'A':
          container = 'ACH'
          break
        case 'X':
          container = 'Cash'
          break
        case 'M':
          container = 'GiftCards'
          break
        case 'Z':
          container = 'Zelle'
          break
      }
      return container
    },
    showDialogo() {
      return this.$store.state['pointOfSales/payments/index'].dialogoInvoce.show
    },
    caseOrder() {
      return this.$store.state['pointOfSales/payments/index'].dialogoInvoce.type
    },
    maximumRefundAllowed() {
      if (!this.isEmptyValue(this.selectionTypeRefund) && !this.isEmptyValue(this.selectionTypeRefund.maximum_refund_allowed) && this.selectionTypeRefund.maximum_refund_allowed > 0) {
        return this.selectionTypeRefund.maximum_refund_allowed
      }
      return this.$store.getters.posAttributes.currentPointOfSales.maximumRefundAllowed
    },
    maximumDailyRefundAllowed() {
      if (!this.isEmptyValue(this.selectionTypeRefund) && !this.isEmptyValue(this.selectionTypeRefund.maximum_daily_refund_allowed) && this.selectionTypeRefund.maximum_daily_refund_allowed > 0) {
        return this.selectionTypeRefund.maximum_daily_refund_allowed
      }
      return this.$store.getters.posAttributes.currentPointOfSales.maximumDailyRefundAllowed
    },
    refundReferenceCurrency() {
      if (!this.isEmptyValue(this.selectionTypeRefund) && !this.isEmptyValue(this.selectionTypeRefund.refund_reference_currency)) {
        return this.selectionTypeRefund.refund_reference_currency.iso_code
      }
      if (this.isEmptyValue(this.$store.getters.posAttributes.currentPointOfSales.refundReferenceCurrency.iso_code)) {
        return ''
      }
      return this.$store.getters.posAttributes.currentPointOfSales.refundReferenceCurrency.iso_code
    },
    isoCode() {
      return this.$store.getters.posAttributes.currentPointOfSales.displayCurrency.iso_code
    },
    displayeCurrency() {
      const tenderType = this.$store.getters.getValueOfField({
        containerUuid: 'OverdrawnInvoice',
        columnName: 'TenderType'
      })
      if (tenderType === 'D') {
        return true
      }
      return false
    },
    primaryFieldsList() {
      return this.fieldsList.filter(field => field.sequence <= 2)
    },
    hiddenFieldsList() {
      return this.fieldsList.filter(field => field.sequence >= 3)
    },
    listCurrency() {
      return this.$store.getters.getCurrenciesList
    },
    emptyFieldGiftCard() {
      const empty = this.fieldsList.filter(field => {
        if (field.sequence < 3 && this.isEmptyValue(
          this.$store.getters.getValueOfField({
            containerUuid: 'OverdrawnInvoice',
            columnName: field.columnName
          })
        )) {
          return field
        }
      })
      return empty.map(empty => empty.name)
    },
    emptyMandatoryFields() {
      return this.$store.getters.getFieldsListEmptyMandatory({ containerUuid: 'OverdrawnInvoice', formatReturn: 'name' })
    },
    paymentTypeList() {
      return this.$store.getters.getPaymentTypeList.filter(type => type.is_allowed_to_refund_open)
    },
    paymentTypeListRefund() {
      return this.$store.getters.getPaymentTypeList.filter(type => type.is_allowed_to_refund)
    },
    refundLoaded() {
      return this.$store.getters.getRefundLoaded
    }
  },
  watch: {
    option(value) {
      this.$store.commit('updateValueOfField', {
        containerUuid: this.renderComponentContainer,
        columnName: 'PayAmt',
        value: this.change
      })
      this.selectionTypeRefund = {}
    }
  },
  mounted() {
    this.selectionTypeRefund = {}
  },
  methods: {
    formatPrice,
    imageCard(typeRefund) {
      let image
      switch (typeRefund) {
        case 'D':
          image = 'MobilePayment.jpg'
          break
        case 'P':
          image = 'Mobile.jpg'
          break
        case 'X':
          image = 'Cash.jpg'
          break
        case 'A':
          image = 'ACH.jpg'
          break
        case 'M':
          image = 'GiftCard.jpg'
          break
        case 'Z':
          image = 'Zelle.jpg'
          break
        default:
          image = 'Default.jpg'
          break
      }
      return require('@/image/ADempiere/pos/typePayment/' + image)
    },
    selectPayment(payment) {
      this.selectionTypeRefund = payment
      this.$store.commit('updateValueOfField', {
        containerUuid: this.renderComponentContainer,
        columnName: 'PayAmt',
        value: this.change
      })
    },
    addRefund() {
      const values = this.$store.getters.getValuesView({
        containerUuid: this.renderComponentContainer,
        format: 'object'
      })
      const customer = {
        customerAccount: values,
        currencyUuid: this.$store.getters.getCurrencyRedund.uuid,
        orderUuid: this.currentOrder.uuid,
        posUuid: this.currentPointOfSales.uuid,
        tenderTypeCode: this.selectionTypeRefund.tender_type
      }
      const emptyMandatoryFields = this.$store.getters.getFieldsListEmptyMandatory({ containerUuid: this.renderComponentContainer, formatReturn: 'name' })
      if (!this.isEmptyValue(emptyMandatoryFields) && this.isEmptyValue(this.$store.getters.getCurrencyRedund.uuid)) {
        this.$message({
          type: 'warning',
          message: this.$t('notifications.mandatoryFieldMissing') + emptyMandatoryFields,
          duration: 1500,
          showClose: true
        })
        return
      }
      Object.keys(values).forEach(element => {
        this.$store.commit('updateValueOfField', {
          containerUuid: this.renderComponentContainer,
          columnName: element,
          value: undefined
        })
      })
      this.$store.dispatch('addRefundLoaded', values)
      this.$store.dispatch('sendCreateCustomerAccount', customer)
      this.selectionTypeRefund = {}
      this.success()
    },
    success() {
      const customerDetails = []
      this.fieldsList.forEach(element => {
        const value = this.$store.getters.getValueOfField({
          containerUuid: 'OverdrawnInvoice',
          columnName: element.columnName
        })
        customerDetails.push({
          label: element.columnName,
          value
        })
      })
      this.optionSelected({
        posUuid: this.currentPointOfSales.uuid,
        orderUuid: this.currentOrder.uuid,
        customerDetails,
        payments: this.currentOrder.listPayments.payments
      })
      this.selectionTypeRefund = {}
    },
    close() {
      this.selectionTypeRefund = {}
      this.$store.commit('dialogoInvoce', { show: false })
    },
    changeCurrency(value) {
      this.currentFieldCurrency = value
    },
    changePaymentType(value) {
      this.$store.commit('currentTenderChange', value)
      this.currentPaymentType = value
      this.$store.commit('updateValueOfField', {
        containerUuid: 'OverdrawnInvoice',
        columnName: 'TenderType',
        value: value
      })
    },
    optionSelected({ posUuid, orderUuid, customerDetails, payments }) {
      switch (this.option) {
        case 2:
          this.completePreparedOrder(posUuid, orderUuid, payments)
          this.$store.commit('dialogoInvoce', { show: false, success: true })
          break
        case 3:
          if (!this.isEmptyValue(this.refundLoaded)) {
            this.completePreparedOrder(posUuid, orderUuid, payments)
            overdrawnInvoice({
              posUuid,
              orderUuid,
              createPayments: !this.isEmptyValue(this.currentOrder.listPayments.payments),
              payments: this.currentOrder.listPayments.payments,
              customerDetails,
              option: this.option
            })
              .then(response => {
                this.$store.dispatch('reloadOrder', response.uuid)
                this.$message({
                  type: 'success',
                  message: this.$t('notifications.completed'),
                  showClose: true
                })
              })
            this.$store.commit('dialogoInvoce', { show: false, success: true })
          } else {
            this.$message({
              type: 'warning',
              message: this.$t('form.pos.collect.overdrawnInvoice.addPayment'),
              showClose: true
            })
            return
          }
          break
        default:
          if (this.$store.getters.posAttributes.currentPointOfSales.isPosRequiredPin) {
            const attributePin = {
              posUuid,
              orderUuid,
              payments,
              action: 'openBalanceInvoice',
              type: 'actionPos',
              label: this.$t('form.pos.pinMessage.invoiceOpen')
            }
            this.visible = true
            this.$store.dispatch('changePopoverOverdrawnInvoice', { attributePin, visible: true })
          } else {
            this.completePreparedOrder(posUuid, orderUuid, payments)
            this.$store.commit('dialogoInvoce', { show: false, success: true })
          }
          break
      }
    },
    completePreparedOrder(posUuid, orderUuid, payments) {
      this.$store.dispatch('updateOrderPos', true)
      this.$store.dispatch('updatePaymentPos', true)
      this.$message({
        type: 'info',
        message: this.$t('notifications.processing'),
        showClose: true
      })
      processOrder({
        posUuid,
        orderUuid,
        createPayments: !this.isEmptyValue(payments),
        payments: payments
      })
        .then(response => {
          this.$store.dispatch('reloadOrder', response.uuid)
          this.$message({
            type: 'success',
            message: this.$t('notifications.completed'),
            showClose: true
          })
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: error.message,
            showClose: true
          })
        })
        .finally(() => {
          this.$store.dispatch('listOrdersFromServer', {
            posUuid: this.currentPointOfSales.uuid
          })
          this.$store.dispatch('updateOrderPos', false)
          this.$store.dispatch('updatePaymentPos', false)
        })
    }
  }
}
</script>

<style scoped>
  .el-dialog__header {
    padding: 20px;
    padding-bottom: 10px;
    background: #dae6f32e;
  }
  .el-image {
    display: inline-block;
    overflow: hidden;
  }
  .el-card__header {
    padding: 18px 20px;
    border-bottom: 1px solid #e6ebf5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    background-color: rgb(245, 247, 250);
  }
  .el-card__body {
    padding-top: 0px !important;
    padding-right: 0px!important;
    padding-bottom: 20px;
    padding-left: 10px!important;
    height: 100%!important;
  }

  .bottom {
    margin-top: 0px!important;
    line-height: 1px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
    height: 9vh;
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
  .el-aside {
    color: #333;
  }
  .el-row {
    margin: 0px!important;
  }
</style>
