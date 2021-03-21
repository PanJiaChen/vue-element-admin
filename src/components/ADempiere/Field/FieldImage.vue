<template>
  <el-upload
    :ref="metadata.columnName"
    action="https://jsonplaceholder.typicode.com/posts/"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :on-change="handleChange"
    :before-upload="beforeAvatarUpload"
    :disabled="isDisabled"
    :class="cssClassStyle"
  >
    <img v-if="value" :src="value" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon" />
  </el-upload>
</template>

<script>
import fieldMixin from '@/components/ADempiere/Field/mixin/mixinField.js'
import { getResource, updateResource } from '@/api/ADempiere/field/binary.js'

export default {
  name: 'FieldImage',
  mixins: [fieldMixin],
  props: {
    // receives the property that is an object with all the attributes
    binary: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      valuesImage: [{
        identifier: 'undefined',
        value: '',
        isLoaded: true
      }]
    }
  },
  computed: {
    cssClassStyle() {
      let styleClass = ' custom-field-image '
      if (!this.isEmptyValue(this.metadata.cssClassName)) {
        styleClass += this.metadata.cssClassName
      }
      return styleClass
    }
  },
  methods: {
    updateResource,
    getResource,
    handleChange(file, fileList) {
      let message, type
      this.binary.push({
        columnName: this.metadata.columnName,
        value: file
      })
      switch (file.status) {
        case 'success':
          message = 'succesful'
          type = file.status
          break
        case 'ready':
          message = 'loading'
          type = 'loading'
          break
        case 'error':
          message = file.status
          type = file.status
          break
      }
      this.$message({
        type: type,
        showClose: true,
        message: this.$t('notifications.' + message)
      })
      updateResource({
        uuid: this.metadata.recordUuid,
        tableName: this.$route.params.tableName,
        binaryFile: this.binary
      })
    },
    handleAvatarSuccess(res, file) {
      this.value = URL.createObjectURL(file.raw)
      this.handleFieldChange({ value: this.value })
      getResource({
        uuid: this.metadata.recordUuid,
        tableName: this.$route.params.tableName
      })
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      // const isGIF = file.type === 'image/gif'
      // const isBMP = file.type === 'image/bmp'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isLt2M) {
        this.$message.error(this.$t('components.imageError'))
      }
      return isJPG + isPNG + isLt2M
    }
  }
}
</script>

<style scoped>
  .custom-field-image .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .custom-field-image .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
