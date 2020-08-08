<template>
  <el-upload
    :ref="metadata.columnName"
    v-model="value"
    :limit="metadata.Limit"
    :on-remove="handleRemove"
    :on-success="handleSuccess"
    :on-error="handleError"
    :class="cssClassStyle"
    action="https://jsonplaceholder.typicode.com/posts/"
    :disabled="isDisabled"
    @change="preHandleChange"
  >
    <el-button size="small" type="primary">
      {{ $t('components.binaryButton') }}
    </el-button>
    <div slot="tip" class="el-upload__tip">
      {{ $t('components.binaryTip') }}
    </div>
  </el-upload>
</template>

<script>
import fieldMixin from '@/components/ADempiere/Field/mixin/mixinField.js'

export default {
  name: 'FieldBinary',
  mixins: [fieldMixin],
  computed: {
    cssClassStyle() {
      let styleClass = ' image-uploader '
      if (!this.isEmptyValue(this.metadata.cssClassName)) {
        styleClass += this.metadata.cssClassName
      }
      return styleClass
    }
  },
  methods: {
    handleRemove(file) {
      this.$message.success(`The previously uploaded file has been deleted.`)
    },
    handleError(file) {
      this.$message.error(`The file does not meet the specifications.`)
    },
    handleSuccess(file) {
      this.$message.success(`The file has been successfully loaded.`)
    }
  }
}
</script>
