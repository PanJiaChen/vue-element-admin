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
  requestCreateOrderLine,
  requestUpdateOrderLine,
  requestDeleteOrderLine
} from '@/api/ADempiere/form/point-of-sales.js'
import { formatPercent } from '@/utils/ADempiere/valueFormat.js'

export default {
  name: 'OrderLineMixin',
  data() {
    return {
      orderLineDefinition: {
        lineDescription: {
          columnName: 'LineDescription',
          label: this.$t('form.pos.tableProduct.product'),
          isNumeric: false
        },
        currentPrice: {
          columnName: 'CurrentPrice',
          label: this.$t('form.productInfo.price'),
          isNumeric: true
        },
        quantityOrdered: {
          columnName: 'QtyOrdered',
          label: this.$t('form.pos.tableProduct.quantity'),
          isNumeric: true
        },
        discount: {
          columnName: 'Discount',
          label: '% ' + this.$t('form.pos.order.discount'),
          isNumeric: true
        },
        grandTotal: {
          columnName: 'GrandTotal',
          label: 'Total',
          isNumeric: true
        }
      }
    }
  },
  methods: {
    formatPercent,
    changeLine(command) {
      switch (command) {
        case 'Eliminar':
          // this.deleteOrderLine()
          break
        //
        case this.$t('form.pos.tableProduct.editQuantities'):
          this.fillOrderLineQuantities({
            currentPrice: this.currentOrderLine.currentPrice,
            quantityOrdered: this.currentOrderLine.quantityOrdered,
            discount: this.currentOrderLine.discount
          })
          this.edit = true
          break
        //
        case 'Información':
          break
      }
    },
    fillOrderLine(orderLine) {
      this.$store.dispatch('updateOrderLines', orderLine)
    },
    createOrderLine(orderUuid) {
      const productUuid = this.product.uuid
      requestCreateOrderLine({
        orderUuid,
        productUuid
      })
        .then(orderLine => {
          this.fillOrderLine(orderLine)
          this.reloadOrder(true, orderUuid)
        })
        .catch(error => {
          console.warn(error.message)
          this.$message({
            type: 'error',
            message: error.message,
            showClose: true
          })
        })
    },
    listOrderLines({ uuid: orderUuid }) {
      if (!this.isEmptyValue(orderUuid)) {
        this.orderLines = this.listOrderLine
        this.handleCurrentLineChange(this.currentOrderLine)
      }
    },
    updateOrderLine(line) {
      let {
        currentPrice: price,
        discount: discountRate,
        quantityOrdered: quantity
      } = this.currentOrderLine

      switch (line.columnName) {
        case 'QtyEntered':
          quantity = line.value
          break
        case 'PriceEntered':
          price = line.value
          break
        case 'Discount':
          discountRate = line.value
          break
      }

      requestUpdateOrderLine({
        orderLineUuid: this.currentOrderLine.uuid,
        quantity,
        price,
        discountRate
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
    },
    deleteOrderLine(lineSelection) {
      requestDeleteOrderLine({
        orderLineUuid: lineSelection.uuid
      })
        .then(() => {
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
    },
    /**
     * Show the correct display format
     * @param {object} row record
     * @param {object} orderLine or field definition
     */
    displayValue(row, orderLine) {
      const { columnName } = orderLine
      if (columnName === 'LineDescription') {
        return row.lineDescription
      }
      const currency = this.pointOfSalesCurrency.iSOCode
      if (columnName === 'CurrentPrice') {
        return this.formatPrice(row.priceActual, currency)
      } else if (columnName === 'QtyOrdered') {
        return this.formatQuantity(row.quantityOrdered)
      } else if (columnName === 'Discount') {
        return this.formatPercent(row.discount)
      } else if (columnName === 'GrandTotal') {
        return this.formatPrice(row.grandTotal, currency)
      }
    },
    handleCurrentLineChange(rowLine) {
      if (!this.isEmptyValue(rowLine)) {
        this.currentOrderLine = rowLine
        this.currentTable = this.listOrderLine.findIndex(item => item.uuid === rowLine.uuid)
        if (this.isEmptyValue(this.currentOrderLine) && !this.isEmptyValue(this.listOrderLine)) {
          this.$refs.linesTable.setCurrentRow(this.listOrderLine[this.currentTable])
        }
      }
    },
    fillOrderLineQuantities({
      currentPrice,
      quantityOrdered,
      discount
    }) {
      const containerUuid = this.formUuid
      //  Editable fields
      if (!this.isEmptyValue(quantityOrdered)) {
        this.$store.commit('updateValueOfField', {
          containerUuid,
          columnName: 'QtyEntered',
          value: quantityOrdered
        })
      }
      if (!this.isEmptyValue(currentPrice)) {
        this.$store.commit('updateValueOfField', {
          containerUuid,
          columnName: 'PriceEntered',
          value: currentPrice
        })
      }
      if (!this.isEmptyValue(discount)) {
        this.$store.commit('updateValueOfField', {
          containerUuid,
          columnName: 'Discount',
          value: discount
        })
      }
    },
    isValidForDeleteLine(line) {
      if (this.isEmptyValue(this.currentOrderLine) && !this.isEmptyValue(this.orderLines)) {
        this.currentOrderLine = this.orderLines[0]
      }
      return !this.isEmptyValue(line)
    }
  }
}
