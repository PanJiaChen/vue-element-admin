// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Yamel Senih ysenih@erpya.com www.erpya.com
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import {
  findProduct,
  updateOrderLine,
  deleteOrderLine,
  processOrder
} from '@/api/ADempiere/form/point-of-sales.js'
import {
  formatDate,
  formatPrice,
  formatQuantity
} from '@/utils/ADempiere/valueFormat.js'
import orderLineMixin from './Order/orderLineMixin.js'
import { validatePin } from '@/api/ADempiere/form/point-of-sales.js'

export default {
  name: 'POSMixin',
  mixins: [
    orderLineMixin
  ],
  props: {
    metadata: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      product: {},
      currentTable: 0,
      orderLines: [],
      products: {
        uuid: '',
        quantityAvailable: 0
      },
      edit: false,
      displayType: '',
      pin: '',
      attributePin: {},
      validatePin: false,
      visible: false
    }
  },
  computed: {
    allowsCreateOrder() {
      return this.$store.getters.posAttributes.currentPointOfSales.isAllowsCreateOrder
    },
    allowsCollectOrder() {
      return this.$store.getters.posAttributes.currentPointOfSales.isAllowsCollectOrder
    },
    allowsModifyQuantity() {
      return this.$store.getters.posAttributes.currentPointOfSales.isAllowsModifyQuantity
    },
    allowsReturnOrder() {
      return this.$store.getters.posAttributes.currentPointOfSales.isAllowsReturnOrder
    },
    modifyPrice() {
      return this.$store.getters.posAttributes.currentPointOfSales.isModifyPrice
    },
    adviserPin() {
      return this.$store.getters.posAttributes.currentPointOfSales.isAisleSeller
    },
    isSetTemplateBP() {
      const currentPOS = this.currentPointOfSales
      if (!this.isEmptyValue(currentPOS) &&
        !this.isEmptyValue(currentPOS.templateBusinessPartner) &&
        this.isEmptyValue(this.$route.query.action)) {
        return currentPOS.templateBusinessPartner
      }
      return false
    },
    updateOrderProcessPos() {
      return this.$store.getters.getUpdateOrderPos
    },
    currentPointOfSales() {
      return this.$store.getters.posAttributes.currentPointOfSales
    },
    // Currency Point Of Sales
    pointOfSalesCurrency() {
      // const currency = this.currentPointOfSales
      if (!this.isEmptyValue(this.currentPointOfSales.priceList)) {
        return {
          ...this.currentPointOfSales.priceList.currency,
          amountConvertion: 1
        }
      }
      return {
        uuid: '',
        iSOCode: '',
        curSymbol: '',
        amountConvertion: 1,
        divideRate: 1
      }
    },
    listPointOfSales() {
      return this.$store.getters.posAttributes.pointOfSalesList
    },
    curretnPriceList() {
      if (!this.isEmptyValue(this.$store.getters.currentPriceList)) {
        return this.$store.getters.currentPriceList
      }
      return {}
    },
    priceListPointOfSales() {
      const list = this.$store.getters.posAttributes.currentPointOfSales.pricesList
      if (this.isEmptyValue(list)) {
        return []
      }
      return list
    },
    warehousesListPointOfSales() {
      const list = this.$store.getters.posAttributes.currentPointOfSales.warehousesList
      if (this.isEmptyValue(list)) {
        return []
      }
      return list
    },
    ordersList() {
      if (this.isEmptyValue(this.currentPointOfSales)) {
        return []
      }
      return this.currentPointOfSales.listOrder
    },
    currentOrder() {
      if (this.isEmptyValue(this.currentPointOfSales)) {
        return {
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
        }
      }
      return this.currentPointOfSales.currentOrder
    },
    isDisabled() {
      return this.currentPointOfSales.currentOrder.isProcessed
    },
    listOrderLine() {
      if (this.isEmptyValue(this.currentOrder)) {
        return []
      }
      return this.currentOrder.lineOrder
    },
    isPosRequiredPin() {
      const pos = this.$store.getters.posAttributes.currentPointOfSales
      if (!this.isEmptyValue(pos.isPosRequiredPin)) {
        return pos.isPosRequiredPin
      }
      return false
    },
    showOverdrawnInvoice() {
      return this.$store.getters.getOverdrawnInvoice.visible
    }
  },
  watch: {
    currentOrder(value) {
      if (this.isEmptyValue(value)) {
        this.orderLines = []
        this.$store.dispatch('listOrderLine', [])
        this.listOrderLines()
      } else {
        const businessPartner = this.$store.getters.getValueOfField({
          containerUuid: this.$route.meta.uuid,
          columnName: 'C_BPartner_ID' // this.parentMetadata.columnName
        })
        const documentType = this.$store.getters.getValueOfField({
          containerUuid: this.$route.meta.uuid,
          columnName: 'C_DocTypeTarget_ID' // this.parentMetadata.columnName
        })
        if (!this.isEmptyValue(businessPartner) && businessPartner !== value.businessPartner.id) {
          this.setBusinessPartner(value.businessPartner)
        } else if (this.isEmptyValue(businessPartner) && value.businessPartner.id) {
          this.setBusinessPartner(value.businessPartner)
        }
        if (!this.isEmptyValue(documentType) && documentType !== value.documentType.id) {
          this.setDocumentType(value.documentType)
        }
      }
    },
    updateOrderProcessPos(value) {
      if (!value && !this.isEmptyValue(this.$route.query)) {
        this.reloadOrder(true)
      }
    },
    showOverdrawnInvoice(value) {
      this.visible = value
    }
  },
  beforeMount() {
    this.unsubscribe = this.subscribeChanges()
  },
  beforeDestroy() {
    this.unsubscribe()
  },
  methods: {
    formatDate,
    formatPrice,
    formatQuantity,
    theAction(event) {
      switch (event.srcKey) {
        case 'enter':
          this.openPin(this.pin)
          break
        case 'close':
          this.closePin()
          break
      }
    },
    openPin(pin) {
      validatePin({
        posUuid: this.currentPointOfSales.uuid,
        pin
      })
        .then(response => {
          this.validatePin = true
          this.pin = ''
          this.visible = false
          this.pinAction(this.attributePin)
          this.$message({
            type: 'success',
            message: 'Acción a realizar',
            showClose: true
          })
        })
        .catch(error => {
          console.error(error.message)
          this.$message({
            type: 'error',
            message: error.message,
            showClose: true
          })
          this.pin = ''
        })
        .finally(() => {
          this.visible = false
          this.pin = ''
        })
    },
    pinAction(action) {
      action = this.isEmptyValue(action) ? this.$store.getters.getOverdrawnInvoice.attributePin : action
      if (action.type === 'updateOrder') {
        switch (action.columnName) {
          case 'QtyEntered':
          case 'PriceEntered':
          case 'Discount':
            this.updateOrderLine(action)
            break
          case 'C_DocTypeTarget_ID': {
            const documentTypeUuid = this.$store.getters.getValueOfField({
              containerUuid: this.$route.meta.uuid,
              columnName: 'C_DocTypeTarget_ID_UUID'
            })
            this.$store.dispatch('updateOrder', {
              orderUuid: this.$route.query.action,
              posUuid: this.currentPointOfSales.uuid,
              documentTypeUuid
            })
            break
          }
        }
      } else if (action.type === 'addProduct') {
        this.findProduct(action.value)
      } else if (action.type === 'deleteLine') {
        deleteOrderLine({
          orderLineUuid: action.uuid
        })
          .then(response => {
            this.$store.dispatch('reloadOrder', { orderUuid: this.$store.getters.posAttributes.currentPointOfSales.currentOrder.uuid })
          })
          .catch(error => {
            console.error(error.message)
            this.$message({
              type: 'error',
              message: error.message,
              showClose: true
            })
          })
      } else if (action.type === 'maximumRefundAllowed') {
        this.refundAllowed(action.posUuid, action.orderUuid, action.payments)
      } else if (action.type === 'actionPos') {
        switch (action.action) {
          case 'changeWarehouse':
            this.$store.commit('setCurrentWarehousePos', action)
            break
          case 'changeDocumentType':
            this.$store.commit('setCurrentDocumentTypePos', action)
            break
          case 'changePriceList':
            this.$store.commit('setCurrentPriceList', action)
            break
          case 'openBalanceInvoice':
            this.$store.commit('dialogoInvoce', { show: true, type: 2 })
            this.$store.commit('dialogoInvoce', { show: false })
            this.refundAllowed(action.posUuid, action.orderUuid, action.payments)
            break
        }
      }
    },
    closePin() {
      this.visible = false
      this.pin = ''
      this.$store.dispatch('changePopoverOverdrawnInvoice', { visible: false })
      this.setDocumentType(this.currentOrder.documentType)
    },
    refundAllowed(posUuid, orderUuid, payments) {
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
          this.$store.commit('dialogoInvoce', { show: false })
        })
    },
    withoutPOSTerminal() {
      if (this.isEmptyValue(this.currentPointOfSales)) {
        this.$message({
          type: 'warn',
          message: 'Without POS Terminal',
          showClose: true
        })
        return true
      }
      return false
    },
    arrowTop() {
      if (this.currentTable > 0) {
        this.currentTable--
        this.$refs.linesTable.setCurrentRow(this.listOrderLine[this.currentTable])
        this.currentOrderLine = this.listOrderLine[this.currentTable]
      }
    },
    arrowBottom() {
      const top = this.listOrderLine.length - 1
      if (this.currentTable < top) {
        this.currentTable++
        this.$refs.linesTable.setCurrentRow(this.listOrderLine[this.currentTable])
        this.currentOrderLine = this.listOrderLine[this.currentTable]
      }
    },
    updateOrder(update) {
      // user session
      const documentTypeUuid = this.$store.getters.getValueOfField({
        containerUuid: this.$route.meta.uuid,
        columnName: 'C_DocTypeTarget_ID_UUID'
      })
      if (!this.isEmptyValue(update.value) && update.value !== this.currentOrder.businessPartner.uuid && !this.isEmptyValue(this.currentPointOfSales)) {
        this.$store.dispatch('updateOrder', {
          orderUuid: this.$route.query.action,
          posUuid: this.currentPointOfSales.uuid,
          customerUuid: update.value,
          documentTypeUuid
        })
      }
    },
    setBusinessPartner({ name, id, uuid }) {
      // Use update values of container (without subscription)
      this.$store.commit('updateValueOfField', {
        containerUuid: this.$route.meta.uuid,
        columnName: 'C_BPartner_ID',
        value: id
      })
      this.$store.commit('updateValueOfField', {
        containerUuid: this.$route.meta.uuid,
        columnName: 'DisplayColumn_C_BPartner_ID',
        value: name
      })
      this.$store.commit('updateValueOfField', {
        containerUuid: this.$route.meta.uuid,
        columnName: 'C_BPartner_ID_UUID',
        value: uuid
      })
    },
    setDocumentType({ name, id, uuid }) {
      // Use update values of container (without subscription)
      this.$store.commit('updateValueOfField', {
        containerUuid: this.$route.meta.uuid,
        columnName: 'C_DocTypeTarget_ID',
        value: id
      })
      this.$store.commit('updateValueOfField', {
        containerUuid: this.$route.meta.uuid,
        columnName: 'DisplayColumn_C_DocTypeTarget_ID',
        value: name
      })
      this.$store.commit('updateValueOfField', {
        containerUuid: this.$route.meta.uuid,
        columnName: 'C_DocTypeTarget_ID_UUID',
        value: uuid
      })
    },
    findProduct(searchValue) {
      if (this.withoutPOSTerminal()) {
        return
      }

      const searchProduct = (typeof searchValue === 'object') ? searchValue.value : searchValue
      if (this.isEmptyValue(this.curretnPriceList)) {
        return
      }
      findProduct({
        searchValue: searchProduct,
        priceListUuid: this.curretnPriceList.uuid,
        posUuid: this.currentPointOfSales.uuid
      })
        .then(productPrice => {
          this.product = productPrice.product
          this.createOrder({ withLine: true })
        })
        .catch(error => {
          console.warn(error.message)
          this.$message({
            type: 'info',
            message: error.message,
            showClose: true
          })
        })
        .finally(() => {
          this.$store.commit('updateValuesOfContainer', {
            containerUuid: this.metadata.containerUuid,
            attributes: [{
              columnName: 'ProductValue',
              value: undefined
            }]
          })
        })
    },
    createOrder({ withLine = false, newOrder = false, customer }) {
      if (this.withoutPOSTerminal()) {
        return
      }
      const orderUuid = this.$route.query.action
      if (this.isEmptyValue(orderUuid) || newOrder) {
        const posUuid = this.currentPointOfSales.uuid
        let customerUuid = this.$store.getters.getValueOfField({
          containerUuid: this.metadata.containerUuid,
          columnName: 'C_BPartner_ID_UUID'
        })
        const id = this.$store.getters.getValueOfField({
          containerUuid: this.metadata.containerUuid,
          columnName: 'C_BPartner_ID'
        })
        const documentTypeUuid = this.$store.getters.getValueOfField({
          containerUuid: this.$route.meta.uuid,
          columnName: 'C_DocTypeTarget_ID_UUID'
        })
        if (this.isEmptyValue(customerUuid) || id === 1000006) {
          customerUuid = this.currentPointOfSales.templateBusinessPartner.uuid
        }
        if (customer) {
          customerUuid = customer
        }
        // user session
        this.$store.dispatch('createOrder', {
          posUuid,
          customerUuid,
          salesRepresentativeUuid: this.currentPointOfSales.salesRepresentative.uuid,
          documentTypeUuid
        })
          .then(response => {
            // this.order = response
            this.reloadOrder(true, response.uuid)
            this.$router.push({
              params: {
                ...this.$route.params
              },
              query: {
                ...this.$route.query,
                action: response.uuid
              }
            }).then(() => {
              if (withLine) {
                this.createOrderLine(response.uuid)
              }
              this.$store.dispatch('listOrdersFromServer', {
                posUuid: this.currentPointOfSales.uuid
              })
            }).catch(() => {})
          })
      } else {
        this.createOrderLine(orderUuid)
      }
    },
    reloadOrder(requery, orderUuid) {
      if (requery) {
        if (this.isEmptyValue(orderUuid)) {
          orderUuid = this.currentOrder.uuid
          // if (this.isEmptyValue(orderUuid)) {
          //   orderUuid = this.$store.getters.currentOrder.uuid // this.currentOrder.uuid
          // }
        }
        if (!this.isEmptyValue(orderUuid)) {
          this.$store.dispatch('reloadOrder', { orderUuid })
        }
      }
      this.setDocumentType(this.currentOrder.documentType)
    },
    fillOrder(order, setToStore = true) {
      const orderToPush = {
        uuid: order.uuid,
        id: order.id,
        businessPartner: order.businessPartner, // description, duns, id, lastName, naics, name, taxId, uuid, value
        documentNo: order.documentNo,
        dateOrdered: order.dateOrdered,
        documentStatus: order.documentStatus, // value, name, description
        documentType: order.documentType, // name, printName
        salesRepresentative: order.salesRepresentative, // id, uuid, name, description,
        totalLines: order.totalLines,
        grandTotal: order.grandTotal
      }
      if (setToStore) {
        this.$store.dispatch('setOrder', {
          ...orderToPush
        })
      }
    },
    getOrderTax(currency) {
      return this.formatPrice(this.currentOrder.grandTotal - this.currentOrder.totalLines, currency)
    },
    deleteOrderLine(lineSelection) {
      if (this.currentPointOfSales.isAllowsModifyQuantity) {
        deleteOrderLine({
          orderLineUuid: lineSelection.uuid
        })
          .then(response => {
            this.$store.dispatch('reloadOrder', { orderUuid: this.$store.getters.posAttributes.currentPointOfSales.currentOrder.uuid })
          })
          .catch(error => {
            console.error(error.message)
            this.$message({
              type: 'error',
              message: error.message,
              showClose: true
            })
          })
      } else {
        const attributePin = {
          ...lineSelection,
          type: 'deleteLine',
          label: this.$t('form.pos.pinMessage.delete')
        }
        this.$store.dispatch('changePopoverOverdrawnInvoice', { attributePin, visible: true })
        this.visible = true
      }
    },
    subscribeChanges() {
      return this.$store.subscribe((mutation, state) => {
        // TODO: Add container uuid comparison
        if (mutation.type === 'addActionKeyPerformed') {
          switch (mutation.payload.columnName) {
            case 'ProductValue':
              // this.findProduct(mutation.payload.value)
              // if (this.isPosRequiredPin) {
              if (this.allowsCreateOrder) {
                this.findProduct(mutation.payload.value)
              } else {
                const attributePin = {
                  ...mutation.payload,
                  type: 'addProduct',
                  label: this.$t('form.pos.pinMessage.addProduct')
                }
                this.$store.dispatch('changePopoverOverdrawnInvoice', { attributePin, visible: true })
                this.visible = true
              }
              // } else {
              //   this.findProduct(mutation.payload.value)
              // }
              break
          }
        } else if (mutation.type === 'addActionPerformed') {
          switch (mutation.payload.columnName) {
            case 'QtyEntered':
              if (this.allowsModifyQuantity && !this.isEmptyValue(this.$store.state['pointOfSales/orderLine/index'].line)) {
                this.updateOrderLine(mutation.payload)
              } else {
                const attributePin = {
                  ...mutation.payload,
                  type: 'updateOrder',
                  label: this.$t('form.pos.pinMessage.qtyEntered')
                }
                this.$store.dispatch('changePopoverOverdrawnInvoice', { attributePin, visible: true })
                this.visible = true
              }
              break
            case 'PriceEntered':
            case 'Discount':
              if (this.modifyPrice) {
                this.updateOrderLine(mutation.payload)
              } else {
                const attributePin = {
                  ...mutation.payload,
                  type: 'updateOrder',
                  label: mutation.payload.columnName === 'PriceEntered' ? this.$t('form.pos.pinMessage.price') : this.$t('form.pos.pinMessage.discount')
                }
                this.$store.dispatch('changePopoverOverdrawnInvoice', { attributePin, visible: true })
                this.visible = true
              }
              break
            case 'C_DocTypeTarget_ID': {
              const documentTypeUuid = this.$store.getters.getValueOfField({
                containerUuid: mutation.payload.containerUuid,
                columnName: 'C_DocTypeTarget_ID_UUID'
              })
              if (this.isPosRequiredPin && !this.isEmptyValue(documentTypeUuid) && !this.isEmptyValue(this.currentOrder.documentType.uuid)) {
                const attributePin = {
                  ...mutation.payload,
                  type: 'updateOrder'
                }
                this.$store.dispatch('changePopoverOverdrawnInvoice', { attributePin, visible: true })
                this.visible = true
              } else if (!this.isEmptyValue(documentTypeUuid) && !this.isEmptyValue(this.currentOrder.documentType.uuid)) {
                this.$store.dispatch('updateOrder', {
                  orderUuid: this.$route.query.action,
                  posUuid: this.currentPointOfSales.uuid,
                  documentTypeUuid
                })
              }
              break
            }
          }
        } else if (mutation.type === 'updateValueOfField') {
          switch (mutation.payload.columnName) {
            case 'DisplayColumn_TenderType':
              this.displayType = mutation.payload.value
              break
            case 'C_BPartner_ID_UUID': {
              const bPartnerValue = mutation.payload.value
              if (!this.isEmptyValue(this.currentPointOfSales.templateBusinessPartner) && this.$route.meta.uuid === mutation.payload.containerUuid) {
                const bPartnerPOS = this.currentPointOfSales.templateBusinessPartner.uuid
                this.updateOrder(mutation.payload)
                // Does not send values to server, when empty values are set or
                // if BPartner set equal to BPartner POS template
                if (this.isEmptyValue(bPartnerValue) || bPartnerValue === bPartnerPOS) {
                  break
                }
              }
              break
            }
          }
        }
      })
    },
    shortcutKeyMethod(event) {
      switch (event.srcKey) {
        // case 'options':
        case 'up':
          this.arrowTop()
          break
        case 'popoverConvet':
          this.seeConversion = !this.seeConversion
          break
        case 'down':
          this.arrowBottom()
          break
        case 'plus':
          updateOrderLine({
            orderLineUuid: this.currentOrderLine.uuid,
            quantity: this.listOrderLine[this.currentTable].quantity + 1
          })
            .then(response => {
              this.fillOrderLine(response)
              this.reloadOrder(true)
            })
            .catch(error => {
              console.error(error.message)
              this.$message({
                type: 'error',
                message: error.message,
                showClose: true
              })
            })

          break
        case 'minus':
          updateOrderLine({
            orderLineUuid: this.currentOrderLine.uuid,
            quantity: this.listOrderLine[this.currentTable].quantity - 1
          })
            .then(response => {
              this.fillOrderLine(response)
              this.reloadOrder(true)
            })
            .catch(error => {
              console.error(error.message)
              this.$message({
                type: 'error',
                message: error.message,
                showClose: true
              })
            })
          break
      }
    },
    clearOrder() {
      this.$router.push({
        params: {
          ...this.$route.params
        },
        query: {
          pos: this.currentPointOfSales.id
        }
      }).catch(() => {
      }).finally(() => {
        this.$store.commit('setListPayments', {})
        const { templateBusinessPartner } = this.currentPointOfSales
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
        this.$store.commit('setShowPOSCollection', false)
        this.$store.dispatch('listOrderLine', [])
      })
    },
    changePos(posElement) {
      this.$store.dispatch('setCurrentPOS', posElement)
      this.clearOrder()
    }
  }
}
