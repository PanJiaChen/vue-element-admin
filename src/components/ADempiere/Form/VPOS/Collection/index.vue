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
                      :currency="currencyPoint"
                    />
                    <el-button slot="reference" type="text" style="color: #000000;font-weight: 604!important;font-size: 100%;">
                      {{ formatPrice(currentOrder.grandTotal, currencyPoint.iSOCode) }}
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
                      :currency="currencyPoint"
                    />
                    <el-button slot="reference" type="text" style="color: #000000;font-weight: 604!important;font-size: 100%;">
                      {{ formatPrice(pending, currencyPoint.iSOCode) }}
                    </el-button>
                  </el-popover>
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
              >
                <el-row>
                  <el-col v-for="(field, index) in fieldsList" :key="index" :span="8">
                    <field-definition
                      :key="field.columnName"
                      :metadata-field="field"
                    />
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </el-card>
          <samp style="float: right;padding-right: 10px;">
            <el-button type="danger" icon="el-icon-close" @click="exit" />
            <el-button type="info" icon="el-icon-minus" @click="undoPatment" />
            <el-button type="primary" :disabled="validPay || addPay" icon="el-icon-plus" @click="addCollectToList(paymentBox)" />
            <el-button type="success" :disabled="validateCompleteCollection" icon="el-icon-shopping-cart-full" />
          </samp>
        </el-header>
        <el-main style="padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px;">
          <type-collection
            :is-add-type-pay="listPayments"
            :currency="currencyPoint"
            :list-types-payment="fieldsList[2]"
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
                        :currency="currencyPoint"
                      />
                      <el-button slot="reference" type="text" style="color: #000000;font-weight: 604!important;font-size: 100%;">
                        {{ formatPrice(currentOrder.grandTotal, currencyPoint.iSOCode) }}
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
                        :currency="currencyPoint"
                      />
                      <el-button slot="reference" type="text" style="color: #000000;font-weight: 604!important;font-size: 100%;">
                        {{ formatPrice(pending, currencyPoint.iSOCode) }}
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
                        :currency="currencyPoint"
                      />
                      <el-button slot="reference" type="text" style="color: #000000;font-weight: 604!important;font-size: 100%;">
                        {{ formatPrice(pay, currencyPoint.iSOCode) }}
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
                        :currency="currencyPoint"
                      />
                      <el-button slot="reference" type="text" style="color: #000000;font-weight: 604!important;font-size: 100%;">
                        {{ formatPrice(change, currencyPoint.iSOCode) }}
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
import fieldsListCollection from './fieldsListCollection.js'
import typeCollection from '@/components/ADempiere/Form/VPOS/Collection/typeCollection'
import convertAmount from '@/components/ADempiere/Form/VPOS/Collection/convertAmount/index'
import { formatDate, formatPrice } from '@/utils/ADempiere/valueFormat.js'

