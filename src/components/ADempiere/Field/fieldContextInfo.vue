<template>
  <span>
    <el-popover
      v-if="(contextInfo && contextInfo.isActive) || reference.zoomWindowList.length"
      ref="contextInfoField"
      placement="top"
      width="300"
      trigger="click"
    >
      <p
        class="pre-formatted"
        v-html="contextInfo.messageText.msgText"
      />
      <div>
        <span class="custom-tittle-popover">
          {{ name }}
        </span>
        <template v-if="!isEmptyValue(help)">
          : {{ help }}
        </template>
      </div>
      <template v-for="(zoomItem, index) in reference.zoomWindowList">
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
      {{ name }}
    </span>
  </span>
</template>

<script>
import { showMessage } from '@/utils/ADempiere/notification'

export default {
  name: 'FieldContextInfo',
  props: {
    contextInfo: {
      type: Object,
      required: true
    },
    reference: {
      type: Object,
      required: true
    },
    columnName: {
      type: String,
      required: true
    },
    name: {
      type: String,
      default: undefined
    },
    help: {
      type: String,
      default: undefined
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
      this.$store.dispatch('getWindowByUuid', {
        routes: this.permissionRoutes,
        windowUuid: window.uuid
      })
      const windowRoute = this.$store.getters.getWindowRoute(window.uuid)
      if (windowRoute) {
        this.$router.push({
          name: windowRoute.name,
          query: {
            action: 'advancedQuery',
            tabParent: 0,
            [this.columnName]: this.value
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
