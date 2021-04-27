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
    <div style="text-align: center">
      <b>{{ $t('form.pos.title') }}</b>
      <br>
      {{ $t('form.pos.optionsPoinSales.title') }}
    </div>
    <modal-dialog
      :parent-uuid="processPos"
      :container-uuid="processPos"
      panel-type="From"
    />
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item :title="$t('form.pos.optionsPoinSales.salesOrder.title')" name="salesOrder">
        <el-row :gutter="12" style="padding-right: 10px;">
          <el-col :span="size">
            <el-card shadow="hover">
              <p
                :style="isEmptyValue($route.query.action) ? 'cursor: not-allowed; text-align: center !important; color: gray;' : blockOption"
                @click="newOrder"
              >
                <i class="el-icon-news" />
                <br>
                {{ $t('form.pos.optionsPoinSales.salesOrder.newOrder') }}
              </p>
            </el-card>
          </el-col>

          <el-col :span="size">
            <el-card shadow="hover">
              <el-popover
                placement="right"
                width="800"
                trigger="click"
                @show="seeOrderList"
                @hide="showFieldListOrder = !showFieldListOrder"
              >
                <orders-list
                  :parent-metadata="metadata"
                  :show-field="showFieldListOrder"
                />
                <p
                  slot="reference"
                  :style="blockOption"
                >
                  <el-button
                    type="text"
                    @click="showFieldListOrder = !showFieldListOrder"
                  >
                    <svg-icon icon-class="list" />
                    <br>
                    {{ $t('form.pos.optionsPoinSales.salesOrder.ordersHistory') }}
                  </el-button>
                </p>
                <!-- <p
                  slot="reference"
                  :style="blockOption"
                >
                  <svg-icon icon-class="list" />
                  <br>
                  {{ $t('form.pos.optionsPoinSales.salesOrder.ordersHistory') }}
                </p> -->
              </el-popover>
            </el-card>
          </el-col>

          <el-col :span="size">
            <el-card shadow="hover">
              <p
                :style="blockOption"
                @click="generateImmediateInvoice"
              >
                <i class="el-icon-document-add" />
                <br>
                {{ $t('form.pos.optionsPoinSales.salesOrder.generateImmediateInvoice') }}
              </p>
            </el-card>
          </el-col>

          <el-col :span="size">
            <el-card shadow="hover">
              <p
                :style="blockOption"
                @click="completePreparedOrder"
              >
                <i class="el-icon-success" />
                <br>
                {{ $t('form.pos.optionsPoinSales.salesOrder.completePreparedOrder') }}
              </p>
            </el-card>
          </el-col>

          <el-col :span="size">
            <el-card shadow="hover">
              <p
                :style="blockOption"
                @click="reverseSalesTransaction"
              >
                <i class="el-icon-error" />
                <br>
                {{ $t('form.pos.optionsPoinSales.salesOrder.cancelSaleTransaction') }}
              </p>
            </el-card>
          </el-col>

          <el-col :span="size">
            <el-card shadow="hover">
              <p
                :style="blockOption"
                @click="withdrawal"
              >
                <i class="el-icon-document-remove" />
                <br>
                {{ $t('form.pos.optionsPoinSales.salesOrder.createPos') }}
              </p>
            </el-card>
          </el-col>

          <el-col :span="size">
            <el-card shadow="hover">
              <p
                :style="blockOption"
                @click="printOrder"
              >
                <i class="el-icon-printer" />
                <br>
                {{ $t('form.pos.optionsPoinSales.salesOrder.print') }}
              </p>
            </el-card>
          </el-col>

          <el-col :span="size">
            <el-card shadow="hover">
              <p
                :style="blockOption"
                @click="createNewCustomerReturnOrder"
              >
                <i class="el-icon-refresh-left" />
                <br>
                Crear Nueva Orden de Devolución
              </p>
            </el-card>
          </el-col>
          <el-col :span="size">
            <el-card shadow="hover">
              <p
                :style="blockOption"
                @click="copyOrder "
              >
                <i class="el-icon-document-copy" />
                <br>
                {{ $t('form.pos.optionsPoinSales.salesOrder.copyOrder') }}
              </p>
            </el-card>
          </el-col>
          <el-col :span="size">
            <el-card shadow="hover">
              <p
                :style="blockOption"
                @click="deleteOrder"
              >
                <i class="el-icon-close" />
                <br>
                {{ $t('form.pos.optionsPoinSales.salesOrder.cancelOrder') }}
              </p>
            </el-card>
          </el-col>
        </el-row>
      </el-collapse-item>

      <el-collapse-item :title="$t('form.pos.optionsPoinSales.cashManagement.title')" name="cashManagement">
        <el-row :gutter="12" style="padding-right: 10px;">
          <el-col :span="size">
            <el-card shadow="hover">
              <p
                :style="blockOption"
              >
                <i class="el-icon-sell" />
                <br>
                {{ $t('form.pos.optionsPoinSales.cashManagement.cashOpening') }}
              </p>
            </el-card>
          </el-col>
          <el-col :span="size">
            <el-card shadow="hover">
              <p
                :style="blockOption"
              >
                <i class="el-icon-money" />
                <br>
                {{ $t('form.pos.optionsPoinSales.cashManagement.cashwithdrawal') }}
              </p>
            </el-card>
          </el-col>
          <el-col :span="size">
            <el-card shadow="hover">
              <p
                :style="blockOption"
                @click="cashClosing"
              >
                <i class="el-icon-sold-out" />
                <br>
                {{ $t('form.pos.optionsPoinSales.cashManagement.closeBox') }}
              </p>
            </el-card>
          </el-col>
        </el-row>
      </el-collapse-item>

      <el-collapse-item :title="$t('form.pos.optionsPoinSales.generalOptions.title')" name="generalOptions">
        <el-row :gutter="12" style="padding-right: 10px;">
          <el-col :span="size">
            <el-card shadow="hover">
              <el-dropdown trigger="click" style="padding-top: 8px; color: black;" @command="changePos">
                <p
                  :style="blockOption"
                >
                  <i class="el-icon-mobile-phone" />
                  <br>
                  {{ $t('form.pos.optionsPoinSales.generalOptions.changePos') }}
                </p>
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
            </el-card>
          </el-col>

          <el-col :span="8">
            <el-card shadow="hover">
              <el-popover
                placement="right"
                trigger="click"
                width="800"
              >
                <list-product-price
                  :is-selectable="false"
                  popover-name="isShowPopoverMenu"
                />
                <div
                  slot="reference"
                  :style="blockOption"
                  @click="isShowProductsPriceList = !isShowProductsPriceList"
                >
                  <svg-icon icon-class="shopping" />
                  <br>
                  {{ $t('form.pos.optionsPoinSales.generalOptions.listProducts') }}
                </div>
              </el-popover>
            </el-card>
          </el-col>

        </el-row>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import OrdersList from '@/components/ADempiere/Form/VPOS/OrderList/index'
