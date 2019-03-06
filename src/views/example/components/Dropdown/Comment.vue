<template>
  <el-dropdown :show-timeout="100" trigger="click">
    <el-button plain>
      {{ !comment_disabled?'评论已打开':'评论已关闭' }}
      <i class="el-icon-caret-bottom el-icon--right" />
    </el-button>
    <el-dropdown-menu slot="dropdown" class="no-padding">
      <el-dropdown-item>
        <el-radio-group v-model="comment_disabled" style="padding: 10px;">
          <el-radio :label="true">
            关闭评论
          </el-radio>
          <el-radio :label="false">
            打开评论
          </el-radio>
        </el-radio-group>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    comment_disabled: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>
