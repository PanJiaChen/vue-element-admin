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
  <el-container style="background: white; height: 100% !important;">
    <el-main style="background: white; padding: 0px; height: 100% !important; overflow: hidden">
      <el-container style="background: white; padding: 0px; height: 100% !important;">
        <el-header style="height: auto; padding-bottom: 10px; padding-right: 0px; padding-left: 0px">
          <el-card class="box-card" style="padding-left: 0px; padding-right: 0px">
            <div slot="header" class="clearfix">
              <p class="total">
                <b>{{ $t('form.pos.collect.orderTotal') }}:</b>
                <b style="float: right;">
                  <el-popover
                    placement="top-start"
                    trigger="click"
                  >
                    <convert-amount
                      :convert="multiplyRate"
                      :amount="currentOrder.grandTotal"
                      :currency="pointOfSalesCurrency"
                    />
                    <el-button slot="reference" type="text" style="color: #000000;font-weight: 604!important;font-size: 100%;">
                      {{ formatPrice(currentOrder.grandTotal, pointOfSalesCurrency.iSOCode) }}
                    </el-button>
                  </el-popover>
                </b>
              </p>
              <p class="total">
                <b> {{ $t('form.pos.collect.pending') }}: </b>
                <b style="float: right;">
                  <el-popover
                    placement="top-start"
                    trigger="click"
                  >
                    <convert-amount
                      :convert="multiplyRate"
                      :amount="pending"
                      :currency="pointOfSalesCurrency"
                    />
                    <el-button slot="reference" type="text" style="color: #000000;font-weight: 604!important;font-size: 100%;">
                      {{ formatPrice(pending, pointOfSalesCurrency.iSOCode) }}
                    </el-button>
                  </el-popover>
                </b>
              </p>
              <p class="total">
                <b>Tasa del Día: </b>
                <b v-if="!isEmptyValue(dateRate)" style="float: right;">
                  {{
                    dateRate.iSOCode
                  }}
                  {{
                    formatConversionCurrenty(dateRate.amountConvertion)
                  }}
                </b>
              </p>
            </div>
            <div
              v-if="isLoaded"
              class="text item"
            >
              <el-form
                label-position="top"
                label-width="10px"
                style="float: right; display: flex; line-height: 10px;"
                :disabled="isDisabled"
              >
                <el-row>
                  <el-col v-for="(field, index) in fieldsList" :key="index" :span="8">
                    <field-definition
                      :key="field.columnName"
                      :metadata-field="field.columnName === 'PayAmt' ? {
                        ...field,
                        labelCurrency: isEmptyValue($store.getters.getFieldCuerrency) ? pointOfSalesCurrency : $store.getters.getFieldCuerrency
                      } : field"
                    />
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </el-card>
          <samp style="float: right;padding-right: 10px;">
            <el-button type="danger" icon="el-icon-close" @click="exit" />
            <el-button type="info" icon="el-icon-minus" :disabled="isDisabled" @click="undoPatment" />
            <el-button type="primary" :disabled="validPay || addPay || isDisabled" icon="el-icon-plus" @click="addCollectToList(paymentBox)" />
            <el-button type="success" :disabled="validateCompleteCollection || isDisabled" icon="el-icon-shopping-cart-full" @click="completePreparedOrder(listPayments)" />
          </samp>
        </el-header>
        <el-main style="padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px;">
          <type-collection
            v-if="!updateOrderPaymentPos"
            :is-add-type-pay="listPayments"
            :currency="pointOfSalesCurrency"
            :list-types-payment="fieldsList[2]"
            :is-loaded="isLoadedPayments"
          />
          <div
            v-else
            key="form-loading"
            v-loading="updateOrderPaymentPos"
            :element-loading-text="$t('notifications.loading')"
            :element-loading-spinner="'el-icon-loading'"
            element-loading-background="rgba(255, 255, 255, 0.8)"
            class="view-loading"
          />
        </el-main>

        <el-footer height="auto" style="padding-left: 0px; padding-right: 0px;">
          <el-row :gutter="24" style="background-color: rgb(245, 247, 250);">
            <el-col :span="24">
              <span>
                <p class="total">
                  <b>
                    {{ $t('form.pos.collect.orderTotal') }}:
                  </b>
                  <b style="float: right;">
                    <el-popover
                      placement="top-start"
                      trigger="click"
                    >
                      <convert-amount
                        :convert="multiplyRate"
                        :amount="currentOrder.grandTotal"
                        :currency="pointOfSalesCurrency"
                      />
                      <el-button slot="reference" type="text" style="color: #000000;font-weight: 604!important;font-size: 100%;">
                        {{ formatPrice(currentOrder.grandTotal, pointOfSalesCurrency.iSOCode) }}
                      </el-button>
                    </el-popover>
                  </b>
                </p>

                <p class="total">
                  {{ $t('form.pos.collect.pending') }}:
                  <b style="float: right;">
                    <el-popover
                      placement="top-start"
                      trigger="click"
                    >
                      <convert-amount
                        :convert="multiplyRate"
                        :amount="pending"
                        :currency="pointOfSalesCurrency"
                      />
                      <el-button slot="reference" type="text" style="color: #000000;font-weight: 604!important;font-size: 100%;">
                        {{ formatPrice(pending, pointOfSalesCurrency.iSOCode) }}
                      </el-button>
                    </el-popover>
                  </b>
                </p>

                <p class="total">
                  {{ $t('form.pos.collect.payment') }}:
                  <b style="float: right;">
                    <el-popover
                      placement="top-start"
                      trigger="click"
                    >
                      <convert-amount
                        :convert="multiplyRate"
                        :amount="pay"
                        :currency="pointOfSalesCurrency"
                      />
                      <el-button slot="reference" type="text" style="color: #000000;font-weight: 604!important;font-size: 100%;">
                        {{ formatPrice(pay, pointOfSalesCurrency.iSOCode) }}
                      </el-button>
                    </el-popover>
                  </b>
                </p>
                <p class="total">
                  {{ $t('form.pos.collect.change') }}:
                  <b style="float: right;">
                    <el-popover
                      placement="top-start"
                      trigger="click"
                    >
                      <convert-amount
                        :convert="multiplyRate"
                        :amount="change"
                        :currency="pointOfSalesCurrency"
                      />
                      <el-button slot="reference" type="text" style="color: #000000;font-weight: 604!important;font-size: 100%;">
                        {{ formatPrice(change, pointOfSalesCurrency.iSOCode) }}
                      </el-button>
                    </el-popover>
                  </b>
                </p>
              </span>
            </el-col>
          </el-row>
        </el-footer>
      </el-container>
    </el-main>
  </el-container>
