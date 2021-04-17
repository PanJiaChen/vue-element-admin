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
                            listTypePayment: typesPayment
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
                        v-if="currencyFind({
                          currencyCurrent: value.currencyUuid,
                          listCurrency: listCurrency,
                          defaultCurrency: currency
                        }).currencyDisplay !== currency.iSOCode"
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
                        <p class="total">
                          <b style="float: right;">
                            {{
                              formatPrice(
                                (amountConvertion(value)),
                                currencyFind({
                                  currencyCurrent: value.currencyUuid,
                                  listCurrency: listCurrency,
                                  defaultCurrency: currency
                                }).currencyDisplay
                              )
                            }}
                          </b>
                        </p>
                      </div>
                      <div v-else slot="header" class="clearfix">
                        <p class="total">
                          <b style="float: right;padding-top: 18px;padding-bottom: 20px;">
                            {{ formatPrice(value.amount, currency.iSOCode) }}
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

export default {
  name: 'TypeCollection',
  props: {
    isAddTypePay: {
      type: Array,
      default: undefined
    },
    currency: {
      type: Object,
      default: undefined
    },
    listTypesPayment: {
      type: Object,
      default: undefined
    }
  },
  data() {
    return {
      conevertion: 0
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
    }
  },
  watch: {
    listTypesPayment(value) {
      if (!this.isEmptyValue(value) && this.typesPayment.length <= 1) {
        this.tenderTypeDisplaye(value)
      }
    }
  },
  methods: {
    formatDate,
    formatPrice,
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
    amountConvertion(payment) {
      return payment.amount * this.conevertionAmount.multiplyRate
    },
    tenderTypeDisplaye(value) {
      if (!this.isEmptyValue(value.reference)) {
        const tenderType = value.reference
        if (!this.isEmptyValue(tenderType)) {
          this.$store.dispatch('getLookupListFromServer', {
            tableName: tenderType.tableName,
            query: tenderType.query,
            filters: []
          })
            .then(response => {
              this.$store.dispatch('tenderTypeDisplaye', response)
            })
        }
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
