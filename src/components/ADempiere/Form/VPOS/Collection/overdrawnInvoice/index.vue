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
            <span>{{ $t('form.pos.collect.overdrawnInvoice.above') }}</span>
            <span style="float: right;text-align: end">
              <b>{{ $t('form.pos.collect.overdrawnInvoice.dailyLimit') }}: {{ formatPrice(maximumDailyRefundAllowed, currency.iSOCode) }} | {{ formatPrice(0, isoCode) }} | {{ $t('form.pos.collect.overdrawnInvoice.available') }}: {{ formatPrice(maximumDailyRefundAllowed, currency.iSOCode) }} | {{ formatPrice(0, isoCode) }}</b> <br>
              <b>{{ $t('form.pos.collect.overdrawnInvoice.customerLimit') }}: {{ formatPrice(maximumRefundAllowed, currency.iSOCode) }} | {{ formatPrice(0, isoCode) }} </b>
            </span>
          </div>
          <div v-if="optionTypePay === 0" class="text item">
            <el-row :gutter="12">
              <el-col v-for="(payment, index) in paymentTypeList" :key="index" :span="8">
                <div @click="optionTypePay = payment.key">
                  <el-card shadow="hover">
                    <div slot="header" class="clearfix" style="text-align: center;">
                      <span>
                        {{ payment.name }}
                      </span>
                    </div>
                    <p style="text-align: center;"> Nombre </p>
                    <p style="text-align: center;"> Cedula </p>
                    <p style="text-align: center;"> Telefono </p>
                    <p style="text-align: center;"> Banco </p>
                    <p style="text-align: center;"> Descripcion </p>
                  </el-card>
                </div>
              </el-col>
            </el-row>
          </div>
          <div v-if="optionTypePay !== 0" class="text item">
            <component
              :is="componentRender"
              :change="change"
            />
          </div>
        </el-card>
      </div>
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
          v-if="optionTypePay !== 0"
          type="info"
          class="custom-button-create-bp"
          icon="el-icon-back"
          @click="optionTypePay = 0"
        />
        <el-button
          type="danger"
          class="custom-button-create-bp"
          icon="el-icon-close"
          @click="close"
        />
        <el-button
          type="primary"
          class="custom-button-create-bp"
          icon="el-icon-check"
          @click="success"
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

export default {
  name: 'OverdrawnInvoice',
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
      fieldsList: fieldsListOverdrawnInvoice,
      currentFieldCurrency: '',
      currentPaymentType: ''
    }
  },
  computed: {
    componentRender() {
      let typePay
      switch (this.optionTypePay) {
        case 'P':
          typePay = () => import('./paymentTypeChange/MobilePayment.vue')
          break
        case 'X':
          typePay = () => import('./paymentTypeChange/cash/index.vue')
          break
        case 'A':
          typePay = () => import('./paymentTypeChange/ACH/index.vue')
          break
        case 'Z':
          typePay = () => import('./paymentTypeChange/zelle/index.vue')
          break
      }
      return typePay
    },
    showDialogo() {
      return this.$store.state['pointOfSales/payments/index'].dialogoInvoce.show
    },
    caseOrder() {
      return this.$store.state['pointOfSales/payments/index'].dialogoInvoce.type
    },
    isoCode() {
      return this.$store.getters.posAttributes.currentPointOfSales.displayCurrency.iso_code
    },
    maximumDailyRefundAllowed() {
      return this.$store.getters.posAttributes.currentPointOfSales.maximumDailyRefundAllowed
    },
    maximumRefundAllowed() {
      return this.$store.getters.posAttributes.currentPointOfSales.maximumRefundAllowed
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
      return this.$store.getters.getPaymentTypeList
    }
  },
  methods: {
    formatPrice,
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
    },
    close() {
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
          if (this.isEmptyValue(this.emptyFieldGiftCard)) {
            this.completePreparedOrder(posUuid, orderUuid, payments)
            this.$store.commit('dialogoInvoce', { show: false, success: true })
          } else {
            this.$message({
              type: 'warn',
              message: this.$t('notifications.mandatoryFieldMissing') + this.emptyFieldGiftCard,
              duration: 1500,
              showClose: true
            })
          }
          break
        case 3:
          if (this.isEmptyValue(this.emptyMandatoryFields)) {
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
              .catch(error => {
                this.$message({
                  type: 'error',
                  message: error.message,
                  showClose: true
                })
              })
            this.$store.commit('dialogoInvoce', { show: false, success: true })
          } else {
            this.$message({
              type: 'warn',
              message: this.$t('notifications.mandatoryFieldMissing') + this.emptyMandatoryFields,
              duration: 1500,
              showClose: true
            })
          }
          break
        default:
          this.completePreparedOrder(posUuid, orderUuid, payments)
          this.$store.commit('dialogoInvoce', { show: false, success: true })
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
