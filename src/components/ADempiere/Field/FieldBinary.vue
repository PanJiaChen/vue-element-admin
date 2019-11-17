<template>
  <el-upload
    :ref="metadata.columnName"
    v-model="value"
    :limit="metadata.Limit"
    :on-remove="handleRemove"
    :on-success="handleSuccess"
    :on-error="handleError"
    class="image-uploader"
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
import { fieldMixin } from '@/components/ADempiere/Field/FieldMixin'

export default {
  name: 'FieldBinary',
  mixins: [fieldMixin],
  watch: {
    valueModel(value) {
      if (this.metadata.inTable) {
        this.value = value
      }
    },
    'metadata.value'(value) {
      if (!this.metadata.inTable) {
        this.value = value
      }
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
