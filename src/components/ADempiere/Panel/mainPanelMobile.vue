<!--
 ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
 Contributor(s): Edwin Betancourt edwinBetanc0urt@hotmail.com www.erpya.com
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
  <div class="wrapper">
    <el-form
      v-if="isLoadPanel"
      key="panel-loaded"
      v-model="dataRecords"
      label-position="top"
      label-width="200px"
    >
      <template
        v-if="firstGroup && firstGroup.groupFinal === ''"
      >
        <div v-show="firstGroup.activeFields" class="cards-not-group">
          <div
            v-if="(groupTab.groupType == 'T' && groupTab.groupName == firstGroup.groupFinal)
              || (groupTab.groupType !== 'T' && firstGroup.typeGroup !== 'T')"
            class="card"
          >
            <div class="select-filter">
              <span>
                {{ firstGroup.groupFinal }}
              </span>
              <filter-fields
                :container-uuid="containerUuid"
                :panel-type="panelType"
                :group-field="firstGroup.groupFinal"
                :is-advanced-query="isAdvancedQuery"
              />
            </div>
            <el-card
              :shadow="shadowGroup"
              :body-style="{ padding: '10px' }"
            >
              <el-row>
                <template v-for="(fieldAttributes, subKey) in firstGroup.metadataFields">
                  <field-definition
                    :ref="fieldAttributes.columnName"
                    :key="subKey"
                    :metadata-field="{
                      ...fieldAttributes,
                      ...panelAttributes
                    }"
                    :record-data-fields="isAdvancedQuery ? undefined : dataRecords[fieldAttributes.columnName]"
                    :in-group="!isShowedRecordNavigation"
                    :is-advanced-query="isAdvancedQuery"
                  />
                </template>
              </el-row>
            </el-card>
          </div>
        </div>
      </template>
      <div :class="classCards">
        <template v-for="(item, key) in fieldGroups">
          <el-row :key="key">
            <el-col :key="key" :span="24">
              <div
                v-if="item.groupFinal !== ''
                  && (groupTab.groupType == 'T' && groupTab.groupName == item.groupFinal)
                  || (groupTab.groupType !== 'T' && item.typeGroup !== 'T')"
                :key="key"
                class="card"
              >
                <el-card
                  :shadow="shadowGroup"
                  :body-style="{ padding: '10px' }"
                >
                  <div slot="header" class="clearfix">
                    <span>
                      {{ item.groupFinal }}
                    </span>
                    <div v-if="!isAdvancedQuery" class="select-filter-header">
                      <filter-fields
                        :container-uuid="containerUuid"
                        :panel-type="panelType"
                        :group-field="item.groupFinal"
                        :is-first-group="false"
                      />
                    </div>
                  </div>
                  <el-row>
                    <template v-for="(fieldAttributes, subKey) in item.metadataFields">
                      <field-definition
                        :ref="fieldAttributes.columnName"
                        :key="subKey"
                        :metadata-field="{
                          ...fieldAttributes,
                          ...panelAttributes
                        }"
                        :record-data-fields="isAdvancedQuery ? undefined : dataRecords[fieldAttributes.columnName]"
                        :in-group="isPanelWindow && fieldGroups.length > 1"
                      />
                    </template>
                  </el-row>
                </el-card>
              </div>
            </el-col>
          </el-row>
        </template>
      </div>
    </el-form>
    <div
      v-else
      key="panel-loading"
      v-loading="!isLoadPanel"
      :element-loading-text="$t('notifications.loading')"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)"
      class="loading-panel"
    />
  </div>
</template>

<script>
import mainPanelMixin from './mainPanelMixin.js'

export default {
  name: 'MainPanelMobile',
  mixins: [mainPanelMixin]
}
</script>

<style scoped src="./index.css">
</style>
