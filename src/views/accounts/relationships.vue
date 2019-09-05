
<template>
  <div class="app-container">

    <el-table v-loading="listLoading" :data="buyerAccounts" border fit style="width: 100%">

      <el-table-column label="X" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column v-for="seller in sellerAccounts" :key="seller._id" align="center" :label="seller.name">
        <template slot-scope="scope">
          <span v-if="relationshipMatrix[`${buyerAccounts[scope.$index].id}-${seller.id}`]">

            <span style="color: green">B: Enabled<br></span>

            <span v-if="relationshipMatrix[`${buyerAccounts[scope.$index].id}-${seller.id}`].other" style="color: green">S: Enabled<br></span>
            <span v-else style="color: red">S: Disabled<br></span>
          </span>
          <span v-else style="color: red;">
            No Relationship
            <br>
            <br>
          </span>
        </template>
      </el-table-column>

    </el-table>

  </div>
</template>

<script>
import { fetchList, fetchRelationships } from '@/api/account'

export default {
  name: 'RelationshipList',
  data() {
    return {
      sellerAccounts: [],
      buyerAccounts: [],
      relationshipMatrix: [],
      originalList: null,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        buyerAccountId: '',
        sellerAccountId: ''
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
    },
    getList() {
      Promise.all([fetchRelationships({ platform: 'OLFDE' }), fetchList({ platform: 'OLFDE', limit: 100 })]).then((results) => {
        const allRelationships = results[0].data.relationships
        this.sellerAccounts = results[1].data.docs.filter(a => a.type === 'seller').map(v => { return { name: v.name, id: v._id } })
        this.buyerAccounts = results[1].data.docs.filter(a => a.type === 'buyer').map(v => { return { name: v.name, id: v._id } })

        // Map the seller accounts
        const relationshipData = []
        allRelationships.forEach((a) => {
          relationshipData[`${a.buyer.account_id}-${a.other.account_id}`] = a
        })
        this.relationshipMatrix = relationshipData
      })
    },
    resetFilter() {
    },
    handleFilter() {
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
