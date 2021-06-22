<template>
  <div>
    <el-button v-for="d in data" :key="d.method" type="primary" @click="Fn(d.method)">{{ d.text }}{{ d.method }}</el-button>

  </div>
</template>

<script>
import api from '@/api/public'

export default {
  props: {
    funid: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      data: []

    }
  },
  created() {
    this.getButtons()
  },
  methods: {
    getButtons() {
      api.getFormBtn(this.funid).then(data => {
        if (data.success) {
          this.data = data.data.buttons
        } else {
          this.$message.error(data.message)
        }
      })
    },
    Fn(method) {
      this[method]()
    },
    create() {
      this.$emit('create')
    },
    del() {
      this.$emit('del')
    },
    save() {
      this.$emit('save')
    },
    upload() {
      this.$emit('upload')
    }
  }
}
</script>

<style lang="scss" scoped>
// .el-card {
//   margin-top: 10px;
// }
</style>
