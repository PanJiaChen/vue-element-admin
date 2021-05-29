<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Elsio Sanchez elsiosanches@gmail.com www.erpya.com
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
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>
        {{ $t('field.logsField') }}
        <b> {{ fieldAttributes.name }} </b>
      </span>
    </div>
    <div>
      <el-scrollbar v-if="!isEmptyValue(listLogsField)" :wrap-class="classIsMobilePanel">
        <el-timeline>
          <el-timeline-item
            v-for="(listLogs) in listLogsField.sort(sortSequence)"
            :key="listLogs.logId"
            :type="listLogs.type"
            :timestamp="translateDate(listLogs.logDate)"
            placement="top"
          >
            <el-card shadow="hover" class="clearfix">
              <div>
                {{ listLogs.userName }}
              </div>
              <!-- <el-collapse-transition> -->
              <div>
                <span v-for="(list, index) in listLogs.changeLogsList" :key="index">
                  <p v-if="list.columnName === 'DocStatus'">
                    <b> {{ list.displayColumnName }} :</b>
                    <strike>
                      <el-tag :type="tagStatus(list.oldValue)">
                        {{ list.oldDisplayValue }}
                      </el-tag>
                    </strike>
                    <el-tag :type="tagStatus(list.newValue)">
                      {{ list.newDisplayValue }}
                    </el-tag>
                  </p>
                  <p v-else>
                    <b> {{ list.displayColumnName }} :</b>
                    <strike>
                      <el-link type="danger">
                        {{ list.oldDisplayValue }}
                      </el-link>
                    </strike>
                    <el-link type="success">
                      {{ list.newDisplayValue }}
                    </el-link>
                  </p>
                </span>
              </div>
              <!-- </el-collapse-transition> -->
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-scrollbar>
      <p v-else>
        {{ $t('field.logsFieldEmpty') }}
      </p>
    </div>
  </el-card>
</template>

<script>

export default {
  name: 'FieldChangeLogs',
  props: {
    fieldAttributes: {
      type: Object,
      required: true
    },
    recordUuid: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      isLoading: false,
      currentKey: 0,
      typeAction: 0
    }
  },
  computed: {
    language() {
      return this.$store.getters.language
    },
    listLogsField() {
      const log = this.$store.getters.getRecordLogs.entityLogs
      if (log) {
        const logsField = log.map(element => {
          let type
          if (!this.isEmptyValue(element.changeLogsList[0].newDisplayValue) && this.isEmptyValue(element.changeLogsList[0].oldDisplayValue)) {
            type = 'success'
          } else if (this.isEmptyValue(element.changeLogsList[0].newDisplayValue) && !this.isEmptyValue(element.changeLogsList[0].oldDisplayValue)) {
            type = 'danger'
          } else {
            type = 'primary'
          }
          return {
            ...element,
            columnName: element.changeLogsList[0].columnName,
            type
          }
        })
        return logsField.filter(field => field.columnName === this.fieldAttributes.columnName)
      }
      return []
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    classIsMobilePanel() {
      if (this.isMobile) {
        return 'panel-mobile'
      }
      return 'scroll-child'
    }
  },
  methods: {
    sortSequence(itemA, itemB) {
      return new Date().setTime(new Date(itemB.logDate).getTime()) - new Date().setTime(new Date(itemA.logDate).getTime())
    },
    translateDate(value) {
      return this.$d(new Date(value), 'long', this.language)
    },
    showkey(key, index) {
      if (key === this.currentKey && index === this.typeAction) {
        this.currentKey = 1000
      } else {
        this.currentKey = key
        this.typeAction = index
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .custom-tittle-popover {
    font-size: 14px;
    font-weight: bold;
  }
</style>
<style lang="scss">
  /**
   * Separation between elements (item) of the form
   */
  .el-form-item {
    margin-bottom: 10px !important;
    margin-left: 10px;
    margin-right: 10px;
  }
  /**
   * Reduce the spacing between the form element and its label
   */
  .el-form--label-top .el-form-item__label {
    padding-bottom: 0px !important;
  }
  .panel-mobile {
    height: 80vh;
  }
</style>
