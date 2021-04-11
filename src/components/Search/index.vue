<template>
  <div>
    <div class="search">
      <el-select v-model="funCode" placeholder="请选择" @change="change">
        <el-option
          v-for="item in fun"
          :key="item.fun_col__col_code"
          :label="item.fun_col__col_name"
          :value="item.fun_col__col_code"
        />
      </el-select>
      <div v-if="control === 'text' || control === 'selectwin' || control === 'combowin'">
        <el-input v-model="searchVal" clearable placeholder="请输入内容" @keyup.enter.native="search" />
      </div>
      <div v-else-if="control === 'date'" class="combo-select">
        <el-date-picker
          v-model="searchVal"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
          @change="search"
        />
      </div>
      <div v-else-if="control === 'combo' || 'checkbox'" class="combo-select">
        <el-select v-model="searchVal" placeholder="请选择" clearable @change="search">
          <el-option
            v-for="item in combo"
            :key="item.funall_control__value_data"
            :label="item.funall_control__display_data"
            :value="item.funall_control__value_data"
          />
        </el-select>
      </div>
      <div v-else-if="control === ''">
        <el-input v-model="searchVal" clearable placeholder="请输入内容" @keyup.enter.native="search" />
      </div>
      <el-button slot="append" icon="el-icon-search" @click="search" />
    </div>
  </div>
</template>

<script>
import api from './api'
export default {
  name: 'SafeIdsp',
  components: {
    // buttons
  },
  props: {
    dataId: {
      type: Array,
      default: () => []
    },
    tableName: {
      type: String,
      default: null
    },
    funid: {
      type: String,
      default: ''
    },
    wsql: {
      type: String,
      default: ''
    },
    wvalue: {
      type: String,
      default: ''
    },
    wtype: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      data: [],
      funCode: '',
      fun: [],
      searchVal: '',
      selData: [],
      control: 'text',
      control_name: '',
      combo: [],
      where_sql: '',
      where_value: '',
      where_type: ''
    }
  },
  created() {
    this.getFunCol()
  },
  mounted() {
  },
  methods: {
    getFunCol() {
      api.getFunCol(this.funid).then(data => {
        if (data.success) {
          this.fun = data.data.root.filter(d => {
            return d.fun_col__col_index !== '10000'
          })
          console.log(this.fun, 'this.fun')
          this.funCode = this.fun[0].fun_col__col_code
          this.where_sql = `${this.fun[0].fun_col__col_code}`
          this.where_type = this.fun[0].fun_col__data_type
          setTimeout(() => {
            this.loading = false
          }, 200)
        } else {
          this.$message.error(data.message)
        }
      })
    },
    change(val) {
      this.searchVal = ''
      this.control = ''
      this.control_name = ''
      this.where_sql = ''
      this.where_type = ''
      this.selData = this.fun.filter(d => {
        return val === d.fun_col__col_code
      })

      this.control = this.selData[0].fun_col__col_control
      this.control_name = this.selData[0].fun_col__control_name
      this.where_sql = `${this.selData[0].fun_col__col_code}`
      this.where_type = this.selData[0].fun_col__data_type
      if (this.control === 'combo') {
        this.getCombo()
      } else if (this.control === 'checkbox') {
        this.control_name = 'yesno'
        this.getCombo()
      }
    },
    getCombo() {
      api.getSelect(this.control_name).then(data => {
        if (data.success) {
          this.combo = data.data.root
        } else {
          this.$message.error(data.message)
        }
      })
    },
    search() {
      let whereValue
      let whereSql
      console.log(this.wvalue, 'wvalue')
      if (this.searchVal) {
        if (this.control === 'date') {
          if (this.wsql) {
            const where_sql = `(${this.wsql}=?) and ${this.where_sql} >= ?`
            const whereValue = `${this.wvalue};${this.searchVal}`
            const where_type = `${this.wtype};date`
            whereSql = `where_sql=${where_sql}&where_value=${whereValue}&where_type=${where_type}`
          } else {
            const where_sql = `${this.where_sql} >= ?`
            const whereValue = `${this.searchVal}`
            const where_type = `date`
            whereSql = `where_sql=${where_sql}&where_value=${whereValue}&where_type=${where_type}`
          }
        } else {
          if (this.wsql) {
            const Value = encodeURI(`\%${this.searchVal}\%`)
            const where_sql = `(${this.wsql}) and (${this.where_sql} like ?)`
            const whereValue = `${this.wvalue};${Value}`
            const where_type = `${this.wtype};${this.where_type}`
            whereSql = `where_sql=${where_sql}&where_value=${whereValue}&where_type=${where_type}`
          } else {
            whereValue = encodeURI(`\%${this.searchVal}\%`)
            whereSql = `where_sql=${this.where_sql} like ?&where_value=${whereValue}&where_type=${this.where_type}`
          }
        }
      } else {
        if (this.wsql) {
          whereSql = `where_sql=${this.wsql}&where_value=${this.wvalue}&where_type=${this.wtype}`
        } else {
          whereSql = `where_sql=&where_value=&where_type=`
        }
      }
      console.log(whereSql, '1231')
      this.$emit('search', `${whereSql}`)
    }
  }
}
</script>
<style lang="scss" scoped>
  .search{
    display: flex;
      .el-select,.el-select--medium{
        width: 30%;
        margin-left: 20%;
      }
      .el-input--medium,.el-input__inner{
        margin-right: 20%;
        width: 80%;
        float: right;
      }
      .combo-select{
      .el-select,.el-select--medium{
        margin-right: 20%;
          width: 80%;
          float: right;
        }
      }
      .el-button--medium {
        height: 26.8px;
        width: 50px;
        padding: 0px;
        background-color: #1890ff;
        color:#fff;
        margin-left: -9%;
      }
    }
    ::v-deep .el-input--medium .el-input__inner {
        height: 26.8px;
        line-height: 26.8px;
    }
    ::v-deep .el-input--medium .el-input__icon {
    line-height: 26.8px;
}
</style>
