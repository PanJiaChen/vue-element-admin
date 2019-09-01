<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input v-model="listQuery.orderId" placeholder="Order Id" width="10%" />
      <el-date-picker
        v-model="listQuery.dateRange"
        type="daterange"
        range-separator="To"
        start-placeholder="Start date"
        end-placeholder="End date"
      />
      <el-select v-model="listQuery.sellerAccountId" :remote-method="getRemoteAccountList" filterable default-first-option remote placeholder="Seller Accounts" loading-text="Loading...">
        <el-option v-for="(item,index) in sellerAccounts" :key="item+index" :label="item.name" :value="item.id" />
      </el-select>
      <el-select v-model="listQuery.buyerAccountId" :remote-method="getRemoteAccountList" filterable default-first-option remote placeholder="Buyer Accounts" loading-text="Loading...">
        <el-option v-for="(item,index) in buyerAccounts" :key="item+index" :label="item.name" :value="item.id" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button class="filter-item" type="danger" icon="el-icon-remove" @click="resetFilter">
        Reset
      </el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit style="width: 100%" :summary-method="getSummary" show-summary>
      <el-table-column align="center" label="Date" sortable prop="created" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.created }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="orderId" sortable label="Order Id" width="100" />

      <el-table-column align="center" prop="offers[0].seller.name" sortable label="Seller" width="250" />

      <el-table-column align="center" prop="buyer.name" sortable label="Buyer" width="250" />

      <el-table-column align="center" label="Total" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.offers | totalPrice }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Products" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.offers.length }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="Status" width="110">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Actions" width="120">
        <template slot-scope="scope">
          <router-link :to="'/orders/edit/' + scope.row._id">
            <el-button type="primary" size="small" icon="el-icon-edit">
              Edit
            </el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
const fetchAccountList = require('@/api/account').fetchList
import { fetchList } from '@/api/order'
import moment from 'moment'

export default {
  name: 'OrderList',
  filters: {
    statusFilter(status) {
      const statusMap = {
        Complete: 'success',
        Cancelled: 'danger'
      }
      return statusMap[status]
    },
    totalPrice(offers) {
      let price = 0
      offers.forEach(element => {
        price += ((element.price * 10) * element.quantityOrdered)
      })
      return `€${(price * 1.19).toFixed(2)}`
    }
  },
  data() {
    return {
      sellerAccounts: [],
      buyerAccounts: [],
      originalList: null,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        orderId: '',
        buyerAccountId: '',
        sellerAccountId: '',
        dateRange: [moment().startOf('day').startOf('week').toDate(), moment().toDate()]
      }
    }
  },
  created() {
    this.listQuery.platform = 'OLFDE'
    this.getList()
  },
  methods: {
    getRemoteAccountList(query) {
      query = {}
      query.platform = 'OLFDE'
      query.limit = 100
      fetchAccountList(query).then(response => {
        if (!response.data.docs) return
        this.sellerAccounts = response.data.docs.filter(a => a.type === 'seller').map(v => { return { name: v.name, id: v._id } })
        this.buyerAccounts = response.data.docs.filter(a => a.type === 'buyer').map(v => { return { name: v.name, id: v._id } })
      })
    },
    getSummary(param) {
      const { data } = param
      const sums = []

      let totalPrice = 0
      data.forEach(order => {
        order.offers.forEach(element => {
          totalPrice += ((element.price * 10) * element.quantityOrdered)
        })
      })

      // Set the sum on the 4th column, as that's the cost one
      sums[4] = Number(totalPrice * 1.19).toFixed(2)

      return sums
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.originalList = response.data.orders
        this.total = response.data.orders.length
        this.listLoading = false

        // Handle the filter for the initial load
        this.handleFilter()
      })
    },
    resetFilter() {
      this.listQuery.orderId = ''
      this.listQuery.dateRange = []
      this.listQuery.sellerAccountId = ''
      this.listQuery.buyerAccountId = ''
    },
    handleFilter() {
      const allItems = this.originalList

      // If we have an orderId, that trumps all other fields
      if (this.listQuery.orderId && this.listQuery.orderId.length > 0) {
        this.list = allItems.filter(o => o.orderId.indexOf(this.listQuery.orderId) > -1)
      } else {
        // We don't have an order id, let's check the other fields to use
        let newResults = allItems

        if (this.listQuery.dateRange.length === 2) {
          newResults = newResults.filter(o => {
            const created = new Date(o.created).getTime()
            return created > this.listQuery.dateRange[0].getTime() && created < this.listQuery.dateRange[1].getTime()
          })
        }

        if (this.listQuery.sellerAccountId.length > 0) {
          newResults = newResults.filter(o => o.offers[0].seller._id === this.listQuery.sellerAccountId)
        }

        if (this.listQuery.buyerAccountId.length > 0) {
          newResults = newResults.filter(o => o.buyer._id === this.listQuery.buyerAccountId)
        }

        this.list = newResults
      }
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
