<template>
  <el-dropdown :show-timeout="100" trigger="click">
    <el-button plain>
      外链
      <i class="el-icon-caret-bottom el-icon--right"></i>
    </el-button>
    <el-dropdown-menu class="no-padding no-border" style="width:400px" slot="dropdown">
      <el-form-item label-width="0px" style="margin-bottom: 0px" prop="source_uri">
        <el-input placeholder="请输入内容" v-model="source_uri">
          <template slot="prepend">填写url</template>
        </el-input>
      </el-form-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  props: ['value'],
  computed: {
    source_uri: {
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
