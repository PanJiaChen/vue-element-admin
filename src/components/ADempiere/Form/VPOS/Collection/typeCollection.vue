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
    <el-main style="padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px;">
      <el-row :gutter="24">
        <template v-for="(value, key) in isAddTypePay">
          <el-col :key="key" :span="12" style="padding-left: 5px; padding-right: 5px;">
            <el-card :body-style="{ padding: '0px' }">
              <el-row>
                <el-col :span="6" style="padding: 10px">
                  <img src="@/image/ADempiere/pos/no-image.jpg" fit="contain" class="image">
                </el-col>
                <el-col :span="18">
                  <el-button
                    type="text"
                    icon="el-icon-close"
                    style="float: right; margin-right: 10px; color: red; padding-top: 10px;"
                    @click="deleteCollect(value)"
                  />
                  <div style="padding-right: 10px; padding-top: 10%;">
                    <div class="top clearfix">
                      <span>
                        {{
                          tenderTypeFind({
                            currentPayment: value.tenderTypeCode,
                            listTypePayment: labelTypesPayment
                          })
                        }}
                      </span>
                    </div>
                    <div class="bottom clearfix" style="margin-top: 0px !important!">
                      <el-button
                        type="text"
                        class="button"
                        style="color: rgb(50, 54, 58); font-size: 13px; text-align: left; float: unset; padding-top: 5px;"
                      >
                        {{ value.documentNo }}
                      </el-button>

                      <el-button
                        v-if="!isEmptyValue(value.paymentDate)"
                        type="text"
                        class="button"
                        style="color: rgb(50, 54, 58); font-size: 13px; text-align: left; float: unset; padding-top: 5px;"
                      >
                        {{ formatDate(value.paymentDate) }}
                      </el-button>
                      <div
                        v-if="loginCovertion"
                        slot="header"
                        class="clearfix"
                        style="padding-bottom: 20px;"
                      >
                        <p class="total">
                          <b style="float: right;">
                            {{ formatPrice(value.amount, currency.iSOCode) }}
                          </b>
                        </p>
                        <br>
                        <p v-if="!isEmptyValue(value.currencyConvertion)" class="total">
                          <b style="float: right;">
                            {{ formatPrice(value.amountConvertion, value.currencyConvertion.iSOCode) }}
                          </b>
                        </p>
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
        </template>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import {
  formatDate,
  formatPrice
} from '@/utils/ADempiere/valueFormat.js'
import {
  requestGetConversionRate
} from '@/api/ADempiere/form/point-of-sales.js'
import posMixin from '@/components/ADempiere/Form/VPOS/posMixin.js'

export default {
  name: 'TypeCollection',
  mixins: [
    posMixin
  ],
  props: {
    isAddTypePay: {
      type: Array,
      default: undefined
    },
    openPanel: {
      type: Boolean,
      default: false
    },
    currency: {
      type: Object,
      default: undefined
    },
    listTypesPayment: {
      type: Object,
      default: undefined
    },
    listPaymentType: {
      type: Object,
      default: undefined
    },
    isLoaded: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      conevertion: 0,
      loginCovertion: false,
      labelTypesPayment: []
    }
  },
  computed: {
    typesPayment() {
      return this.$store.getters.getListsPaymentTypes
    },
    listCurrency() {
      return this.$store.getters.getListCurrency
    },
    conevertionAmount() {
      return this.$store.getters.getConvertionPayment
    },
    currentPointOfSales() {
      return this.$store.getters.posAttributes.currentPointOfSales
    },
    // Validate if there is a payment in a different type of currency to the point
    paymentCurrency() {
      return this.currentPointOfSales.currentOrder.listPayments.payments.find(pay => pay.currencyUuid !== this.currency.uuid)
    }
  },
  watch: {
    listPaymentType(value) {
      if (!this.isEmptyValue(value.reference)) {
        this.tenderTypeDisplaye({
          tableName: value.reference.tableName,
          query: value.reference.query
        })
      }
    },
    labelTypesPayment(value) {
      console.log(value)
    }
  },
  created() {
    if (!this.isEmptyValue(this.isAddTypePay)) {
      this.convertingPaymentMethods()
    }
    if (!this.isEmptyValue(this.listPaymentType.reference)) {
      this.tenderTypeDisplaye({
        tableName: this.listPaymentType.reference.tableName,
        query: this.listPaymentType.reference.query
      })
    }
  },
  methods: {
    formatDate,
    formatPrice,
    // If there are payments in another currency, search for conversion
    convertingPaymentMethods() {
      if (!this.isEmptyValue(this.paymentCurrency)) {
        requestGetConversionRate({
          conversionTypeUuid: this.currentPointOfSales.conversionTypeUuid,
          currencyFromUuid: this.currency.uuid,
          currencyToUuid: this.paymentCurrency.currencyUuid
        })
          .then(response => {
            this.$store.getters.posAttributes.currentPointOfSales.currentOrder.listPayments.payments.forEach(element => {
              console.log({ response, element })
              if (element.currencyUuid !== this.pointOfSalesCurrency.uuid) {
                element.multiplyRate = element.amount / response.multiplyRate
                element.amountConvertion = element.amount / response.divideRate
                element.divideRate = response.multiplyRate
                element.currencyConvertion = response.currencyTo
              }
            })
            this.$store.commit('setListPayments', {
              payments: this.isAddTypePay
            })
          })
          .catch(error => {
            console.warn(`conversion: ${error.message}. Code: ${error.code}.`)
          })
      }
      this.loginCovertion = true
    },
    getImageFromTenderType(typePay) {
      // A: Direct Deposit: ACH Automatic Clearing House
      // C: Credit Card:
      // D: Direct Debit:
      // K: Check:
      // M: Credit Memo:
      // P: Mobile Payment Interbank:
      // T: Account:
      // X: Cash:
      // Z: Zelle:
      let image = ''
      switch (typePay) {
        case 'A':
          image = 'DirectDeposit2'
          break
        case 'M':
          image = 'CreditMemo'
          break
        case 'K':
          image = 'check2'
          break
        case 'X':
          image = 'cash'
          break
        case 'Z':
          image = 'zelle'
          break
        case 'T':
          image = 'Account'
          break
        case 'P':
          image = 'paymobile'
          break
        case 'C':
          image = 'CreditCard'
          break
        case 'D':
          image = 'DirectDebit'
          break
      }
      return require('@/image/' + image + '.jpg')
    },
    deleteCollect(key) {
      const orderUuid = key.orderUuid
      const paymentUuid = key.uuid
      this.$store.dispatch('deletetPayments', {
        orderUuid,
        paymentUuid
      })
    },
    // Payment card label
    tenderTypeDisplaye({
      tableName,
      query
    }) {
      if (!this.isEmptyValue(tableName)) {
        this.$store.dispatch('getLookupListFromServer', {
          tableName,
          query
        })
          .then(response => {
            console.log(response)
            this.labelTypesPayment = response
          })
      }
    }
  }
}
</script>

<style scoped>
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
