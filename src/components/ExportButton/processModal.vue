<template>
  <el-dialog
    :mask-closable="false"
    :title="modalTitle"
    :visible.sync="show"
  >
    <div class="content">
      <div class="number">
        <span class="number-first">{{ currentNumber }}</span>
        <span class="number-op">/</span>
        <span class="number-total">{{ total }}</span>
      </div>
      <Progress :percent="percent|numberFormat" />
    </div>

    <div slot="footer">
      <el-button :loading="exporting" type="primary" @click="startExport">{{ buttonName }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  filters: {
    numberFormat(value) {
      return Number(value.toFixed(2))
    }
  },
  props: {
    value: Boolean,
    total: Number,
    percent: Number,
    exporting: Boolean,
    currentNumber: Number,
    modalTitle: {
      type: String,
      default() {
        return '数据导出'
      }
    }
  },
  data() {
    return {
      // show: false
    }
  },
  computed: {
    buttonName() {
      if (this.currentNumber === 0) {
        return '开始导出'
      } else if (this.currentNumber < this.total) {
        return '数据获取中'
      } else {
        return '已下载'
      }
    },
    show: {
      get() {
        console.log('get', this.value)
        return this.value
      },
      set(newVal) {
        console.log('set', newVal)
        this.$emit('input', newVal)
      }
    }
  },
  watch: {
    // show(newVal) {
    //   this.$emit("input", newVal);
    // },
    // value(newVal) {
    //   this.show = newVal;
    // }
  },
  methods: {
    startExport() {
      this.$emit('startExport')
    }
  }
}
</script>
<style scoped>
.content{
  text-align: center;
}

.number{
  font-size: 28px;
}
</style>
