<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Elsio Sanchez esanchez@erpya.com www.erpya.com
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <https:www.gnu.org/licenses/>.
-->
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
          <el-form-item v-if="!isEmptyValue(messageText)" :label="$t('field.contextInfo')">
            {{ messageText }}
          </el-form-item>
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
import { parseContext } from '@/utils/ADempiere/contextUtils'

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
    },
    messageText() {
      if (!this.isEmptyValue(this.fieldAttributes.contextInfo.sqlStatement)) {
        const contextInfo = this.$store.getters.getContextInfoField(this.fieldAttributes.contextInfo.uuid, this.fieldAttributes.contextInfo.sqlStatement)
        if (this.isEmptyValue(contextInfo)) {
          return ''
        }
        return contextInfo.messageText
      }
      return ''
    }
  },
  watch: {
    fieldValue(value) {
      this.value = value
    }
  },
  created() {
    if (this.isEmptyValue(this.messageText)) {
      const sqlParse = parseContext({
        parentUuid: this.fieldAttributes.parentUuid,
        containerUuid: this.fieldAttributes.containerUuid,
        value: this.fieldAttributes.contextInfo.sqlStatement,
        isBooleanToString: true
      })
      this.$store.dispatch('getContextInfoValueFromServer', {
        contextInfoId: this.fieldAttributes.contextInfo.id,
        contextInfoUuid: this.fieldAttributes.contextInfo.uuid,
        sqlStatement: sqlParse.value
      })
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
      if (!this.isEmptyValue(this.$route.query.fieldColumnName)) {
        this.$router.push({
          name: this.$route.name,
          query: {
            ...this.$route.query,
            typeAction: '',
            fieldColumnName: ''
          }
        }, () => {})
      }
    }
  }
}
</script>
