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
    <el-card
      v-if="getIsChangeLog"
      :class="classIsMobilePanel"
    >
      <el-scrollbar :wrap-class="classIsMobilePanel">
        <el-timeline>
          <el-timeline-item
            v-for="(listLogs, key) in gettersListRecordLogs.sort(sortSequence)"
            :key="listLogs.logId"
            :type="listLogs.type"
            :timestamp="translateDate(listLogs.logDate)"
            placement="top"
          >
            <el-card shadow="hover" class="clearfix">
              <div>
                {{ listLogs.userName }}
                <el-link
                  type="primary"
                  style="float: right;"
                  @click="showkey(key)"
                >
                  {{ $t('window.containerInfo.changeDetail') }}
                </el-link>
              </div>
              <el-collapse-transition>
                <div v-show="(currentKey === key)">
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
              </el-collapse-transition>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-scrollbar>
    </el-card>
  </div>
</template>

<script>
import MixinInfo from './mixinInfo.js'

export default {
  name: 'RecordLogs',
  mixins: [
    MixinInfo
  ],
  data() {
    return {
      currentKey: 0,
      typeAction: 0
    }
  },
  computed: {
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    },
    classIsMobileScroll() {
      if (this.isMobile) {
        return 'scroll-window-log-change-mobile'
      }
      return 'scroll-window-log-change'
    },
    classIsMobilePanel() {
      if (this.isMobile) {
        return 'panel-mobile'
      }
      return 'panel'
    },
    gettersListRecordLogs() {
      const log = this.$store.getters.getRecordLogs.entityLogs
      if (log) {
        return log.map(element => {
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
      }
      return []
    },
    getIsChangeLog() {
      if (this.isEmptyValue(this.gettersListRecordLogs)) {
        return false
      }
      return true
    }
  },
  methods: {
    sortSequence(itemA, itemB) {
      return new Date().setTime(new Date(itemB.logDate).getTime()) - new Date().setTime(new Date(itemA.logDate).getTime())
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

<style>
  .scroll-window-log-change {
    max-height: 74vh !important;
  }
  .scroll-window-log-change-mobile {
    max-height: 56vh !important;
  }
  .panel-mobile {
    height: 57vh;
  }
  .panel {
    height: 75vh;
  }
</style>