</template>

<script>
import formMixin from '@/components/ADempiere/Form/formMixin'
import posMixin from '@/components/ADempiere/Form/VPOS/posMixin.js'
import fieldsListCollection from './fieldsListCollection.js'
import typeCollection from '@/components/ADempiere/Form/VPOS/Collection/typeCollection'
import convertAmount from '@/components/ADempiere/Form/VPOS/Collection/convertAmount/index'
import { formatPrice } from '@/utils/ADempiere/valueFormat.js'
import { processOrder } from '@/api/ADempiere/form/point-of-sales.js'
import { FIELDS_DECIMALS } from '@/utils/ADempiere/references'

export default {
  name: 'Collection',
  components: {
    typeCollection,
    convertAmount
  },
  mixins: [
    formMixin,
    posMixin
  ],
  props: {
    isLoadedPanel: {
      type: Boolean,
      required: false
    },
    amount: {
      type: Object,
      default: undefined
    },
    metadata: {
      type: Object,
      default: () => {
        return {
          uuid: 'Collection',
          containerUuid: 'Collection'
        }
      }
    }
  },
  data() {
    return {
      isCustomForm: true,
      checked: false,
      currencyConversion: 1,
      convertAllPayment: 1,
      allPayCurrency: 0,
      labelTenderType: '',
      defaultLabel: '',
      fieldsList: fieldsListCollection,
      sendToServer: false,
      amontSend: 0
    }
  },
  computed: {
    validateCompleteCollection() {
      let collection
      if (this.pay === this.currentOrder.grandTotal) {
        collection = false
      } else {
        if (this.pay >= this.currentOrder.grandTotal && (this.isCashAmt >= this.change) || this.checked) {
          collection = false
        } else {
          collection = true
        }
      }
      return collection
    },
    fullCopper() {
      if ((this.change > this.isCashAmt) && this.pay > this.currentOrder.grandTotal) {
        return true
      }
      return false
    },
    isPaymentBox() {
      return this.$store.getters.getPaymentBox
    },
    addPay() {
      const amount = this.$store.getters.getValueOfField({
        containerUuid: this.containerUuid,
        columnName: 'PayAmt'
      })
      if (amount <= 0) {
        return true
      }
      return false
    },
    listPayments() {
      const listLocal = this.$store.getters.getPaymentBox
      const listServer = this.currentOrder.listPayments
      if (!this.sendToServer) {
        return listServer.payments
      }
      return listLocal
    },
    isLoadedPayments() {
      return this.currentOrder.listPayments.isLoaded
    },
    paymentBox() {
      const payment = this.listPayments.filter(pay => {
        return pay.isVisible
      })
      if (this.isEmptyValue(payment)) {
        return []
      }
      return payment
    },
    cashPayment() {
      const cash = this.listPayments.filter(pay => {
        return pay.tenderTypeCode === 'X'
      })
      return this.sumCash(cash)
    },
    isValidForPay() {
      const containerUuid = this.containerUuid
      const typePay = this.$store.getters.getValueOfField({
        containerUuid,
        columnName: 'TenderType'
      })
      const amount = this.$store.getters.getValueOfField({
        containerUuid,
        columnName: 'PayAmt'
      })
      const allChange = Number.parseFloat(amount + this.change).toFixed(2) - this.cashPayment
      if (typePay !== 'X' && !this.isMandatory) {
        if (this.cashPayment === this.change && this.pending === 0 || (allChange > 0 && this.pending === 0)) {
          return true
        }
        return false
      }
      const cash = this.isMandatory
      return cash
    },
    turned() {
      const containerUuid = this.containerUuid
      const amount = this.$store.getters.getValueOfField({
        containerUuid,
        columnName: 'PayAmt'
      })
      const typePay = this.$store.getters.getValueOfField({
        containerUuid,
        columnName: 'TenderType'
      })
      const allPay = this.cashPayment + amount
      if (typePay !== 'X') {
        if (allPay <= this.currentOrder.grandTotal) {
          return false
        }
        return true
      }
      return false
    },
    isCashAmt() {
      const cashAmt = this.listPayments.map(item => {
        if (item.tenderTypeCode === 'X') {
          return item.amount
        }
        return 0
      })
      if (!this.isEmptyValue(cashAmt)) {
        return cashAmt.reduce((accumulator, currentValue) => accumulator + currentValue)
      }
      return 0
    },
    isOtherPayAmt() {
      const cashAmt = this.listPayments.map(item => {
        if (item.tenderTypeCode !== 'X') {
          return item.payAmt
        }
        return 0
      })
      if (!this.isEmptyValue(cashAmt)) {
        return cashAmt.reduce((accumulator, currentValue) => accumulator + currentValue)
      }
      return 0
    },
    pay() {
      return this.sumCash(this.listPayments)
    },
    pending() {
      const missing = this.currentOrder.grandTotal - this.pay
      if (this.pay > 0 && this.pay < this.currentOrder.grandTotal) {
        return missing
      }
      const pending = this.currentOrder.grandTotal <= this.pay ? 0 : this.currentOrder.grandTotal
      return pending
    },
    convertion() {
      return this.$store.getters.getDivideRateCollection
    },
    isMandatory() {
      const containerUuid = this.containerUuid
      const fieldsEmpty = this.$store.getters.getFieldsListEmptyMandatory({
        containerUuid,
        fieldsList: this.fieldsList
      })
      const amount = this.$store.getters.getValueOfField({
        containerUuid,
        columnName: 'PayAmt'
      })
      if (this.isEmptyValue(fieldsEmpty) && amount > 0) {
        return false
      }
      return true
    },
    validPay() {
      const containerUuid = this.containerUuid
      // filter by visible fields
      const fieldLogic = this.fieldsList.filter(field => field.isDisplayedFromLogic === true)
      const fieldsEmpty = this.$store.getters.getFieldsListEmptyMandatory({
        containerUuid,
        fieldsList: fieldLogic,
        isValidate: true
      })
      return !this.isEmptyValue(fieldsEmpty)
    },
    change() {
      const missing = this.pay - this.currentOrder.grandTotal
      if (this.pay > 0 && this.pay > this.currentOrder.grandTotal) {
        return missing
      }
      return 0
    },
    typeCurrency() {
      return this.$store.getters.getValueOfField({
        containerUuid: this.containerUuid,
        columnName: 'C_Currency_ID'
      })
    },
    currencyUuid() {
      return this.$store.getters.getValueOfField({
        containerUuid: 'Collection',
        columnName: 'C_Currency_ID_UUID'
      })
    },
    multiplyRate() {
      return this.$store.getters.getMultiplyRate
    },
    multiplyRateCollection() {
      return this.$store.getters.getMultiplyRateCollection
    },
    divideRate() {
      return this.$store.getters.getDivideRate
    },
    fieldAmount() {
      const amount = this.$store.getters.getValueOfField({
        containerUuid: this.containerUuid,
        columnName: 'PayAmt'
      })
      return amount * this.divideRate
    },
    validateConvertion() {
      if (this.fieldAmount <= this.pending) {
        return false
      }
      return true
    },
    displayCurrency() {
      return this.$store.getters.getListCurrency
    },
    convert() {
      return this.$store.getters.getConvertionPayment
    },
    updateOrderPaymentPos() {
      return this.$store.getters.getUpdatePaymentPos
    },
    dateRate() {
      return this.$store.getters.getConvertionRate.find(currency => {
        if (currency.id === this.typeCurrency) {
          return currency
        }
      })
    }
  },
  watch: {
    pending(value) {
      this.$store.commit('updateValueOfField', {
        containerUuid: this.containerUuid,
        columnName: 'PayAmt',
        value
      })
    },
    currencyUuid(value) {
      const listCurrency = this.$store.getters.getConvertionRate.find(currency => {
        if (currency.uuid === value) {
          return currency
        }
      })
      if (listCurrency === undefined) {
        this.$store.dispatch('conversionDivideRate', {
          conversionTypeUuid: this.currentPointOfSales.conversionTypeUuid,
          currencyFromUuid: this.pointOfSalesCurrency.uuid,
          conversionDate: this.formatDate(new Date()),
          currencyToUuid: value
        })
      }
    },
    convertAllPayment(value) {
      if (!this.isEmptyValue(value)) {
        this.allPayCurrency = this.pay / value
      }
      this.allPayCurrency = this.pay
    },
    isLoaded(value) {
      if (value) {
        this.$store.commit('updateValueOfField', {
          containerUuid: this.containerUuid,
          columnName: 'PayAmt',
          value: this.pending
        })
      }
    },
    dateRate(value) {
      if (value && !this.isEmptyValue(value.amountConvertion)) {
        this.$store.commit('updateValueOfField', {
          containerUuid: this.containerUuid,
          columnName: 'PayAmt',
          value: this.pending / value.amountConvertion
        })
      } else {
        this.$store.commit('updateValueOfField', {
          containerUuid: this.containerUuid,
          columnName: 'PayAmt',
          value: this.pending
        })
      }
    }
  },
  created() {
    this.$store.dispatch('addRateConvertion', this.pointOfSalesCurrency)
    this.unsubscribe = this.subscribeChanges()
    this.defaultValueCurrency()
  },
  methods: {
    formatNumber({ displayType, number }) {
      let fixed = 0
      // Amount, Costs+Prices, Number
      if (FIELDS_DECIMALS.includes(displayType)) {
        fixed = 2
      }
      return new Intl.NumberFormat().format(number.toFixed(fixed))
    },
    formatPrice,
    sumCash(cash) {
      let sum = 0
      if (cash) {
        cash.forEach((pay) => {
          sum += pay.amount
        })
      }
      return sum
    },
    notSubmitForm(event) {
      event.preventDefault()
      return false
    },
    addCollectToList() {
      const containerUuid = this.containerUuid
      const posUuid = this.currentPointOfSales.uuid
      const orderUuid = this.$route.query.action
      const bankUuid = this.$store.getters.getValueOfField({
        containerUuid,
        columnName: 'C_Bank_ID_UUID'
      })
      this.amontSend = this.$store.getters.getValueOfField({
        containerUuid,
        columnName: 'PayAmt'
      })
      const paymentDate = this.$store.getters.getValueOfField({
        containerUuid,
        columnName: 'DateTrx'
      })
      const tenderTypeCode = this.$store.getters.getValueOfField({
        containerUuid,
        columnName: 'TenderType'
      })
      const referenceNo = this.$store.getters.getValueOfField({
        containerUuid,
        columnName: 'ReferenceNo'
      })
      const currencyUuid = this.$store.getters.getValueOfField({
        containerUuid,
        columnName: 'C_Currency_ID_UUID'
      })
      const currencyId = this.$store.getters.getValueOfField({
        containerUuid,
        columnName: 'C_Currency_ID'
      })
      const currencyToPay = this.isEmptyValue(currencyUuid) ? currencyId : currencyUuid
      if (this.isEmptyValue(this.currencyDisplay(currencyToPay)) && this.currencyDisplay(currencyToPay).currencyUuid !== this.pointOfSalesCurrency.uuid) {
        this.amontSend = this.convert.divideRate * this.amontSend
      }
      if (this.sendToServer) {
        this.$store.dispatch('setPaymentBox', {
          posUuid,
          orderUuid,
          bankUuid,
          referenceNo,
          amount: this.amontSend * this.convertion,
          paymentDate,
          tenderTypeCode,
          currencyUuid
        })
      } else {
        this.$store.dispatch('createPayments', {
          posUuid,
          orderUuid,
          bankUuid,
          referenceNo,
          amount: this.amontSend * this.convertion,
          paymentDate,
          tenderTypeCode,
          currencyUuid: this.currencyDisplay(currencyToPay)
        })
      }
      this.addCollect()
    },
    updateServer(listPaymentsLocal) {
      const posUuid = this.currentPointOfSales.uuid
      const orderUuid = this.$route.query.action
      this.$store.dispatch('uploadOrdersToServer', { listPaymentsLocal, posUuid, orderUuid })
    },
    addCollect() {
      this.fieldsList.forEach(element => {
        if (element.columnName !== 'PayAmt') {
          this.$store.commit('updateValueOfField', {
            containerUuid: this.containerUuid,
            columnName: element.columnName,
            value: element.defaultValue
          })

          // set default logics
          this.$store.dispatch('changeDependentFieldsList', {
            field: element
          })
        }
        this.$store.commit('updateValueOfField', {
          containerUuid: this.containerUuid,
          columnName: 'C_Currency_ID',
          value: this.pointOfSalesCurrency.id
        })
        this.$store.commit('updateValueOfField', {
          parentUuid: '',
          containerUuid: 'Collection',
          columnName: 'DisplayColumn_TenderType',
          value: this.defaultLabel
        })
        this.$store.commit('updateValueOfField', {
          containerUuid: this.containerUuid,
          columnName: 'PayAmt',
          value: this.pending
        })
      })
      this.defaultValueCurrency()
      this.$store.commit('currencyDivideRateCollection', 1)
      this.$store.commit('currencyMultiplyRate', 1)
      this.cancel()
    },
    cancel() {
      this.fieldsList.forEach(element => {
        if (element.columnName !== 'PayAmt' || element.columnName !== 'C_Currency_ID') {
          this.$store.commit('updateValueOfField', {
            containerUuid: this.containerUuid,
            columnName: element.columnName,
            value: element.defaultValue
          })
        }
        this.$store.dispatch('changeDependentFieldsList', {
          field: element
        })
      })
      this.$store.commit('updateValueOfField', {
        containerUuid: this.containerUuid,
        columnName: 'C_Currency_ID',
        value: this.pointOfSalesCurrency.id
      })
      this.$store.commit('updateValueOfField', {
        containerUuid: this.containerUuid,
        columnName: 'PayAmt',
        value: this.pending
      })
      this.defaultValueCurrency()
      this.$store.commit('currencyDivideRateCollection', 1)
      this.$store.commit('currencyMultiplyRate', 1)
    },
    exit() {
      this.$store.commit('setShowPOSCollection', false)
    },
    getPriceApplyingDiscount(price, discount) {
      if (this.isEmptyValue(price)) {
        price = 0
      }
      if (this.isEmptyValue(discount)) {
        discount = 0
      }
      return price - discount * price / 100
    },
    getDiscountByPriceEntered(unitPrice, priceEntereded) {
      if (this.isEmptyValue(unitPrice)) {
        unitPrice = 0
      }
      if (this.isEmptyValue(priceEntereded)) {
        priceEntereded = 0
      }
      const discount = 100 - priceEntereded * 100 / unitPrice
      if (this.isEmptyValue(discount) || discount === -Infinity) {
        return 0
      }
      return discount
    },
    defaultValueCurrency() {
      this.$store.commit('updateValueOfField', {
        containerUuid: this.containerUuid,
        columnName: 'DisplayColumn_C_Currency_ID',
        value: this.pointOfSalesCurrency.iSOCode
      })
      this.$store.commit('updateValueOfField', {
        containerUuid: this.containerUuid,
        columnName: 'C_Currency_ID',
        value: this.pointOfSalesCurrency.id
      })
      this.$store.commit('updateValueOfField', {
        containerUuid: this.containerUuid,
        columnName: 'C_Currency_ID_UUID',
        value: this.pointOfSalesCurrency.uuid
      })
    },
    defaulTenderType() {
      this.$store.commit('updateValueOfField', {
        parentUuid: '',
        containerUuid: 'Collection',
        columnName: 'DisplayColumn_TenderType',
        value: this.$t('form.pos.collect.TenderType.cash')
      })
    },
    currencyDisplay(currency) {
      const display = this.displayCurrency.find(item => {
        if (item.currencyUuid === currency || (item.currencyId === currency)) {
          return item
        }
      })
      if (display) {
        return display
      }
      if (currency === this.pointOfSalesCurrency.id) {
        return this.pointOfSalesCurrency.uuid
      }
      return currency
    },
    convertCurrency() {
      const convertCurrency = this.currencyDisplay(100)
      this.$store.dispatch('convertionPayment', {
        conversionTypeUuid: this.currentPointOfSales,
        currencyFromUuid: this.pointOfSalesCurrency.uuid,
        currencyToUuid: convertCurrency.currencyUuid
      })
    },
    undoPatment() {
      const list = this.listPayments[this.listPayments.length - 1]
      const orderUuid = list.orderUuid
      const paymentUuid = list.uuid
      this.$store.dispatch('deletetPayments', {
        orderUuid,
        paymentUuid
      })
    },
    completePreparedOrder(payment) {
      const posUuid = this.currentPointOfSales.uuid
      const orderUuid = this.$route.query.action
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
        createPayments: !this.isEmptyValue(payment),
        payments: payment
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
    },
    formatDate(date) {
      let month = '' + (date.getMonth() + 1)
      let day = '' + date.getDate()
      const year = date.getFullYear()
      if (month.length < 2) {
        month = '0' + month
      }
      if (day.length < 2) {
        day = '0' + day
      }
      return [year, month, day].join('-')
    },
    subscribeChanges() {
      return this.$store.subscribe((mutation, state) => {
        if (mutation.type === 'updateValueOfField') {
          if (mutation.payload.columnName === 'DisplayColumn_TenderType') {
            this.labelTenderType = mutation.payload.value
          }
        }
      })
    }
  }
}
</script>

<style scoped>
  .stylefullPayment {
    font-size: 15px;
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif
  }
  .el-button--text {
    border-color: transparent;
    color: #1890ff;
    background: transparent;
    padding-left: 0;
    padding-right: 0;
    padding-bottom: 0px;
    padding-top: 0px;
  }
  .el-card__header {
    padding: 18px 20px;
    border-bottom: 1px solid #e6ebf5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    background-color: rgb(245, 247, 250);
  }
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
  .el-card__body {
    padding-top: 0px !important;
    padding-right: 0px!important;
    padding-bottom: 20px;
    padding-left: 10px!important;
    height: 100%!important;
  }
  .el-card__header {
    padding: 0px 20px;
    border-bottom: 1px solid #e6ebf5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
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
  .el-tag--medium {
    height: 34px;
    line-height: 32px;
  }
  .el-col {
    border-radius: 4px;
  }
</style>
