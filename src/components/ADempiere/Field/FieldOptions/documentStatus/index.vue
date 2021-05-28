<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com www.erpya.com
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
  <el-popover
    v-if="(fieldAttributes.columnName === 'DocStatus') && (!isEmptyValue(processOrderUuid))"
    placement="right"
    width="400"
    trigger="click"
    :disabled="withoutRecord"
  >
    <el-select
      v-model="valueActionDocument"
      @change="documentActionChange"
      @visible-change="listActionDocument"
    >
      <el-option
        v-for="(item, key) in listDocumentActions"
        :key="key"
        :label="item.name"
        :value="item.value"
      />
    </el-select>
    <el-tag
      v-if="isEmptyValue(valueActionDocument)"
      :type="tagStatus(fieldAttributes.value)"
    >
      {{ fieldAttributes.displayColumn }}
    </el-tag>
    <el-tag
      v-else
      :type="tagStatus(valueActionDocument)"
    >
      {{ labelDocumentActions }}
    </el-tag>
    <p v-if="isEmptyValue(valueActionDocument)"> {{ fieldAttributes.description }} </p>
    <p v-else> {{ descriptionDocumentActions }} </p>
    <el-button
      slot="reference"
      type="text"
      icon="el-icon-set-up"
    />
  </el-popover>
</template>

<script>
export default {
  name: 'FieldDocumentStatus',

  props: {
    fieldAttributes: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      valueActionDocument: ''
    }
  },
  computed: {
    withoutRecord() {
      // TODO: Validate with record attribute
      if (this.isEmptyValue(this.$route.query.action) ||
      ['create-new', 'reference', 'advancedQuery', 'criteria'].includes(this.$route.query.action)) {
        return true
      }
      return false
    },
    documentActions() {
      return this.$store.getters.getListDocumentActions
    },
    listDocumentActions() {
      return this.documentActions.documentActionsList
    },
    labelDocumentActions() {
      const found = this.listDocumentActions.find(element => {
        if (element.value === this.valueActionDocument) {
          return element
        }
      })
      if (this.isEmptyValue(found)) {
        return this.valueActionDocument
      }
      return found.name
    },
    descriptionDocumentActions() {
      const found = this.listDocumentActions.find(element => {
        if (element.value === this.valueActionDocument) {
          return element
        }
      })
      if (this.isEmptyValue(found)) {
        return this.valueActionDocument
      }
      return found.description
    },
    processOrderUuid() {
      return this.$store.getters.getOrders
    }
  },
  methods: {
    listActionDocument(isShowList) {
      if (isShowList) {
        if (!this.withoutRecord && this.$route.query.action !== this.documentActions.recordUuid) {
          this.$store.dispatch('listDocumentActionStatus', {
            recordUuid: this.$route.query.action,
            tableName: this.$route.params.tableName,
            recordId: this.$route.params.recordId
          })
        }
      }
    },
    documentActionChange(value) {
      // this.$store.dispatch('notifyFieldChange', {
      //   parentUuid: this.fieldAttributes.parentUuid,
      //   containerUuid: this.fieldAttributes.containerUuid,
      //   columnName: 'DocAction',
      //   isSendToServer: true,
      //   newValue: value
      // })

      const actionProcess = this.$store.getters.getOrders
      this.$store.dispatch('startProcess', {
        action: {
          uuid: actionProcess.uuid,
          id: actionProcess.id,
          name: actionProcess.name
        }, // process metadata
        tableName: this.$route.params.tableName,
        recordId: this.$route.params.recordId,
        recordUuid: this.$route.query.action,
        parametersList: [{
          columnName: this.fieldAttributes.columnName,
          value: this.valueActionDocument
        }],
        isActionDocument: true,
        parentUuid: this.fieldAttributes.parentUuid,
        panelType: this.fieldAttributes.panelType,
        containerUuid: this.fieldAttributes.containerUuid // determinate if get table name and record id (window) or selection (browser)
      })
      this.valueActionDocument = ''
    }
  }
}
</script>
