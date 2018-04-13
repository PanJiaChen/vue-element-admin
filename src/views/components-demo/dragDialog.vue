<template>
  <div class="components-container">
    <el-button type="primary" @click="dialogTableVisible = true">open a Drag Dialog</el-button>
    <el-dialog v-el-drag-dialog title="Shipping address" :visible.sync="dialogTableVisible">
      <el-table :data="gridData">
        <el-table-column property="date" label="Date" width="150"></el-table-column>
        <el-table-column property="name" label="Name" width="200"></el-table-column>
        <el-table-column property="address" label="Address"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import elDragDialog from '@/directive/el-dragDialog' // base on element-ui

export default {
  name: 'dragDialog-demo',
  directives: { elDragDialog },
  data() {
    return {
      dialogTableVisible: false,
      gridData: [{
        date: '2016-05-02',
        name: 'John Smith',
        address: 'No.1518,  Jinshajiang Road, Putuo District'
      }, {
        date: '2016-05-04',
        name: 'John Smith',
        address: 'No.1518,  Jinshajiang Road, Putuo District'
      }, {
        date: '2016-05-01',
        name: 'John Smith',
        address: 'No.1518,  Jinshajiang Road, Putuo District'
      }, {
        date: '2016-05-03',
        name: 'John Smith',
        address: 'No.1518,  Jinshajiang Road, Putuo District'
      }]
    }
  }
}
</script>