import ListProductPrice from '@/components/ADempiere/Form/VPOS/ProductInfo/productList'
import {
  printOrder,
  generateImmediateInvoice,
  withdrawal,
  createNewReturnOrder,
  cashClosing,
  requestDeleteOrder,
  requestCreateOrder,
  processOrder
} from '@/api/ADempiere/form/point-of-sales.js'
import ModalDialog from '@/components/ADempiere/Dialog'
import posProcess from '@/utils/ADempiere/constants/posProcess'
import posMixin from '@/components/ADempiere/Form/VPOS/posMixin.js'
import orderLineMixin from '@/components/ADempiere/Form/VPOS/Order/orderLineMixin.js'

export default {
  name: 'Options',
  components: {
    ListProductPrice,
    OrdersList,
    ModalDialog
  },
  mixins: [
    orderLineMixin,
    posMixin
  ],
  props: {
    metadata: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      activeName: '',
      processPos: '',
      showFieldListOrder: false
    }
  },
  computed: {
    isShowProductsPriceList: {
      get() {
        return this.$store.state['pointOfSales/point/index'].productPrice.isShowPopoverMenu
      },
      set(isShowed) {
        if (!this.isEmptyValue(this.$route.query.pos)) {
          this.$store.commit('showListProductPrice', {
            attribute: 'isShowPopoverMenu',
            isShowed
          })
        }
      }
    },
    isShowOrdersList: {
      get() {
        return this.ordersList.isShowPopover
      },
      set(value) {
        if (!this.isEmptyValue(this.$route.query.pos)) {
          this.$store.commit('showListOrders', value)
        }
      }
    },
    blockOption() {
      if (!this.isEmptyValue(this.$route.query.pos)) {
        return 'cursor: pointer; text-align: center !important; color: black'
      }
      return 'cursor: not-allowed; text-align: center !important; color: gray;'
    },
    size() {
      const size = this.$store.getters.getWidthLeft
      return 24 / size
    }
  },
  created() {
    this.findProcess()
  },
  methods: {
    notSubmitForm(event) {
      event.preventDefault()
      return false
    },
    printOrder() {
      printOrder({
        orderUuid: this.$route.query.action
      })
    },
    generateImmediateInvoice() {
      // TODO: Add BPartner
      const { uuid: posUuid, id: posId } = this.getCurrentPOS
      generateImmediateInvoice({
        posId,
        posUuid
      })
    },
    completePreparedOrder() {
      const posUuid = this.currentPointOfSales.uuid
      this.$store.dispatch('updateOrderPos', true)
      this.$store.dispatch('updatePaymentPos', true)
      this.$message({
        type: 'info',
        message: this.$t('notifications.processing'),
        showClose: true
      })
      processOrder({
        posUuid,
        orderUuid: this.$route.query.action,
        createPayments: !this.isEmptyValue(this.currentOrder.listPayments),
        payments: this.currentOrder.listPayments
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
    reverseSalesTransaction() {
      const process = this.$store.getters.getProcess(posProcess[0].uuid)
      this.showModal(process)
      const parametersList = [
        {
          columnName: 'C_Order_ID',
          value: this.currentOrder.id
        },
        {
          columnName: 'Bill_BPartner_ID',
          value: this.currentOrder.businessPartner.id
        },
        {
          columnName: 'IsCancelled',
          value: false
        },
        {
          columnName: 'IsShipConfirm',
          value: true
        },
        {
          columnName: 'C_DocTypeRMA_ID',
          value: 'VO'
        }
      ]
      this.$store.dispatch('addParametersProcessPos', parametersList)
    },
    withdrawal() {
      const { uuid: posUuid, id: posId } = this.getCurrentPOS
      // TODO: Add BParner, C_BankAccount_ID (caja), CashTransferBankAccount_ID, PAY_C_BankAccount_ID
      withdrawal({
        posId,
        posUuid
      })
    },
    createNewCustomerReturnOrder() {
      createNewReturnOrder({
        orderUuid: this.$route.query.action
      })
    },
    showModal(action) {
      this.$store.dispatch('setShowDialog', {
        type: action.type,
        action: {
          ...action,
          containerUuid: action.uuid
        }
      })
    },
    copyOrder() {
      this.processPos = posProcess[1].uuid
      const posUuid = this.currentPointOfSales.uuid
      const parametersList = [{
        columnName: 'C_Order_ID',
        value: this.currentOrder.id
      }]
      this.$store.dispatch('addParametersProcessPos', parametersList)
      requestCreateOrder({
        posUuid,
        customerUuid: this.currentOrder.businessPartner.uuid,
        salesRepresentativeUuid: this.currentPointOfSales.salesRepresentative.uuid
      })
        .then(order => {
          this.$store.dispatch('currentOrder', order)

          this.$router.push({
            params: {
              ...this.$route.params
            },
            query: {
              ...this.$route.query,
              action: order.uuid
            }
          }).then(() => {
          }).catch(() => {})

          this.$store.commit('setIsReloadListOrders')
        })
        .catch(error => {
          console.error(error.message)
          this.$message({
            type: 'error',
            message: error.message,
            showClose: true
          })
        })
        .finally(() => {
          const process = this.$store.getters.getProcess(posProcess[1].uuid)
          this.showModal(process)
        })
    },
    copyLineOrder() {
      this.processPos = posProcess[1].uuid
      const process = this.$store.getters.getProcess(posProcess[1].uuid)
      this.showModal(process)
    },
    cashClosing() {
      const { uuid: posUuid, id: posId } = this.getCurrentPOS
      cashClosing({
        posId,
        posUuid
      })
    },
    deleteOrder() {
      this.$store.dispatch('updateOrderPos', true)
      requestDeleteOrder({
        orderUuid: this.$route.query.action
      })
        .then(response => {
          this.changePos(this.currentPointOfSales)
        })
        .finally(() => {
          this.$store.dispatch('listOrdersFromServer', {
            posUuid: this.currentPointOfSales.uuid
          })
          this.$message({
            type: 'success',
            message: this.$t('form.pos.optionsPoinSales.salesOrder.orderRemoved'),
            showClose: true
          })
          this.$store.dispatch('updateOrderPos', false)
        })
    },
    seeOrderList() {
      if (this.ordersList.recordCount <= 0) {
        this.$store.dispatch('listOrdersFromServer', {})
      }
    },
    findProcess() {
      const findServer = this.$store.getters.getProcess('a42ad0c6-fb40-11e8-a479-7a0060f0aa01')
      if (this.isEmptyValue(findServer)) {
        posProcess.forEach(item => {
          this.$store.dispatch('getProcessFromServer', { containerUuid: item.uuid, processId: item.id })
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-button--text {
    border-color: transparent;
    color: black;
    background: transparent;
    padding-left: 0;
    padding-right: 0;
  }
  .el-button--text:hover, .el-button--text:focus {
    color: #46a6ff !important;
    border-color: transparent;
    background-color: transparent;
  }
  .el-col :hover {
    background-color: rgba(209, 233, 255, 0.719);
  }
  .title-of-option {
    cursor: pointer;
    text-align: center !important;
  }
</style>
