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
                      :amount="order.grandTotal"
                      :currency="currencyPoint"
                    />
                    <el-button slot="reference" type="text" style="color: #000000;font-weight: 604!important;font-size: 100%;">
                      {{ formatPrice(order.grandTotal, currencyPoint.iSOCode) }}
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
            <el-button type="danger" icon="el-icon-close" @click="cancel" />
            <el-button type="primary" :disabled="isValidForPay || validateConvertion" icon="el-icon-plus" @click="addCollectToList(paymentBox)" />
          </samp>
        </el-header>
        <el-main style="padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px;">
          <type-collection
            v-if="isLoaded"
            :is-add-type-pay="paymentBox"
            :currency="currencyPoint"
          />
          <div
            v-else
            key="form-loading"
            v-loading="!isLoaded"
            :element-loading-text="$t('notifications.loading')"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            class="loading-panel"
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
                        :amount="order.grandTotal"
                        :currency="currencyPoint"
                      />
                      <el-button slot="reference" type="text" style="color: #000000;font-weight: 604!important;font-size: 100%;">
                        {{ formatPrice(order.grandTotal, currencyPoint.iSOCode) }}
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
      currencyConversion: 1,
      convertAllPayment: 1,
      allPayCurrency: 0,
      fieldsList: fieldsListCollection
    }
  },
  computed: {
    isPaymentBox() {
      return this.$store.getters.getPaymentBox
    },
    paymentBox() {
      const payment = this.isPaymentBox.filter(pay => {
        return pay.isVisible
      })
      if (this.isEmptyValue(payment)) {
        return []
      }
      return payment
    },
    cashPayment() {
      const cash = this.isPaymentBox.filter(pay => {
        return pay.tenderType === 'X'
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
      const cash = this.pending === 0 ? true : this.isMandatory
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
        if (allPay <= this.order.grandTotal) {
          return false
        }
        return true
      }
      return false
    },
    isCashAmt() {
      const cashAmt = this.paymentBox.map(item => {
        if (item.tenderType === 'X') {
          return item.payAmt
        }
        return 0
      })
      if (!this.isEmptyValue(cashAmt)) {
        return cashAmt.reduce((accumulator, currentValue) => accumulator + currentValue)
      }
      return 0
    },
    isOtherPayAmt() {
      const cashAmt = this.paymentBox.map(item => {
        if (item.tenderType !== 'X') {
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
      return this.sumCash(this.isPaymentBox)
    },
    pending() {
      const missing = this.order.grandTotal - this.pay
      if (this.pay > 0 && this.pay < this.order.grandTotal) {
        return missing
      }
      const pending = this.order.grandTotal <= this.pay ? 0 : this.order.grandTotal
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
    change() {
      const missing = this.pay - this.order.grandTotal
      if (this.pay > 0 && this.pay > this.order.grandTotal) {
        return missing
      }
      return 0
    },
    order() {
      return this.$store.getters.getFindOrder
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
      return this.$store.getters.getFindOrder
    },
    typeCurrency() {
      return this.$store.getters.getValueOfField({
        containerUuid: this.containerUuid,
        columnName: 'C_Currency_ID'
      })
    },
    currencyUuid() {
      return this.$store.getters.getValueOfField({
        containerUuid: this.containerUuid,
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
    converCurrency() {
      return this.$store.getters.getValueOfField({
        containerUuid: 'Collection-Convert-Amount',
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
    }
    // fieldpending() {
    //   return this.pending / this.divideRate
    // }

  },
  watch: {
    // fieldpending(value) {
    //   this.$store.commit('updateValueOfField', {
    //     containerUuid: this.containerUuid,
    //     columnName: 'PayAmt',
    //     value: value
    //   })
    // },
    pending(value) {
      this.$store.commit('updateValueOfField', {
        containerUuid: this.containerUuid,
        columnName: 'PayAmt',
        value
      })
    },
    currencyUuid(value) {
      this.$store.dispatch('conversionDivideRate', {
        conversionTypeUuid: this.$store.getters.getCurrentPOS.conversionTypeUuid,
        currencyFromUuid: this.currencyPoint.uuid,
        currencyToUuid: value,
        conversionDate: this.currentOrder.dateOrdered
      })
    },
    convertAllPayment(value) {
      if (!this.isEmptyValue(value)) {
        this.allPayCurrency = this.pay / value
      }
      this.allPayCurrency = this.pay
    },
    converCurrency(value) {
      this.$store.dispatch('conversionMultiplyRate', {
        conversionTypeUuid: this.$store.getters.getCurrentPOS.conversionTypeUuid,
        currencyFromUuid: this.currencyPoint.uuid,
        currencyToUuid: value,
        conversionDate: this.currentOrder.dateOrdered
      })
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
    this.defaultValueCurrency()
  },
  methods: {
    formatDate,
    formatPrice,
    sumCash(cash) {
      let sum = 0
      cash.forEach((pay) => {
        sum += pay.payAmt
      })
      return sum
    },
    notSubmitForm(event) {
      event.preventDefault()
      return false
    },
    displayTenderType(type) {
      let label
      switch (type) {
        case 'A':
          label = 'Depósito directo'
          break
        case 'C':
          label = 'Tarjeta de crédito'
          break
        case 'D':
          label = 'Débito directo'
          break
        case 'K':
          label = 'Cheque'
          break
        case 'M':
          label = 'Nota de crédito'
          break
        case 'P':
          label = 'Pago móvil interbancario'
          break
        case 'T':
          label = 'Cuenta'
          break
        case 'X':
          label = 'Efectivo'
          break
        case 'Z':
          label = 'Zelle'
          break
      }
      return label
    },
    addCollectToList() {
      const containerUuid = this.containerUuid
      const amount = this.$store.getters.getValueOfField({
        containerUuid,
        columnName: 'PayAmt'
      })
      const date = this.$store.getters.getValueOfField({
        containerUuid,
        columnName: 'DateTrx'
      })
      const typePay = this.$store.getters.getValueOfField({
        containerUuid,
        columnName: 'TenderType'
      })
      const referenceNo = this.$store.getters.getValueOfField({
        containerUuid,
        columnName: 'ReferenceNo'
      })
      let currency = this.$store.getters.getValueOfField({
        containerUuid,
        columnName: 'DisplayColumn_C_Currency_ID'
      })
      const currencyId = this.$store.getters.getValueOfField({
        containerUuid,
        columnName: 'C_Currency_ID'
      })
      if (currency === this.currencyPoint.id) {
        currency = this.currencyPoint.iSOCode
      }

      const displayType = this.displayTenderType(typePay)
      this.$store.dispatch('setPaymentBox', {
        isVisible: true,
        quantityCahs: amount,
        payAmt: amount * this.divideRate,
        tenderType: typePay,
        referenceNo: referenceNo,
        dateTrx: date,
        currency: {
          currency,
          id: currencyId
        },
        displayTenderType: displayType
      })
      this.addCollect()
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
          containerUuid: this.containerUuid,
          columnName: 'PayAmt',
          value: this.pending
        })
      })
      this.defaultValueCurrency()
      this.$store.dispatch('conversionDivideRate', 1)
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
    }
  }
}
</script>

<style scoped>
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
