import {
  findProduct,
  requestUpdateOrderLine
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
        return this.$store.getters.getOrder
      }

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
    },
    updateOrderProcessPos() {
      return this.$store.getters.getUpdateOrderPos
    },
    getOrder() {
      return this.$store.getters.getPos.currentOrder
    }
  },
  watch: {
    getOrder(value) {
      if (!this.isEmptyValue(value)) {
        // this.order = value
        this.$store.commit('updateValuesOfContainer', {
          parentUuid: this.parentUuid,
          containerUuid: this.containerUuid,
          attributes: [{
            columnName: 'C_BPartner_ID',
            value: value.businessPartner.id
          },
          {
            columnName: 'DisplayColumn_C_BPartner_ID',
            value: value.businessPartner.name
          },
          {
            columnName: ' C_BPartner_ID_UUID',
            value: value.businessPartner.uuid
          }]
        })
      }
    },
    currentOrder(value) {
      if (this.isEmptyValue(value)) {
        this.orderLines = []
        this.$store.dispatch('listOrderLine', [])
        this.listOrderLines({})
      } else {
        this.listOrderLines(value)
      }
    },
    currentPoint(value) {
      if (!this.isEmptyValue(value)) {
        this.$store.dispatch('setCurrentPOS', value)
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
    },
    updateOrderProcessPos(value) {
      if (!value && !this.isEmptyValue(this.$route.query)) {
        this.reloadOrder(true)
      }
    }
  },
  created() {
    this.getPanel()
  },
  beforeMount() {
    if (!this.isEmptyValue(this.currentPoint)) {
      if (!this.isEmptyValue(this.currentOrder)) {
        this.listOrderLines(this.currentOrder)
      }
    }
    this.unsubscribe = this.subscribeChanges()
  },
  beforeDestroy() {
    this.unsubscribe()
  },
  mounted() {
    if (!this.isEmptyValue(this.$route.query)) {
      this.reloadOrder(true, this.$route.query.action)
    }
    if (!this.isEmptyValue(this.$route.query.pos) && !this.isEmptyValue(this.allOrderLines) && this.isEmptyValue(this.$route.query.action)) {
      this.$router.push({
        params: {
          ...this.$route.params
        },
        query: {
          ...this.$route.query,
          action: this.getOrder.uuid
        }
      }, () => {})
    }
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
      // user session
      if (update.value !== this.getOrder.businessPartner.uuid && !this.isEmptyValue(this.currentPoint)) {
        this.$store.dispatch('updateOrder', {
          orderUuid: this.$route.query.action,
          posUuid: this.currentPoint.uuid,
          customerUuid: update.value
        })
      }
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
        const id = this.$store.getters.getValueOfField({
          containerUuid: this.containerUuid,
          columnName: 'C_BPartner_ID'
        })
        if (this.isEmptyValue(customerUuid) || id === 1000006) {
          customerUuid = this.currentPoint.templateBusinessPartner.uuid
        }
        // user session
        // alert(name)
        this.$store.dispatch('createOrder', {
          posUuid,
          customerUuid,
          salesRepresentativeUuid: this.currentPoint.templateBusinessPartner.uuid
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
                posUuid: this.currentPoint.uuid
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
          orderUuid = this.$route.query.action
          // if (this.isEmptyValue(orderUuid)) {
          //   orderUuid = this.$store.getters.getOrder.uuid // this.currentOrder.uuid
          // }
        }
        if (!this.isEmptyValue(orderUuid)) {
          this.$store.dispatch('reloadOrder', { orderUuid })
        }
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
      // this.order = orderToPush
    },
    getOrderTax(currency) {
      return this.formatPrice(this.getOrder.grandTotal - this.getOrder.totalLines, currency)
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
          }
        } else if (mutation.type === 'updateValueOfField') {
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
    },
    mas() {
      this.$refs.linesTable.setCurrentRow(this.listOrderLine[1])
    },
    menos() {
      this.$refs.linesTable.setCurrentRow(this.listOrderLine[0])
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
          requestUpdateOrderLine({
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
          requestUpdateOrderLine({
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
    }
  }
}
