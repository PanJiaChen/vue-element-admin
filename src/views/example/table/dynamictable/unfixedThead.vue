<template>
  <div class="app-container">

    <div class="filter-container">
      <el-checkbox-group v-model="formThead">
        <el-checkbox label="apple">apple</el-checkbox>
        <el-checkbox label="banana">banana</el-checkbox>
        <el-checkbox label="orange">orange</el-checkbox>
      </el-checkbox-group>
    </div>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="name" label="fruitName" width="180">
      </el-table-column>
      <el-table-column :key='fruit' v-for='(fruit,index) in formThead' :label="fruit">
        <template scope="scope">
          {{scope.row.list[index].value}}
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        tableData: [
          {
            name: 'fruit1',
            list: [
                { name: 'apple1', value: 10 },
                { name: 'banana1', value: 20 },
                { name: 'orange1', value: 20 }
            ]
          },
          {
            name: 'fruit2',
            list: [
                { name: 'apple2', value: 12 },
                { name: 'banana2', value: 22 },
                { name: 'orange2', value: 20 }
            ]
          }
        ],
        formThead: ['apple', 'banana']
      }
    }
  };
</script>
