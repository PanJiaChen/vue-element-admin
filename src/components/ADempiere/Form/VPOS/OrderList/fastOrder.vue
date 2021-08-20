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
  <el-popover
    placement="bottom"
    width="700"
    trigger="click"
  >
    <el-container>
      <el-header style="height: 2%;">
        <p style="text-align: center;"> <b> Pedidos Vendedor de Pasillo por Facturar </b></p>
        <el-form label-position="top" :inline="true" class="demo-form-inline" @submit.native.prevent="notSubmitForm">
          <el-form-item label="No. del Documento">
            <el-input v-model="input" placeholder="Please input" @change="listOrdersInvoiced" />
          </el-form-item>
          <el-form-item>
            <field
              v-if="!isEmptyValue(metadataList)"
              :key="metadataList.columnName"
              :metadata-field="{
                ...metadataList,
                size: 24
              }"
            />
          </el-form-item>
        </el-form>
      </el-header>
      <el-main>
        <el-table
          v-loading="isloading"
          :data="ordersInvoiced"
          height="400"
          border
          fit
          :highlight-current-row="highlightRow"
          @current-change="handleCurrentChange"
        >
          <el-table-column
            prop="documentNo"
            label="Nro. Documento"
            width="130"
          />
          <el-table-column
            label="Estado"
            width="100"
          >
            <template slot-scope="scope">
              <el-tag
                :type="tagStatus(scope.row.documentStatus.value)"
              >
                {{ scope.row.documentStatus.name }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column
            prop="salesRepresentative.name"
            label="Agente Comercial"
            min-width="170"
          />

          <el-table-column
            label="Socio de Negocio"
            min-width="150"
          >
            <template slot-scope="scope">
              {{ scope.row.businessPartner.name }}
            </template>
          </el-table-column>

          <el-table-column
            label="Fecha de Orden"
            width="135"
          >
            <template slot-scope="scope">
              {{ formatDate(scope.row.dateOrdered) }}
            </template>
          </el-table-column>
          <el-table-column
            label="Total General"
            align="right"
            width="120"
          >
            <template slot-scope="scope">
              {{ formatQuantity(scope.row.grandTotal) }}
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <custom-pagination
          :total="total"
          :current-page="currentPage"
          :handle-change-page="handleChangePage"
          layout="total, prev, pager, next"
          style="float: right;"
        />
      </el-footer>
    </el-container>
    <el-button slot="reference" type="text" style="color: black;margin-left: 5%;margin-top: 15%;font-size: 15px;" @click="openPopover = !openPopover">
      <svg-icon icon-class="tree-table" />
      <b> Por Facturar </b>
    </el-button>
  </el-popover>
</template>

<script>
import CustomPagination from '@/components/ADempiere/Pagination'
import fieldsListOrders from './fieldsListOrders.js'
import {
  createFieldFromDictionary
} from '@/utils/ADempiere/lookupFactory'
import {
  formatDate,
  formatQuantity
} from '@/utils/ADempiere/valueFormat.js'
import {
  listOrders
} from '@/api/ADempiere/form/point-of-sales.js'
import Field from '@/components/ADempiere/Field'
import { extractPagingToken } from '@/utils/ADempiere/valueUtils.js'

export default {
  name: 'AisleVendorList',
  components: {
    CustomPagination,
    Field
  },
  props: {
    metadata: {
      type: Object,
      default: () => {
        return {
          panelType: 'from',
          uuid: 'Aisle-Vendor-List',
          containerUuid: 'Aisle-Vendor-List'
        }
      }
    },
    showField: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fieldsList: fieldsListOrders,
      metadataList: {},
      total: 0,
      currentPage: 1,
      tokenPage: '',
      input: '',
      isCustomForm: true,
      businessPartner: '',
      timeOut: null,
      isloading: true,
      ordersInvoiced: [],
      openPopover: false
    }
  },
  computed: {
    highlightRow() {
      if (!this.isEmptyValue(this.selectOrder)) {
        return true
      }
      return false
    },
    selectOrder() {
      const action = this.$route.query.action
      if (!this.isEmptyValue(this.ordersInvoiced)) {
        const order = this.ordersInvoiced.find(item => item.uuid === action)
        if (!this.isEmptyValue(order)) {
          return order
        }
      }
      return null
    },
    sortFieldsListOrder() {
      return this.fieldsList.find(field => field.columnName === 'C_BPartner_ID')
    }
  },
  watch: {
    openPopover(value) {
      if (value && this.isEmptyValue(this.ordersInvoiced)) {
        this.setFieldsList()
        this.listOrdersInvoiced()
      }
    }
  },
  created() {
    this.unsubscribe = this.subscribeChanges()
  },
  beforeDestroy() {
    this.unsubscribe()
  },
  methods: {
    formatDate,
    formatQuantity,
    extractPagingToken,
    createFieldFromDictionary,
    notSubmitForm(event) {
      event.preventDefault()
      return false
    },
    handleChangePage(newPage) {
      this.tokenPage = this.tokenPage + '-' + newPage
      this.listOrdersInvoiced()
    },
    handleCurrentChange(row) {
      // close popover
      this.$store.commit('showListOrders', false)
      this.$store.dispatch('currentOrder', row)
      if (!this.isEmptyValue(row)) {
        this.$store.dispatch('deleteAllCollectBox')
        this.$router.push({
          params: {
            ...this.$route.params
          },
          query: {
            ...this.$route.query,
            action: row.uuid
          }
        }, () => {})
        const orderUuid = this.$route.query.action
        this.$store.dispatch('listPayments', { orderUuid })
      }
    },
    subscribeChanges() {
      return this.$store.subscribe((mutation, state) => {
        if (mutation.type === 'updateValueOfField' && mutation.payload.columnName === 'C_BPartner_ID_UUID' && mutation.payload.containerUuid === 'Aisle-Vendor-List' && mutation.payload.value !== this.businessPartner) {
          this.businessPartner = mutation.payload.value
        }
        if (mutation.type === 'updateValueOfField' &&
          !mutation.payload.columnName.includes('DisplayColumn') &&
          !mutation.payload.columnName.includes('_UUID') &&
          mutation.payload.containerUuid === this.metadata.containerUuid) {
          clearTimeout(this.timeOut)
          this.timeOut = setTimeout(() => {
            this.listOrdersInvoiced()
          }, 2000)
        }
      })
    },
    orderPrpcess(row) {
      const parametersList = [{
        columnName: 'C_Order_ID',
        value: row.id
      }]
      this.$store.dispatch('addParametersProcessPos', parametersList)
    },
    setFieldsList() {
      const list = {
        ...this.sortFieldsListOrder,
        containerUuid: 'Aisle-Vendor-List'
      }
      // Create Panel
      this.$store.dispatch('addPanel', {
        containerUuid: 'Aisle-Vendor-List',
        isCustomForm: true,
        uuid: this.metadata.uuid + 1,
        fieldsList: [list]
      })
      // Product Code
      this.createFieldFromDictionary(list)
        .then(response => {
          // this.metadataList = response
          this.metadataList = {
            ...response
          }
        }).catch(error => {
          console.warn(`LookupFactory: Get Field From Server (State) - Error ${error.code}: ${error.message}.`)
        })
    },
    sortDate(listDate) {
      return listDate.sort((elementA, elementB) => {
        return new Date().setTime(new Date(elementB.dateOrdered).getTime()) - new Date().setTime(new Date(elementA.dateOrdered).getTime())
      })
    },
    listOrdersInvoiced() {
      this.isloading = true
      listOrders({
        posUuid: this.$store.getters.posAttributes.currentPointOfSales.uuid,
        documentNo: this.input,
        isAisleSeller: true,
        pageToken: this.tokenPage,
        businessPartnerUuid: this.businessPartner
      })
        .then(response => {
          this.isloading = false
          this.tokenPage = this.extractPagingToken(response.nextPageToken)
          this.total = response.recordCount
          this.ordersInvoiced = response.ordersList
        })
        .catch(error => {
          this.isloading = false
          console.warn(`listOrdersFromServer: ${error.message}. Code: ${error.code}.`)
        })
    }
  }
}
</script>
