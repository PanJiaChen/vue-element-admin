<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>
          {{ $t('field.field') }}
          <b> {{ fieldAttributes.name }} </b>
        </span>
      </div>
      <el-scrollbar wrap-class="scroll-child">
        <el-form ref="form" label-position="top" label-width="120px" style="overflow: auto;" @submit.native.prevent="notSubmitForm">
          <el-form-item :label="$t('field.container.description')">
            {{ fieldAttributes.description }}
          </el-form-item>
          <el-form-item :label="$t('field.container.help')">
            {{ fieldAttributes.help }}
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <template v-for="(zoomItem, index) in fieldAttributes.reference.zoomWindows">
        <el-button
          :key="index"
          type="text"
          @click="redirect({ window: zoomItem })"
        >
          {{ $t('table.ProcessActivity.zoomIn') }}
          {{ zoomItem.name }}
        </el-button>
      </template>
    </el-card>
  </div>
</template>

<script>
import { recursiveTreeSearch } from '@/utils/ADempiere/valueUtils.js'

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
    notSubmitForm(event) {
      event.preventDefault()
      return false
    },
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
        }, () => {})
      } else {
        this.$message({
          type: 'error',
          showClose: true,
          message: this.$t('notifications.noRoleAccess')
        })
      }
      this.$store.commit('changeShowRigthPanel', false)
    }
  }
}
</script>
