<template>
  <el-table :data="hotelList" border>
    <el-table-column
      v-for="{ prop, label } in colConfigs"
      :key="prop"
      :prop="prop"
      :label="label"
    />
  </el-table>
</template>

<script>
import { findHotelListFromApi } from '@/api/hotel'
export default {
  data() {
    this.colConfigs = [
      { prop: 'id', label: 'id' },
      { prop: 'hotelName', label: '酒店名' },
      { prop: 'country', label: '国家' },
      { prop: 'city', label: '城市' },
      { prop: 'longitude', label: '经度' },
      { prop: 'latitude', label: '纬度' },
      { prop: 'createTime', label: '创建时间' }
    ]
    return {
      hotelList: [] // 变量即使为空也需要先放在return里面
    }
  },
  created() { // 加载view视图时加载数据
    this.findHotelListMethod()
  },
  methods: {
    findHotelListMethod() {
      findHotelListFromApi().then(response => {
        this.hotelList = response.data
      })
    }
  }
}
</script>

<style>

</style>
