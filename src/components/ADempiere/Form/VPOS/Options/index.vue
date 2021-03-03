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
              >
                <orders-list
                  :parent-metadata="metadata"
                />
                <p
                  slot="reference"
                  :style="blockOption"
                >
                  <svg-icon icon-class="list" />
                  <br>
                  {{ $t('form.pos.optionsPoinSales.salesOrder.ordersHistory') }}
                </p>
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
                @click="createWithdrawal"
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
                    v-for="item in sellingPointsList"
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
                v-model="isShowProductsPriceList"
                placement="right"
                width="800"
                trigger="manual"
              >
                <list-product-price
                  v-if="isShowProductsPriceList"
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
  requestPrintOrder,
  requestGenerateImmediateInvoice,
  requestCreateWithdrawal,
  requestCreateNewCustomerReturnOrder,
  requestCashClosing,
  requestDeleteOrder,
  requestCreateOrder,
  requestProcessOrder
} from '@/api/ADempiere/form/point-of-sales.js'
import ModalDialog from '@/components/ADempiere/Dialog'
import posProcess from '@/utils/ADempiere/constants/posProcess'
import orderLineMixin from '@/components/ADempiere/Form/VPOS/Order/orderLineMixin.js'

export default {
  name: 'Options',
  components: {
    ListProductPrice,
    OrdersList,
    ModalDialog
  },
  mixins: [
    orderLineMixin
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
      processPos: ''
    }
  },
  computed: {
    isShowProductsPriceList: {
      get() {
        return this.$store.state['pointOfSales/listProductPrice'].productPrice.isShowPopoverMenu
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
        return this.$store.getters.getListOrder.isShowPopover
      },
      set(value) {
        if (!this.isEmptyValue(this.$route.query.pos)) {
          this.$store.commit('showListOrders', value)
        }
      }
    },
    sellingPointsList() {
      return this.$store.getters.getSellingPointsList
    },
    currentPOS() {
      return this.$store.getters.getOrder
    },
    currentPoint() {
      return this.$store.getters.getCurrentPOS
    },
    pointOfSalesId() {
      const currentPOS = this.currentPOS
      if (!this.isEmptyValue(currentPOS)) {
        return currentPOS.id
      }
      return undefined
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
    changePos(posElement) {
      this.$store.dispatch('setCurrentPOS', posElement)
      this.newOrder()
    },
    newOrder() {
      const pos = this.pointOfSalesId || this.$route.query.pos
      this.$router.push({
        params: {
          ...this.$route.params
        },
        query: {
          pos
        }
      }).catch(error => {
        console.info(`VPOS/Options component (New Order): ${error.message}`)
      }).finally(() => {
        const { templateBusinessPartner } = this.$store.getters.getCurrentPOS
        // TODO: Set order with POS Terminal default values
        this.$store.commit('setListPayments', [])
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
        this.$store.commit('setShowPOSCollection', false)
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
            value: this.$store.getters['user/getUserUuid']
          }]
        })
      })
    },
    printOrder() {
      requestPrintOrder({
        orderUuid: this.$route.query.action
      })
    },
    generateImmediateInvoice() {
      // TODO: Add BPartner
      const { uuid: posUuid, id: posId } = this.getCurrentPOS
      requestGenerateImmediateInvoice({
        posId,
        posUuid
      })
    },
    completePreparedOrder() {
      const posUuid = this.currentPoint.uuid
      this.$store.dispatch('updateOrderPos', true)
      this.$store.dispatch('updatePaymentPos', true)
      this.$message({
        type: 'info',
        message: this.$t('notifications.processing'),
        showClose: true
      })
      requestProcessOrder({
        posUuid,
        orderUuid: this.$route.query.action,
        createPayments: !this.isEmptyValue(this.$store.getters.getListPayments),
        payments: this.$store.getters.getListPayments
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
          console.log(error)
        })
        .finally(() => {
          this.$store.dispatch('listOrdersFromServer', {
            posUuid: this.$store.getters.getCurrentPOS.uuid
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
          value: this.$store.getters.getOrder.id
        },
        {
          columnName: 'Bill_BPartner_ID',
          value: this.$store.getters.getOrder.businessPartner.id
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
    createWithdrawal() {
      const { uuid: posUuid, id: posId } = this.getCurrentPOS
      // TODO: Add BParner, C_BankAccount_ID (caja), CashTransferBankAccount_ID, PAY_C_BankAccount_ID
      requestCreateWithdrawal({
        posId,
        posUuid
      })
    },
    createNewCustomerReturnOrder() {
      requestCreateNewCustomerReturnOrder({
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
      const posUuid = this.currentPoint.uuid
      const parametersList = [{
        columnName: 'C_Order_ID',
        value: this.$store.getters.getOrder.id
      }]
      this.$store.dispatch('addParametersProcessPos', parametersList)
      requestCreateOrder({
        posUuid,
        customerUuid: this.currentPOS.businessPartner.uuid,
        salesRepresentativeUuid: this.currentPOS.salesRepresentative.uuid
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
      requestCashClosing({
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
          this.changePos(this.$store.getters.getCurrentPOS)
        })
        .finally(() => {
          this.$store.dispatch('listOrdersFromServer', {
            posUuid: this.$store.getters.getCurrentPOS.uuid
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
      if (this.$store.getters.getListOrder.recordCount <= 0) {
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
