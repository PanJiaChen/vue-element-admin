<template>
  <el-dropdown :show-timeout="100" trigger="click">
    <el-button plain>
      {{ platform_selection === 'DE' ? 'Platform: DE' : 'Platform: UK' }}
      <i class="el-icon-caret-bottom el-icon--right" />
    </el-button>
    <el-dropdown-menu slot="dropdown" class="no-padding dropdown-menu">
      <el-dropdown-item>
        <el-radio-group v-model="platform_selection" style="padding: 10px;">
          <el-radio :value="DE">
            DE
          </el-radio>
          <el-radio :value="UK">
            UK
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
      type: String,
      default: 'DE'
    }
  },
  computed: {
    platform_selection: {
      get() {
        console.log(this.value)
        return this.value
      },
      set(val) {
        console.log(this.value)
        this.$emit('input', val)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .dropdown-menu {
    z-index: 40000 !important;
  }
</style>
