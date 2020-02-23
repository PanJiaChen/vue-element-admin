<template>
  <span v-if="isContextInfo">
    <el-popover
      ref="contextInfoField"
      placement="top"
      width="300"
      trigger="click"
    >
      <p
        class="pre-formatted"
        v-html="fieldAttributes.contextInfo.messageText.msgText"
      />
      <div>
        <span class="custom-tittle-popover">
          {{ fieldAttributes.name }}
        </span>
        {{ fieldAttributes.help }}
      </div>
      <template v-for="(zoomItem, index) in fieldAttributes.reference.zoomWindowList">
        <el-button
          :key="index"
          type="text"
          @click="redirect({ window: zoomItem })"
        >
          {{ $t('table.ProcessActivity.zoomIn') }}
          {{ zoomItem.name }}
        </el-button>
      </template>
    </el-popover>
    <span v-popover:contextInfoField>
      {{ fieldAttributes.name }}
    </span>
  </span>
</template>

<script>
import { showMessage } from '@/utils/ADempiere/notification'
import { recursiveTreeSearch } from '@/utils/ADempiere/valueUtils'

export default {
  name: 'FieldContextInfo',
  props: {
    fieldAttributes: {
      type: Object,
      required: true
    },
    fieldValue: {
      type: [Number, String, Boolean, Array, Object, Date],
      default: undefined
    }
  },
  data() {
    return {
      value: this.fieldValue
    }
  },
  computed: {
    isContextInfo() {
      return (this.fieldAttributes.contextInfo && this.fieldAttributes.contextInfo.isActive) || this.fieldAttributes.reference.zoomWindowList.length
    },
    permissionRoutes() {
      return this.$store.getters.permission_routes
    }
  },
  watch: {
    fieldValue(value) {
      this.value = value
    }
  },
  methods: {
    showMessage,
    redirect({ window }) {
      const viewSearch = recursiveTreeSearch({
        treeData: this.permissionRoutes,
        attributeValue: window.uuid,
        attributeName: 'meta',
        secondAttribute: 'uuid',
        attributeChilds: 'children'
      })

      if (viewSearch) {
        this.$router.push({
          name: viewSearch.name,
          query: {
            action: 'advancedQuery',
            tabParent: 0,
            [this.fieldAttributes.columnName]: this.value
          }
        })
      } else {
        this.showMessage({
          type: 'error',
          message: this.$t('notifications.noRoleAccess')
        })
      }
    }
  }
}
</script>
