<template>
  <div>
    <el-form>
      <el-form-item label="城市三级联动选择">
        <el-cascader
          :options="city"
          @change="selctCity"
        />
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import { city } from './city'
// 如果城市数据有误，可以直接更改，城市数据来自网络
export default {
  data() {
    return {
      city: []
    }
  },
  mounted() {
    this.city = city
  },
  methods: {
    selctCity(val) {
      console.log(val)
      this.$message({
        message: '所选城市编码：' + val,
        type: 'success'
      })
    }
  }
}
</script>