export default {
  name: 'Collection',
  components: {
    typeCollection,
    convertAmount
  },
  mixins: [
    formMixin
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
      // return false
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
      const listServer = this.$store.getters.getListPayments
      if (!this.sendToServer) {
        return listServer.reverse()
      }
      return listLocal
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
      const fieldsEmpty = this.$store.getters.getFieldsListEmptyMandatory({
        containerUuid,
        fieldsList: this.fieldsList
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
    currencyPoint() {
      const currency = this.$store.getters.getCurrentPOS
      if (!this.isEmptyValue(currency)) {
        return currency.priceList.currency
      }
      return {
        uuid: '',
        iSOCode: '',
        curSymbol: '',
        id: 0
      }
    },
    currentOrder() {
      return this.$store.getters.getOrder
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
    displayeTypeCurrency() {
      return this.$store.getters.getValueOfField({
        containerUuid: this.containerUuid,
        columnName: 'DisplayColumn_C_Currency_ID'
      })
    },
    multiplyRate() {
      return this.$store.getters.getMultiplyRate
    },
    multiplyRateCollection() {
      return this.$store.getters.getMultiplyRateCollection
    },
    converCurrency() {
      return this.$store.getters.getValueOfField({
        containerUuid: 'Collection',
        columnName: 'C_Currency_ID_UUID'
      })
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
    fieldpending() {
      return this.pending
    },
    displayCurrency() {
      return this.$store.getters.getListCurrency
    },
    convert() {
      return this.$store.getters.getConvertionPayment
    }
  },
  watch: {
    fieldpending(value) {
      this.$store.commit('updateValueOfField', {
        containerUuid: this.containerUuid,
        columnName: 'PayAmt',
        value: value
      })
    },
    pending(value) {
      this.$store.commit('updateValueOfField', {
        containerUuid: this.containerUuid,
        columnName: 'PayAmt',
        value
      })
    },
    currencyUuid(value) {
      if (!this.isEmptyValue(value)) {
        this.$store.dispatch('conversionDivideRate', {
          conversionTypeUuid: this.$store.getters.getCurrentPOS.conversionTypeUuid,
          currencyFromUuid: this.currencyPoint.uuid,
          currencyToUuid: value
        })
      }
      if (!this.isEmptyValue(value)) {
        this.$store.dispatch('conversionMultiplyRate', {
          containerUuid: 'Collection',
          conversionTypeUuid: this.$store.getters.getCurrentPOS.conversionTypeUuid,
          currencyFromUuid: this.currencyPoint.uuid,
          currencyToUuid: value
        })
      } else {
        this.$store.commit('currencyMultiplyRateCollection', 1)
      }
    },
    convertAllPayment(value) {
      if (!this.isEmptyValue(value)) {
        this.allPayCurrency = this.pay / value
      }
      this.allPayCurrency = this.pay
    },
    converCurrency(value) {
      if (!this.isEmptyValue(value)) {
        this.$store.dispatch('conversionMultiplyRate', {
          containerUuid: 'Collection',
          conversionTypeUuid: this.$store.getters.getCurrentPOS.conversionTypeUuid,
          currencyFromUuid: this.currencyPoint.uuid,
          currencyToUuid: value
        })
      } else {
        this.$store.commit('currencyMultiplyRate', 1)
      }
    },
    isLoaded(value) {
      if (value) {
        this.$store.commit('updateValueOfField', {
          containerUuid: this.containerUuid,
          columnName: 'PayAmt',
          value: this.pending
        })
      }
    }
  },
  created() {
    this.unsubscribe = this.subscribeChanges()
    this.defaultValueCurrency()
  },
  mounted() {
    setTimeout(() => {
      this.convertCurrency()
    }, 2000)
  },
  methods: {
    formatDate,
    formatPrice,
    sumCash(cash) {
      let sum = 0
      cash.forEach((pay) => {
        sum += pay.amount
      })
      return sum
    },
    notSubmitForm(event) {
      event.preventDefault()
      return false
    },
    addCollectToList() {
      const containerUuid = this.containerUuid
      const posUuid = this.$store.getters.getCurrentPOS.uuid
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
      if (this.currencyDisplay(currencyToPay).currencyUuid !== this.currencyPoint.uuid) {
        this.amontSend = this.convert.divideRate * this.amontSend
      }
      if (this.sendToServer) {
        this.$store.dispatch('setPaymentBox', {
          posUuid,
          orderUuid,
          bankUuid,
          referenceNo,
          amount: this.amontSend,
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
          amount: this.amontSend,
          paymentDate,
          tenderTypeCode,
          currencyUuid: this.currencyDisplay(currencyToPay).currencyUuid
        })
      }
      this.addCollect()
    },
    updateServer(listPaymentsLocal) {
      // const listLocal = this.$store.getters.getPaymentBox
      const posUuid = this.$store.getters.getCurrentPOS.uuid
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
          value: this.currencyPoint.id
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
      this.$store.dispatch('conversionDivideRate', 1)
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
        value: this.currencyPoint.id
      })
      this.$store.commit('updateValueOfField', {
        containerUuid: this.containerUuid,
        columnName: 'PayAmt',
        value: this.pending
      })
      this.defaultValueCurrency()
      this.$store.dispatch('conversionDivideRate', 1)
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
        value: this.currencyPoint.iSOCode
      })
      this.$store.commit('updateValueOfField', {
        containerUuid: this.containerUuid,
        columnName: 'C_Currency_ID',
        value: this.currencyPoint.id
      })
      this.$store.commit('updateValueOfField', {
        containerUuid: this.containerUuid,
        columnName: 'C_Currency_ID_UUID',
        value: this.currencyPoint.uuid
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
      return currency
    },
    convertCurrency() {
      const convertCurrency = this.currencyDisplay(100)
      this.$store.dispatch('convertionPayment', {
        conversionTypeUuid: this.$store.getters.getCurrentPOS.conversionTypeUuid,
        currencyFromUuid: this.currencyPoint.uuid,
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
