<template>
  <div class="app-container">

    <div class="filter-container">
      <el-checkbox-group v-model="checkboxVal"	>
        <el-checkbox label="apple">apple</el-checkbox>
        <el-checkbox label="banana">banana</el-checkbox>
        <el-checkbox label="orange">orange</el-checkbox>
      </el-checkbox-group>
    </div>

    <el-table :data="tableData" :key='key' style="width: 100%">
      <el-table-column prop="name" label="fruitName" width="180"></el-table-column>
      <el-table-column :key='fruit' v-for='(fruit,index) in formThead' :label="fruit">
        <template scope="scope">
          {{scope.row[fruit]}}
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
  const defaultFormThead = ['apple', 'banana']; // 默认选中项
  export default {
    data() {
      return {
        tableData: [
          {
            name: 'fruit-1',
            apple: 'apple-10',
            banana: 'banana-10',
            orange: 'orange-10'
          },
          {
            name: 'fruit-2',
            apple: 'apple-20',
            banana: 'banana-20',
            orange: 'orange-20'
          }
        ],
        key: 1, // table key
        formTheadOptions: ['apple', 'banana', 'orange'], // 可选择表头
        checkboxVal: defaultFormThead, // checkboxVal
        formThead: defaultFormThead // 默认表头
      }
    },
    watch: {
      checkboxVal(valArr) {
        this.formThead = this.formTheadOptions.filter(i => valArr.indexOf(i) >= 0);
        this.key = this.key + 1;// 为了保证table 每次都会重渲 （牺牲性能保证效果，当然也可以不用）
      }
    }
  };
</script>

