import {
  findProduct,
  requestCreateOrder,
  requestGetOrder,
  requestUpdateOrder
} from '@/api/ADempiere/form/point-of-sales.js'
import {
  formatDate,
  formatPrice,
  formatQuantity
} from '@/utils/ADempiere/valueFormat.js'

export default {
  name: 'POSMixin',
  props: {
    metadata: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      product: {},
      order: {
        documentType: {},
        documentStatus: {
          value: ''
        },
        totalLines: 0,
        grandTotal: 0,
        salesRepresentative: {},
        businessPartner: {
          value: ''
        }
      },
      currentTable: 0,
      currentOrderLine: {
        product: {
          value: 0,
          name: '',
          description: '',
          priceStandard: 0
        },
        taxIndicator: 0,
        quantityOrdered: 0
      },
      orderLines: [],
      products: {
        uuid: '',
        quantityAvailable: 0
      },
      edit: false,
      displayType: ''
    }
  },
  computed: {
    allOrderLines() {
      if (this.isEmptyValue(this.listOrderLine)) {
        return []
      }
      return this.listOrderLine
    },
    listOrderLine() {
      return this.$store.getters.getListOrderLine
    },
    ordersList() {
      const order = this.$store.getters.getListOrder
      if (order && !this.isEmptyValue(order.ordersList)) {
        return order.ordersList
      }
      return []
    },
    currentOrder() {
      const action = this.$route.query.action
      if (!this.isEmptyValue(action)) {
        const order = this.ordersList.find(item => item.uuid === action)
        if (!this.isEmptyValue(order)) {
          return order
        }
      }

      return this.$store.getters.getFindOrder
    },
    currentPoint() {
      return this.$store.getters.getCurrentPOS
    },
    priceListUuid() {
      const currentPOS = this.currentPoint
      if (this.isEmptyValue(currentPOS)) {
        return undefined
      }
      return this.currentPoint.priceList.uuid
    },
    getWarehouse() {
      return this.$store.getters['user/getWarehouse']
    },
    isSetTemplateBP() {
      const currentPOS = this.currentPoint
      if (!this.isEmptyValue(currentPOS) &&
        !this.isEmptyValue(currentPOS.templateBusinessPartner) &&
        this.isEmptyValue(this.$route.query.action)) {
        return currentPOS.templateBusinessPartner
      }
      return false
    }
  },
  watch: {
    currentOrder(value) {
      if (this.isEmptyValue(value)) {
        this.orderLines = []
        this.order = {
          documentType: {},
          documentStatus: {},
          salesRepresentative: {}
        }
        this.$store.dispatch('listOrderLine', [])
        this.listOrderLines({})
      } else {
        this.fillOrder(value)
        this.listOrderLines(value)
      }
    },
    /**
     * Used when loading/reloading the app without the order uuid
     * @param {oject|boolean} bPartnerToSet
     */
    isSetTemplateBP(bPartnerToSet) {
      if (bPartnerToSet) {
        this.setBusinessPartner(bPartnerToSet)
      }
    }
  },
  created() {
    this.getPanel()
  },
  beforeMount() {
    if (!this.isEmptyValue(this.currentPoint)) {
      if (!this.isEmptyValue(this.currentOrder)) {
        this.fillOrder(this.currentOrder)
        this.listOrderLines(this.currentOrder)
      }
    }

    this.unsubscribe = this.subscribeChanges()
  },
  beforeDestroy() {
    this.unsubscribe()
  },
  methods: {
    formatDate,
    formatPrice,
    formatQuantity,
    withoutPOSTerminal() {
      if (this.isEmptyValue(this.currentPoint)) {
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
      if (this.withoutPOSTerminal()) {
        return
      }
      if (!this.$route.query || this.isEmptyValue(this.$route.query.action)) {
        return
      }

      const { uuid: posUuid } = this.currentPoint

      let customerUuid
      if (update.columnName === 'C_BPartner_ID_UUID') {
        customerUuid = update.value
        if (this.isEmptyValue(customerUuid) && !this.isEmptyValue(this.currentPoint)) {
          customerUuid = this.currentPoint.templateBusinessPartner.uuid
        }
      }

      requestUpdateOrder({
        orderUuid: this.$route.query.action,
        posUuid,
        customerUuid
        // documentTypeUuid: value.value,
        // description
      })
        .then(response => {
          // this.reloadOrder(true)
        })
        .catch(error => {
          console.error(error.message)
          this.$message({
            type: 'error',
            message: error.message,
            showClose: true
          })
        })
    },
    setBusinessPartner({ name, id, uuid }) {
      // Use update values of container (without subscription)
      this.$store.commit('updateValuesOfContainer', {
        parentUuid: this.parentUuid,
        containerUuid: this.containerUuid,
        attributes: [{
          columnName: 'C_BPartner_ID',
          value: id
        },
        {
          columnName: 'DisplayColumn_C_BPartner_ID',
          value: name
        },
        {
          columnName: ' C_BPartner_ID_UUID',
          value: uuid
        }]
      })
    },
    findProduct(searchValue) {
      if (this.withoutPOSTerminal()) {
        return
      }

      const searchProduct = (typeof searchValue === 'object') ? searchValue.value : searchValue

      findProduct({
        searchValue: searchProduct,
        priceListUuid: this.priceListUuid
      })
        .then(productPrice => {
          this.product = productPrice.product
          this.createOrder(true)
        })
        .catch(error => {
          console.warn(error.message)
          this.$message({
            type: 'info',
            message: error.message,
            showClose: true
          })

          this.$store.commit('updateValueOfField', {
            containerUuid: 'Products-Price-List',
            columnName: 'ProductValue',
            value: `${searchProduct}`
          })

          this.$store.commit('showListProductPrice', {
            attribute: 'isShowPopoverField',
            isShowed: true
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
    createOrder(withLine) {
      if (this.withoutPOSTerminal()) {
        return
      }
      const orderUuid = this.$route.query.action
      if (this.isEmptyValue(orderUuid)) {
        const posUuid = this.currentPoint.uuid

        let customerUuid = this.$store.getters.getValueOfField({
          containerUuid: this.containerUuid,
          columnName: 'C_BPartner_ID_UUID'
        })
        if (this.isEmptyValue(customerUuid)) {
          customerUuid = this.currentPoint.templateBusinessPartner.uuid
        }

        // user session
        const salesRepresentativeUuid = this.$store.getters['user/getUserUuid']

        requestCreateOrder({
          posUuid,
          customerUuid,
          salesRepresentativeUuid
        })
          .then(order => {
            this.$store.dispatch('currentOrder', order)
            this.fillOrder(order)

            this.$router.push({
              params: {
                ...this.$route.params
              },
              query: {
                ...this.$route.query,
                action: order.uuid
              }
            }).then(() => {
              if (withLine) {
                this.createOrderLine(order.uuid)
              }
            }).catch(() => {})

            // update orders list
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
      } else {
        this.createOrderLine(orderUuid)
      }
    },
    reloadOrder(requery, orderUuid) {
      if (requery) {
        if (this.isEmptyValue(orderUuid)) {
          orderUuid = this.$route.query.action
          if (this.isEmptyValue(orderUuid)) {
            orderUuid = this.$store.getters.getOrder.uuid // this.currentOrder.uuid
          }
        }

        if (!this.isEmptyValue(orderUuid)) {
          requestGetOrder(orderUuid)
            .then(orderResponse => {
              this.fillOrder(orderResponse)
              this.$store.dispatch('currentOrder', orderResponse)
              this.listOrderLines(orderResponse)
            })
            .catch(error => {
              this.$message({
                type: 'error',
                message: error.message,
                showClose: true
              })
            })
        }
      } else {
        this.fillOrder(this.currentOrder, false)
      }
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
      if (!this.isEmptyValue(order.businessPartner)) {
        const { businessPartner } = order
        this.setBusinessPartner(businessPartner)
      }
      this.order = orderToPush
    },
    getOrderTax(currency) {
      if (this.isEmptyValue(this.order)) {
        return undefined
      }
      return this.formatPrice(this.order.grandTotal - this.order.totalLines, currency)
    },
    subscribeChanges() {
      return this.$store.subscribe((mutation, state) => {
        // TODO: Add container uuid comparison
        if (mutation.type === 'addActionKeyPerformed') {
          switch (mutation.payload.columnName) {
            case 'ProductValue':
              this.findProduct(mutation.payload.value)
              break
          }
        } else if (mutation.type === 'addActionPerformed') {
          switch (mutation.payload.columnName) {
            case 'QtyEntered':
            case 'PriceEntered':
            case 'Discount':
              if (!this.isEmptyValue(this.currentOrderLine)) {
                this.updateOrderLine(mutation.payload)
              }
              break
            //
            case 'C_DocType_ID':
              this.updateOrder(mutation.payload)
              break
          }
        } else if (mutation.type === 'updateValueOfField') {
          // if (this.metadata.containerUuid === mutation.payload.containerUuid &&
          //   mutation.payload.columnName === 'ProductValue') {
          //   this.findProduct(mutation.payload.value)
          // }
          switch (mutation.payload.columnName) {
            case 'DisplayColumn_TenderType':
              this.displayType = mutation.payload.value
              break

            case 'C_BPartner_ID_UUID': {
              const bPartnerValue = mutation.payload.value
              if (!this.isEmptyValue(this.currentPoint)) {
                const bPartnerPOS = this.currentPoint.templateBusinessPartner.uuid
                // Does not send values to server, when empty values are set or
                // if BPartner set equal to BPartner POS template
                if (this.isEmptyValue(bPartnerValue) || bPartnerValue === bPartnerPOS) {
                  break
                }
              }
              this.updateOrder(mutation.payload)
              break
            }
          }
        }
      })
    }
  }
}
