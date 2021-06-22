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
      default: '' || 'sys_dept'
    }
  },
  data() {
    return {
      data: [],
      loading: false
    }
  },
  created() {
    this.getButtons()
  },
  methods: {
    getButtons() {
      this.loading = true
      api.getButtons(this.funid).then(data => {
        if (data.success) {
          this.data = data.data.buttons
          this.loading = false
        } else {
          this.$message.error(data.message)
        }
      })
    },
    Fn(method) {
      this[method]()
    },
    editCreate() {
      this.$emit('editCreate')
    },
    editDelete() {
      this.$emit('editDelete')
    },
    editSave() {
      this.$emit('editSave')
    },
    upload() {
      this.$emit('upload')
    },
    save() {
      this.$emit('save')
    },
    create() {
      this.$emit('Create')
    },
    del() {
      this.$emit('Del')
    }
  }
}
</script>

<style lang="scss" scoped>
// .el-card {
//   margin-top: 10px;
// }
</style>
